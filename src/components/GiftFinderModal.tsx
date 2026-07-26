import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Sparkles, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface GiftFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (p: Product) => void;
}

export const GiftFinderModal: React.FC<GiftFinderModalProps> = ({
  isOpen,
  onClose,
  onProductClick,
}) => {
  const { products, currency, addToCart } = useCMS();
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState<'myself' | 'housewarming' | 'birthday' | 'colleague'>('housewarming');
  const [budget, setBudget] = useState<'under50' | 'under100' | 'luxury'>('under100');
  const [vibe, setVibe] = useState<'minimal' | 'fragrance' | 'organic'>('minimal');

  const getRecommendations = () => {
    let filtered = [...products];

    if (budget === 'under50') {
      filtered = filtered.filter((p) => p.price <= 50);
    } else if (budget === 'under100') {
      filtered = filtered.filter((p) => p.price <= 100);
    }

    if (vibe === 'fragrance') {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes('fragrance') || p.category.toLowerCase().includes('인센스'));
    } else if (vibe === 'organic') {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes('ceramic') || p.category.toLowerCase().includes('세라믹'));
    }

    if (filtered.length === 0) return products.slice(0, 3);
    return filtered.slice(0, 3);
  };

  const handleReset = () => {
    setStep(1);
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-xl w-full shadow-2xl rounded-2xl z-10 space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-amber-500">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 block">
                  AI OBJECT MATCHER
                </span>
                <h3 className="text-base md:text-lg font-bold font-display uppercase tracking-wider text-neutral-900 dark:text-white">
                  맞춤 선물 & 공간 오브제 추천
                </h3>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                  STEP 1. 누구를 위한 선물인가요?
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'housewarming', label: '🏡 집들이 / 신혼부부' },
                    { key: 'birthday', label: '🎂 생일 / 기념일 선물' },
                    { key: 'colleague', label: '💼 감사 선물 / 동료' },
                    { key: 'myself', label: '✨ 나만의 공간 테라피' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setRecipient(item.key as any)}
                      className={`p-4 border text-xs font-bold text-left rounded-xl transition-all cursor-pointer ${
                        recipient === item.key
                          ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>다음 단계로</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                  STEP 2. 예산대와 분위기를 선택하세요.
                </h4>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 block">예산 범위</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'under50', label: '$50 이하' },
                      { key: 'under100', label: '$50 ~ $100' },
                      { key: 'luxury', label: '$100 이상 럭셔리' },
                    ].map((b) => (
                      <button
                        key={b.key}
                        onClick={() => setBudget(b.key as any)}
                        className={`p-2.5 border text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                          budget === b.key
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 block">취향 무드</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'minimal', label: '미니멀 오브제' },
                      { key: 'fragrance', label: '향기 & 인센스' },
                      { key: 'organic', label: '핸드메이드 세라믹' },
                    ].map((v) => (
                      <button
                        key={v.key}
                        onClick={() => setVibe(v.key as any)}
                        className={`p-2.5 border text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                          vibe === v.key
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 border border-neutral-300 dark:border-neutral-700 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                  >
                    이전
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>추천 오브제 확인하기</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI 맞춤 매칭 오브제
                  </h4>
                  <button
                    onClick={handleReset}
                    className="text-[10px] font-mono text-neutral-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> 다시 선택
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {getRecommendations().map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-28 object-cover rounded-lg bg-neutral-100"
                        />
                        <span className="text-[9px] font-mono uppercase text-neutral-400 block">
                          {p.category}
                        </span>
                        <h5 className="text-xs font-bold font-display uppercase tracking-wider line-clamp-1 text-neutral-900 dark:text-white">
                          {p.name}
                        </h5>
                        <p className="text-xs font-mono font-extrabold text-neutral-900 dark:text-white">
                          {formatPrice(p.price, currency)}
                        </p>
                      </div>

                      <div className="space-y-1 pt-2">
                        <button
                          onClick={() => {
                            addToCart(p.id);
                            alert(`${p.name}을(를) 장바구니에 담았습니다!`);
                          }}
                          className="w-full py-1.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold uppercase rounded flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>카트 담기</span>
                        </button>
                        <button
                          onClick={() => {
                            onProductClick(p);
                            onClose();
                          }}
                          className="w-full py-1 text-[9px] font-mono text-neutral-500 hover:underline text-center cursor-pointer block"
                        >
                          상세보기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
