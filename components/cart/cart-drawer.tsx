'use client';

import { useEffect, useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { Cart } from './cart';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { isOpen, closeCart, items } = useCartStore();
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Cart
                  {totalItemsCount > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({totalItemsCount})
                    </span>
                  )}
                </h2>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCart}
                className="h-8 w-8 p-0"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <Cart />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
