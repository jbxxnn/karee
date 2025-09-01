'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Cart() {
  const [isHydrated, setIsHydrated] = useState(false);
  const items = useCartStore(state => state.items);
  // const clearCart = useCartStore(state => state.clearCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  
  // Memoize computed values to prevent infinite loops
  const computedValues = useMemo(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
    
    return { totalItems, subtotal };
  }, [items]);
  
  const { subtotal } = computedValues;

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show loading state while store initializes
  if (!isHydrated) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full py-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut"
        }}
      >
        {/* Main Message */}
        <div className="text-center mb-8">
          <h3 className="text-5xl font-normal text-gray-900 mb-1">
            Your cart is{' '} <br />
            <span className="text-5xl italic font-normal text-gray-900">
              empty
            </span>
          </h3>
        </div>

        {/* Call to Action Button */}
        <Link href="/products" className="block">
          <motion.div 
            className="flex items-center border border-gray-300 rounded-lg bg-brand-black transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="px-6 py-3 text-sm font-medium text-white uppercase tracking-wide">
              Browse Products
            </span>
            <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center ml-2 mr-2">
              <ArrowRight className="h-4 w-4 text-brand-black" />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6 relative">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <CartItem
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Summary & Checkout Section */}
      <motion.div 
        className="bg-gray-50 p-10 border-t border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: 0.2,
          ease: "easeOut"
        }}
      >
        <div className="space-y-4">
          {/* Estimated Total */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              ESTIMATED TOTAL
            </span>
            <span className="text-lg font-bold text-gray-900">
              ₦{subtotal.toFixed(2)}
            </span>
          </div>
          
          {/* Shipping & Taxes Note */}
          <p className="text-xs text-gray-600">
            Shipping & taxes calculated at checkout
          </p>
          
          {/* Legal Disclaimer */}
          <p className="text-xs text-gray-400 leading-relaxed">
            By checking out, I agree to the{' '}
            <Link href="/terms" className="underline hover:text-gray-600">
              Terms of Use
            </Link>{' '}
            and acknowledge that I have read the{' '}
            <Link href="/privacy" className="underline hover:text-gray-600">
              Privacy Policy
            </Link>
          </p>
          
          {/* Checkout Button */}
          <Link href="/checkout" className="block w-full">
            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 py-6 text-sm font-bold uppercase tracking-wide rounded-none transition-all duration-200 hover:scale-[1.02]">
              CHECKOUT
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
