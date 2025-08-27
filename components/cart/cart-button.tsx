'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import './cart-button.css';

export function CartButton() {
  const { openCart, items } = useCartStore();
  const totalItemsCount = useMemo(() => 
    items.reduce((total, item) => total + item.quantity, 0), 
    [items]
  );

  return (
    <a 
      href="/cart" 
      aria-label="Cart" 
      className="u-p3 header-CartBag relative text-xxs text-brand-black font-pp-mori" 
      data-action="toggle-drawer" 
      data-toggle-id="cart"
      onClick={(e) => {
        e.preventDefault();
        openCart();
      }}
    >
     <span className="font-xs text-brand-black dark:text-brand-cream">cart</span>
      
      <span className="CartCount u-p3 text-brand-black dark:text-brand-cream">({totalItemsCount})</span>
    </a>
  );
}
