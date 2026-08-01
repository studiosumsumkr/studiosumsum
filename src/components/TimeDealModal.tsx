import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Flame, Sparkles, Check, X, ArrowRight, Share2, ShoppingBag, Zap, AlertTriangle } from 'lucide-react';
import { useCMS } from '../cms';
import { formatPrice } from '../utils/currency';

interface TimeDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeDealModal: React.FC<TimeDealModalProps> = ({ isOpen, onClose }) => {
  const { products, currency, addToCart } = useCMS();

  const [purchased, setPurchased] = useState(false);
  const [copied, setCopied] = useState(false);

  // Time Deal target product (e.g. limited stock item)
  const targetProduct = products[1] || products[0] || {
    id: 'td_1',
    name: 'SUMSUM 프리미엄 오라클 브론즈 인센스 버너',
    price: 128000,
    originalPrice: 168000,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
  };

  const initialStock = 20;
  const remainingStock = 5;
  const stockPercent = Math.round((remainingStock / initialStock) * 100);

  // Live Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = () => {
    if (targetProduct.id) {
      addToCart(targetProduct.id);
    }

    setPurchased(true);
    setTimeout(() => {
      setPurchased(false);
      onClose();
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white dark:bg-neutral-900 border border-amber-500/30 dark:border-amber-500/20 p-6 md:p-8 max-w-2xl w-full shadow-2xl rounded-2xl z-10 space-y-6 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
                <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black font-display uppercase tracking-wider">
                      24시간 스페셜 타임딜
                    </h3>
                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-mono font-extrabold uppercase rounded animate-pulse">
                      FLASH SALE
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                    정해진 수량과 시간 내에만 제공되는 초특가 한정 할인 혜택입니다.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time Deal Main Card */}
            <div className="bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 p-5 rounded-2xl border border-amber-500/20 space-y-4">
              {/* Product Info */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shrink-0 relative">
                  <img src={targetProduct.imageUrl} alt={targetProduct.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-rose-600 text-white text-[8px] font-mono font-black uppercase rounded shadow-xs">
                    TIME DEAL
                  </span>
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center justify-center sm:justify-start space-x-1">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>한정 수량 타임세일 중</span>
                  </span>
                  <h4 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white">
                    {targetProduct.name}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 font-mono">
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(targetProduct.price * 1.35, currency)}
                    </span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                      {formatPrice(targetProduct.price, currency)}
                    </span>
                    <span className="text-[10px] bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded">
                      25% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Countdown Clocks */}
              <div className="bg-neutral-950 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono border border-amber-500/30">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>타임딜 종료까지:</span>
                </div>
                <div className="flex items-center space-x-2 text-lg font-black tracking-widest text-amber-400">
                  <div className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </div>
                  <span>:</span>
                  <div className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </div>
                  <span>:</span>
                  <div className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 text-rose-400">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </div>

              {/* Stock Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>남은 재고: 단 {remainingStock}개!</span>
                  </span>
                  <span className="text-neutral-500">
                    총 {initialStock}개 중 {initialStock - remainingStock}개 판매됨
                  </span>
                </div>

                <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-500"
                    style={{ width: `${100 - stockPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleShare}
                className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-bold text-xs font-mono rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? '복사완료' : '공유하기'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={purchased}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {purchased ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>장바구니 담기 완료!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>타임딜 특가로 구매하기</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
