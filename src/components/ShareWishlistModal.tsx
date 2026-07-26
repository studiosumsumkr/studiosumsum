import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, X, Copy, CheckCircle2, Heart } from 'lucide-react';
import { useCMS } from '../cms';

interface ShareWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWishlistModal: React.FC<ShareWishlistModalProps> = ({ isOpen, onClose }) => {
  const { wishlist, products } = useCMS();
  const [copied, setCopied] = useState(false);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const shareText = `STUDIO SUMSUM - 위시리스트 공유\n\n${wishlistedProducts
    .map((p) => `- ${p.name} ($${p.price})`)
    .join('\n')}\n\n스튜디오 숨숨에서 함께 확인해보세요!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
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

            <div className="flex items-center space-x-3 text-rose-500">
              <div className="p-3 bg-rose-500/10 rounded-full">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  위시리스트 공유하기
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  담아둔 오브제 ({wishlistedProducts.length}개)
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              선택한 위시리스트 목록을 지인이나 친구에게 텍스트 메시지나 링크 형태로 공유해 보세요.
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-700 dark:text-neutral-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {shareText}
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>위시리스트 클립보드 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>위시리스트 텍스트 복사</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
