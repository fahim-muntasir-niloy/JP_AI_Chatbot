import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import { ChatMessage as ChatMessageType, Role } from '../types';
import { UserIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

// NOTE: You'll need to install react-markdown and its plugin:
// npm install react-markdown remark-gfm

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.User;

  return (
    <div className={`flex items-start space-x-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
          AI
        </div>
      )}

      <div className={`max-w-xl ${isUser ? 'bg-blue-600 text-white' : 'bg-[#252528] text-gray-200'} rounded-lg p-4`}>
        <article className="prose prose-invert prose-sm md:prose-base prose-pre:bg-[#1a1a1d] prose-pre:p-4 prose-pre:rounded-md prose-code:text-indigo-300">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkFootnotes]}>
            {message.content}
          </ReactMarkdown>
        </article>
      </div>

      {isUser && (
         <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-500 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;