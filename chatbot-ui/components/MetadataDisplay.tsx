
import React from 'react';
import { FileIcon } from './icons/FileIcon';

interface MetadataDisplayProps {
    metadata: { [key: string]: any };
}

const MetadataItem: React.FC<{ label: string; value: any }> = ({ label, value }) => {
    // Don't render if value is null, undefined, or an empty string
    if (value === null || value === undefined || value === '') return null;

    // A simple way to format keys for display
    const formattedLabel = label
        .replace(/_/g, ' ')
        .replace(/modDate/g, 'Modification Date')
        .replace(/creationDate/g, 'Creation Date')
        .replace(/\b\w/g, l => l.toUpperCase());

    return (
         <div className="flex flex-col">
            <dt className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate" title={formattedLabel}>{formattedLabel}</dt>
            <dd className="text-xs text-zinc-700 dark:text-stone-300 break-words" title={String(value)}>{String(value)}</dd>
        </div>
    );
};


export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => {
    // Extract source/file_path for a special header, if it exists
    const source = metadata.source || metadata.file_path;
    
    // Filter out keys we don't want to display generically or are already handled
    const otherMetadata = Object.entries(metadata).filter(
        ([key]) => key !== 'source' && key !== 'file_path'
    );

    return (
        <div>
            {source && (
                 <div className="flex items-center gap-2 mb-3">
                     <FileIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 truncate" title={source}>
                       {source.split('\\').pop().split('/').pop()}
                    </p>
                </div>
            )}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                 {otherMetadata.map(([key, value]) => (
                    <MetadataItem key={key} label={key} value={value} />
                ))}
            </dl>
        </div>
    );
};