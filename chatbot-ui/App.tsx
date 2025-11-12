import React, { useState, useEffect, useRef } from 'react';
import { StreamEvent, Message, LlmTokenEvent, ToolCallEvent, ToolOutputEvent, ParsedToolOutput, ToolStep } from './types';
import { UserMessage } from './components/UserMessage';
import { AssistantMessage } from './components/AssistantMessage';
import { ToolCallCard } from './components/ToolCallCard';
import { ChatInput } from './components/ChatInput';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';

// UUID generator fallback for browsers that don't support crypto.randomUUID()
const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        try {
            return crypto.randomUUID();
        } catch (e) {
            console.warn('crypto.randomUUID() failed, using fallback:', e);
        }
    }
    // Fallback UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [threadId, setThreadId] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            // Set theme from local storage or default to dark mode
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                setTheme('dark');
            }
            
            // Set initial threadId without sending a message
            setThreadId(generateUUID());
        } catch (error) {
            console.error('Error initializing app:', error);
            // Set defaults on error
            setTheme('dark');
            setThreadId(generateUUID());
        }
    }, []);
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const processStreamEvent = (event: StreamEvent) => {
        setMessages(prevMessages => {
            let newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];

            if (event.type === 'llm_token' && event.node === 'model') {
                const tokenEvent = event as LlmTokenEvent;
                if (lastMessage && lastMessage.type === 'assistant' && !lastMessage.isComplete) {
                    lastMessage.content += tokenEvent.token;
                } else {
                    if (lastMessage && lastMessage.type === 'assistant') {
                        lastMessage.isComplete = true;
                    }
                    newMessages.push({
                        id: generateUUID(),
                        type: 'assistant',
                        content: tokenEvent.token,
                        isComplete: false,
                    });
                }
            } else if (event.type === 'tool_call') {
                if (lastMessage && lastMessage.type === 'assistant') {
                    lastMessage.isComplete = true;
                }
                const toolCallEvent = event as ToolCallEvent;
                const newToolStep: ToolStep = {
                    tool_call_id: toolCallEvent.tool_id,
                    tool_name: toolCallEvent.tool_name,
                    input: toolCallEvent.tool_input.query,
                    output: null
                };

                if(lastMessage && lastMessage.type === 'tool_step' && !lastMessage.isComplete) {
                    lastMessage.steps.push(newToolStep);
                } else {
                    newMessages.push({
                        id: generateUUID(),
                        type: 'tool_step',
                        steps: [newToolStep],
                        isComplete: false,
                    });
                }

            } else if (event.type === 'tool_output') {
                const toolOutputEvent = event as ToolOutputEvent;
                 if (lastMessage && lastMessage.type === 'tool_step') {
                    const stepToUpdate = lastMessage.steps.find(step => step.tool_call_id === toolOutputEvent.tool_call_id);
                    if (stepToUpdate) {
                        try {
                            const parsedOutput: ParsedToolOutput = JSON.parse(toolOutputEvent.output);
                            stepToUpdate.output = parsedOutput.results;
                        } catch (error) {
                            console.error("Failed to parse tool output:", error, "Raw output:", toolOutputEvent.output);
                            stepToUpdate.output = [{ content: "Error: Could not parse tool output.", metadata: {} }];
                        }
                    }
                    const allStepsComplete = lastMessage.steps.every(step => step.output !== null);
                    if (allStepsComplete) {
                        lastMessage.isComplete = true;
                    }
                }
            }
            
            return newMessages;
        });
    };

    const processStream = async (messageContent: string, currentThreadId: string) => {
        setIsStreaming(true);
        
        try {
            // Use relative URL for API calls so it works with any deployment
            const apiUrl = '/chat/stream';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageContent,
                    thread_id: currentThreadId,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Response body is null");
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.substring(6);
                            if (jsonStr) {
                                const event = JSON.parse(jsonStr) as StreamEvent;
                                processStreamEvent(event);
                            }
                        } catch (e) {
                            console.error("Error parsing stream data:", e, "Line:", line);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Streaming failed:", error);
            setMessages(prev => {
                const lastMessage = prev[prev.length-1];
                if(lastMessage.type === 'assistant' && !lastMessage.isComplete){
                    lastMessage.content += `\n\n**Error:** Failed to connect to the stream. Is the server running?`;
                    return [...prev];
                }
                return [...prev, {
                    id: generateUUID(),
                    type: 'assistant',
                    content: `**Error:** Failed to connect to the stream. Is the server running?`,
                    isComplete: true,
                }]
            });
        } finally {
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && (lastMessage.type === 'assistant' || lastMessage.type === 'tool_step')) {
                    lastMessage.isComplete = true;
                }
                return newMessages;
            });
            setIsStreaming(false);
        }
    };
    
    const handleSendMessage = (content: string) => {
        if (isStreaming) return;
        
        const newThreadId = generateUUID();
        setThreadId(newThreadId);

        const newUserMessage: Message = {
            id: generateUUID(),
            type: 'user',
            content,
        };

        setMessages(prev => [...prev, newUserMessage]);
        
        processStream(content, newThreadId);
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-stone-50 dark:bg-zinc-950 text-zinc-800 dark:text-stone-200">
            <header className="p-4 border-b border-stone-200 dark:border-zinc-800 shadow-sm flex justify-between items-center bg-white dark:bg-zinc-900">
                <div>
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Japan Subsidy Bot</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Thread ID: {threadId}</p>
                </div>
                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
            </header>

            <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => {
                    switch (msg.type) {
                        case 'user':
                            return <UserMessage key={msg.id} content={msg.content} />;
                        case 'assistant':
                            return <AssistantMessage key={msg.id} content={msg.content} isComplete={msg.isComplete} />;
                        case 'tool_step':
                            return <ToolCallCard key={msg.id} steps={msg.steps} isComplete={msg.isComplete} />;
                        default:
                            return null;
                    }
                })}
            </main>
            
            <footer className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-stone-200 dark:border-zinc-800 p-2 md:p-4">
                <ChatInput onSendMessage={handleSendMessage} disabled={isStreaming} />
            </footer>
        </div>
    );
};

export default App;