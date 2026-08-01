import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight, Share2, Heart, CheckCircle2, QrCode, ArrowRightLeft, Bell, Users, Zap } from 'lucide-react';
import { Product } from '../types';
import { useCMS } from '../cms';
import { ImageWithFallback } from './ImageWithFallback';
import { ImageMagnifier } from './ImageMagnifier';
import { QrCodeModal } from './QrCodeModal';
import { ProductBadges } from './ProductBadges';
import { ProductReviews } from './ProductReviews';
import { ProductFAQ } from './ProductFAQ';
import { StockAlertModal } from './StockAlertModal';
import { formatPrice } from '../utils/currency';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (id: string) => void;
  onOpenTimeDeal?: () => void;
}

const formatUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onOpenTimeDeal }) => {
  const { settings, wishlist, toggleWishlist, compareList, toggleCompare, currency } = useCMS();
  const [selectedSize, setSelectedSize] = useState<string | null>('ONE SIZE');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showStockAlertModal, setShowStockAlertModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const sizes = ['ONE SIZE', 'STANDARD', 'LARGE'];
  const buyLink = product?.buyUrl || product?.link;
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const isCompared = product ? compareList.includes(product.id) : false;
  const isSoldOut = product?.inStock === false || (product?.stockCount !== undefined && product.stockCount <= 0);

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

            {/* Product Image with Zoom Lens */}
            <div className="w-full md:w-1/2 h-64 md:h-full bg-[#F9F9F9] dark:bg-neutral-950 border-b md:border-b-0 md:border-r border-[#E5E5E5] dark:border-neutral-800 relative overflow-hidden group flex items-center justify-center">
              <ProductBadges product={product} />

              <ImageMagnifier 
                src={product.imageUrl}
                alt={product.name}
                imagePosition={product.imagePosition || 'center'}
                className="w-full h-full"
              />

              <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[9px] font-mono px-2 py-0.5 rounded pointer-events-none opacity-70">
                🔍 마우스 확대 렌즈
              </span>
            </div>

            {/* Product Details */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col overflow-y-auto bg-[#FFFFFF] dark:bg-neutral-900 text-neutral-900 dark:text-white">
              <div className="flex-1">
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#777777] font-display">CATEGORY: {product.category}</p>
                    {product.isPreorder && (
                      <span className="bg-amber-600 text-white text-[9px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                        PRE-ORDER ({product.preorderDeliveryDate || '순차발송'})
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-[0.12em] uppercase leading-none mb-4 text-[#222222] dark:text-white">
                    {product.name}
                  </h2>
                  <p className="text-2xl font-mono font-extrabold text-[#111111] dark:text-white">
                    {formatPrice(product.price, currency)}
                  </p>
                  {product.isPreorder && (
                    <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-800 dark:text-amber-300 font-sans">
                      ⚡ <strong>프리오더 안내:</strong> 본 상품은 사전 예약 제작 상품입니다. 예상 발송 예정일은 <strong>{product.preorderDeliveryDate || '상세안내 참조'}</strong> 입니다.
                    </div>
                  )}

                  {onOpenTimeDeal && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs font-sans">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 font-extrabold text-amber-700 dark:text-amber-400">
                          <Zap className="w-3.5 h-3.5 fill-amber-500" />
                          <span>⚡ 24H 한정 타임딜 특가 진행 중!</span>
                        </div>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                          한정 수량 초특가 25% 할인가로 즉시 구매 가능
                        </p>
                      </div>
                      <button
                        onClick={onOpenTimeDeal}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg shrink-0 cursor-pointer shadow-xs transition-all"
                      >
                        타임딜 특가
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-8 mb-8">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5] dark:border-neutral-800">
                      <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#222222] dark:text-white font-display">SELECT OPTION</label>
                      <button 
                        onClick={() => setShowSizeGuide(true)}
                        className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#777777] hover:text-[#222222] dark:hover:text-white transition-colors underline font-display cursor-pointer"
                      >
                        SPECS & DIMENSIONS
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                       {sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-5 h-11 flex items-center justify-center text-[10px] uppercase tracking-[0.12em] font-bold border transition-all cursor-pointer ${selectedSize === size ? 'bg-[#111111] text-[#FFFFFF] dark:bg-white dark:text-black border-[#111111]' : 'bg-transparent border-[#E5E5E5] dark:border-neutral-800 text-[#222222] dark:text-neutral-300'}`}
                          >
                            {size}
                          </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#222222] dark:text-white font-display">PRODUCT DESCRIPTION</label>
                    <p className="text-xs md:text-sm font-sans tracking-tight leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-lg">
                      {product.description || "A masterfully crafted piece designed for the modern silhouette. Made with premium materials and attention to every detail."}
                    </p>
                  </div>

                  <ProductFAQ />

                  <ProductReviews productId={product.id} />
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#E5E5E5] dark:border-neutral-800">
                {/* Action Buttons: Wishlist & Compare & QR */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`py-2.5 px-2 border text-[9px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                      isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-300' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'SAVED' : 'WISHLIST'}</span>
                  </button>

                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`py-2.5 px-2 border text-[9px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                      isCompared ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'COMPARING' : 'COMPARE'}</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="py-2.5 px-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>MOBILE QR</span>
                  </button>
                </div>

                {isSoldOut ? (
                  <button 
                    onClick={() => setShowStockAlertModal(true)}
                    className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] font-display flex items-center justify-center space-x-2 bg-amber-500 text-black border border-amber-500 cursor-pointer hover:bg-amber-400 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    <span>SOLD OUT — 재입고 알림 신청하기</span>
                  </button>
                ) : buyLink ? (
                  <a 
                    href={formatUrl(buyLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 transition-all text-[11px] font-bold uppercase tracking-[0.2em] font-display flex items-center justify-center space-x-3 cursor-pointer ${
                      product.isPreorder
                        ? 'bg-amber-500 text-black border border-amber-500 hover:bg-amber-400 font-extrabold'
                        : 'bg-[#111111] text-[#FFFFFF] dark:bg-white dark:text-black border border-[#111111]'
                    }`}
                  >
                    <span>{product.isPreorder ? 'PRE-ORDER NOW (프리오더 예약 구매)' : 'BUY NOW (구매하기)'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button 
                    onClick={() => {
                      alert("등록된 구매 링크가 없습니다. 어드민 관리자 페이지에서 상품 구매 링크(URL)를 설정하실 수 있습니다.");
                    }}
                    className={`w-full py-4 transition-all text-[11px] font-bold uppercase tracking-[0.2em] font-display flex items-center justify-center space-x-3 cursor-pointer ${
                      product.isPreorder
                        ? 'bg-amber-500 text-black border border-amber-500 hover:bg-amber-400 font-extrabold'
                        : 'bg-[#111111] text-[#FFFFFF] dark:bg-white dark:text-black border border-[#111111]'
                    }`}
                  >
                    <span>{product.isPreorder ? 'PRE-ORDER NOW (프리오더 예약 구매)' : 'BUY NOW (구매하기)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <QrCodeModal
              isOpen={showQrModal}
              onClose={() => setShowQrModal(false)}
              title={product.name}
            />

            <StockAlertModal
              isOpen={showStockAlertModal}
              onClose={() => setShowStockAlertModal(false)}
              product={product}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
