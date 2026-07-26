import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight, Share2, Heart, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCMS } from '../cms';
import { ImageWithFallback } from './ImageWithFallback';


interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (id: string) => void;
}

const formatUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { settings, wishlist, toggleWishlist } = useCMS();
  const [selectedSize, setSelectedSize] = useState<string | null>('ONE SIZE');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const sizes = ['ONE SIZE', 'STANDARD', 'LARGE'];
  const buyLink = product?.buyUrl || product?.link;
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const isSoldOut = product?.inStock === false;

  const handleShare = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'STUDIO SUMSUM',
          text: product?.description,
          url: currentUrl
        });
        return;
      } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("링크 주소: " + currentUrl);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-md"
          />
          
          <AnimatePresence>
            {showSizeGuide && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-6"
              >
                <div onClick={() => setShowSizeGuide(false)} className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />
                <div className="relative bg-[#FFFFFF] border border-[#E5E5E5] p-12 max-w-lg w-full rounded-none shadow-none z-10">
                  <button onClick={() => setShowSizeGuide(false)} className="absolute top-6 right-6 text-[#222222] hover:rotate-90 transition-transform duration-300"><X className="w-5 h-5"/></button>
                  <h3 className="text-xl font-display font-extrabold uppercase tracking-[0.12em] mb-8 text-[#222222]">DIMENSION & SPEC GUIDE</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 text-[9px] font-bold uppercase text-[#777777] tracking-[0.12em] pb-3 border-b border-[#E5E5E5]">
                      <span>Option</span><span>Width (W)</span><span>Height (H)</span><span>Depth (D)</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs font-sans tracking-[-0.02em] py-3 border-b border-[#E5E5E5]/60 text-[#222222]">
                      <span className="font-bold">ONE SIZE</span><span>12 cm</span><span>15 cm</span><span>12 cm</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs font-sans tracking-[-0.02em] py-3 border-b border-[#E5E5E5]/60 text-[#222222]">
                      <span className="font-bold">STANDARD</span><span>14 cm</span><span>20 cm</span><span>14 cm</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs font-sans tracking-[-0.02em] py-3 border-b border-[#E5E5E5]/60 text-[#222222]">
                      <span className="font-bold">LARGE</span><span>18 cm</span><span>28 cm</span><span>18 cm</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="fixed inset-4 md:inset-16 lg:inset-24 bg-[#FFFFFF] z-[111] border border-[#E5E5E5] rounded-none shadow-none overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-3 bg-[#FFFFFF] border border-[#E5E5E5] text-[#222222] hover:bg-[#111111] hover:text-[#FFFFFF] transition-all hover:rotate-90 duration-300 rounded-none"
              id="close-product-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image */}
            <div className="w-full md:w-1/2 h-64 md:h-full bg-[#F9F9F9] border-b md:border-b-0 md:border-r border-[#E5E5E5] relative overflow-hidden group p-4 flex items-center justify-center">
              <ImageWithFallback 
                src={product.imageUrl} 
                imagePosition={product.imagePosition || 'center'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-none" 
                alt={product.name} 
              />
            </div>


            {/* Product Details */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col overflow-y-auto bg-[#FFFFFF]">
              <div className="flex-1">
                <div className="mb-10">
                  <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#777777] font-display mb-3">CATEGORY: {product.category}</p>
                  <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-[0.12em] uppercase leading-none mb-6 text-[#222222]">
                    {product.name}
                  </h2>
                  <p className="text-2xl font-serif italic text-[#1E291B]">${product.price.toLocaleString()}</p>
                </div>

                <div className="space-y-10 mb-12">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5]">
                      <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#222222] font-display">SELECT OPTION</label>
                      <button 
                        onClick={() => setShowSizeGuide(true)}
                        className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#777777] hover:text-[#222222] transition-colors underline font-display"
                      >
                        SPECS & DIMENSIONS
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                       {sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-5 h-12 min-w-20 flex items-center justify-center text-[10px] uppercase tracking-[0.12em] font-bold border transition-all rounded-none ${selectedSize === size ? 'bg-[#111111] text-[#FFFFFF] border-[#111111] scale-102' : 'bg-transparent border-[#E5E5E5] text-[#222222] hover:border-[#111111]'}`}
                          >
                            {size}
                          </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#222222] font-display">PRODUCT DESCRIPTION</label>
                    <p className="text-sm font-sans tracking-[-0.02em] leading-[1.65] text-[#777777] max-w-lg">
                      {product.description || "A masterfully crafted piece designed for the modern silhouette. Made with premium materials and attention to every detail."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-[#E5E5E5]">
                {/* Action Buttons: Wishlist & Share */}
                <div className="flex gap-3 mb-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex-1 py-3 px-4 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-300' : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'WISH LISTED' : 'ADD TO WISHLIST'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-3 px-4 bg-white text-neutral-700 border border-neutral-200 hover:border-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer relative"
                    title="상품 링크 복사 및 공유"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>공유하기</span>
                      </>
                    )}
                  </button>
                </div>

                {isSoldOut ? (
                  <button 
                    disabled
                    className="w-full py-5 text-[11px] font-bold uppercase tracking-[0.2em] font-display flex items-center justify-center space-x-3 bg-neutral-200 text-neutral-500 border border-neutral-300 cursor-not-allowed"
                  >
                    <span>SOLD OUT (품절된 상품입니다)</span>
                  </button>
                ) : buyLink ? (
                  <a 
                    href={formatUrl(buyLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 transition-all text-[11px] font-bold uppercase tracking-[0.2em] font-display flex items-center justify-center space-x-3 bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] border border-[#111111] cursor-pointer"
                  >
                    <span>BUY NOW (구매하기)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button 
                    onClick={() => {
                      alert("등록된 구매 링크가 없습니다. 어드민 관리자 페이지에서 상품 구매 링크(URL)를 설정하실 수 있습니다.");
                    }}
                    className="w-full py-5 transition-all text-[11px] font-bold uppercase tracking-[0.2em] font-display flex items-center justify-center space-x-3 bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] border border-[#111111] cursor-pointer"
                  >
                    <span>BUY NOW (구매하기)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
