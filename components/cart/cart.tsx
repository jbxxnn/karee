'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export function Cart() {
  const [isHydrated, setIsHydrated] = useState(false);
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  
  // Memoize computed values to prevent infinite loops
  const computedValues = useMemo(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return { totalItems, subtotal, shipping, tax, total };
  }, [items]);
  
  const { totalItems, subtotal, shipping, tax, total } = computedValues;

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show loading state while store initializes
  if (!isHydrated) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Link href="/products">
          <Button>
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h2>
                 <Button
           variant="ghost"
           onClick={clearCart}
           className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
         >
           Clear Cart
         </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                 {items.map((item) => (
           <CartItem
             key={item.id}
             item={item}
             onUpdateQuantity={updateQuantity}
             onRemove={removeItem}
           />
         ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Order Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          
          {shipping > 0 && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <Truck className="inline h-4 w-4 mr-1" />
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-6 space-y-3">
          <Link href="/checkout" className="w-full">
            <Button className="w-full" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
