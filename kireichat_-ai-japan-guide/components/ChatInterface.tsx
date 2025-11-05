
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon, JapanIcon, LoadingIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (input: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight(e.target);
  };


  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4">
      <header className="py-4 border-b border-stone-700 flex items-center justify-center space-x-3">
        <JapanIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-2xl font-semibold text-gray-100">KireiChat AI</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto py-8 space-y-8">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
         {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                AI
            </div>
            <div className="bg-[#252528] rounded-lg p-4 mt-2 flex items-center space-x-2">
                <LoadingIcon />
                <span>Kirei is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="py-4">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Japan..."
            className="w-full bg-[#2c2c31] text-gray-200 rounded-lg p-4 pr-16 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all duration-200"
            rows={1}
            style={{maxHeight: '200px'}}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white disabled:bg-stone-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;
