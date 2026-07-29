import React from 'react';
import { SlidersHorizontal, Sparkles, Flame, CheckCircle, Clock } from 'lucide-react';

interface CategoryQuickFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedFilter: 'all' | 'new' | 'best' | 'preorder' | 'instock';
  onSelectFilter: (filter: 'all' | 'new' | 'best' | 'preorder' | 'instock') => void;
}

export const CategoryQuickFilter: React.FC<CategoryQuickFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <div className="py-4 border-y border-neutral-200 dark:border-neutral-800 my-6 space-y-3 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectCategory('ALL')}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-black'
            }`}
          >
            ALL OBJECTS
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature Filters */}
        <div className="flex items-center space-x-1.5 text-[10px] font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 mr-1" />
          <button
            onClick={() => onSelectFilter('all')}
            className={`px-2.5 py-1 font-bold uppercase border transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900'
                : 'bg-white dark:bg-neutral-900 text-neutral-500 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            전체 보기
          </button>

          <button
            onClick={() => onSelectFilter('new')}
            className={`px-2.5 py-1 font-bold uppercase border transition-all cursor-pointer flex items-center space-x-1 ${
              selectedFilter === 'new'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>신상품</span>
          </button>

          <button
            onClick={() => onSelectFilter('best')}
            className={`px-2.5 py-1 font-bold uppercase border transition-all cursor-pointer flex items-center space-x-1 ${
              selectedFilter === 'best'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>베스트셀러</span>
          </button>

          <button
            onClick={() => onSelectFilter('preorder')}
            className={`px-2.5 py-1 font-bold uppercase border transition-all cursor-pointer flex items-center space-x-1 ${
              selectedFilter === 'preorder'
                ? 'bg-amber-500 text-black font-extrabold border-amber-500'
                : 'bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>프리오더</span>
          </button>

          <button
            onClick={() => onSelectFilter('instock')}
            className={`px-2.5 py-1 font-bold uppercase border transition-all cursor-pointer flex items-center space-x-1 ${
              selectedFilter === 'instock'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-neutral-900 text-blue-700 dark:text-blue-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>구매가능만</span>
          </button>
        </div>
      </div>
    </div>
  );
};
