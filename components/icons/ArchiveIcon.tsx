// FIX: Create ArchiveIcon.tsx component.

import React from 'react';

export const ArchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <path d="M8 12h8" />
    <path d="M2 10h20" />
  </svg>
);
