import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbNavProps {
  category?: string;
  productName?: string;
  onCategoryClick?: (cat: string) => void;
  onHomeClick?: () => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  category,
  productName,
  onCategoryClick,
  onHomeClick,
}) => {
  return (
    <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-sans">
      <button
        onClick={onHomeClick}
        className="hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
      >
        <Home className="w-3 h-3" />
        <span>HOME</span>
      </button>

      <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />

      <span>SHOP</span>

      {category && (
        <>
          <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
          <button
            onClick={() => onCategoryClick?.(category)}
            className="hover:text-black dark:hover:text-white font-bold transition-colors cursor-pointer"
          >
            {category}
          </button>
        </>
      )}

      {productName && (
        <>
          <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
          <span className="text-neutral-900 dark:text-white font-bold truncate max-w-[150px]">
            {productName}
          </span>
        </>
      )}
    </nav>
  );
};
