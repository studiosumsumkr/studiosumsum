import React from 'react';
import { DollarSign, Globe } from 'lucide-react';
import { useCMS } from '../cms';
import { CurrencyType } from '../utils/currency';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCMS();

  const currencies: { code: CurrencyType; label: string; symbol: string }[] = [
    { code: 'USD', label: 'USD ($)', symbol: '$' },
    { code: 'KRW', label: 'KRW (₩)', symbol: '₩' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  ];

  return (
    <div className="inline-flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">
      <Globe className="w-3 h-3 text-neutral-400 ml-1.5" />
      {currencies.map((c) => {
        const isActive = currency === c.code;
        return (
          <button
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={`px-2 py-0.5 font-bold uppercase transition-all rounded cursor-pointer ${
              isActive
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            {c.code}
          </button>
        );
      })}
    </div>
  );
};
