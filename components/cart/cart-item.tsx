'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/stores/cart-store';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const primaryImage = item.product.product_images.find(img => img.is_primary) || item.product.product_images[0];
  const price = item.selectedVariant?.price || item.product.price;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === item.quantity) return;
    
    setIsUpdating(true);
    try {
      onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex items-start gap-4 p-6 border-b border-gray-200 last:border-b-0 transition-all duration-200 hover:bg-gray-50">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={item.product.name}
            fill
            className="object-cover rounded-md border border-gray-200"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md border border-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details & Actions */}
      <div className="flex-1 min-w-0">
        {/* Product Name & Description */}
        <div className="mb-4">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">
            {item.product.name}
          </h4>
          
          {item.product.short_description && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {item.product.short_description}
            </p>
          )}
          
          {item.selectedVariant && (
            <p className="text-xs text-gray-600">
              Variant: {item.selectedVariant.name}
            </p>
          )}
        </div>

        {/* Quantity Selector & Price Row */}
        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-none">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-8 h-8 text-brand-black flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            
            <span className="w-12 h-8 bg-white text-center font-medium text-gray-900 flex items-center justify-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 text-brand-black flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Individual Price */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ₦{price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleRemove}
        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200 flex-shrink-0"
        aria-label="Remove item from cart"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
