import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Eye } from 'lucide-react';
import { useCMS } from '../cms';
import { getTypographyStyle } from '../utils';
import { Product } from '../types';

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
  const { products, settings } = useCMS();
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'ALL' || p.category.toUpperCase() === filter;
    const cleanSearch = searchQuery.toLowerCase().replace(/\s/g, '');
    const cleanName = p.name.toLowerCase().replace(/\s/g, '');
    const cleanCategory = p.category.toLowerCase().replace(/\s/g, '');
    const matchesSearch = cleanName.includes(cleanSearch) || cleanCategory.includes(cleanSearch);
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.price - b.price;
    if (sortBy === 'PRICE_HIGH') return b.price - a.price;
    if (sortBy === 'NAME') return a.name.localeCompare(b.name);
    return 0;
  });

  const categories = ['ALL', ...new Set(products.map(p => p.category.toUpperCase()))];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 lg:pt-48 pb-24 lg:pb-36 px-4 md:px-6 bg-[#FFFFFF] min-h-screen relative font-sans text-neutral-900"
    >
      <div className="noise-bg" />
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 lg:mb-24 relative border-b border-neutral-100 pb-10">
          <span className="text-[9px] uppercase tracking-[0.5em] font-medium text-neutral-400 block mb-3">Online Curator Boutique</span>
          <h1 
            style={settings?.shopTitleStyle ? getTypographyStyle(settings.shopTitleStyle) : {}}
            className={`font-display font-light leading-none tracking-wide uppercase mb-8 relative z-10 break-words ${!settings?.shopTitleStyle ? 'text-3xl md:text-5xl lg:text-6xl text-neutral-900' : ''}`}
          >
            {settings?.shopTitle || 'Shop'}
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex flex-wrap gap-2 text-[9px] lg:text-[10px] uppercase tracking-[0.25em] font-medium">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 lg:px-8 py-2.5 lg:py-3 transition-all duration-500 border rounded-none ${
                    filter === cat ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-transparent text-neutral-700 border-neutral-200/80 hover:border-neutral-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3 border border-neutral-200 bg-white rounded-none px-5 py-2.5">
              <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-400">Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[9px] font-semibold uppercase tracking-[0.2em] outline-none cursor-pointer pr-4 text-neutral-850"
              >
                <option value="DEFAULT">Default</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="NAME">Name: A-Z</option>
              </select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {sortedProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hip-card group overflow-hidden border-neutral-200/80 rounded-none bg-white"
            >
              <div 
                className="relative aspect-[4/5] overflow-hidden border-b border-neutral-100 cursor-crosshair pb-0 rounded-none bg-neutral-50"
                onClick={() => onProductClick(product)}
              >
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute top-6 left-6 bg-[#FFFFFF]/95 backdrop-blur text-neutral-800 text-[9px] px-4 py-1.5 rounded-none uppercase tracking-widest font-medium border border-neutral-100 shadow-sm">
                  {product.category}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-950/20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-8 gap-3 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const buyLink = product.buyUrl || product.link;
                      if (buyLink) {
                        window.open(formatUrl(buyLink), '_blank');
                      } else {
                        onProductClick(product);
                      }
                    }}
                    className="px-6 py-3 bg-neutral-900 border border-neutral-900 text-white text-[9px] uppercase tracking-[0.25em] font-bold hover:bg-black transition-all rounded-none shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                    <span>BUY NOW (구매하기)</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex justify-between items-start bg-white">
                <div className="space-y-1.5">
                  <h3 className="text-base lg:text-lg font-display uppercase tracking-wide font-light text-neutral-850 group-hover:text-neutral-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-[1px] bg-neutral-200" />
                    <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
                      Studio Edition
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-serif italic text-neutral-800">${product.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
