import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Upload, Database, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCMS } from '../../cms';

interface DataBackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupRestoreModal: React.FC<DataBackupRestoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { exportJsonBackup, importJsonBackup, forcePublishToCloud, resetToDefaultData } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        if (confirm("경고: 백업 파일을 복원하면 현재 등록된 모든 상품 및 배너 데이터가 해당 파일 내용으로 대체됩니다. 진행하시겠습니까?")) {
          await importJsonBackup(content);
          onClose();
        }
      }
    };
    reader.readAsText(file);
  };

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
            className="relative bg-neutral-900 border border-neutral-800 text-white p-6 md:p-8 max-w-md w-full shadow-2xl z-10 space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-display font-black uppercase tracking-[0.2em] text-white">
                DATA BACKUP & RESTORE MASTER
              </h3>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              사이트의 상품, 배너, 문구, 레이아웃 설정을 1초 만에 파일로 보관하거나, 이전 백업 파일을 업로드하여 데이터를 안전하게 원복할 수 있습니다.
            </p>

            <div className="space-y-3">
              {/* Export Button */}
              <button
                onClick={exportJsonBackup}
                className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>JSON 데이터 내보내기 (Export Backup)</span>
              </button>

              {/* Import Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>JSON 백업 파일 복원 (Import Backup)</span>
              </button>

              <hr className="border-neutral-800 my-2" />

              {/* Force Cloud Sync */}
              <button
                onClick={async () => {
                  await forcePublishToCloud();
                  onClose();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>클라우드 DB 즉시 강제 퍼블리시</span>
              </button>

              {/* Reset to Default */}
              <button
                onClick={async () => {
                  if (confirm("정말로 초기 기본 데이터로 리셋하시겠습니까? 현재 모든 설정이 기본 샘플 데이터로 복구됩니다.")) {
                    await resetToDefaultData();
                    onClose();
                  }
                }}
                className="w-full py-2.5 bg-neutral-950 text-neutral-400 hover:text-rose-400 border border-neutral-800 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>초기 샘플 데이터로 리셋</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
