import React from 'react';
import { ToolOutputResult } from '../types';
import { MetadataDisplay } from './MetadataDisplay';

interface ToolOutputCardProps {
    results: ToolOutputResult[];
}

export const ToolOutputCard: React.FC<ToolOutputCardProps> = ({ results }) => {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-stone-200">Tool Output ({results.length} {results.length === 1 ? 'result' : 'results'})</h4>
            {results.map((result, index) => (
                <div key={index} className="bg-stone-50 dark:bg-zinc-900/70 p-4 rounded-lg border border-stone-200 dark:border-zinc-700">
                    <p className="text-sm text-zinc-700 dark:text-stone-300 mb-4 whitespace-pre-wrap">{result.content}</p>
                    {Object.keys(result.metadata).length > 0 && (
                        <div className="border-t border-stone-200 dark:border-zinc-700 pt-3 mt-3">
                            <MetadataDisplay metadata={result.metadata} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};