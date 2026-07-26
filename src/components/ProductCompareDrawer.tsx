import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRightLeft, Trash2, ShoppingBag, Check, Minus } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (p: Product) => void;
}

export const ProductCompareDrawer: React.FC<ProductCompareDrawerProps> = ({
  isOpen,
  onClose,
  onProductClick,
}) => {
  const { compareList, products, toggleCompare, clearCompare, currency, addToCart } = useCMS();

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] cursor-pointer"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 inset-x-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-[85] shadow-2xl font-sans max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 text-neutral-900 dark:text-white" />
                <h3 className="text-xs font-display font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                  PRODUCT COMPARE ({comparedProducts.length}/4)
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                {comparedProducts.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:underline cursor-pointer"
                  >
                    비우기
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Table */}
            <div className="p-6 overflow-x-auto flex-1">
              {comparedProducts.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <ArrowRightLeft className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-xs font-mono uppercase tracking-widest">
                    비교할 상품을 선택해 주세요.
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    상품 카드 또는 상세 페이지에서 비교 아이콘을 누르면 최대 4개까지 한눈에 스펙을 비교할 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-w-[600px]">
                  {comparedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-square bg-neutral-100 overflow-hidden group">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ objectPosition: p.imagePosition || 'center' }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black transition-all cursor-pointer"
                            title="비교함에서 제거"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
                            {p.category}
                          </span>
                          <h4
                            onClick={() => {
                              onProductClick(p);
                              onClose();
                            }}
                            className="text-xs font-bold font-display uppercase tracking-wider cursor-pointer hover:underline truncate"
                          >
                            {p.name}
                          </h4>
                          <p className="text-sm font-mono font-extrabold text-neutral-900 dark:text-white mt-1">
                            {formatPrice(p.price, currency)}
                          </p>
                        </div>

                        {/* Attribute Badges */}
                        <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] font-mono">
                          <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                            <span>재고 상태:</span>
                            {p.inStock !== false ? (
                              <span className="text-emerald-600 font-bold flex items-center">
                                <Check className="w-3 h-3 mr-0.5" /> 구매가능
                              </span>
                            ) : (
                              <span className="text-rose-500 font-bold flex items-center">
                                <Minus className="w-3 h-3 mr-0.5" /> 품절
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                            <span>신상품 여부:</span>
                            <span className="font-bold">{p.isNewProduct ? 'YES' : 'NO'}</span>
                          </div>

                          <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                            <span>베스트셀러:</span>
                            <span className="font-bold">{p.isBestSeller ? 'YES' : 'NO'}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-neutral-500 line-clamp-3 leading-relaxed pt-2">
                          {p.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p.id);
                        }}
                        disabled={p.inStock === false}
                        className="w-full py-2.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>장바구니 담기</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
