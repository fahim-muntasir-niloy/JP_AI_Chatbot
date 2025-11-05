import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ChatMessage as ChatMessageType, Role } from '../types';
import { UserIcon, BotIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

// NOTE: You'll need to install react-markdown and its plugins if not present:
// npm install react-markdown remark-gfm remark-footnotes rehype-raw rehype-sanitize

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.User;

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : ''} ${isUser ? 'space-x-4' : 'space-x-4'}`}>
      {/* AI avatar on the left, user avatar on the right */}
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-red-600 flex items-center justify-center shadow-md">
          <BotIcon className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`max-w-xl ${isUser ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-100'} rounded-lg p-4 shadow-sm ${!isUser ? 'border border-gray-800' : ''}`}>
        <article className={`prose prose-sm md:prose-base ${isUser ? 'prose-invert' : 'prose-invert'} prose-pre:bg-black prose-pre:p-4 prose-pre:rounded-md prose-code:text-amber-400 prose-headings:text-gray-100 prose-p:text-gray-200 prose-strong:text-gray-100 prose-a:text-red-400 hover:prose-a:text-red-300`}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkFootnotes]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {message.content}
          </ReactMarkdown>
        </article>
      </div>

      {isUser && (
         <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center shadow-md">
            <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;