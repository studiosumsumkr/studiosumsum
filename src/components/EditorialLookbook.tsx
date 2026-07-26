import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { useCMS } from '../cms';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface EditorialLookbookProps {
  onProductClick: (product: Product) => void;
}

export const EditorialLookbook: React.FC<EditorialLookbookProps> = ({ onProductClick }) => {
  const { products, currency, settings } = useCMS();
  const [activeHotspot, setActiveHotspot] = useState<Product | null>(null);

  // Pick up to 3 products for hotspots
  const hotspotProducts = products.slice(0, 3);

  // Hotspot coordinates (percentage position on editorial image)
  const positions = [
    { top: '35%', left: '28%' },
    { top: '55%', left: '68%' },
    { top: '75%', left: '42%' },
  ];

  return (
    <section className="py-20 bg-[#F7F6F2] text-[#222222] overflow-hidden relative font-sans border-t border-b border-[#E3E0D6]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E3E0D6] pb-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#1E291B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> LOOKBOOK & INTERACTIVE SCENE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase text-[#111111]">
              STUDIO SCENOGRAPHY
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-600 max-w-md leading-relaxed">
            이미지 위 핫스팟 포인트(+)를 클릭하여 조형적인 공간에 오롯이 녹아든 스튜디오 숨숨의 대표 홈 오브제를 바로 탐색해 보세요.
          </p>
        </div>

        {/* Hotspot Canvas */}
        <div className="relative w-full h-[500px] md:h-[650px] rounded-2xl overflow-hidden border border-[#D5D2C7] group shadow-xl">
          <img
            src={
              settings?.editorialImageUrl ||
              'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=2070'
            }
            alt="Editorial Scene"
            className="w-full h-full object-cover filter brightness-90 group-hover:scale-102 transition-transform duration-1000"
          />

          {/* Hotspot Markers */}
          {hotspotProducts.map((product, idx) => {
            const pos = positions[idx] || { top: '50%', left: '50%' };
            const isSelected = activeHotspot?.id === product.id;

            return (
              <div
                key={product.id}
                style={{ top: pos.top, left: pos.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => setActiveHotspot(isSelected ? null : product)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs transition-all cursor-pointer shadow-xl relative ${
                    isSelected
                      ? 'bg-amber-400 border-white text-black scale-125'
                      : 'bg-black/80 border-amber-400 text-amber-400 hover:scale-110'
                  }`}
                >
                  <span className="animate-ping absolute inset-0 rounded-full bg-amber-400 opacity-40" />
                  +
                </button>

                {/* Popover Card */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-10 left-1/2 -translate-x-1/2 w-56 p-3 bg-white text-neutral-900 border border-neutral-200 shadow-2xl rounded-xl z-30 space-y-2 text-left"
                    >
                      <div className="flex gap-2.5 items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded bg-neutral-100"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">
                            {product.category}
                          </span>
                          <h4 className="text-xs font-bold font-display uppercase tracking-wider truncate">
                            {product.name}
                          </h4>
                          <span className="text-xs font-mono font-extrabold text-black block">
                            {formatPrice(product.price, currency)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onProductClick(product)}
                        className="w-full py-1.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded hover:bg-neutral-800 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>상세보기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
