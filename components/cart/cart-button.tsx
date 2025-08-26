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
      className="u-p3 header-CartBag relative text-xxs" 
      data-action="toggle-drawer" 
      data-toggle-id="cart"
      onClick={(e) => {
        e.preventDefault();
        openCart();
      }}
    >
      {/* <svg 
        className="Svg Svg--bag" 
        width="20" 
        height="20" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M13.12 4.48H2.88V14.08H13.12V4.48Z" 
          stroke="black" 
          strokeWidth="0.9" 
          strokeMiterlimit="10"
        />
        <path 
          d="M11.2 4.48V1.92H4.8V4.48" 
          stroke="black" 
          strokeWidth="0.9" 
          strokeMiterlimit="10"
        />
      </svg> */}
      {/* <span className="font-family: Phosphor,sans-serif !important; font-style: normal !important; font-weight: 300 !important; font-size: 13px !important; line-height: 18.23px !important; letter-spacing: 0.13px !important; color: #A59F94 !important;">cart</span> */}
      <span className="font-xs">cart</span>
      
      <span className="CartCount u-p3">({totalItemsCount})</span>
    </a>
  );
}
