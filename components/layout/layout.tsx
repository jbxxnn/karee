'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
