
import React from 'react';
import { UserIcon } from './icons/UserIcon';

interface UserMessageProps {
    content: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
    return (
        <div className="flex items-start gap-3 justify-end">
            <div className="bg-teal-600 text-white rounded-lg p-3 max-w-lg shadow">
                <p className="text-sm">{content}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-stone-500 dark:text-zinc-400" />
            </div>
        </div>
    );
};