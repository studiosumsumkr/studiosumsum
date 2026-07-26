import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2, Send } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({ isOpen, onClose, product }) => {
  const { addStockAlert } = useCMS();
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    addStockAlert(product.id, contact.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContact('');
      onClose();
    }, 1800);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-md w-full shadow-2xl rounded-2xl z-10 space-y-4"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  재입고 알림 신청
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  {product.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              현재 해당 오브제는 품절되었습니다. 재입고 시 가장 빠르게 안내받으실 이메일 주소나 휴대폰 번호를 남겨주세요.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  알림 신청이 완료되었습니다!
                </h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  재입고 즉시 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="이메일 주소 또는 전화번호 (예: 010-0000-0000)"
                  required
                  className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-900 dark:text-white"
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>재입고 알림받기</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
