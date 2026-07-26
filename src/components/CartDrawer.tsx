import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCMS } from '../cms';
import { FreeShippingBar } from './FreeShippingBar';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, products, removeFromCart, updateCartQuantity } = useCMS();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const total = cartItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 z-[101] shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-3 bg-neutral-50 dark:bg-neutral-950">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-display font-extrabold uppercase tracking-[0.12em] flex items-center gap-3 text-neutral-900 dark:text-white">
                  <ShoppingBag className="w-4 h-4 text-neutral-900 dark:text-white" />
                  Shopping Bag ({cart.length})
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-black dark:hover:text-white hover:rotate-90 transition-transform duration-300 cursor-pointer"
                  id="close-cart-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FreeShippingBar currentAmount={total} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-[#FFFFFF]">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-[#F9F9F9] border border-[#E5E5E5] flex items-center justify-center rounded-none shadow-none">
                    <ShoppingBag className="w-6 h-6 text-[#777777]/40" />
                  </div>
                  <div>
                    <h3 className="text-xs font-display font-extrabold uppercase tracking-[0.12em] text-[#222222] mb-2">YOUR BAG IS EMPTY</h3>
                    <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-[#777777] max-w-xs mx-auto">Explore our curated collection to find your pieces</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3.5 bg-[#111111] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-[#1E291B] transition-colors rounded-none shadow-none font-display"
                  >
                    BACK TO COLLECTION
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-6 group">
                    <div className="w-20 aspect-[3/4] border border-[#E5E5E5] bg-[#F9F9F9] overflow-hidden shrink-0 rounded-none shadow-none p-1">
                      <img src={item.product!.imageUrl} alt={item.product!.name} className="w-full h-full object-cover rounded-none" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-display font-extrabold uppercase tracking-[0.12em] text-[#222222] group-hover:text-[#777777] transition-colors">
                            {item.product!.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="text-[#777777]/30 hover:text-red-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] text-[#777777] uppercase tracking-[0.12em] font-display">
                          {item.product!.category}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-[#E5E5E5] overflow-hidden rounded-none">
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 hover:bg-neutral-50 text-[#777777] hover:text-[#222222] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-sans tracking-tight text-[#222222]">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 hover:bg-neutral-50 text-[#777777] hover:text-[#222222] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-serif italic text-[#222222]">${(item.product!.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-8 border-t border-[#E5E5E5] space-y-6 bg-[#F9F9F9]">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#777777] font-display">SUBTOTAL</p>
                  <p className="text-xl font-serif italic text-[#1E291B]">${total.toLocaleString()}</p>
                </div>
                <button className="w-full py-4.5 bg-[#111111] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-[0.12em] font-display hover:bg-[#1E291B] transition-colors rounded-none shadow-none">
                  PROCEED TO CHECKOUT
                </button>
                <p className="text-[8px] text-center uppercase tracking-[0.12em] text-[#777777] font-bold font-display">
                  SHIPPING & TAXES CALCULATED AT CHECKOUT • SECURE PACKS
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
