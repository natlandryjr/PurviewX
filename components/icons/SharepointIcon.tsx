// FIX: Creating the SharepointIcon component.
import React from 'react';

export const SharepointIcon: React.FC<{ className?: string, title?: string }> = ({ className, title }) => (
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
    {title && <title>{title}</title>}
    <path d="M12 2l-8 4v12l8 4 8-4V6l-8-4z" />
    <path d="M12 2v20" />
    <path d="M4 6l8 4 8-4" />
    <path d="M4 18l8-4 8 4" />
  </svg>
);
