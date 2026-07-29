import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ExternalLink, Trash2, ShoppingBag } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, onProductClick }) => {
  const { wishlist, products, toggleWishlist, currency } = useCMS();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[75] shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h2 className="text-xs font-display font-black uppercase tracking-[0.2em] text-black">
                  WISHLIST ({wishlistedProducts.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistedProducts.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-400 space-y-3">
                  <Heart className="w-10 h-10 opacity-30 stroke-1" />
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    관심 상품 목록이 비어있습니다.
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    마음에 드는 상품의 하트 아이콘을 눌러 추가해보세요.
                  </p>
                </div>
              ) : (
                wishlistedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 p-3 border border-neutral-200 bg-neutral-50/50 hover:border-black transition-all group"
                  >
                    <div
                      onClick={() => {
                        onProductClick(p);
                        onClose();
                      }}
                      className="w-16 h-16 bg-neutral-100 shrink-0 overflow-hidden cursor-pointer relative"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{ objectPosition: p.imagePosition || 'center' }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            onProductClick(p);
                            onClose();
                          }}
                          className="text-xs font-display font-bold uppercase tracking-wide truncate cursor-pointer hover:text-neutral-600"
                        >
                          {p.name}
                        </h4>
                        <p className="text-[11px] font-mono font-extrabold text-neutral-900">
                          {formatPrice(p.price, currency)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 pt-2">
                        <button
                          onClick={() => {
                            onProductClick(p);
                            onClose();
                          }}
                          className="text-[9px] font-bold uppercase tracking-widest text-neutral-800 hover:underline flex items-center space-x-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>상세보기</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="text-[9px] font-bold uppercase tracking-widest text-rose-600 hover:text-rose-800 flex items-center space-x-1 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlistedProducts.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-3">
                <p className="text-[10px] text-neutral-500 font-mono text-center">
                  총 {wishlistedProducts.length}개의 관심 상품이 저장되었습니다.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
