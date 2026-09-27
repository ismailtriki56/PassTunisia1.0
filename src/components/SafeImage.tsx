import React, { useState } from 'react';
import { MapPin, ImageOff, Compass } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  alt: string;
  category?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt,
  category,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);
  const [triedFallback, setTriedFallback] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

  const handleError = () => {
    if (fallbackSrc && !triedFallback && fallbackSrc !== currentSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  // If image fails, render clean plain solid-color placeholder card with the place name as text
  if (hasError || !currentSrc) {
    const isTeal = category === 'culture' || category === 'beach';
    const isAmber = category === 'eclipse_viewing';
    const bgClass = isAmber
      ? 'bg-amber-800 text-amber-100'
      : isTeal
      ? 'bg-[#124e5b] text-[#e0f2f1]'
      : 'bg-[#8d3d22] text-[#fdf5f0]';

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 text-center select-none ${bgClass} ${className}`}
        style={{ minHeight: '130px' }}
      >
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-2 shadow-xs">
          <Compass className="w-5 h-5 opacity-90" />
        </div>
        <div className="text-xs sm:text-sm font-bold tracking-tight line-clamp-2 px-2 max-w-[200px]">
          {alt}
        </div>
        <div className="text-[10px] tracking-wider uppercase opacity-75 mt-1 font-mono">
          Tunisia Heritage
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      className={className}
      {...props}
    />
  );
};
