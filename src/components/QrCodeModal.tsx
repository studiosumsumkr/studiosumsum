import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Smartphone, Copy, CheckCircle2 } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title = 'STUDIO SUMSUM',
  url = window.location.href,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`링크 주소: ${url}`);
    }
  };

  // Quick Google QR Code API renderer for high fidelity
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    url
  )}&color=000000&bgcolor=ffffff&margin=1`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-sm w-full shadow-2xl z-10 space-y-5 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-black dark:text-white">
              <QrCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-display font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                MOBILE SCAN QR CODE
              </h3>
              <p className="text-[11px] text-neutral-500 line-clamp-1">{title}</p>
            </div>

            {/* QR Image Container */}
            <div className="p-4 bg-white border border-neutral-200 rounded-lg inline-block shadow-inner mx-auto">
              <img
                src={qrApiUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-[10px] text-neutral-400 leading-relaxed">
              스마트폰 카메라로 위 QR코드를 스캔하시면 모바일 화면에서 바로 해당 상품 및 페이지를 확인하실 수 있습니다.
            </p>

            <button
              onClick={handleCopy}
              className="w-full py-3 bg-neutral-900 text-white dark:bg-white dark:text-black text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer hover:opacity-90"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>주소 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>URL 주소 복사하기</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
