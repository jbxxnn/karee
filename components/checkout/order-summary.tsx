'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, CreditCard } from 'lucide-react';

export function OrderSummary() {
  const { items } = useCartStore();

  // Calculate totals using useMemo to prevent infinite loops
  const { subtotal, shipping, tax, total } = useMemo(() => {
    const subtotal = items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  }, [items]);

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">IMG</span>
              </div>
              <div className="flex-1 min-w-0">
                                 <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                   {item.product.name}
                 </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ${((item.selectedVariant?.price || item.product.price) * item.quantity).toFixed(2)}
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
            <span className="text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="text-gray-900 dark:text-gray-100">
              {shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="text-gray-900 dark:text-gray-100">${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Shipping Info */}
        {shipping === 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Truck className="h-4 w-4" />
            <span>Free shipping on orders over $50</span>
          </div>
        )}

        {/* Payment Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <CreditCard className="h-4 w-4" />
          <span>Secure payment processing</span>
        </div>

        {/* Order Count */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
