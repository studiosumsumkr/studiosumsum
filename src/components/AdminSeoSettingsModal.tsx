import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, Save, CheckCircle2, Search, Share2 } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminSeoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSeoSettingsModal: React.FC<AdminSeoSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings } = useCMS();
  const [seoTitle, setSeoTitle] = useState(settings?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(settings?.seoDescription || '');
  const [ogImage, setOgImage] = useState(settings?.ogImage || '');
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setSeoTitle(settings.seoTitle || '');
      setSeoDesc(settings.seoDescription || '');
      setOgImage(settings.ogImage || '');
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      seoTitle,
      seoDescription: seoDesc,
      ogImage,
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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-xl w-full shadow-2xl rounded-2xl z-10 space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <Globe className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  SEO & 검색엔진 최적화 관리자
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  구글 검색결과 및 소셜 미디어(카카오톡/인스타그램) 공유 카드 메타데이터를 설정합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                  검색 타이틀 (SEO Title)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="예: STUDIO SUMSUM | Premium Home Objects"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                  메타 설명문 (SEO Description)
                </label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  rows={3}
                  placeholder="구글 검색 결과창에 노출되는 웹사이트 요약 설명문을 입력하세요."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">
                  공유 카카오/소셜 대표 이미지 URL (OG Image)
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            {/* Google Search Live Preview */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 font-sans">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Search className="w-3 h-3 text-blue-500" /> 구글 검색결과 미리보기
              </span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500 block truncate font-mono">
                  https://studiosumsum.kr
                </span>
                <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  {seoTitle || 'STUDIO SUMSUM'}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {seoDesc || '스튜디오 숨숨 브랜드 소개'}
                </p>
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
                    <span>SEO 메타설정 저장</span>
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
