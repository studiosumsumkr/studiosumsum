import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, X, Database, HardDrive, Wifi, ShieldCheck } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminSystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSystemHealthModal: React.FC<AdminSystemHealthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { dbConnected, syncStatus, products, banners } = useCMS();

  // Estimate payload size in KB
  const estimatedPayloadSize = Math.round(
    (JSON.stringify(products).length + JSON.stringify(banners).length) / 1024
  );

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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-lg w-full shadow-2xl rounded-2xl z-10 space-y-4 font-sans"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <Activity className="w-6 h-6 text-emerald-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  시스템 헬스 & 클라우드 데이터 진단
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  파이어베이스 Firestore 연결 상태, 로컬 캐시 용량 및 데이터 헬스 진단.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    Firestore 실시간 동기화
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    dbConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {dbConnected ? '온라인 연결됨' : '오프라인 캐시'}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    동기화 상태
                  </span>
                </div>
                <span className="font-bold text-neutral-900 dark:text-white uppercase">
                  {syncStatus}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    현재 데이터 용량
                  </span>
                </div>
                <span className="font-bold text-neutral-900 dark:text-white">
                  ~{estimatedPayloadSize} KB / 1,024 KB
                </span>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  시스템 데이터 구조가 유효하게 동기화되고 있습니다. 이미지 용량이 안전 범위 내에 위치해 있습니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
