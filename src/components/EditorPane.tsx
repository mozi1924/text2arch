
import { RefObject } from 'react';
import Editor from 'react-simple-code-editor';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  readOnly?: boolean;
  fontClass?: string;
  placeholder?: string;
  lineNumbers?: boolean;
  inputRef?: RefObject<any>; // Simple editor doesn't expose HTMLTextAreaElement directly in the same way, but let's see
  onFocus?: () => void;
  icon?: React.ReactNode;
  highlight: (code: string) => string;
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
  icon,
  highlight
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
      <div className="flex-1 flex overflow-hidden relative group font-mono text-sm">
        
        {/* Line Numbers */}
        {lineNumbers && (
           <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right text-xs pt-4 pr-3 leading-6 select-none border-r border-white/5 font-mono">
             {lineArray.map(ln => (
               <div key={ln} style={{ height: '24px' }}>{ln}</div>
             ))}
           </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 relative overflow-auto custom-scrollbar editor-nowrap" onClick={onFocus}>
            <Editor
                value={value}
                onValueChange={onChange}
                highlight={highlight}
                padding={16}
                textareaClassName="focus:outline-none"
                style={{
                  fontFamily: fontClass === 'font-arch' ? '"ArchBase4", monospace' : 'monospace',
                  fontSize: 14,
                  backgroundColor: 'transparent',
                  minHeight: '100%',
                  minWidth: '100%', 
                  width: 'max-content', // Forces container to expand to fit text width
                  lineHeight: '24px',
                  overflow: 'visible' // Override react-simple-code-editor default hidden
                }}
                textareaId="code-area"
                placeholder={placeholder}
                // @ts-ignore
                ref={inputRef}
            />
        </div>
      </div>
    </div>
  );
}
