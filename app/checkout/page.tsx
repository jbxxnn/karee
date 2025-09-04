'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { Button } from '@/components/ui/button';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from '@/components/ui/disclosure';

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
            <div className="flex justify-end px-4 md:px-8 p-8 py-8 md:py-24">
              <div className="w-full md:w-[70%]">
                <div className="block md:hidden mb-4">
                  <Disclosure>
                    <DisclosureTrigger>
                      <div className="flex items-center justify-between cursor-pointer border border-gray-200 rounded-sm p-2">
                      Order Summary
                      <ChevronDown className="w-4 h-4" />
                      </div>
                    </DisclosureTrigger>
                    <DisclosureContent>
                      <OrderSummary />
                    </DisclosureContent>
                  </Disclosure>
                </div>
              <CheckoutForm />
              </div>
            </div>

            {/* Right Column - Order Summary */}
              <div className="bg-[#f5f5f5] flex justify-start sticky top-8 px-4 md:px-8 p-8 py-8 md:py-24 hidden md:block">
                <div className="w-full md:w-[70%]">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
