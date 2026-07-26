import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, X, Save, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminTranslationEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTranslationEditor: React.FC<AdminTranslationEditorProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings } = useCMS();
  const [navHome, setNavHome] = useState(settings?.navHomeText || 'HOME');
  const [navShop, setNavShop] = useState(settings?.navShopText || 'COLLECTION');
  const [navEditorial, setNavEditorial] = useState(settings?.navEditorialText || 'EDITORIAL');
  const [navAbout, setNavAbout] = useState(settings?.navAboutText || 'ABOUT');
  const [shopBuyNow, setShopBuyNow] = useState(settings?.shopBuyNowText || 'BUY NOW (구매하기)');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      navHomeText: navHome,
      navShopText: navShop,
      navEditorialText: navEditorial,
      navAboutText: navAbout,
      shopBuyNowText: shopBuyNow,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-xl w-full shadow-2xl rounded-2xl z-10 space-y-4 font-sans"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <Languages className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  다국어 & 버튼 라벨 사전 관리자
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  사이트의 네비게이션 메뉴 및 주요 버튼 문구를 한글/영문 자유롭게 변경합니다.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">메뉴 1: 홈 (Home)</label>
                <input
                  type="text"
                  value={navHome}
                  onChange={(e) => setNavHome(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">메뉴 2: 숍 (Shop)</label>
                <input
                  type="text"
                  value={navShop}
                  onChange={(e) => setNavShop(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">메뉴 3: 에디토리얼</label>
                <input
                  type="text"
                  value={navEditorial}
                  onChange={(e) => setNavEditorial(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">구매하기 버튼 문구</label>
                <input
                  type="text"
                  value={shopBuyNow}
                  onChange={(e) => setShopBuyNow(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-mono font-bold uppercase text-neutral-500 hover:underline cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center space-x-2"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>저장 완료!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>문구 변경 저장</span>
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
