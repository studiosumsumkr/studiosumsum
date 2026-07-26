import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Mail } from 'lucide-react';

export const NewsletterOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('laura_newsletter_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('laura_newsletter_seen', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white border-4 border-black shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-2 overflow-hidden"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="hidden md:block relative h-full min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1549062572-544a64fb0c56?auto=format&fit=crop&q=80&w=1000" 
                className="absolute inset-0 w-full h-full object-cover"
                alt="Brand Membership"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="p-12 md:p-16 flex flex-col justify-center space-y-8 bg-paper">
              {!submitted ? (
                <>
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.6em] font-black text-black/40">Exclusive Membership</p>
                    <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tighter uppercase leading-none">
                      Join The<br/>Inner Circle<span className="text-accent">.</span>
                    </h2>
                    <p className="text-sm font-serif italic text-black/60 max-w-xs">
                      Receive early access to seasonal curations, artisanal studies, and exclusive invitations.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="EMAIL ADDRESS"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-black/10 py-4 focus:border-accent transition-colors outline-none text-[10px] font-black uppercase tracking-widest"
                      />
                      <Mail className="absolute right-0 top-4 w-4 h-4 text-black/20" />
                    </div>
                    <button className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-accent hover:text-black transition-all group flex items-center justify-center space-x-4">
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-accent border-2 border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ArrowRight className="w-8 h-8 rotate-[-45deg]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight">Welcome to L'AURA</h3>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mt-2">Your journey with us begins now</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
