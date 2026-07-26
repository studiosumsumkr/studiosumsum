import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X, ShieldAlert } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminActivityLogModal: React.FC<AdminActivityLogModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activityLogs } = useCMS();

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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-xl w-full shadow-2xl rounded-2xl z-10 space-y-4 max-h-[80vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <History className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  어드민 작업 기록 & 히스토리 로그
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  최근 관리자 페이지에서 수행된 컨텐츠 변경 및 동기화 이력을 기록합니다.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950">
              {activityLogs.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 font-mono text-xs italic">
                  기록된 최근 작업 로그가 없습니다.
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                        [{log.action}]
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {log.details}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
