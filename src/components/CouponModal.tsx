import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ticket, Check, Copy, Phone, Sparkles, Tag, Gift } from 'lucide-react';
import { useCMS } from '../cms';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose }) => {
  const { settings, addCouponClaim } = useCMS();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const couponCode = settings?.promoDiscountCode || 'SUMSUM15';
  const discountPercent = settings?.promoDiscountPercent || 15;
  const couponTitle = settings?.couponTitle || 'WELCOME GIFT COUPON';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 7) {
      val = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
    } else if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }

    setPhoneNumber(val);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (rawNumber.length < 9) {
      setError('올바른 휴대폰 번호를 입력해 주세요.');
      return;
    }

    addCouponClaim(phoneNumber, couponCode);
    setIsSubmitted(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setPhoneNumber('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white text-neutral-900 border border-neutral-200 p-6 sm:p-8 max-w-md w-full shadow-2xl rounded-2xl z-10 overflow-hidden"
          >
            {/* Header Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-[#F2F0E8] border border-[#DCD9CE] text-[#1E291B] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                    <Gift className="w-6 h-6" />
                  </div>
                  <span className="inline-block text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#1E291B] bg-[#EFECE6] px-2.5 py-1 rounded">
                    {couponTitle}
                  </span>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#111111]">
                    {discountPercent}% 특별 할인 쿠폰 신청
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                    전화번호를 입력하시면 결제 시 즉시 사용 가능한 시크릿 쿠폰 코드를 발급해 드립니다.
                  </p>
                </div>

                {/* Coupon Ticket Visual */}
                <div className="bg-[#111111] text-white p-4 rounded-xl border border-neutral-800 relative overflow-hidden flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
                      STUDIO SUMSUM SPECIAL
                    </p>
                    <p className="text-2xl font-black font-display text-amber-300">
                      {discountPercent}% OFF
                    </p>
                    <p className="text-[10px] text-neutral-300 font-mono">
                      전 품목 즉시 할인 적용
                    </p>
                  </div>
                  <Ticket className="w-10 h-10 text-neutral-700 opacity-60" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                      휴대폰 번호 입력
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono font-bold text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder:text-neutral-400"
                        autoFocus
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-[11px] font-semibold mt-1">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#222222] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>쿠폰 코드 즉시 받기</span>
                  </button>

                  <p className="text-[10px] text-neutral-400 text-center font-mono">
                    ※ 입력하신 번호는 신제품 드롭 및 쿠폰 관리에만 사용됩니다.
                  </p>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-2"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-display uppercase text-[#111111]">
                    신청이 완료되었습니다!
                  </h3>
                  <p className="text-xs text-neutral-800 font-bold font-mono">
                    [{phoneNumber}] 님, 확인 후 곧 연락드리겠습니다.
                  </p>
                </div>

                {/* Issued Coupon Box */}
                <div className="bg-[#111111] text-white p-5 rounded-2xl border border-neutral-800 space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    YOUR EXCLUSIVE COUPON CODE
                  </p>
                  <div className="flex items-center justify-center space-x-2 bg-neutral-900 py-3 px-4 rounded-xl border border-neutral-800">
                    <Tag className="w-5 h-5 text-amber-300" />
                    <span className="text-2xl font-mono font-black text-amber-300 tracking-widest">
                      {couponCode}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    결제 페이지 쿠폰란에 위 코드를 입력하시면 {discountPercent}% 할인이 적용됩니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCopyCode}
                    className="w-full py-3.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>복사되었습니다!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>쿠폰 코드 복사하기</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 text-neutral-500 hover:text-neutral-900 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
