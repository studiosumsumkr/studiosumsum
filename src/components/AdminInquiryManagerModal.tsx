import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Mail, Check } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminInquiryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminInquiryManagerModal: React.FC<AdminInquiryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { stockAlerts, products } = useCMS();

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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-2xl w-full shadow-2xl rounded-2xl z-10 space-y-4 max-h-[80vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <Bell className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  고객 재입고 알림 신청 리스트
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  고객들이 품절 상품에 대해 등록한 이메일/연락처 신청 현황입니다.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950">
              {stockAlerts.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 font-mono text-xs italic">
                  아직 접수된 재입고 알림 신청건이 없습니다.
                </div>
              ) : (
                stockAlerts.map((alertItem) => {
                  const targetProd = products.find((p) => p.id === alertItem.productId);
                  return (
                    <div
                      key={alertItem.id}
                      className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-white block">
                            {alertItem.contact}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            신청 상품: {targetProd?.name || alertItem.productId} • {alertItem.createdAt}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[9px] rounded">
                        접수됨
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
