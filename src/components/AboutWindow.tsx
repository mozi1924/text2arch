import { useState, useEffect, useRef } from 'react';

interface AboutWindowProps {
  onClose: () => void;
}

export function AboutWindow({ onClose }: AboutWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Center initially
  useEffect(() => {
    if (windowRef.current) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = windowRef.current;
      setPosition({
        x: (innerWidth - offsetWidth) / 2,
        y: (innerHeight - offsetHeight) / 2
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      }
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
    <div 
      ref={windowRef}
      className="fixed z-[100] w-80 bg-[#252526] border border-[#454545] shadow-2xl flex flex-col text-[#cccccc] select-none"
      style={{ left: position.x, top: position.y }}
    >
      {/* Title Bar */}
      <div 
        className="h-8 bg-[#3c3c3c] flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-semibold">About Text2Arch</span>
        <button 
          onClick={onClose}
          className="hover:bg-[#c42b1c] hover:text-white px-2 h-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col items-center gap-4 text-center">
        {/* Logo Placeholder */}
        {/* Logo */}
        <img src="/logo.svg" className="w-20 h-20 object-contain drop-shadow-2xl" alt="ArchBase4 Logo" />

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Text2Arch</h2>
          <p className="text-xs text-[#858585]">Version 1.0.0</p>
        </div>

        <blockquote className="text-sm italic text-[#d4d4d4] border-l-2 border-[#007acc] pl-3 py-1 my-2 bg-black/20 w-full text-left">
          "The Arch people live in Arch life"
          <footer className="text-xs text-[#858585] mt-1">— Mozi Arasaka</footer>
        </blockquote>

        <div className="text-xs text-[#858585] w-full pt-4 border-t border-[#454545]">
          <p>Created by Mozi1924</p>
          <a href="https://github.com/mozi1924/text2arch" target="_blank" rel="noopener" className="text-[#3794ff] hover:underline">
            github.com/mozi1924/text2arch
          </a>
          <p className="mt-2 text-[10px] opacity-60">
            Copyright © 2024. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
