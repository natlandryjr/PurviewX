import { useCallback } from 'react';

// This is a mock hook. In a real app, this would be part of a full context-based toast system.
// For simplicity, it uses the browser's alert() function.
export const useToast = () => {
  const showToast = useCallback(({ title, description }: { title: string; description: string }) => {
    // In a real app, this would dispatch an action to a toast context provider.
    console.log(`[Toast] ${title}: ${description}`);
    alert(`${title}\n${description}`);
  }, []);

  return { showToast };
};
