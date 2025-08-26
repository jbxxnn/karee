'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { CartDrawer } from '@/components/cart/cart-drawer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showHeader && <Header />}
      {children}
      <CartDrawer />
    </div>
  );
}
