import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Table, X, Save, CheckCircle2, Copy } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';

interface BulkProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkProductEditorModal: React.FC<BulkProductEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, bulkUpdateProducts, duplicateProduct } = useCMS();
  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setEditedProducts(JSON.parse(JSON.stringify(products)));
    }
  }, [isOpen, products]);

  const handleChange = (id: string, field: keyof Product, value: any) => {
    setEditedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveAll = () => {
    bulkUpdateProducts(editedProducts);
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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-5xl w-full shadow-2xl rounded-2xl z-10 space-y-6 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
                <Table className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-base font-bold font-display uppercase tracking-wider">
                    상품 가격 & 재고 일괄 편집 테이블
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400">
                    등록된 모든 오브제의 가격, 품절 여부, 뱃지(NEW/BEST)를 한눈에 빠르게 수정합니다.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3">상품명</th>
                    <th className="p-3">카테고리</th>
                    <th className="p-3">가격 ($)</th>
                    <th className="p-3">상태</th>
                    <th className="p-3">뱃지 설정</th>
                    <th className="p-3 text-right">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-900 dark:text-white">
                  {editedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="p-3 font-bold">
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleChange(p.id, 'name', e.target.value)}
                          className="bg-transparent border-b border-dashed border-neutral-300 dark:border-neutral-700 outline-none w-full font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={p.category}
                          onChange={(e) => handleChange(p.id, 'category', e.target.value)}
                          className="bg-transparent border-b border-dashed border-neutral-300 dark:border-neutral-700 outline-none w-28 uppercase"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => handleChange(p.id, 'price', Number(e.target.value))}
                          className="bg-transparent border-b border-dashed border-neutral-300 dark:border-neutral-700 outline-none w-20 font-bold text-amber-600 dark:text-amber-400"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleChange(p.id, 'inStock', !p.inStock)}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            p.inStock !== false
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                          }`}
                        >
                          {p.inStock !== false ? '판매중' : '품절'}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleChange(p.id, 'isNewProduct', !p.isNewProduct)}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                              p.isNewProduct
                                ? 'bg-amber-400 text-black'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            NEW
                          </button>
                          <button
                            onClick={() => handleChange(p.id, 'isBestSeller', !p.isBestSeller)}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                              p.isBestSeller
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            BEST
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => duplicateProduct(p.id)}
                          className="p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                          title="복제"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-mono font-bold uppercase text-neutral-500 hover:underline cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSaveAll}
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
                    <span>일괄 반영 저장하기</span>
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
