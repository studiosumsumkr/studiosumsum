import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useCMS } from './cms';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { Login } from './components/Admin/Login';
import { Dashboard } from './components/Admin/Dashboard';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Instagram, Facebook, Twitter, ShoppingBag, ArrowUpRight, Plus } from 'lucide-react';
import { getTypographyStyle } from './utils';

const Footer = () => {
  const { settings } = useCMS();
  const rightsStyle = settings?.footerRightsStyle ? getTypographyStyle(settings.footerRightsStyle) : {};
  
  return (
    <footer className="bg-[#F3F2EE] text-[#222222] py-20 lg:py-28 px-6 border-t border-[#E5E5E5] relative z-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
        <div className="space-y-6 lg:space-y-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold tracking-[0.12em] uppercase text-[#111111] break-words">{settings?.logoText || "STUDIO SUMSUM"}</h2>
          <p className="text-[#666666] text-sm lg:text-base leading-[1.65] max-w-md font-serif italic">
            {settings?.footerDescription}
          </p>
          <div className="flex space-x-6 lg:space-x-8">
            {settings?.instagramLink && (
              <a href={settings.instagramLink} target="_blank" rel="noreferrer" className="text-[#666666] hover:text-[#111111] transition-colors">
                <Instagram className="w-5 h-5 cursor-pointer transition-all hover:scale-105" />
              </a>
            )}
            {settings?.twitterLink && (
              <a href={settings.twitterLink} target="_blank" rel="noreferrer" className="text-[#666666] hover:text-[#111111] transition-colors">
                <Twitter className="w-5 h-5 cursor-pointer transition-all hover:scale-105" />
              </a>
            )}
            {settings?.facebookLink && (
              <a href={settings.facebookLink} target="_blank" rel="noreferrer" className="text-[#666666] hover:text-[#111111] transition-colors">
                <Facebook className="w-5 h-5 cursor-pointer transition-all hover:scale-105" />
              </a>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.12em] text-[#888888] font-bold mb-6 lg:mb-8 font-display">NAVIGATION</h3>
            <ul className="space-y-3 lg:space-y-4 text-[10px] lg:text-xs uppercase tracking-[0.12em] font-medium text-[#555555] font-display">
              <li><a href="/#about" className="hover:text-[#111111] transition-colors">About Studio</a></li>
              <li><a href="/#services" className="hover:text-[#111111] transition-colors">Services & Capabilities</a></li>
              <li><a href="/#projects" className="hover:text-[#111111] transition-colors">Selected Projects</a></li>
              <li><a href="/#contact" className="hover:text-[#111111] transition-colors">Inquire / Contact</a></li>
              <li><Link to="/shop" className="hover:text-[#111111] transition-colors">Archive Collection</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.12em] text-[#888888] font-bold mb-6 lg:mb-8 font-display">NEWSLETTER</h3>
            <div className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#666666] font-display">
                {settings?.footerNewsletterTitle || "Join the list"}
              </p>
              <div className="relative group border-b border-[#CCCCCC] focus-within:border-[#111111] transition-all">
                <input 
                  type="email" 
                  placeholder={settings?.footerNewsletterPlaceholder || "JOIN THE LIST"} 
                  className="w-full bg-transparent py-3 outline-none transition-all text-[10px] uppercase tracking-[0.12em] font-bold text-[#111111] placeholder:text-[#999999]"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#111111] transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 lg:mt-24 pt-8 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center gap-4 text-[#777777]">
        <p 
          style={rightsStyle}
          className={`uppercase font-bold font-display ${!settings?.footerRightsStyle ? 'text-[9px] tracking-[0.12em]' : ''}`}
        >
          © {new Date().getFullYear()} {settings?.logoText || "STUDIO SUMSUM"}. {settings?.footerRightsText || "ALL RIGHTS RESERVED."}
        </p>
        <div className="flex space-x-6 lg:space-x-12 text-[9px] uppercase tracking-[0.12em] font-bold text-[#777777] font-display">
          <a href="#" className="hover:text-[#111111] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#111111] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

import { Home } from './components/Home';
import { Shop } from './components/Shop';
import { ProductModal } from './components/ProductModal';
import { ScrollProgress } from './components/ScrollProgress';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductCompareDrawer } from './components/ProductCompareDrawer';
import { RecentlyViewedBar } from './components/RecentlyViewedBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { PromoAnnouncementBar } from './components/PromoAnnouncementBar';
import { SearchModal } from './components/SearchModal';
import { LiveSocialProofToast } from './components/LiveSocialProofToast';
import { ScrollToTop } from './components/ScrollToTop';
import { ShareWishlistModal } from './components/ShareWishlistModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ShippingTrackerModal } from './components/ShippingTrackerModal';
import { GiftFinderModal } from './components/GiftFinderModal';
import { CouponModal } from './components/CouponModal';
import { Product } from './types';

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('laura_admin') === 'true');
  const [isAdminView, setIsAdminView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isShareWishlistOpen, setIsShareWishlistOpen] = useState(false);
  const [isShippingTrackerOpen, setIsShippingTrackerOpen] = useState(false);
  const [isGiftFinderOpen, setIsGiftFinderOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const { settings, loading } = useCMS();
  const location = useLocation();

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('laura_admin', 'true');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('laura_admin');
    setIsAdminView(false);
  };

  if (isAdminView) {
    if (!isAdmin) return <Login onBack={() => setIsAdminView(false)} onLogin={() => handleLogin(true)} />;
    return (
      <div className={`relative min-h-screen bg-[#FFFFFF] text-neutral-900 selection:bg-neutral-100 font-set-${settings?.fontSet || 'round'}`}>
        <NetworkStatusIndicator />
        <Dashboard onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen bg-[#FFFFFF] text-neutral-900 selection:bg-neutral-100 font-set-${settings?.fontSet || 'round'}`}>
      <NetworkStatusIndicator />
      <PromoAnnouncementBar onOpenCouponModal={() => setIsCouponModalOpen(true)} />

      {loading && !settings && (
        <div className="fixed inset-0 z-[100] bg-[#FFFFFF] flex items-center justify-center">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-serif tracking-[0.5em] uppercase text-neutral-800"
          >
            {settings?.logoText || "STUDIO SUMSUM"}
          </motion.div>
        </div>
      )}
      <Helmet>
        <title>{settings?.seoTitle || "STUDIO SUMSUM | GLOBAL"}</title>
        <meta name="description" content={settings?.seoDescription} />
      </Helmet>

      <Navbar 
        onAdminClick={() => setIsAdminView(true)} 
        onWishlistClick={() => setIsWishlistOpen(true)}
        onCompareClick={() => setIsCompareOpen(true)}
        onCouponClick={() => setIsCouponModalOpen(true)}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <ScrollToHash />

      {/* Global Interactive Tools */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onProductSelect={setSelectedProduct}
      />

      <LiveSocialProofToast onProductClick={setSelectedProduct} />
      <ScrollToTop />

      <ShareWishlistModal
        isOpen={isShareWishlistOpen}
        onClose={() => setIsShareWishlistOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onToggleTheme={() => {}}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAdmin={() => setIsAdminView(true)}
      />

      <ShippingTrackerModal
        isOpen={isShippingTrackerOpen}
        onClose={() => setIsShippingTrackerOpen(false)}
      />

      <GiftFinderModal
        isOpen={isGiftFinderOpen}
        onClose={() => setIsGiftFinderOpen(false)}
        onProductSelect={setSelectedProduct}
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onProductClick={setSelectedProduct}
      />

      <ProductCompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onProductClick={setSelectedProduct}
      />

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <RecentlyViewedBar
        onProductClick={setSelectedProduct}
      />

      {settings?.showScrollProgress && <ScrollProgress />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col"
        >
          <Routes location={location}>
            <Route path="/" element={<Home onProductClick={setSelectedProduct} />} />
            <Route path="/shop" element={<Shop searchQuery={searchQuery} onProductClick={setSelectedProduct} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <AppContent />
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

