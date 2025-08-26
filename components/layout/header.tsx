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

        {/* Mobile Menu Overlay */}
        <div 
          className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed top-0 left-0 h-full w-[90%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© 2024 kareè</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
