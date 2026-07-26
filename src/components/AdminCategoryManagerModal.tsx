import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderTree, X, Edit3, Trash2, Plus, Save } from 'lucide-react';
import { useCMS } from '../cms';

interface AdminCategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCategoryManagerModal: React.FC<AdminCategoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, updateProduct } = useCMS();
  const [newCatName, setNewCatName] = useState('');
  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
  const [renamedValue, setRenamedValue] = useState('');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleRename = (oldCat: string) => {
    if (!renamedValue.trim()) return;
    const targetProducts = products.filter((p) => p.category === oldCat);
    targetProducts.forEach((p) => {
      updateProduct(p.id, { category: renamedValue.trim().toUpperCase() });
    });
    setRenamingCategory(null);
    setRenamedValue('');
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
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-xl w-full shadow-2xl rounded-2xl z-10 space-y-4 font-sans"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <FolderTree className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  카테고리 일괄 관리 매니저
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  스토어 내 등록된 카테고리를 명칭 변경하거나 재분류합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const isEditing = renamingCategory === cat;

                return (
                  <div
                    key={cat}
                    className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between text-xs font-mono"
                  >
                    {isEditing ? (
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={renamedValue}
                          onChange={(e) => setRenamedValue(e.target.value)}
                          className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded border outline-none font-bold text-xs uppercase"
                        />
                        <button
                          onClick={() => handleRename(String(cat))}
                          className="p-1 bg-black text-white dark:bg-white dark:text-black rounded"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider block">
                          {cat}
                        </span>
                        <span className="text-[10px] text-neutral-400">등록된 오브제 {count}개</span>
                      </div>
                    )}

                    {!isEditing && (
                      <button
                        onClick={() => {
                          setRenamingCategory(cat);
                          setRenamedValue(cat);
                        }}
                        className="p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
