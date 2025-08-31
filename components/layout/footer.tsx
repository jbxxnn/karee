'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-black dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 py-12">
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-2 justify-center">
          <p className="text-[8px] md:text-xs uppercase font-ultrabold text-brand-cream text-start">
          Nourish Your Skin, <br /> Naturally.
          </p>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <h2 className="text-2xl md:text-6xl text-brand-cream text-center">
            Kareè
          </h2>
        </div>
        <div className="flex flex-col gap-2 justify-center">
        <p className="text-[8px] md:text-xs uppercase font-ultrabold text-brand-cream text-end">
        Suitable for All <br /> Skin Types
          </p>
        </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-brand-cream">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6 justify-center">
              <Link 
                href="/privacy" 
                className="text-[8px] md:text-xs uppercase font-ultrabold text-brand-cream dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Cookies
              </Link>
              <Link 
                href="/privacy" 
                className="text-[8px] md:text-xs uppercase font-ultrabold text-brand-cream dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Terms and Conditions
              </Link>
              <Link 
                href="/terms" 
                className="text-[8px] md:text-xs uppercase font-ultrabold text-brand-cream dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
               Shipping and Returns
              </Link>
            </div>
            <div className="text-[8px] md:text-xs uppercase font-ultrabold text-brand-cream dark:text-gray-400">
              <p>© 2025 kareè. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
