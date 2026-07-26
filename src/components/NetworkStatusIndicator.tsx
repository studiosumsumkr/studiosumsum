import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NetworkStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showRestored, setShowRestored] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 inset-x-0 z-[100] bg-rose-600 text-white py-2 px-4 text-center shadow-lg font-sans flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider"
        >
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>오프라인 상태입니다. 변경사항은 로컬 저장소에 안전하게 보관됩니다.</span>
        </motion.div>
      )}

      {isOnline && showRestored && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 inset-x-0 z-[100] bg-emerald-600 text-white py-2 px-4 text-center shadow-lg font-sans flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider"
        >
          <Wifi className="w-4 h-4" />
          <span>인터넷에 다시 연결되었습니다. 클라우드 DB 자동 동기화 완료!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
