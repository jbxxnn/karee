'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CartButton } from '@/components/cart/cart-button';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle mobile menu"

          >
            <div className={`navbar-hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <div className="navbar-hamburger-line navbar-hamburger-line-1"></div>
              <div className="navbar-hamburger-line navbar-hamburger-line-2"></div>
            </div>
          </button>

          {/* Left Section - Navigation Links (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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
          <div className="flex-1 flex justify-center lg:flex-none lg:justify-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl text-gray-900 dark:text-white">
                kareè
              </h1>
            </Link>
          </div>

          {/* Right Section - Utility Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <CartButton />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
            <nav className="py-4 space-y-3">
              <Link 
                href="/products" 
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                shop
              </Link>
              <Link 
                href="/cart" 
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                about us
              </Link>
              <Link 
                href="/cart" 
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                collections
              </Link>
              <Link 
                href="/checkout" 
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                support
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
