'use client';

import { Cart } from '@/components/cart/cart';
import { Layout } from '@/components/layout/layout';

export default function CartPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Cart />
      </div>
    </Layout>
  );
}
