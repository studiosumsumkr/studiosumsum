import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, X, Trash2, Search, Download, Copy, Check, Filter, Ticket, Tag } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminCouponLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCouponLeadsModal: React.FC<AdminCouponLeadsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { couponClaims, deleteCouponClaim, updateCouponClaimStatus } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'USED'>('ALL');
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredList = couponClaims.filter((item) => {
    const matchesSearch = item.phoneNumber.includes(searchTerm) || item.couponCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCopyAllPhoneNumbers = () => {
    if (couponClaims.length === 0) return;
    const phoneList = couponClaims.map((item) => item.phoneNumber).join('\n');
    navigator.clipboard.writeText(phoneList);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCsv = () => {
    if (couponClaims.length === 0) return;
    const header = '전화번호,발급쿠폰,신청일시,상태\n';
    const rows = couponClaims
      .map((item) => `"${item.phoneNumber}","${item.couponCode}","${item.claimedAt}","${item.status || 'NEW'}"`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupon_claims_phone_numbers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 font-sans">
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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-3xl w-full shadow-2xl rounded-2xl z-10 space-y-5 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
                <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wider flex items-center gap-2">
                    쿠폰 발급 고객 전화번호 목록
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono rounded-full">
                      총 {couponClaims.length}건
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                    고객이 쿠폰 발급 창에서 직접 등록한 휴대폰 번호 리스트입니다.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="전화번호 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono outline-none focus:border-amber-500 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg text-[10px] font-mono border border-neutral-200 dark:border-neutral-800">
                  {(['ALL', 'NEW', 'CONTACTED', 'USED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-2 py-1 rounded transition-colors font-bold ${
                        filterStatus === st
                          ? 'bg-amber-500 text-white'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? '전체' : st === 'NEW' ? '신규' : st === 'CONTACTED' ? '연락됨' : '사용완료'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyAllPhoneNumbers}
                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="전화번호 전체 복사"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? '복사됨' : '전체 복사'}</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-mono rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                  title="엑셀 CSV 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV 저장</span>
                </button>
              </div>
            </div>

            {/* List Table / Cards */}
            <div className="flex-1 overflow-y-auto space-y-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 min-h-[280px]">
              {filteredList.length === 0 ? (
                <div className="py-20 text-center text-neutral-400 font-mono text-xs italic flex flex-col items-center justify-center space-y-2">
                  <Phone className="w-8 h-8 opacity-30" />
                  <span>
                    {couponClaims.length === 0
                      ? '아직 등록된 전화번호 쿠폰 신청건이 없습니다.'
                      : '검색 조건과 일치하는 전화번호가 없습니다.'}
                  </span>
                </div>
              ) : (
                filteredList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg shrink-0">
                        <Phone className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">
                            {item.phoneNumber}
                          </span>
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] rounded font-mono">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{item.couponCode}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400">
                          신청 일시: {item.claimedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      {/* Status selector */}
                      <select
                        value={item.status || 'NEW'}
                        onChange={(e) => updateCouponClaimStatus(item.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border outline-none cursor-pointer ${
                          item.status === 'USED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : item.status === 'CONTACTED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        }`}
                      >
                        <option value="NEW">신규 (NEW)</option>
                        <option value="CONTACTED">연락완료</option>
                        <option value="USED">사용완료</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`${item.phoneNumber} 항목을 목록에서 삭제하시겠습니까?`)) {
                            deleteCouponClaim(item.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
