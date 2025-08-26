'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const totalPrice = price * item.quantity;

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
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={item.product.name}
            fill
            className="object-cover rounded-md"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {item.product.name}
        </h4>
        
        {item.selectedVariant && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Variant: {item.selectedVariant.name}
          </p>
        )}
        
        {item.product.category && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {item.product.category.name}
          </p>
        )}
        
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="w-8 h-8 p-0"
        >
          <Minus size={16} />
        </Button>
        
        <span className="w-12 text-center font-medium">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="w-8 h-8 p-0"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Total Price */}
      <div className="text-right min-w-[80px]">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${totalPrice.toFixed(2)}
        </p>
        {item.quantity > 1 && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            ${price.toFixed(2)} each
          </p>
        )}
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        aria-label="Remove item from cart"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
}
