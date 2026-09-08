import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  withSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  withSlogan = false,
  className = '',
}) => {
  const isDark = variant === 'dark';
  const isGold = variant === 'gold';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Tape measure + African wax motif icon */}
      <div
        className={`relative flex items-center justify-center rounded-xl overflow-hidden shadow-sm flex-shrink-0 ${iconSizes[size]} ${
          isDark
            ? 'bg-[#0D1B2A] text-[#D4A017] border border-[#D4A017]/30'
            : isGold
            ? 'bg-[#D4A017] text-[#0D1B2A] border border-[#0D1B2A]/20'
            : 'bg-white text-[#0D1B2A] border border-[#0D1B2A]/10'
        }`}
      >
        {/* Subtle geometric wax corner marks */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Tape measure coiled loop */}
          <path
            d="M8 24C8 15.1634 15.1634 8 24 8C32.8366 8 40 15.1634 40 24C40 32.8366 32.8366 40 24 40"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Needle piercing through center */}
          <path
            d="M34 14L16 32"
            stroke={isDark ? '#F7F4EF' : '#0D1B2A'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="34" cy="14" r="2.5" fill={isDark ? '#D4A017' : '#0D1B2A'} />
          {/* Measure graduations / marks */}
          <path d="M24 8V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35 13L32 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 24H36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35 35L32 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 40V36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Golden center thimble dot */}
          <circle cx="24" cy="24" r="3.5" fill="#D4A017" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span
            className={`font-display font-extrabold tracking-tight ${textSizes[size]} ${
              isDark ? 'text-[#0D1B2A]' : isGold ? 'text-[#0D1B2A]' : 'text-white'
            }`}
          >
            Mesure<span className="text-[#D4A017]">Pro</span>
          </span>
        </div>
        {withSlogan && (
          <span
            className={`text-xs font-sans tracking-normal -mt-0.5 ${
              isDark ? 'text-[#0D1B2A]/75' : isGold ? 'text-[#0D1B2A]/80' : 'text-[#F7F4EF]/80'
            }`}
          >
            « La précision qui valorise votre savoir-faire »
          </span>
        )}
      </div>
    </div>
  );
};
