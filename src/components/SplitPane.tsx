import { useState, useRef, useEffect, ReactNode } from 'react'

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number;
  splitPos?: number;
  onSplitChange?: (pos: number) => void;
}

export function SplitPane({ left, right, initialSplit = 50, splitPos, onSplitChange }: SplitPaneProps) {
  const [internalSplit, setInternalSplit] = useState(initialSplit);
  const split = splitPos !== undefined ? splitPos : internalSplit;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (splitPos === undefined) {
        setInternalSplit(initialSplit);
    }
  }, [initialSplit, splitPos]);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      
      const { left, width } = containerRef.current.getBoundingClientRect();
      const newSplit = ((e.clientX - left) / width) * 100;
      
      const clampedSplit = Math.min(Math.max(newSplit, 20), 80);
      
      if (splitPos === undefined) {
        setInternalSplit(clampedSplit);
      }
      
      onSplitChange?.(clampedSplit);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSplitChange, splitPos]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div style={{ width: `${split}%` }} className="h-full overflow-hidden">
        {left}
      </div>
      
      <div 
        className="w-1 bg-[#333] hover:bg-[#007acc] cursor-col-resize transition-colors z-10 flex items-center justify-center"
        onMouseDown={handleMouseDown}
      />
      
      <div style={{ width: `${100 - split}%` }} className="h-full overflow-hidden">
        {right}
      </div>
    </div>
  );
}
