import React from 'react';
import { Grid2X2, Grid3X3, LayoutGrid } from 'lucide-react';

interface GridDensityToggleProps {
  cols: 2 | 3 | 4;
  onChange: (cols: 2 | 3 | 4) => void;
}

export const GridDensityToggle: React.FC<GridDensityToggleProps> = ({ cols, onChange }) => {
  return (
    <div className="hidden sm:flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <button
        onClick={() => onChange(2)}
        className={`p-1.5 rounded transition-all cursor-pointer ${
          cols === 2
            ? 'bg-white dark:bg-neutral-900 shadow text-black dark:text-white'
            : 'text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
        title="2열 격자 보기"
      >
        <Grid2X2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onChange(3)}
        className={`p-1.5 rounded transition-all cursor-pointer ${
          cols === 3
            ? 'bg-white dark:bg-neutral-900 shadow text-black dark:text-white'
            : 'text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
        title="3열 격자 보기"
      >
        <Grid3X3 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onChange(4)}
        className={`p-1.5 rounded transition-all cursor-pointer ${
          cols === 4
            ? 'bg-white dark:bg-neutral-900 shadow text-black dark:text-white'
            : 'text-neutral-400 hover:text-black dark:hover:text-white'
        }`}
        title="4열 밀도 보기"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
};
