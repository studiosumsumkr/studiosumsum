import React, { useState } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt?: string;
  zoomLevel?: number;
  className?: string;
  imagePosition?: string;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt = 'Product image',
  zoomLevel = 2.5,
  className = '',
  imagePosition = 'center',
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  return (
    <div
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={(e) => {
        const elem = e.currentTarget;
        const { width, height } = elem.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
      }}
      onMouseMove={(e) => {
        const elem = e.currentTarget;
        const { top, left } = elem.getBoundingClientRect();
        const xPos = e.clientX - left;
        const yPos = e.clientY - top;
        setXY([xPos, yPos]);
      }}
      onMouseLeave={() => {
        setShowMagnifier(false);
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ objectPosition: imagePosition }}
        className="w-full h-full object-cover transition-transform duration-300"
        referrerPolicy="no-referrer"
      />

      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: '160px',
            width: '160px',
            top: `${y - 80}px`,
            left: `${x - 80}px`,
            opacity: '1',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + 80}px`,
            backgroundPositionY: `${-y * zoomLevel + 80}px`,
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
};
