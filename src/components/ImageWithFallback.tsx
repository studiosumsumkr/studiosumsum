import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  imagePosition?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  style,
  imagePosition = 'center',
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-neutral-100 flex flex-col items-center justify-center p-4 text-neutral-400 select-none ${className}`}>
        <ImageOff className="w-6 h-6 mb-1 opacity-50" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Image Unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      onError={() => setError(true)}
      style={{
        objectPosition: imagePosition,
        ...style
      }}
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
