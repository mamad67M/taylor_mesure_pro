import React from 'react';

export const WaxHeaderPattern: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.08,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waxPatternBg" width="48" height="48" patternUnits="userSpaceOnUse">
            {/* Concentric African Wax geometric petals */}
            <circle cx="24" cy="24" r="16" fill="none" stroke="#D4A017" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="8" fill="none" stroke="#D4A017" strokeWidth="1" />
            <circle cx="24" cy="24" r="3" fill="#D4A017" />
            <path
              d="M0 0 Q 24 12 48 0 Q 36 24 48 48 Q 24 36 0 48 Q 12 24 0 0"
              fill="none"
              stroke="#D4A017"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waxPatternBg)" />
      </svg>
    </div>
  );
};

export const SewingTapeDecoration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 opacity-60 ${className}`}>
      <div className="h-0.5 w-6 bg-[#D4A017]/40 rounded-full" />
      <div className="h-1 w-1 rounded-full bg-[#D4A017]" />
      <div className="h-0.5 w-3 bg-[#D4A017]/40 rounded-full" />
      <div className="h-1 w-1 rounded-full bg-[#D4A017]" />
      <div className="h-0.5 w-6 bg-[#D4A017]/40 rounded-full" />
    </div>
  );
};
