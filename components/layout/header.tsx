'use client';

import Link from 'next/link';
import { CartButton } from '@/components/cart/cart-button';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Header() {
  return (
    <header className="w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-3 items-center justify-between h-16">
          {/* Left Section - Navigation Links */}
          <nav className="flex items-center space-x-8">
            <Link 
              href="/products" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              shop
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              about us
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              collections
            </Link>
            <Link 
              href="/checkout" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              support
            </Link>
          </nav>

          {/* Center Section - Brand Logo/Title */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl text-gray-900 dark:text-white">
                kareè
              </h1>
            </Link>
          </div>

          {/* Right Section - Utility Icons */}
          <div className="flex items-center justify-end space-x-6">
            <CartButton />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
