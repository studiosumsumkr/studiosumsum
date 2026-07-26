import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Percent, X, Save, CheckCircle2, Tag } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDiscountModal: React.FC<AdminDiscountModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useCMS();
  const [couponTitle, setCouponTitle] = useState(settings?.couponTitle || 'WELCOME GIFT COUPON');
  const [promoCode, setPromoCode] = useState(settings?.promoDiscountCode || 'SUMSUM15');
  const [discountPercent, setDiscountPercent] = useState(settings?.promoDiscountPercent || 15);
  const [showAnnouncement, setShowAnnouncement] = useState(settings?.showAnnouncement ?? true);
  const [announcementText, setAnnouncementText] = useState(
    settings?.announcementText || '전 상품 15% 특별 할인 혜택 프로모션'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      couponTitle,
      promoDiscountCode: promoCode,
      promoDiscountPercent: Number(discountPercent),
      showAnnouncement,
      announcementText,
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
              <Percent className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  프로모션 할인 쿠폰 & 상단 띠배너 관리자
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  전 상품 할인율, 쿠폰 코드, 상단 공지 띠배너 텍스트를 제어합니다.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">쿠폰 이름 / 명칭</label>
                <input
                  type="text"
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  placeholder="예: WELCOME GIFT COUPON"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">프로모션 쿠폰 코드</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="예: SUMSUM15"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold uppercase text-amber-600 dark:text-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">할인율 (%)</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">상단 공지 띠배너 문구</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="showAnn"
                  checked={showAnnouncement}
                  onChange={(e) => setShowAnnouncement(e.target.checked)}
                  className="w-4 h-4 accent-black dark:accent-white"
                />
                <label htmlFor="showAnn" className="text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  상단 공지 띠배너 활성화
                </label>
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
                    <span>할인 프로모션 적용</span>
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
