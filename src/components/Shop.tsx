import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Eye, ArrowRightLeft, Heart } from 'lucide-react';
import { useCMS } from '../cms';
import { getTypographyStyle } from '../utils';
import { Product } from '../types';
import { ProductBadges } from './ProductBadges';
import { ImageWithFallback } from './ImageWithFallback';
import { formatPrice } from '../utils/currency';
import { CategoryQuickFilter } from './CategoryQuickFilter';
import { BreadcrumbNav } from './BreadcrumbNav';
import { GridDensityToggle } from './GridDensityToggle';

const formatUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const Shop = ({ 
  searchQuery, 
  onProductClick
}: { 
  searchQuery: string, 
  onProductClick: (p: Product) => void, 
  onAddToCart?: (id: string) => void 
}) => {
  const { products, settings, currency, wishlist, toggleWishlist, compareList, toggleCompare, addRecentlyViewed } = useCMS();
  const [filter, setFilter] = useState('ALL');
  const [quickFilter, setQuickFilter] = useState<'all' | 'new' | 'best' | 'preorder' | 'instock'>('all');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'ALL' || p.category.toUpperCase() === filter;
    
    let matchesFeature = true;
    if (quickFilter === 'new') matchesFeature = p.isNewProduct === true;
    else if (quickFilter === 'best') matchesFeature = p.isBestSeller === true;
    else if (quickFilter === 'preorder') matchesFeature = p.isPreorder === true;
    else if (quickFilter === 'instock') matchesFeature = p.inStock !== false;

    const cleanSearch = searchQuery.toLowerCase().replace(/\s/g, '');
    const cleanName = p.name.toLowerCase().replace(/\s/g, '');
    const cleanCategory = p.category.toLowerCase().replace(/\s/g, '');
    const cleanDesc = p.description ? p.description.toLowerCase().replace(/\s/g, '') : '';
    const matchesSearch = cleanName.includes(cleanSearch) || cleanCategory.includes(cleanSearch) || cleanDesc.includes(cleanSearch);

    return matchesCategory && matchesFeature && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.price - b.price;
    if (sortBy === 'PRICE_HIGH') return b.price - a.price;
    if (sortBy === 'NAME') return a.name.localeCompare(b.name);
    return 0;
  });

  const categories = [...new Set(products.map(p => p.category.toUpperCase()))];

  const handleProductSelect = (p: Product) => {
    addRecentlyViewed(p.id);
    onProductClick(p);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 lg:pt-48 pb-24 lg:pb-36 px-4 md:px-6 bg-[#FFFFFF] dark:bg-neutral-950 min-h-screen relative font-sans text-neutral-900 dark:text-white"
    >
      <div className="noise-bg" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <BreadcrumbNav
            category={filter !== 'ALL' ? filter : undefined}
            onCategoryClick={(cat) => setFilter(cat)}
            onHomeClick={() => (window.location.href = '/')}
          />
        </div>

        <header className="mb-8 relative border-b border-neutral-100 dark:border-neutral-800 pb-8">
          <span className="text-[9px] uppercase tracking-[0.5em] font-medium text-neutral-400 block mb-3">Online Curator Boutique</span>
          <h1 
            style={settings?.shopTitleStyle ? getTypographyStyle(settings.shopTitleStyle) : {}}
            className={`font-display font-light leading-none tracking-wide uppercase mb-6 relative z-10 break-words ${!settings?.shopTitleStyle ? 'text-3xl md:text-5xl lg:text-6xl text-neutral-900 dark:text-white' : ''}`}
          >
            {settings?.shopTitle || 'Shop'}
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <p className="text-xs text-neutral-500 font-mono">
              총 <strong className="text-black dark:text-white font-extrabold">{sortedProducts.length}</strong>개의 세렉트 오브제
            </p>

            <div className="flex items-center space-x-3">
              <GridDensityToggle cols={gridCols} onChange={setGridCols} />

              <div className="flex items-center space-x-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none px-4 py-2">
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-400">Sort By:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[9px] font-semibold uppercase tracking-[0.2em] outline-none cursor-pointer text-neutral-800 dark:text-neutral-200"
                >
                  <option value="DEFAULT" className="dark:bg-neutral-900">Default</option>
                  <option value="PRICE_LOW" className="dark:bg-neutral-900">Price: Low to High</option>
                  <option value="PRICE_HIGH" className="dark:bg-neutral-900">Price: High to Low</option>
                  <option value="NAME" className="dark:bg-neutral-900">Name: A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <CategoryQuickFilter
            categories={categories}
            selectedCategory={filter}
            onSelectCategory={setFilter}
            selectedFilter={quickFilter}
            onSelectFilter={setQuickFilter}
          />
        </header>

        <div className={`grid gap-8 lg:gap-12 ${
          gridCols === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : gridCols === 4
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {sortedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isCompared = compareList.includes(product.id);

            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="hip-card group overflow-hidden border border-neutral-200/80 dark:border-neutral-800 rounded-none bg-white dark:bg-neutral-900 relative flex flex-col justify-between"
              >
                <div 
                  className="relative aspect-[4/5] overflow-hidden border-b border-neutral-100 dark:border-neutral-800 cursor-crosshair pb-0 rounded-none bg-neutral-50 dark:bg-neutral-950"
                  onClick={() => handleProductSelect(product)}
                >
                  <ProductBadges product={product} />

                  <ImageWithFallback 
                    src={product.imageUrl} 
                    alt={product.name}
                    imagePosition={product.imagePosition || 'center'}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Top Action Buttons */}
                  <div className="absolute top-3 right-3 z-20 flex space-x-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                        isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:bg-black hover:text-white'
                      }`}
                      title="관심 상품 추가"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(product.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                        isCompared ? 'bg-emerald-600 text-white' : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:bg-black hover:text-white'
                      }`}
                      title="비교함에 담기"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 dark:bg-neutral-900/95 backdrop-blur text-neutral-800 dark:text-neutral-200 text-[9px] px-3 py-1 uppercase tracking-widest font-mono border border-neutral-200 dark:border-neutral-700 shadow-sm z-10">
                    {product.category}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6 gap-3 z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductSelect(product);
                      }}
                      className="px-5 py-2.5 bg-white text-black text-[9px] uppercase tracking-[0.2em] font-extrabold hover:bg-neutral-200 transition-all rounded-none shadow-md flex items-center space-x-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-black" />
                      <span>QUICK VIEW</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex justify-between items-start bg-white dark:bg-neutral-900">
                  <div className="space-y-1 min-w-0 pr-2">
                    <h3 
                      onClick={() => handleProductSelect(product)}
                      className="text-sm md:text-base font-display uppercase tracking-wide font-bold text-neutral-900 dark:text-white group-hover:text-neutral-500 transition-colors truncate cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                      Studio Edition
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-mono font-extrabold text-neutral-900 dark:text-white">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
