import React from 'react';
import { AlertTriangle, PackageX, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../cms';

export const LowStockWidget: React.FC = () => {
  const { products, updateProduct } = useCMS();

  const soldOutItems = products.filter((p) => p.inStock === false);

  if (soldOutItems.length === 0) return null;

  return (
    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3 font-sans">
      <div className="flex items-center justify-between text-amber-800 dark:text-amber-400">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-display">
            품절 관리 대상 오브제 ({soldOutItems.length}개)
          </h4>
        </div>
        <span className="text-[9px] font-mono bg-amber-500 text-black font-bold px-2 py-0.5 rounded">
          STOCK ALERT
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {soldOutItems.map((p) => (
          <div
            key={p.id}
            className="p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <img src={p.imageUrl} alt={p.name} className="w-9 h-9 object-cover rounded bg-neutral-100" />
              <div className="overflow-hidden">
                <h5 className="text-xs font-bold truncate text-neutral-900 dark:text-white">
                  {p.name}
                </h5>
                <span className="text-[9px] font-mono text-rose-500 font-bold">SOLD OUT</span>
              </div>
            </div>

            <button
              onClick={() => updateProduct(p.id, { inStock: true })}
              className="px-2 py-1 bg-emerald-600 text-white text-[9px] font-mono font-bold uppercase rounded hover:bg-emerald-700 transition-all cursor-pointer shrink-0"
            >
              재입고
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
