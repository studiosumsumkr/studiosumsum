import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Command, Tag, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onProductClick,
}) => {
  const { products, currency, addRecentlyViewed } = useCMS();
  const [query, setQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState<string[]>([
    '세라믹',
    '인센스',
    '화병',
    '프래그런스',
  ]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQ = query.trim().toLowerCase().replace(/\s/g, '');
  const searchResults = cleanQ
    ? products.filter((p) => {
        const name = p.name.toLowerCase().replace(/\s/g, '');
        const cat = p.category.toLowerCase().replace(/\s/g, '');
        const desc = (p.description || '').toLowerCase().replace(/\s/g, '');
        return name.includes(cleanQ) || cat.includes(cleanQ) || desc.includes(cleanQ);
      })
    : [];

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleSelectProduct = (p: Product) => {
    addRecentlyViewed(p.id);
    onProductClick(p);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center pt-16 md:pt-24 p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-2xl w-full shadow-2xl z-10 overflow-hidden rounded-xl"
          >
            {/* Input Bar */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 bg-neutral-50 dark:bg-neutral-950">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="찾으시는 오브제 명칭, 카테고리, 소재를 검색하세요... (Cmd + K)"
                autoFocus
                className="w-full bg-transparent text-sm md:text-base font-medium outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-400 hover:text-black dark:hover:text-white text-xs font-bold"
                >
                  지우기
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results / Suggestions Area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {!query ? (
                <div className="space-y-6">
                  {/* Popular Searches */}
                  <div>
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
                      추천 검색어
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {recentQueries.map((rq) => (
                        <button
                          key={rq}
                          onClick={() => setQuery(rq)}
                          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-mono rounded-md transition-all cursor-pointer flex items-center space-x-1.5"
                        >
                          <Tag className="w-3 h-3 text-neutral-400" />
                          <span>{rq}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2.5">
                      카테고리 둘러보기
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setQuery(cat)}
                          className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-black text-left rounded-lg transition-all cursor-pointer group"
                        >
                          <span className="text-xs font-bold font-display uppercase tracking-wider block text-neutral-900 dark:text-white group-hover:underline">
                            {cat}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {products.filter((p) => p.category === cat).length} items
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <Search className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-xs font-mono uppercase tracking-widest">
                    "{query}"에 대한 검색 결과가 없습니다.
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    다른 키워드로 검색해 보시거나 카테고리 메뉴를 참고해 보세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    검색 결과 ({searchResults.length}개)
                  </p>
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className="py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 px-2 rounded-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded bg-neutral-100"
                          />
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
                              {p.category}
                            </span>
                            <h4 className="text-xs font-bold uppercase text-neutral-900 dark:text-white group-hover:underline">
                              {p.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                            {formatPrice(p.price, currency)}
                          </span>
                          <CornerDownLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-[10px] font-mono text-neutral-400">
              <span className="flex items-center space-x-1">
                <Command className="w-3 h-3" />
                <span>+ K 빠른 검색</span>
              </span>
              <span>STUDIO SUMSUM SENSORY SEARCH</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
