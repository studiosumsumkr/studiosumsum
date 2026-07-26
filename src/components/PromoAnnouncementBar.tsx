import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, X, Clock, Gift } from 'lucide-react';
import { useCMS } from '../cms';

interface PromoAnnouncementBarProps {
  onOpenCouponModal?: () => void;
}

export const PromoAnnouncementBar: React.FC<PromoAnnouncementBarProps> = ({ onOpenCouponModal }) => {
  const { settings } = useCMS();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed || !settings?.showAnnouncement) return null;

  const promoCode = settings?.promoDiscountCode || 'SUMSUM15';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#EFECE6] text-[#222222] text-[11px] font-mono py-2 px-4 border-b border-[#E2DFD7] flex items-center justify-between font-sans transition-all">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
        <div className="flex items-center space-x-2">
          <span className="bg-[#1E291B] text-white px-1.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">
            SEASONAL PROMO
          </span>
          <span className="font-semibold tracking-tight text-[#222222]">
            {settings?.announcementText || '전 상품 15% 특별 할인 혜택 프로모션'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Coupon Trigger Button */}
          {onOpenCouponModal && (
            <button
              onClick={onOpenCouponModal}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#1E291B] hover:bg-black text-amber-300 font-extrabold text-[11px] tracking-tight rounded-md cursor-pointer transition-all shadow-sm ring-1 ring-amber-400/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>🎁 전화번호 입력하고 {settings?.promoDiscountPercent || 15}% 쿠폰 받기</span>
            </button>
          )}

          {/* Promo Code Box */}
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-white hover:bg-neutral-50 border border-[#D5D2C8] rounded text-[#1E291B] font-bold tracking-widest cursor-pointer transition-all shadow-xs"
            title="프로모션 코드 복사"
          >
            <Tag className="w-3 h-3 text-[#1E291B]" />
            <span>코드: {promoCode}</span>
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-neutral-400" />}
          </button>

          {/* Countdown Clock */}
          <div className="flex items-center space-x-1 text-neutral-600 text-[10px] hidden md:flex">
            <Clock className="w-3 h-3 text-[#1E291B]" />
            <span className="font-bold">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-neutral-500 hover:text-black cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
