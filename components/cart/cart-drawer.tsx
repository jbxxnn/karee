'use client';

import { useEffect, useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { Cart } from './cart';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { isOpen, closeCart, items, isHydrated } = useCartStore();
  const totalItemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0), 
    [items]
  );

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.3
            }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  CART
                </h2>
                <span className="text-xs font-normal text-gray-900">
                  PRODUCT ({isHydrated ? totalItemsCount : 0})
                </span>
              </div>
              
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-hidden">
              <Cart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
