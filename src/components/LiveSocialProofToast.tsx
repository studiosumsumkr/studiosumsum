import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, X } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';

interface LiveSocialProofToastProps {
  onProductClick: (product: Product) => void;
}

export const LiveSocialProofToast: React.FC<LiveSocialProofToastProps> = ({ onProductClick }) => {
  const { products } = useCMS();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'purchased' | 'viewed'>('purchased');
  const [city, setCity] = useState('서울 강남구');
  const [visible, setVisible] = useState(false);

  const cities = ['서울 강남구', '부산 해운대구', '인천 송도', '대구 수성구', '제주 서귀포시', '경기 성남시'];

  useEffect(() => {
    if (products.length === 0) return;

    // Show every 18 seconds
    const interval = setInterval(() => {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAction = Math.random() > 0.4 ? 'purchased' : 'viewed';

      setCurrentProduct(randomProd);
      setCity(randomCity);
      setActionType(randomAction);
      setVisible(true);

      // Hide after 5 seconds
      setTimeout(() => setVisible(false), 5000);
    }, 18000);

    return () => clearInterval(interval);
  }, [products]);

  if (!currentProduct || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 left-6 z-[80] max-w-xs w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 shadow-2xl rounded-xl flex items-center space-x-3 font-sans"
      >
        <img
          src={currentProduct.imageUrl}
          alt={currentProduct.name}
          className="w-12 h-12 object-cover rounded-lg bg-neutral-100 shrink-0"
        />

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center space-x-1 text-[10px] font-mono text-neutral-400">
            {actionType === 'purchased' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> 방금 구매됨
              </span>
            ) : (
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <Eye className="w-3 h-3" /> 실시간 탐색 중
              </span>
            )}
            <span>• {city}</span>
          </div>

          <h5
            onClick={() => onProductClick(currentProduct)}
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white truncate cursor-pointer hover:underline"
          >
            {currentProduct.name}
          </h5>
          <span className="text-[9px] font-mono text-neutral-400">3분 전</span>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
