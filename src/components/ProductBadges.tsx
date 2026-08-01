import React from 'react';
import { Product } from '../types';

interface ProductBadgesProps {
  product: Product;
  className?: string;
  showCategory?: boolean;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ 
  product, 
  className = "absolute top-3 left-3 z-20",
  showCategory = false
}) => {
  const isSoldOut = product.inStock === false || (product.stockCount !== undefined && product.stockCount <= 0);
  const isLowStock = !isSoldOut && product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5;
  const isNew = product.isNewProduct;
  const isBest = product.isBestSeller;
  const isPreorder = product.isPreorder;

  if (!isSoldOut && !isLowStock && !isNew && !isBest && !isPreorder && !showCategory) return null;

  return (
    <div className={`flex flex-col gap-1 items-start pointer-events-none select-none ${className}`}>
      {showCategory && product.category && (
        <span className="bg-[#FFFFFF]/95 dark:bg-neutral-900/95 backdrop-blur text-neutral-800 dark:text-neutral-200 text-[9px] px-2.5 py-1 uppercase tracking-widest font-mono border border-neutral-200 dark:border-neutral-700 shadow-sm font-bold">
          {product.category}
        </span>
      )}
      {isSoldOut && (
        <span className="bg-rose-600 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-rose-500 shadow-md">
          SOLD OUT (품절)
        </span>
      )}
      {isLowStock && (
        <span className="bg-orange-600 text-white text-[8px] font-mono font-black uppercase tracking-[0.15em] px-2 py-0.5 shadow-md animate-pulse">
          🔥 품절 임박 (남은 수량 {product.stockCount}개)
        </span>
      )}
      {isPreorder && (
        <span className="bg-amber-500 text-black text-[8px] font-mono font-black uppercase tracking-[0.15em] px-2 py-0.5 shadow-md flex items-center space-x-1">
          <span>PRE-ORDER</span>
        </span>
      )}
      {isNew && !isSoldOut && (
        <span className="bg-emerald-600 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 shadow-md">
          NEW
        </span>
      )}
      {isBest && !isSoldOut && (
        <span className="bg-amber-700 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 shadow-md">
          BEST
        </span>
      )}
    </div>
  );
};

