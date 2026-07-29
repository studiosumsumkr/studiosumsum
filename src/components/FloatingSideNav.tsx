import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ShoppingBag, Search, Heart, ArrowRightLeft, Bot, Ticket, User, PanelLeftOpen, PanelLeftClose, X, Sparkles } from 'lucide-react';
import { useCMS } from '../cms';

interface FloatingSideNavProps {
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenCoupon: () => void;
  onOpenAi: () => void;
  onOpenAdmin: () => void;
  wishlistCount: number;
  compareCount: number;
}

export const FloatingSideNav: React.FC<FloatingSideNavProps> = ({
  onOpenSearch,
  onOpenWishlist,
  onOpenCompare,
  onOpenCoupon,
  onOpenAi,
  onOpenAdmin,
  wishlistCount,
  compareCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useCMS();

  return (
    <>
      {/* Floating Side Bar Toggle Button (always visible on desktop) */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-neutral-900 text-white hover:bg-black px-3.5 py-3 rounded-2xl shadow-2xl hover:shadow-amber-500/10 border border-neutral-800 transition-all cursor-pointer group hover:scale-105"
            title="퀵 메뉴 / 내비게이션 열기"
          >
            <PanelLeftOpen className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold font-sans tracking-tight pr-0.5">메뉴</span>
            {(wishlistCount > 0 || compareCount > 0) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </motion.button>
        )}
      </div>

      {/* Slide-out Floating Side Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center space-y-2.5 bg-white/95 backdrop-blur-md border border-neutral-200/90 p-3 rounded-2xl shadow-2xl transition-all"
            aria-label="Desktop Side Navigation"
          >
            {/* Close Toggle Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all mb-1 cursor-pointer"
              title="닫기"
            >
              <span className="text-[9px] font-mono font-bold uppercase text-neutral-400 pl-1">MENU</span>
              <X className="w-4 h-4" />
            </button>

            {/* Brand Mini Logo */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 bg-neutral-900 text-amber-400 rounded-xl flex items-center justify-center font-black font-display text-xs shadow-sm hover:scale-105 transition-transform"
              title={settings?.logoText || "STUDIO SUMSUM"}
            >
              {settings?.logoText ? settings.logoText.charAt(0) : "S"}
            </Link>

            <div className="w-6 border-t border-neutral-200 my-0.5" />

            {/* Main Page Links */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`p-2.5 rounded-xl transition-all relative group/item ${
                location.pathname === '/' 
                  ? 'bg-neutral-900 text-white shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                홈으로 (Home)
              </span>
            </Link>

            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className={`p-2.5 rounded-xl transition-all relative group/item ${
                location.pathname === '/shop' 
                  ? 'bg-neutral-900 text-white shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                스토어 컬렉션 (Shop)
              </span>
            </Link>

            <div className="w-6 border-t border-neutral-200 my-0.5" />

            {/* Quick Action Tools */}
            <button
              onClick={() => {
                onOpenSearch();
              }}
              className="p-2.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 rounded-xl transition-all relative group/item cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                상품 빠른 검색 (Search)
              </span>
            </button>

            <button
              onClick={() => {
                onOpenWishlist();
              }}
              className="p-2.5 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all relative group/item cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                위시리스트 ({wishlistCount})
              </span>
            </button>

            <button
              onClick={() => {
                onOpenCompare();
              }}
              className="p-2.5 text-neutral-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all relative group/item cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                상품 비교함 ({compareCount})
              </span>
            </button>

            <button
              onClick={() => {
                onOpenAi();
              }}
              className="p-2.5 bg-amber-500 text-black hover:bg-amber-400 rounded-xl transition-all relative group/item cursor-pointer shadow-sm"
            >
              <Bot className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                AI 1:1 상담 / Q&A
              </span>
            </button>

            <button
              onClick={() => {
                onOpenCoupon();
              }}
              className="p-2.5 text-amber-700 hover:bg-amber-100 rounded-xl transition-all relative group/item cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                시크릿 쿠폰 받기
              </span>
            </button>

            <div className="w-6 border-t border-neutral-200 my-0.5" />

            <button
              onClick={() => {
                onOpenAdmin();
              }}
              className="p-2.5 text-neutral-400 hover:bg-neutral-900 hover:text-amber-400 rounded-xl transition-all relative group/item cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity shadow-md z-50">
                관리자 모드
              </span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

