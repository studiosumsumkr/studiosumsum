import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, User, Search, Instagram, Twitter, Facebook } from 'lucide-react';
import { useCMS } from '../cms';
import { getTypographyStyle } from '../utils';

interface NavbarProps {
  onAdminClick: () => void;
  onCartClick?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdminClick, searchQuery, setSearchQuery }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings, products, updateSettings } = useCMS();
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
        <div className="bg-neutral-950 text-white py-2.5 px-6 flex justify-center items-center pointer-events-auto border-b border-neutral-900">
          <Link to={settings.announcementLink || "/shop"} className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/90 hover:opacity-80 transition-opacity">
            {settings.announcementText}
          </Link>
        </div>
      )}

      <nav className={`transition-all duration-700 pointer-events-auto ${
        (isScrolled || !isHomePage) 
          ? 'bg-[#FFFFFF]/90 backdrop-blur-md py-4 border-b border-neutral-100' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Toggle & Left Nav Links */}
          <div className="flex items-center space-x-6">
            <button className={`lg:hidden ${textColor} shrink-0`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <div className="hidden lg:flex items-center space-x-6 xl:space-x-10 uppercase font-light shrink-0">
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
          <div className={`flex items-center space-x-4 md:space-x-6 ${textColor} shrink-0`}>
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
              
              {/* Quick Search Dropdown */}
              <AnimatePresence>
                {searchQuery.length > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-64 bg-[#FFFFFF] rounded-none border border-neutral-200 mt-4 shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-5 space-y-4"
                  >
                    <p className="text-[8px] uppercase tracking-widest font-semibold text-neutral-400">Suggested Results</p>
                    {filteredProducts.map(p => (
                      <Link 
                        to="/shop" 
                        key={p.id} 
                        className="flex items-center space-x-3 group/p"
                        onClick={() => setSearchQuery('')}
                      >
                        <div className="w-10 h-10 border border-neutral-100 rounded-none overflow-hidden shrink-0">
                          <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-medium uppercase truncate text-neutral-800 group-hover/p:text-neutral-500 transition-colors">{p.name}</p>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-400">${p.price}</p>
                        </div>
                      </Link>
                    ))}
                    {filteredProducts.length === 0 && <p className="text-[9px] uppercase font-semibold text-neutral-600 py-2">No results found</p>}
                    <Link to="/shop" className="block pt-2 border-t border-neutral-100 text-center text-[8px] font-semibold uppercase tracking-[0.3em] text-neutral-800 hover:text-neutral-500">View all</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={onAdminClick} className="hover:opacity-70 transition-all flex items-center space-x-1" title="Admin Portal">
              <User className="w-5 h-5 md:w-6 md:h-6" />
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
            className="fixed inset-0 bg-[#FFFFFF] z-[60] p-8 flex flex-col pointer-events-auto"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-8 h-8 text-neutral-900" />
              </button>
            </div>
            <div className="flex flex-col space-y-8 text-4xl font-serif tracking-tighter text-neutral-900">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="flex space-x-6">
                {settings?.instagramLink && (
                  <a href={settings.instagramLink} target="_blank" rel="noreferrer">
                    <Instagram className="w-5 h-5 text-neutral-400 hover:text-neutral-800 transition-colors" />
                  </a>
                )}
                {settings?.twitterLink && (
                  <a href={settings.twitterLink} target="_blank" rel="noreferrer">
                    <Twitter className="w-5 h-5 text-neutral-400 hover:text-neutral-800 transition-colors" />
                  </a>
                )}
                {settings?.facebookLink && (
                  <a href={settings.facebookLink} target="_blank" rel="noreferrer">
                    <Facebook className="w-5 h-5 text-neutral-400 hover:text-neutral-800 transition-colors" />
                  </a>
                )}
              </div>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400"
              >
                Admin Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
