import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, X, Search, Moon, Heart, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onToggleTheme: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenAdmin: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onToggleTheme,
  onOpenWishlist,
  onOpenCompare,
  onOpenAdmin,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + ? for keyboard shortcuts modal
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-md w-full shadow-2xl rounded-2xl z-10 space-y-4 font-sans"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <Command className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  스마트 키보드 단축키 단축 매뉴얼
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  키보드 명령어로 스튜디오 숨숨의 주요 기능을 빠르게 컨트롤하세요.
                </p>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                {
                  keys: ['Cmd / Ctrl', 'K'],
                  label: '통합 오토컴플릿 검색',
                  icon: <Search className="w-4 h-4 text-amber-500" />,
                  action: () => {
                    onClose();
                    onOpenSearch();
                  },
                },
                {
                  keys: ['Shift', '?'],
                  label: '단축키 도움말 팝업',
                  icon: <Command className="w-4 h-4 text-blue-500" />,
                  action: onClose,
                },
                {
                  keys: ['Wishlist'],
                  label: '위시리스트 보관함 열기',
                  icon: <Heart className="w-4 h-4 text-rose-500" />,
                  action: () => {
                    onClose();
                    onOpenWishlist();
                  },
                },
                {
                  keys: ['Compare'],
                  label: '오브제 비교함 열기',
                  icon: <ArrowRightLeft className="w-4 h-4 text-emerald-500" />,
                  action: () => {
                    onClose();
                    onOpenCompare();
                  },
                },
                {
                  keys: ['Admin'],
                  label: '어드민 관리자 페이지',
                  icon: <ShieldCheck className="w-4 h-4 text-purple-500" />,
                  action: () => {
                    onClose();
                    onOpenAdmin();
                  },
                },
              ].map((sc, idx) => (
                <div
                  key={idx}
                  onClick={sc.action}
                  className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5">
                    {sc.icon}
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:underline">
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {sc.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-[10px] font-bold shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
