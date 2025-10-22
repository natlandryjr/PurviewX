import { useState, useCallback, useRef, useEffect } from 'react';

export const useResizableColumns = (initialWidths: number[]) => {
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  const isResizing = useRef<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const startResizing = useCallback((index: number) => {
    isResizing.current = index;
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = null;
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current === null || !tableRef.current) return;

    const tableLeft = tableRef.current.getBoundingClientRect().left;
    const newWidths = [...columnWidths];
    const resizerIndex = isResizing.current;
    
    let newLeftWidth = e.clientX - tableLeft;
    for (let i = 0; i < resizerIndex; i++) {
      newLeftWidth -= newWidths[i];
    }

    const newRightWidth = newWidths[resizerIndex] + newWidths[resizerIndex + 1] - newLeftWidth;

    if (newLeftWidth > 50 && newRightWidth > 50) { // Minimum column width
      newWidths[resizerIndex] = newLeftWidth;
      newWidths[resizerIndex + 1] = newRightWidth;
      setColumnWidths(newWidths);
    }
  }, [columnWidths]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [onMouseMove, stopResizing]);

  return { columnWidths, tableRef, startResizing };
};
