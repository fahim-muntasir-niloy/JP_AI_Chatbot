
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GeminiIcon } from './icons/GeminiIcon';

interface AssistantMessageProps {
    content: string;
    isComplete?: boolean;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({ content, isComplete = false }) => {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                 <GeminiIcon className="w-5 h-5" />
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 max-w-lg shadow border border-stone-200 dark:border-zinc-700">
                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-stone-200 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
                {!isComplete && <span className="inline-block w-2 h-4 bg-zinc-700 dark:bg-zinc-300 animate-pulse mt-1"></span>}
            </div>
        </div>
    );
};