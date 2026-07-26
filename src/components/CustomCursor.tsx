import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select')) {
        setCursorType('pointer');
      } else if (target.closest('img, .hip-card')) {
        setCursorType('zoom');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const variants = {
    default: {
      height: 12,
      width: 12,
      backgroundColor: "#000",
      mixBlendMode: "difference" as const,
    },
    pointer: {
      height: 48,
      width: 48,
      backgroundColor: "#fff",
      mixBlendMode: "difference" as const,
      border: "1px solid #000"
    },
    zoom: {
      height: 64,
      width: 64,
      backgroundColor: "transparent",
      border: "1px solid #000",
      content: "'VIEW'"
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[999] hidden lg:flex items-center justify-center text-[8px] font-black tracking-widest overflow-hidden"
      animate={{
        x: mousePosition.x - (cursorType === 'default' ? 6 : cursorType === 'pointer' ? 24 : 32),
        y: mousePosition.y - (cursorType === 'default' ? 6 : cursorType === 'pointer' ? 24 : 32),
        ...variants[cursorType as keyof typeof variants]
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.5 }}
    >
      {cursorType === 'zoom' && <span className="mix-blend-difference text-white">DISCOVER</span>}
    </motion.div>
  );
};
