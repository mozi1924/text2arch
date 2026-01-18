import { useState, useCallback, useRef, useEffect } from 'react'
import Cookies from 'js-cookie'
import { v1, v2 } from './utils/converter'
import { highlightSource, highlightArch } from './utils/highlighter'
import { SplitPane } from './components/SplitPane'
import { EditorPane } from './components/EditorPane'
import { MenuBar } from './components/MenuBar'
import { AboutWindow } from './components/AboutWindow'
import { CookieConsent } from './components/CookieConsent'

type Version = 'v1' | 'v2';
type ConsentStatus = 'unknown' | 'accepted' | 'rejected';

function App() {
  const [version, setVersion] = useState<Version>('v2')
  const [sourceText, setSourceText] = useState('')
  const [archText, setArchText] = useState('')
  const [showAbout, setShowAbout] = useState(false);
  const [consent, setConsent] = useState<ConsentStatus>('unknown');
  const [splitPos, setSplitPos] = useState(50);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Track focused input for edit operations
  const sourceInputRef = useRef<HTMLTextAreaElement>(null);
  const archInputRef = useRef<HTMLTextAreaElement>(null);
  const [activeInputRef, setActiveInputRef] = useState<React.RefObject<HTMLTextAreaElement> | null>(null);

  const converter = version === 'v1' ? v1 : v2;

  const [focusedPane, setFocusedPane] = useState<'left' | 'right' | null>(null);


  // Load state from cookies on valid consent
  useEffect(() => {
    const savedConsent = Cookies.get('text2arch_consent') as ConsentStatus | undefined;
    
    if (savedConsent === 'accepted') {
      setConsent('accepted');
      const savedVersion = Cookies.get('text2arch_version') as Version | undefined;
      const savedSource = Cookies.get('text2arch_source');
      const savedLayout = Cookies.get('text2arch_layout');

      
      if (savedVersion) setVersion(savedVersion);
      if (savedSource) {
        setSourceText(savedSource);
        // Synchronize archText immediately to prevent ghosting
        const ver = (savedVersion || 'v2') as Version;
        const conv = ver === 'v1' ? v1 : v2;
        try {
           const encoded = conv.encode(savedSource);
           setArchText(encoded);
        } catch (e) {
           setArchText(`Error encoding: ${e}`);
        }
      }
      if (savedLayout) {
        setSplitPos(Number(savedLayout));
      }

    } else if (savedConsent === 'rejected') {
      setConsent('rejected');
    } else {
      setConsent('unknown');
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (consent === 'accepted') {
      Cookies.set('text2arch_version', version, { expires: 365 });
      Cookies.set('text2arch_source', sourceText, { expires: 365 });
      Cookies.set('text2arch_layout', String(splitPos), { expires: 365 });

    }
  }, [consent, version, sourceText, splitPos]);

  const handleSourceChange = useCallback((text: string) => {
    setSourceText(text);
    // Only auto-update Arch if we are NOT focusing on the right pane (i.e. we are editing source)
    // Or if we are programmatically setting it (like clear/import).
    // Actually, simple rule: If editing source, update arch.
    // If editing arch, update source.
    // The issue was visual ghosting.
    try {
      const encoded = converter.encode(text);
      setArchText(encoded);
    } catch (e) {
      setArchText(`Error encoding: ${e}`);
    }
  }, [converter]);

  const handleArchChange = useCallback((text: string) => {
    setArchText(text);
    try {
      const decoded = converter.decode(text);
      setSourceText(decoded);
    } catch (e) {
      // Don't overwrite source if decoding fails
    }
  }, [converter]);
  
  // Auto-refresh when version changes (also runs on initial load if source exists)
  useEffect(() => {
    if (sourceText) {
      handleSourceChange(sourceText);
    }
  }, [version, handleSourceChange]);

  const handleCookieAccept = () => {
    setConsent('accepted');
    Cookies.set('text2arch_consent', 'accepted', { expires: 365 });
    Cookies.set('text2arch_version', version, { expires: 365 });
    Cookies.set('text2arch_source', sourceText, { expires: 365 });
    Cookies.set('text2arch_layout', String(splitPos), { expires: 365 });

  };

  const handleCookieDecline = () => {
    setConsent('rejected');
    Cookies.remove('text2arch_consent');
    Cookies.remove('text2arch_version');
    Cookies.remove('text2arch_source');
    Cookies.remove('text2arch_layout');
    Cookies.remove('text2arch_wordwrap');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleSourceChange(text);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    const blob = new Blob([archText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output.${version === 'v1' ? 'bin' : 'arch'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Edit Operations
  const executeCommand = (command: string) => {
    if (activeInputRef?.current) {
      activeInputRef.current.focus();
      document.execCommand(command);
    }
  };

  const handleUndo = () => executeCommand('undo');
  const handleRedo = () => executeCommand('redo');
  const handleCut = () => executeCommand('cut');
  const handleCopy = () => executeCommand('copy');
  const handlePaste = () => executeCommand('paste');

  const handleClear = () => {
    setSourceText('');
    setArchText('');
    // Focus might be lost, ideally we refocus source.
  };

  const handleResetLayout = () => {
    setSplitPos(50);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] overflow-hidden text-white font-sans relative">
      {showAbout && <AboutWindow onClose={() => setShowAbout(false)} />}
      {consent === 'unknown' && (
        <CookieConsent 
          onAccept={handleCookieAccept} 
          onDecline={handleCookieDecline} 
        />
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".txt,.md,.js,.ts,.json" 
      />
      
      <MenuBar 
        version={version} 
        setVersion={setVersion}
        onImport={handleImport}

        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onClear={handleClear}
        onAbout={() => setShowAbout(true)}
        onResetLayout={handleResetLayout}
      />
      
      <div className="flex-1 overflow-hidden">
        <SplitPane
          splitPos={splitPos}
          onSplitChange={setSplitPos}
          left={
            <EditorPane 
              title="Plain Text - Source.txt"
              value={sourceText}
              onChange={handleSourceChange}
              fontClass="font-mono bg-[#1e1e1e]" // Add bg to ensure editor overlay looks right
              placeholder="Type here to encode..."
              inputRef={sourceInputRef}
              onFocus={() => {
                setActiveInputRef(sourceInputRef);
                setFocusedPane('left');
              }}
              icon={<span className="text-blue-400 font-bold text-xs">TXT</span>}
              highlight={(code) => highlightSource(code)}
            />
          }
          right={
            <EditorPane 
              title={`Arch Encoded - Output.${version === 'v1' ? 'bin' : 'arch'}`}
              value={archText}
              onChange={handleArchChange}
              fontClass="font-arch bg-[#1e1e1e]"
              placeholder="Or type here to decode..."
              inputRef={archInputRef}
              onFocus={() => {
                setActiveInputRef(archInputRef);
                setFocusedPane('right');
              }}
              icon={<img src="/logo.svg" className="w-5 h-5 object-contain" alt="Logo" />}
              highlight={(code) => {
                // If editing Right pane, disable complex mapping to avoid ghosting
                if (focusedPane === 'right') return code; 
                return highlightArch(code, sourceText, version);
              }}
            />
          }
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-4 text-xs select-none justify-between">
        <div className="flex gap-4">
          <span>main*</span>
          <span>{sourceText.length} chars</span>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>{version.toUpperCase()} Protocol</span>
          <span>ArchBase4</span>
        </div>
      </div>
    </div>
  )
}

export default App
