import React from 'react';

interface StickyFooterProps {
  children: React.ReactNode;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({ children }) => {
  return (
    <footer className="sticky bottom-0 bg-card border-t p-4 z-10">
      <div className="container mx-auto flex items-center justify-between">
        {children}
      </div>
    </footer>
  );
};
