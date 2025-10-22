
import React from 'react';

export const FilePdfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 11.5v6" />
    <path d="M13.5 11.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.5" />
    <path d="M8.5 18a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1.5" />
  </svg>
);
