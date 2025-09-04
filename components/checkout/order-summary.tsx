'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export function OrderSummary() {
  const { items } = useCartStore();

  // Calculate totals using useMemo to prevent infinite loops
  const { subtotal, total } = useMemo(() => {
    const subtotal = items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 50000 ? 0 : 0; // Free shipping for Nigerian orders (no shipping cost)
    const total = subtotal + shipping; // No tax for Nigerian orders
    
    return { subtotal, shipping, total };
  }, [items]);

  return (
    <Card className="sticky top-8 rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 rounded-none shadow-none">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                {item.product.product_images && item.product.product_images.length > 0 ? (
                  <Image
                    src={item.product.product_images[0].image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    width={50}
                    height={50}
                  />
                ) : (
                  <Image
                    src="/placeholder.jpg"
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                    width={50}
                    height={50}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {item.product.name}
                </p>
                {item.selectedVariant && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.selectedVariant.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ₦{((item.selectedVariant?.price || item.product.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-gray-100">₦{subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="text-green-600 dark:text-green-400">Free</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
