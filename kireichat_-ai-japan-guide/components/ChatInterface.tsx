
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon, JapanIcon, LoadingIcon, BotIcon } from './icons';

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
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <header className="py-5 px-6 border-b border-gray-900 flex items-center justify-center space-x-3 bg-black">
            <JapanIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-medium text-gray-100">Japan Business Bot</h1>
          </header>
      
      <main className="flex-1 overflow-y-auto py-8 px-6 space-y-6 bg-black">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
         {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-red-600 flex items-center justify-center shadow-md">
                <BotIcon className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-900 rounded-lg p-4 mt-2 flex items-center space-x-2 shadow-sm border border-gray-800">
                <LoadingIcon className="text-red-500" />
                <span className="text-gray-300">Kirei is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="py-5 px-6 bg-black border-t border-gray-900">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Write your concern..."
            className="w-full bg-gray-900 text-gray-100 rounded-xl p-4 pr-14 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200 placeholder-gray-500 shadow-sm"
            rows={1}
            style={{maxHeight: '200px'}}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-red-600 text-white disabled:bg-gray-800 disabled:cursor-not-allowed hover:bg-red-500 active:bg-red-700 transition-colors shadow-md"
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
