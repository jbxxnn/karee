'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number;
}

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariant: { id: string; name: string; price: number } | null;
  onVariantSelect: (variant: { id: string; name: string; price: number }) => void;
}

export function ProductVariants({ variants, selectedVariant, onVariantSelect }: ProductVariantsProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Variant
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock_quantity !== undefined && variant.stock_quantity <= 0;
          
          return (
            <Button
              key={variant.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onVariantSelect(variant)}
              disabled={isOutOfStock}
              className={cn(
                "min-w-[80px]",
                isSelected && "ring-2 ring-blue-200 dark:ring-blue-800",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="text-center">
                <div className="font-medium">{variant.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  ${variant.price.toFixed(2)}
                </div>
                {isOutOfStock && (
                  <div className="text-xs text-red-600">Out of Stock</div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
