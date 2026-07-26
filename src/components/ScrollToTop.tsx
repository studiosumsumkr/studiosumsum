import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (scrollPercent < 10) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[70] w-11 h-11 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all cursor-pointer group"
      title="맨 위로 이동"
    >
      {/* SVG Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="22"
          cy="22"
          r="18"
          className="stroke-neutral-200 dark:stroke-neutral-800 fill-none"
          strokeWidth="2.5"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          className="stroke-black dark:stroke-white fill-none transition-all duration-150"
          strokeWidth="2.5"
          strokeDasharray={113}
          strokeDashoffset={113 - (113 * scrollPercent) / 100}
        />
      </svg>
      <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
