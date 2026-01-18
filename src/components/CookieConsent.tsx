
interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  return (
    <div className="fixed bottom-0 right-0 m-4 z-[100] max-w-sm bg-[#252526] border border-[#454545] shadow-xl text-[#cccccc] text-xs animate-slide-up">
      <div className="flex">
        {/* Info Icon Strip */}
        <div className="w-1 bg-[#007acc]"></div>
        
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="text-[#007acc] mt-0.5">
              <InfoIcon />
            </div>
            <div className="flex-1">
                Do you allow this editor to save your content, settings, and usage data for Google Analytics to cookies?
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end mt-1">
            <button 
              onClick={onDecline}
              className="px-3 py-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white rounded-sm transition-colors"
            >
              Don't Save
            </button>
            <button 
              onClick={onAccept}
              className="px-3 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded-sm transition-colors"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM7 7h2v5H7V7zm0-3h2v2H7V4z"/>
    </svg>
  );
}
