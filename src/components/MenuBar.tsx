
import { useState, useRef, useEffect } from 'react';

interface MenuBarProps {
  version: 'v1' | 'v2';
  setVersion: (v: 'v1' | 'v2') => void;
  onImport: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onClear: () => void;
  onAbout: () => void;
}

export function MenuBar({ 
  version, 
  setVersion,
  onImport,
  onExport,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onClear,
  onAbout
}: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus = {
    File: [
      { label: 'Import Source File...', action: onImport },
      { label: 'Export Result...', action: onExport },
    ],
    Edit: [
      { label: 'Undo', action: onUndo },
      { label: 'Redo', action: onRedo },
      { type: 'separator' },
      { label: 'Cut', action: onCut },
      { label: 'Copy', action: onCopy },
      { label: 'Paste', action: onPaste },
      { type: 'separator' },
      { label: 'Clear All', action: onClear },
    ],
    About: [
      { label: 'About Text2Arch', action: onAbout },
    ]
  };

  return (
    <div className="h-10 bg-[#3c3c3c]/80 backdrop-blur-md flex items-center px-4 justify-between select-none z-50 border-b border-black/20" ref={menuRef}>
      
      {/* Left Menu Items */}
      <div className="flex items-center gap-1 text-[13px] text-white/90 relative">
        {Object.entries(menus).map(([name, items]) => (
          <div key={name} className="relative">
            <div 
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${activeMenu === name ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setActiveMenu(activeMenu === name ? null : name)}
            >
              {name}
            </div>
            
            {activeMenu === name && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#252526] border border-black/20 rounded shadow-xl py-1 z-50 min-w-[200px]">
                {items.map((item, idx) => (
                  (item as any).type === 'separator' ? (
                    <div key={idx} className="h-px bg-white/10 my-1 mx-2" />
                  ) : (
                    <div 
                      key={idx}
                      className="px-4 py-1.5 hover:bg-[#094771] hover:text-white text-white/90 cursor-pointer flex items-center justify-between group"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        (item as any).action?.();
                        setActiveMenu(null);
                      }}
                    >
                      <span>{(item as any).label}</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Center - Title (Optional) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none opacity-60">
        <img src="/logo.svg" className="h-4 w-4" alt="ArchBase4 Logo" />
        <span className="text-xs text-white/60 font-medium">Text2Arch Editor - {version.toUpperCase()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="flex bg-black/20 rounded p-0.5 border border-white/5">
          <button
            onClick={() => setVersion('v1')}
            className={`px-3 py-0.5 text-xs rounded transition-all ${version === 'v1' ? 'bg-[#007acc] text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            v1 (Legacy)
          </button>
          <button
            onClick={() => setVersion('v2')}
            className={`px-3 py-0.5 text-xs rounded transition-all ${version === 'v2' ? 'bg-[#007acc] text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            v2 (Smart)
          </button>
        </div>
        
        <a 
          href="https://github.com/mozi1924/text2arch" 
          target="_blank" 
          rel="noopener"
          className="text-white/60 hover:text-white transition-colors"
        >
          <GitHubIcon />
        </a>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
