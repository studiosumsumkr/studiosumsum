import React from 'react';
import { Product } from '../types';

interface ProductBadgesProps {
  product: Product;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product }) => {
  const isSoldOut = product.inStock === false;
  const isNew = product.isNewProduct;
  const isBest = product.isBestSeller;

  if (!isSoldOut && !isNew && !isBest) return null;

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none select-none">
      {isSoldOut && (
        <span className="bg-neutral-900 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-neutral-700 shadow-md">
          SOLD OUT
        </span>
      )}
      {isNew && !isSoldOut && (
        <span className="bg-emerald-600 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 shadow-md">
          NEW
        </span>
      )}
      {isBest && !isSoldOut && (
        <span className="bg-amber-600 text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 shadow-md">
          BEST
        </span>
      )}
    </div>
  );
};
