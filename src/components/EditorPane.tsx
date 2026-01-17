

import { RefObject } from 'react';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  readOnly?: boolean;
  fontClass?: string;
  placeholder?: string;
  lineNumbers?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement>;
  onFocus?: () => void;
  icon?: React.ReactNode;
}

export function EditorPane({ 
  value, 
  onChange, 
  title, 
  fontClass = 'font-mono', 
  placeholder, 
  lineNumbers = true,
  inputRef,
  onFocus,
  icon
}: EditorPaneProps) {
  
  // Simple line number counter based on newlines
  const lines = value.split('\n').length;
  const lineArray = Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Tab Header */}
      <div className="flex items-center bg-[#2d2d2d] h-9 px-4 select-none border-b border-black/20">
        <span className="text-sm text-yellow-500 mr-2 flex items-center justify-center min-w-[1.5rem]">
          {icon || 'TS'}
        </span>
        <span className="text-sm italic opacity-80">{title}</span>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden relative group">
        
        {/* Line Numbers */}
        {lineNumbers && (
           <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right font-mono text-xs pt-4 pr-3 leading-6 select-none border-r border-white/5">
             {lineArray.map(ln => (
               <div key={ln}>{ln}</div>
             ))}
           </div>
        )}

        {/* Text Area */}
        <textarea
          className={`flex-1 bg-transparent resize-none focus:outline-none p-4 leading-6 text-sm ${fontClass} w-full h-full text-[#d4d4d4]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          ref={inputRef}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
}
