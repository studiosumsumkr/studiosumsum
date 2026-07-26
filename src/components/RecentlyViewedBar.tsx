import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface RecentlyViewedBarProps {
  onProductClick: (p: Product) => void;
}

export const RecentlyViewedBar: React.FC<RecentlyViewedBarProps> = ({ onProductClick }) => {
  const { recentlyViewed, products, currency } = useCMS();
  const [isExpanded, setIsExpanded] = useState(false);

  const viewedProducts = products.filter((p) => recentlyViewed.includes(p.id));

  if (viewedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xl max-w-sm w-80 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                <History className="w-4 h-4 text-emerald-600" />
                <span>최근 본 오브젝트 ({viewedProducts.length})</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {viewedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onProductClick(p)}
                  className="flex items-center gap-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-all cursor-pointer group"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ objectPosition: p.imagePosition || 'center' }}
                    className="w-10 h-10 object-cover rounded bg-neutral-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-bold uppercase truncate group-hover:underline text-neutral-900 dark:text-white">
                      {p.name}
                    </h5>
                    <p className="text-[10px] font-mono text-neutral-500">
                      {formatPrice(p.price, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-neutral-900 text-white dark:bg-white dark:text-black border border-neutral-700 px-3 py-2 rounded-full shadow-2xl text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
          >
            <History className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>최근 본 상품 ({viewedProducts.length})</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};
