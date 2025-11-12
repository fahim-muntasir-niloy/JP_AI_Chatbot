
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-end gap-2 md:gap-4 p-2 rounded-xl bg-stone-100 dark:bg-zinc-800 border border-transparent focus-within:border-teal-500 transition-colors">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={disabled ? "Waiting for response..." : "Type a message..."}
                    className="flex-1 bg-transparent rounded-lg p-2.5 text-sm resize-none border-none focus:ring-0 appearance-none"
                    rows={1}
                    disabled={disabled}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || disabled}
                    className="w-9 h-9 flex-shrink-0 bg-teal-500 text-white rounded-full flex items-center justify-center disabled:bg-stone-300 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
                    aria-label="Send message"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};