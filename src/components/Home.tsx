import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useCMS } from '../cms';
import { HeroSlider } from './HeroSlider';
import { 
  ArrowRight, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Eye, 
  Filter,
  Package,
  Layers,
  Compass,
  Search,
  ArrowUpDown,
  History,
  X,
  Clock
} from 'lucide-react';
import { getTypographyStyle, getLayoutSpacing } from '../utils';
import { formatPrice } from '../utils/currency';
import { Product } from '../types';

export const Home = ({ onProductClick }: { onProductClick?: (p: Product) => void }) => {
  const { settings, banners, products, currency } = useCMS();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'newest'>('recommended');
  
  // Recently viewed products history
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sumsum_recently_viewed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isRecentOpen, setIsRecentOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    // Add to recently viewed history
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== product.id);
      const updated = [product.id, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('sumsum_recently_viewed', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    onProductClick?.(product);
  };

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [recentlyViewedIds, products]);

  const editorialRef = useRef(null);
  const { scrollYProgress: editorialProgress } = useScroll({
    target: editorialRef,
    offset: ["start end", "end start"]
  });

  const editorialY = useTransform(editorialProgress, [0, 1], [0, -30]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category.toUpperCase());
    });
    return ['ALL', 'BEST', 'NEW', 'PRE-ORDER', ...Array.from(cats)];
  }, [products]);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory === 'BEST') {
      result = result.filter(p => p.isBestSeller);
    } else if (activeCategory === 'NEW') {
      result = result.filter(p => p.isNewProduct);
    } else if (activeCategory === 'PRE-ORDER') {
      result = result.filter(p => p.isPreorder);
    } else if (activeCategory !== 'ALL') {
      result = result.filter(p => p.category?.toUpperCase() === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sorted = [...result];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => (b.isNewProduct ? 1 : 0) - (a.isNewProduct ? 1 : 0));
    }

    return sorted;
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    handleProductSelect(product);
    const url = product.buyUrl || product.link;
    if (url) {
      const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      window.open(formatted, '_blank');
    } else {
      onProductClick?.(product);
    }
  };

  if (!settings) return null;

  return (
    <main className="relative overflow-x-hidden bg-[#F9F9F9] text-[#111111]">
      {/* Hero Banner Section */}
      <HeroSlider banners={banners} />

      {/* Brand Benefit Highlights */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E5E5] py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-[#E5E5E5]">
          <div className="flex items-center justify-center space-x-3 px-2">
            <Package className="w-4 h-4 text-neutral-600 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#111111]">HANDCRAFTED OBJECTS</p>
              <p className="text-[10px] text-[#777777] font-sans">100% 수작업 독창적 소품</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 px-2">
            <Truck className="w-4 h-4 text-neutral-600 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#111111]">SAFE PACKAGING</p>
              <p className="text-[10px] text-[#777777] font-sans">친환경 완충 완벽 배송</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 px-2">
            <ShieldCheck className="w-4 h-4 text-neutral-600 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#111111]">QUALITY GUARANTEE</p>
              <p className="text-[10px] text-[#777777] font-sans">오리지널 라벨 품질 보증</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 px-2">
            <RotateCcw className="w-4 h-4 text-neutral-600 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#111111]">EASY CARE SUPPORT</p>
              <p className="text-[10px] text-[#777777] font-sans">관리 및 케어 가이드 제공</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Curated Shop Collection Section */}
      <section id="featured" className="scroll-mt-32 py-20 lg:py-32 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pb-6 border-b border-[#E5E5E5]">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#777777] font-display">
                {settings.curatedBadgeText || 'CURATED STORE'}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold uppercase tracking-[0.08em] text-[#111111]">
              {settings.curatedTitle || 'NEW & FEATURED OBJECTS'}
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all border cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]' 
                    : 'bg-[#FFFFFF] text-[#666666] border-[#E5E5E5] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Tool Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 border border-neutral-200">
          {/* Search Input */}
          <div className="relative w-full sm:w-72 flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="상품 검색 (Search object)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-sans pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 text-neutral-400 hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Result Count & Sorting */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
            <span className="text-[11px] font-mono font-bold text-neutral-500">
              전체 <strong className="text-black">{filteredProducts.length}</strong>개 상품
            </span>

            <div className="flex items-center space-x-2 border-l border-neutral-200 pl-4">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-bold font-sans bg-transparent py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="recommended">추천순 (Default)</option>
                <option value="newest">신상품순 (Newest)</option>
                <option value="price-asc">가격 낮은순 (Price: Low to High)</option>
                <option value="price-desc">가격 높은순 (Price: High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => {
            const isSoldOut = product.inStock === false;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="group relative bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div 
                  onClick={() => handleProductSelect(product)}
                  className="relative aspect-square bg-[#F5F5F5] overflow-hidden cursor-pointer p-4 flex items-center justify-center"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ objectPosition: product.imagePosition || 'center' }}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-75' : ''}`}
                  />
                  
                  {/* Category & Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                    {product.category && (
                      <span className="bg-[#111111] text-[#FFFFFF] text-[8px] font-mono uppercase tracking-[0.2em] px-2.5 py-1">
                        {product.category}
                      </span>
                    )}
                    {product.isPreorder && (
                      <span className="bg-amber-500 text-black text-[8px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 flex items-center space-x-1 shadow-md">
                        <Clock className="w-2.5 h-2.5" />
                        <span>PRE-ORDER ({product.preorderDeliveryDate || '순차발송'})</span>
                      </span>
                    )}
                    {product.isNewProduct && (
                      <span className="bg-emerald-600 text-white text-[8px] font-mono uppercase font-bold tracking-widest px-2 py-0.5">
                        NEW
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-amber-600 text-white text-[8px] font-mono uppercase font-bold tracking-widest px-2 py-0.5">
                        BEST
                      </span>
                    )}
                  </div>

                  {/* Sold Out Overlay Badge */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                      <span className="bg-rose-600 text-white text-[10px] font-display font-extrabold uppercase tracking-[0.25em] px-4 py-2 border border-white/20 shadow-lg">
                        SOLD OUT (품절)
                      </span>
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  {!isSoldOut && (
                    <div className="absolute inset-x-3 bottom-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex gap-2 z-10">
                      <button
                        onClick={(e) => handleBuyNow(e, product)}
                        className={`flex-1 text-[9px] font-display font-bold uppercase tracking-[0.2em] py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                          product.isPreorder
                            ? 'bg-amber-500 text-black hover:bg-amber-400 font-extrabold'
                            : 'bg-[#111111] text-[#FFFFFF] hover:bg-[#333333]'
                        }`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{product.isPreorder ? 'PRE-ORDER NOW' : 'BUY NOW (구매)'}</span>
                      </button>
                      <button
                        onClick={() => handleProductSelect(product)}
                        className="bg-white text-black border border-neutral-300 hover:border-black p-2.5 flex items-center justify-center transition-colors cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 border-t border-[#E5E5E5]">
                  <div>
                    <h3 
                      onClick={() => handleProductSelect(product)}
                      className="text-sm font-display font-bold text-[#111111] uppercase tracking-wide cursor-pointer hover:text-neutral-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#777777] font-sans line-clamp-2 mt-1 leading-relaxed">
                      {product.description || '스튜디오 고유의 감각으로 디자인된 홈 인테리어 오브제.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]/60">
                    <span className="text-sm font-display font-extrabold text-[#111111] tracking-wider">
                      {formatPrice(product.price, currency)}
                    </span>
                    <button
                      onClick={() => handleProductSelect(product)}
                      className="text-[10px] font-display font-bold text-neutral-500 hover:text-black uppercase tracking-widest inline-flex items-center space-x-1"
                    >
                      <span>DETAILS</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-3 bg-[#111111] text-[#FFFFFF] px-10 py-4 font-display text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#333333] transition-all"
          >
            <span>VIEW ENTIRE STORE CATALOG ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Editorial Visual Showcase Section */}
      <section 
        id="curation"
        ref={editorialRef}
        className="scroll-mt-32 bg-[#F2F0E8] text-[#222222] py-20 lg:py-28 border-y border-[#E2DFD6] relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500 font-display">
                {settings.editorialSubtitle || 'SENSORY HOME CURATION'}
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-extrabold uppercase tracking-[0.08em] text-[#111111] leading-tight">
                {settings.editorialTitle || 'PHILOSOPHY IN EVERY PIECE'}
              </h2>
              <div className="w-16 h-[2px] bg-[#111111]" />
            </div>

            <p className="font-sans text-neutral-700 text-sm lg:text-base leading-[1.8] tracking-tight">
              {settings.editorialDescription || '스튜디오 숨숨은 대량 생산품과 차별화되는 고유의 수공예적 결을 지닌 셀렉트 오더 소품을 기획합니다. 정돈된 비대칭의 아름다움과 정밀한 마감으로 일상의 공간에 예술적 공기를 채웁니다.'}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#DCD9CE]">
              <div>
                <p className="text-lg font-display font-extrabold text-[#111111]">
                  {settings.editorialKeypoint1Title || '01. NATURAL CLAY'}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  {settings.editorialKeypoint1Desc || '자연의 흙과 트라버틴 석재 고유의 질감'}
                </p>
              </div>
              <div>
                <p className="text-lg font-display font-extrabold text-[#111111]">
                  {settings.editorialKeypoint2Title || '02. SLOW DESIGN'}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  {settings.editorialKeypoint2Desc || '오래도록 질리지 않는 정돈된 미니멀 형태'}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to={settings.editorialButtonLink || "/shop"}
                className="inline-flex items-center space-x-3 bg-[#222222] text-white px-8 py-3.5 font-display text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#3E3E3E] transition-all"
              >
                <span>{settings.editorialButtonText || 'EXPLORE COLLECTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <motion.div 
            style={{ y: editorialY }}
            className="lg:col-span-6 relative aspect-[4/5] bg-white border border-[#DCD9CE] p-3 shadow-md"
          >
            <img
              src={settings.editorialImageUrl}
              alt="Editorial Visual"
              style={{ objectPosition: settings.editorialImagePosition || 'center' }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-6 py-3 border border-neutral-200 shadow-md">
              <p className="text-[9px] uppercase font-mono tracking-widest text-neutral-500">
                {settings.editorialOverlayTag || 'CURATED LOOKBOOK'}
              </p>
              <p className="text-xs font-bold font-display uppercase tracking-wider text-neutral-900">
                {settings.editorialOverlayTitle || 'STUDIO SUMSUM ARCHIVE'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section (회사소개 / 브랜드 소통) */}
      <section id="about" className="scroll-mt-32 py-28 lg:py-40 max-w-7xl mx-auto px-6 relative z-10 border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block px-3 py-1 bg-neutral-200/80 text-[#333333] text-[10px] font-bold uppercase tracking-[0.25em] font-display">
              {settings.aboutBadgeText || 'OUR ESSENCE & STORY'}
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold uppercase tracking-[0.08em] text-[#111111] leading-tight">
              {settings.aboutTitle || 'ABOUT STUDIO SUMSUM'}
            </h2>
            <div className="w-12 h-[2px] bg-[#111111]" />
            <p className="text-sm font-sans text-[#555555] leading-[1.8]">
              {settings.aboutDescription || '정돈된 공간이 전달하는 정밀한 위로. 정성껏 매만진 소품 하나가 삶의 은근한 여유와 감각적인 매일의 결을 조율합니다.'}
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-neutral-900 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-[#111111]">
                    {settings.philosophyFeature1Title || 'Natural Material'}
                  </h4>
                  <p className="text-xs text-[#777777] font-sans mt-0.5">
                    {settings.philosophyFeature1Description}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-neutral-900 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-[#111111]">
                    {settings.philosophyFeature2Title || 'Sustaining Form'}
                  </h4>
                  <p className="text-xs text-[#777777] font-sans mt-0.5">
                    {settings.philosophyFeature2Description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-[#FFFFFF] border border-[#E5E5E5] p-2">
              <img src={settings.archiveImage1 || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600'} alt="Archive 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] bg-[#FFFFFF] border border-[#E5E5E5] p-2 mt-8">
              <img src={settings.archiveImage2 || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600'} alt="Archive 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Banner */}
      <section className="bg-[#FFFFFF] py-20 border-b border-[#E5E5E5] text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-display text-[#777777]">
            {settings.newsletterTag || 'SENSORY JOURNAL'}
          </span>
          <h2 className="text-2xl lg:text-3xl font-display font-extrabold uppercase tracking-wider text-[#111111]">
            {settings.newsletterTitle || 'SUBSCRIBE FOR NEW RELEASES & EXCLUSIVE PROPS'}
          </h2>
          <p className="text-xs text-[#666666] font-sans leading-relaxed">
            {settings.newsletterDescription || '새로운 오브제 드롭 및 스페셜 에디션 출시 소식을 가장 먼저 이메일로 받아보세요.'}
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('감사합니다. 구독이 완료되었습니다!');
            }} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input 
              type="email" 
              required
              placeholder={settings.newsletterPlaceholder || 'Enter your email address'} 
              className="flex-1 bg-[#F9F9F9] border border-[#E5E5E5] px-4 py-3 text-xs outline-none focus:border-[#111111] transition-colors"
            />
            <button 
              type="submit"
              className="bg-[#111111] text-[#FFFFFF] px-6 py-3 font-display text-[10px] font-bold uppercase tracking-widest hover:bg-[#333333] transition-colors shrink-0 cursor-pointer"
            >
              {settings.newsletterButtonText || 'SUBSCRIBE'}
            </button>
          </form>
        </div>
      </section>

      {/* Floating Recently Viewed Products Widget (최근 본 상품) */}
      {recentlyViewedProducts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
          <AnimatePresence>
            {isRecentOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mb-3 bg-white border-2 border-black p-4 shadow-2xl w-72 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <History className="w-3.5 h-3.5 text-neutral-800" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest font-display text-black">
                      최근 본 상품 ({recentlyViewedProducts.length})
                    </span>
                  </div>
                  <button onClick={() => setIsRecentOpen(false)} className="text-neutral-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {recentlyViewedProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleProductSelect(p);
                        setIsRecentOpen(false);
                      }}
                      className="group relative aspect-square border border-neutral-200 hover:border-black p-1 transition-all overflow-hidden bg-neutral-50 text-left cursor-pointer"
                      title={p.name}
                    >
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        style={{ objectPosition: p.imagePosition || 'center' }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-white text-[8px] font-bold p-0.5 truncate text-center">
                        {formatPrice(p.price, currency)}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsRecentOpen(!isRecentOpen)}
            className="bg-black text-white hover:bg-neutral-800 px-4 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center space-x-2 cursor-pointer font-display text-[10px] font-bold uppercase tracking-widest"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span>최근 본 상품 ({recentlyViewedProducts.length})</span>
          </button>
        </div>
      )}
    </main>
  );
};
