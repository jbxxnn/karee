'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const totalItemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0), 
    [items]
  );
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (totalItemsCount === 0) {
      router.push('/cart');
    }
  }, [totalItemsCount, router]);

  if (totalItemsCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add some items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Back to Cart Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/cart">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Checkout
            </h1>
            <p className="text-gray-400">
              Complete your purchase securely
            </p>
          </div>

          {/* Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
