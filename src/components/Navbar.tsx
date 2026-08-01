import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, User, Search, Instagram, Twitter, Facebook, Heart, ArrowRightLeft, Ticket, Bot, Users, Zap } from 'lucide-react';
import { useCMS } from '../cms';
import { getTypographyStyle } from '../utils';
import { CurrencySelector } from './CurrencySelector';
import { formatPrice } from '../utils/currency';

interface NavbarProps {
  onAdminClick: () => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onCompareClick?: () => void;
  onCouponClick?: () => void;
  onAiClick?: () => void;
  onTimeDealClick?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAdminClick,
  onWishlistClick,
  onCompareClick,
  onCouponClick,
  onAiClick,
  onTimeDealClick,
  searchQuery,
  setSearchQuery
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings, products, wishlist, compareList, updateSettings } = useCMS();
  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP ALL', path: '/shop' },
    { name: 'NEW ARRIVALS', path: '/#featured' },
    { name: 'COLLECTION', path: '/#curation' },
    { name: 'OUR STORY', path: '/#about' },
  ];

  const handleLanguageToggle = () => {
    const nextLang = settings.language === 'EN' ? 'KR' : 'EN';
    updateSettings({ language: nextLang });
    // In a real app, this would also update nav texts based on a template
  };

  const isHomePage = location.pathname === '/';
  const textColor = (isScrolled || !isHomePage) ? 'text-neutral-900' : 'text-white';
  const logoStyle = settings?.logoStyle ? getTypographyStyle(settings.logoStyle) : {};
  const navLinkStyle = settings?.navLinkStyle ? getTypographyStyle(settings.navLinkStyle) : {};

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.includes('#')) {
      const id = path.split('#')[1];
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* Announcement Bar */}
      {settings?.showAnnouncement && (
        <div className="bg-neutral-950 text-white py-2 px-4 flex justify-between items-center pointer-events-auto border-b border-neutral-900 text-xs font-mono">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2 gap-2">
            <Link to={settings.announcementLink || "/shop"} className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/90 hover:opacity-80 transition-opacity truncate">
              {settings.announcementText}
            </Link>
            
            <div className="flex items-center space-x-2 shrink-0">
              {onTimeDealClick && (
                <button
                  onClick={onTimeDealClick}
                  className="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase rounded tracking-wider flex items-center space-x-1 shadow-sm cursor-pointer transition-all animate-pulse"
                >
                  <Zap className="w-3 h-3 fill-black" />
                  <span>⚡ 24H 타임딜</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className={`transition-all duration-700 pointer-events-auto ${
        (isScrolled || !isHomePage) 
          ? 'bg-[#FFFFFF]/90 backdrop-blur-md py-4 border-b border-neutral-100' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left Area: Store Logo & Nav Links */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button className={`lg:hidden ${textColor} shrink-0 p-1`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {/* Store Brand Logo Area (Click to Home) */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0 group py-1 max-w-[160px] sm:max-w-none truncate">
              {settings?.logoImage ? (
                <img 
                  src={settings.logoImage} 
                  alt={settings.logoText || "Store Logo"} 
                  className="h-7 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-neutral-900 text-amber-400 rounded-xl flex items-center justify-center font-black font-display text-xs sm:text-sm tracking-tighter shadow-sm border border-neutral-800 group-hover:bg-black transition-colors shrink-0">
                  {settings?.logoText ? settings.logoText.charAt(0) : "S"}
                </div>
              )}
              
              <span 
                style={logoStyle}
                className={`text-base sm:text-lg md:text-xl font-display font-black tracking-tight uppercase ${textColor} group-hover:opacity-80 transition-opacity truncate`}
              >
                {settings?.logoText || "STUDIO SUMSUM"}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 uppercase font-light shrink-0 border-l border-neutral-200/40 dark:border-neutral-800/40 pl-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  style={navLinkStyle}
                  className={`relative group transition-all duration-300 ${
                    location.pathname === link.path ? 'text-neutral-900 font-semibold' : textColor
                  } ${!settings?.navLinkStyle ? 'text-[10px] tracking-[0.2em] font-medium text-neutral-800' : ''}`}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                  <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-neutral-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Icons */}
          <div className={`flex items-center space-x-2 sm:space-x-3 md:space-x-4 ${textColor} shrink-0`}>
            {/* Currency Selector */}
            <div className="hidden md:flex items-center space-x-2">
              <CurrencySelector />
            </div>

            {/* Live Time Deal Button */}
            {onTimeDealClick && (
              <button
                onClick={onTimeDealClick}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-full font-sans font-black text-xs cursor-pointer shadow-md transition-all ring-2 ring-amber-500/30 animate-pulse"
                title="24H 스페셜 타임딜"
              >
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
                <span className="tracking-tight">타임딜</span>
              </button>
            )}

            {/* Pinned AI CS / Q&A Button in Header (On mobile, accessible in drawer and floating widget) */}
            {onAiClick && (
              <button
                onClick={onAiClick}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-full font-sans font-black text-xs cursor-pointer shadow-md transition-all ring-2 ring-amber-500/20"
                title="AI 1:1 상담 / Q&A 문의"
              >
                <Bot className="w-3.5 h-3.5 text-black" />
                <span className="tracking-tight">AI 1:1 Q&A</span>
              </button>
            )}

            {/* Coupon Trigger Button */}
            {onCouponClick && (
              <button
                onClick={onCouponClick}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-black dark:hover:text-black border border-amber-500/30 rounded-full transition-all text-xs font-bold cursor-pointer shadow-xs group"
                title="시크릿 할인 쿠폰 받기"
              >
                <Ticket className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:text-black transition-colors" />
                <span className="font-sans font-extrabold tracking-tight">쿠폰</span>
              </button>
            )}

            {/* Compare Drawer Trigger */}
            <button
              onClick={onCompareClick}
              className="hover:opacity-70 transition-all relative flex items-center justify-center p-1.5"
              title="Compare Products (상품 비교)"
            >
              <ArrowRightLeft className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onWishlistClick}
              className="hover:opacity-70 transition-all relative flex items-center justify-center p-1.5"
              title="Wishlist (관심 상품)"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Language Toggle */}
            <button 
              onClick={handleLanguageToggle}
              className="text-[10px] font-medium uppercase tracking-widest hover:text-neutral-900 transition-all hidden md:block text-neutral-600"
            >
              {settings.language}
            </button>

            <div className="relative group hidden lg:block">
              <input 
                type="text"
                placeholder={settings?.searchPlaceholder || "SEARCH"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent border-b ${(isScrolled || !isHomePage) ? 'border-black/10' : 'border-white/20'} outline-none text-[10px] uppercase tracking-[0.2em] font-medium w-16 md:w-20 lg:focus:w-28 transition-all`}
              />
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute right-0 top-0 pointer-events-none opacity-60" />
            </div>

            <button onClick={onAdminClick} className="hover:opacity-70 transition-all flex items-center p-1.5" title="Admin Portal">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] p-6 flex flex-col pointer-events-auto overflow-y-auto max-h-screen"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-neutral-900 text-amber-400 rounded-lg flex items-center justify-center font-black text-xs">
                  {settings?.logoText ? settings.logoText.charAt(0) : "S"}
                </div>
                <span className="font-display font-black uppercase text-sm tracking-tight text-neutral-900">
                  {settings?.logoText || "STUDIO SUMSUM"}
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col space-y-4 mb-8">
              <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold tracking-widest">Menu</p>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="text-2xl font-serif font-bold text-neutral-900 hover:text-amber-600 transition-colors py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Quick Actions (Time Deal, Group Buy, Q&A, Coupon) */}
            <div className="space-y-3 mb-8">
              <p className="text-[10px] font-mono uppercase text-neutral-400 font-bold tracking-widest">Quick Actions</p>

              {/* Time Deal Button */}
              {onTimeDealClick && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onTimeDealClick();
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold rounded-xl shadow-md text-sm cursor-pointer animate-pulse"
                >
                  <div className="flex items-center space-x-2.5">
                    <Zap className="w-5 h-5 text-black fill-black" />
                    <span>⚡ 24H 한정 타임딜</span>
                  </div>
                  <span className="text-[10px] bg-black text-amber-400 px-2 py-0.5 rounded-full font-mono font-black">FLASH SALE</span>
                </button>
              )}
              
              {/* AI Q&A Button */}
              {onAiClick && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAiClick();
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold rounded-xl shadow-md text-sm cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Bot className="w-5 h-5 text-black" />
                    <span>AI 1:1 상담 / Q&A 문의</span>
                  </div>
                  <span className="text-[10px] bg-black text-amber-400 px-2 py-0.5 rounded-full font-mono">LIVE</span>
                </button>
              )}

              {/* Coupon Button */}
              {onCouponClick && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onCouponClick();
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-amber-100 text-amber-900 font-extrabold rounded-xl border border-amber-300 text-sm cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Ticket className="w-5 h-5 text-amber-700" />
                    <span>{settings?.promoDiscountPercent || 15}% 특별 쿠폰 받기</span>
                  </div>
                  <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-mono">발급</span>
                </button>
              )}

              {/* Wishlist & Compare 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onWishlistClick?.();
                  }}
                  className="flex items-center justify-between p-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-bold text-xs text-neutral-800 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    <span>위시리스트</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-black">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onCompareClick?.();
                  }}
                  className="flex items-center justify-between p-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-bold text-xs text-neutral-800 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                    <span>상품 비교</span>
                  </div>
                  {compareList.length > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-black">
                      {compareList.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Currency & Settings */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 mb-8 space-y-3">
              <p className="text-[10px] font-mono text-neutral-500 uppercase font-bold">통화 변경 (Currency)</p>
              <CurrencySelector />
            </div>

            {/* Drawer Footer */}
            <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between shrink-0">
              <div className="flex space-x-4">
                {settings?.instagramLink && (
                  <a href={settings.instagramLink} target="_blank" rel="noreferrer" className="p-2 bg-neutral-100 rounded-lg">
                    <Instagram className="w-4 h-4 text-neutral-600" />
                  </a>
                )}
                {settings?.twitterLink && (
                  <a href={settings.twitterLink} target="_blank" rel="noreferrer" className="p-2 bg-neutral-100 rounded-lg">
                    <Twitter className="w-4 h-4 text-neutral-600" />
                  </a>
                )}
                {settings?.facebookLink && (
                  <a href={settings.facebookLink} target="_blank" rel="noreferrer" className="p-2 bg-neutral-100 rounded-lg">
                    <Facebook className="w-4 h-4 text-neutral-600" />
                  </a>
                )}
              </div>

              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>관리자 로그인</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
