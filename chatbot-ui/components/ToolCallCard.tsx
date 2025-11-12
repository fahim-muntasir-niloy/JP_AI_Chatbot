import React, { useState } from 'react';
import { ToolStep } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ToolIcon } from './icons/ToolIcon';
import { ToolOutputCard } from './ToolOutputCard';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ToolCallCardProps {
    steps: ToolStep[];
    isComplete?: boolean;
}

export const ToolCallCard: React.FC<ToolCallCardProps> = ({ steps, isComplete = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    const title = steps.length > 1 ? `${steps.length} Tool Calls` : steps[0].tool_name;

    return (
        <div className="max-w-3xl mx-auto my-2">
            <div className="bg-stone-100 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-lg shadow-sm">
                <button
                    className="w-full flex items-center justify-between p-3 text-left"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-teal-100 dark:bg-teal-900/50'}`}>
                            <ToolIcon className={`w-5 h-5 ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-600 dark:text-teal-400 animate-spin'}`} />
                        </div>

                        <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">{title}</span>
                    </div>
                    <ChevronDownIcon
                        className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="p-4 border-t border-stone-200 dark:border-zinc-700 space-y-4">
                        {steps.map(step => (
                            <div key={step.tool_call_id} className="bg-white dark:bg-zinc-800 p-4 rounded-md border border-stone-200 dark:border-zinc-700">
                                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{step.tool_name}</p>
                                <div className="mt-2 p-3 bg-stone-50 dark:bg-zinc-900 rounded">
                                    <code className="text-sm text-zinc-700 dark:text-zinc-300">{step.input}</code>
                                </div>
                                <div className="mt-4">
                                    {step.output ? (
                                        <ToolOutputCard results={step.output} />
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                            <SpinnerIcon className="w-4 h-4"/>
                                            <span>Waiting for tool output...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};