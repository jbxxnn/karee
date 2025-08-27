'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CartButton } from '@/components/cart/cart-button';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-cream dark:bg-gray-900 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative flex items-center justify-between h-16">
          {/* Left Section - Navigation Links (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-pp-mori">
            <Link 
              href="/products" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm"
            >
              shop
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm"
            >
              about us
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm"
            >
              collections
            </Link>
            <Link 
              href="/checkout" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm"
            >
              support
            </Link>
          </nav>

          {/* Center Section - Brand Logo/Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl sm:text-2xl text-gray-900 dark:text-white font-pp-editorial">
                kareè
              </h1>
            </Link>
          </div>

          {/* Right Section - Utility Icons */}
          <div className="flex items-center justify-end space-x-4 sm:space-x-6 ml-auto">
            <CartButton />
            <ThemeSwitcher />
          </div>

        </div>

        {/* Mobile Menu Button - Positioned absolutely for mobile */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden absolute top-4 left-4 p-2 z-10"
          aria-label="Toggle mobile menu"
        >
          <div className={`navbar-hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="navbar-hamburger-line navbar-hamburger-line-1"></div>
            <div className="navbar-hamburger-line navbar-hamburger-line-2"></div>
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div 
          className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
              linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.03) 75%)
            `,
            backgroundSize: '6px 6px'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed bottom-10 left-1/2 transform -translate-x-1/2 h-[60%] w-[90%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out z-50 rounded-lg ${
            isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close mobile menu"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-0.5 bg-current transform rotate-45"></div>
                <div className="w-4 h-0.5 bg-current transform -rotate-45 absolute"></div>
              </div>
            </button>
          </div>

          {/* Menu Content */}
          <nav className="p-6 space-y-6">
            <Link 
              href="/products" 
              className="block text-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              shop
            </Link>
            <Link 
              href="/cart" 
              className="block text-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              about us
            </Link>
            <Link 
              href="/cart" 
              className="block text-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              collections
            </Link>
            <Link 
              href="/checkout" 
              className="block text-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              support
            </Link>
          </nav>

          {/* Menu Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-lg">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© 2024 kareè</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-2" /> */}
    </header>
  );
}
