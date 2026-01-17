import React, { useState, useEffect, useRef } from 'react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialSplit?: number; // percentage
}

export function SplitPane({ left, right, initialSplit = 50 }: SplitPaneProps) {
  const [split, setSplit] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newSplit = Math.max(10, Math.min(90, (x / width) * 100)); // Clamp between 10% and 90%
      setSplit(newSplit);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex flex-1 h-full w-full overflow-hidden relative">
      <div style={{ width: `${split}%` }} className="h-full overflow-hidden relative z-0">
        {left}
      </div>
      
      {/* Resizer Handle */}
      <div
        className={`w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-10 flex flex-col justify-center items-center group relative -ml-0.5 ${isDragging ? 'bg-blue-600' : 'bg-white/10'}`}
        onMouseDown={handleMouseDown}
      >
         <div className="h-8 w-1 bg-white/20 rounded-full group-hover:bg-white/50 transition-colors" />
      </div>

      <div style={{ width: `${100 - split}%` }} className="h-full overflow-hidden relative z-0">
        {right}
      </div>
    </div>
  );
}
