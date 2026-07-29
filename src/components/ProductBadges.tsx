import React from 'react';
import { Product } from '../types';

interface ProductBadgesProps {
  product: Product;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product }) => {
  const isSoldOut = product.inStock === false;
  const isNew = product.isNewProduct;
  const isBest = product.isBestSeller;
  const isPreorder = product.isPreorder;

  if (!isSoldOut && !isNew && !isBest && !isPreorder) return null;

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none select-none">
      {isSoldOut && (
        <span className="bg-neutral-900 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-neutral-700 shadow-md">
          SOLD OUT
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
