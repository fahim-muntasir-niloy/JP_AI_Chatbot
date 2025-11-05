
import React from 'react';

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
);

export const JapanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20"/>
        <path d="M12 2a10 10 0 0 1 10 10c0 1.5-.34 2.9-.95 4.2"/>
        <path d="M12 22a10 10 0 0 0-9.05-6.2"/>
        <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10c1.5 0 2.9-.34 4.2-.95"/>
        <path d="M12 22A10 10 0 0 1 12 2"/>
    </svg>
);


export const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <circle cx="4" cy="12" r="3">
            <animate id="a" begin="0;c.end-0.25s" attributeName="r" dur="0.75s" values="3;0;3"/>
        </circle>
        <circle cx="12" cy="12" r="3">
            <animate begin="a.end-0.6s" attributeName="r" dur="0.75s" values="3;0;3"/>
        </circle>
        <circle cx="20" cy="12" r="3">
            <animate id="c" begin="a.end-0.45s" attributeName="r" dur="0.75s" values="3;0;3"/>
        </circle>
    </svg>
);
