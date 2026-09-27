import React from 'react';

interface TunisiaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
  showSubtitle?: boolean;
  className?: string;
}

export const TunisiaEmblem: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-9 h-9',
  className = ''
}) => {
  return (
    <div
      className={`relative shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 ${sizeClass} ${className}`}
      title="Tunisian Flag Emblem"
    >
      <svg
        viewBox="-32 -32 64 64"
        className="w-full h-full drop-shadow-xs"
        role="img"
        aria-label="Tunisian flag emblem with crescent and star"
      >
        <defs>
          <linearGradient id="tn-red-grad" x1="-30" y1="-30" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef1326" />
            <stop offset="100%" stopColor="#c70010" />
          </linearGradient>
          <radialGradient id="tn-glow" cx="0" cy="0" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
          </radialGradient>
        </defs>

        {/* Outer Red Shield/Squircle */}
        <rect
          x="-30"
          y="-30"
          width="60"
          height="60"
          rx="14"
          fill="url(#tn-red-grad)"
        />
        {/* Subtle inner highlight border */}
        <rect
          x="-29"
          y="-29"
          width="58"
          height="58"
          rx="13"
          fill="none"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1.2"
        />
        <rect
          x="-30"
          y="-30"
          width="60"
          height="60"
          rx="14"
          fill="url(#tn-glow)"
        />

        {/* Authentic Tunisian Flag White Roundel Disc */}
        <circle fill="#ffffff" cx="0" cy="0" r="18" />

        {/* Outer Red Crescent Circle */}
        <circle fill="#e70013" cx="0" cy="0" r="13.5" />

        {/* Inner White Cutout Circle (offsets right to form the classic right-facing crescent) */}
        <circle fill="#ffffff" cx="3.6" cy="0" r="10.8" />

        {/* Authentic Tunisian 5-Pointed Star - Geometrically exact polygon with hoist-facing point */}
        <polygon
          fill="#e70013"
          points="-4.50,0 1.10,-1.82 1.10,-7.70 4.56,-2.94 10.15,-4.76 6.69,0 10.15,4.76 4.56,2.94 1.10,7.70 1.10,1.82"
        />
      </svg>
    </div>
  );
};

export const TunisiaLogo: React.FC<TunisiaLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  className = ''
}) => {
  const sizeMap = {
    xs: { emblem: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]', badge: 'text-[9px]' },
    sm: { emblem: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]', badge: 'text-[9px]' },
    md: { emblem: 'w-9 h-9', text: 'text-lg', sub: 'text-xs', badge: 'text-[10px]' },
    lg: { emblem: 'w-11 h-11', text: 'text-xl', sub: 'text-xs', badge: 'text-[10px]' },
    xl: { emblem: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'icon') {
    return <TunisiaEmblem sizeClass={currentSize.emblem} className={className} />;
  }

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <TunisiaEmblem sizeClass={currentSize.emblem} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-[#124e5b] ${currentSize.text}`}>
            Pass<span className="text-[#e70013]">Tunisia</span>
          </span>
          <span className={`font-bold px-1.5 py-0.5 bg-[#e70013]/10 text-[#e70013] border border-[#e70013]/20 rounded-md tracking-wider uppercase ${currentSize.badge}`}>
            TN
          </span>
        </div>
        {showSubtitle && (
          <p className={`text-[#786f66] font-medium mt-0.5 leading-tight hidden sm:block ${currentSize.sub}`}>
            National Tourism & Eclipse Explorer
          </p>
        )}
      </div>
    </div>
  );
};
