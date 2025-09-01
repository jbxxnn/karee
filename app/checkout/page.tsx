'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const totalItemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0), 
    [items]
  );
  // const [isLoading, setIsLoading] = useState(false);

  // If cart becomes empty, send user back to products (not cart)
  useEffect(() => {
    if (totalItemsCount === 0) {
      router.push('/products');
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

      <div className="container mx-auto bg-white">
        <div className="w-full mx-auto">
          {/* Page Title */}

          {/* Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="flex justify-end p-8">
              <div className="w-[70%]">
              <CheckoutForm />
              </div>
            </div>

            {/* Right Column - Order Summary */}
              <div className="bg-[#f5f5f5] flex justify-start sticky top-8 p-8">
                <div className="w-[70%]">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
