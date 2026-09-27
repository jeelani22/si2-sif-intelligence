import React, { useState, useRef, useEffect } from 'react';

export default function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-2 right-3 z-40 flex flex-col items-end"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Full explanation popover on hover/click */}
      {isOpen && (
        <div
          role="tooltip"
          className="mb-1.5 max-w-[340px] sm:max-w-sm p-3 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded shadow-lg text-secondary text-[11px] leading-relaxed animate-fade-in text-left"
        >
          <div className="font-semibold text-primary text-xs mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-secondary">info</span>
              Prototype Notice
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-secondary hover:text-primary p-0.5 rounded transition-colors"
              title="Close disclaimer"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
          <p className="text-on-surface-variant font-normal">
            This prototype uses simulated/mock safety-report data for demonstration purposes only. Review-priority scores, patterns, alerts and case information are illustrative and are not calibrated predictions of injury or fatality.
          </p>
        </div>
      )}

      {/* Compact disclaimer pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest/85 hover:bg-surface-container-lowest text-secondary hover:text-primary text-[10.5px] font-medium tracking-tight rounded border border-outline-variant/60 shadow-xs transition-all duration-150 backdrop-blur-xs select-none cursor-pointer focus:outline-none"
        title="Click or hover for full disclaimer"
        aria-label="Prototype disclaimer"
      >
        <span className="material-symbols-outlined text-[12px] opacity-70">info</span>
        <span>Demo Prototype • Simulated Safety Data • Illustrative Scores</span>
      </button>
    </div>
  );
}
