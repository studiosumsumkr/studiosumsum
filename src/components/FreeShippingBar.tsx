import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../cms';
import { formatPrice } from '../utils/currency';

interface FreeShippingBarProps {
  targetAmount?: number; // e.g. 150 (in USD base)
}

export const FreeShippingBar: React.FC<FreeShippingBarProps> = ({ targetAmount = 150 }) => {
  const { cart, products, currency } = useCMS();

  // Calculate current cart total
  const cartSubtotal = cart.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const needed = Math.max(0, targetAmount - cartSubtotal);
  const percent = Math.min(100, Math.round((cartSubtotal / targetAmount) * 100));

  return (
    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-900 dark:text-white">
        <div className="flex items-center space-x-1.5">
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {needed === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 무료 배송 혜택 적용 가능!
            </span>
          ) : (
            <span>
              무료 배송까지 <strong className="text-black dark:text-white">{formatPrice(needed, currency)}</strong> 남았습니다.
            </span>
          )}
        </div>
        <span className="text-neutral-400">{percent}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            needed === 0 ? 'bg-emerald-500' : 'bg-black dark:bg-white'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
