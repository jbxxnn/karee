'use client';

import { Product, ProductImage, Category } from '@/lib/types/database';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: (Product & {
    product_images: ProductImage[];
    category?: Category;
  })[];
  onAddToCart?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  showCategory?: boolean;
  showRating?: boolean;
  loading?: boolean;
}

export function ProductGrid({
  products,
  onAddToCart,
  onAddToWishlist,
  className,
  columns = 4,
  showCategory = true,
  showRating = true,
  loading = false,
}: ProductGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
  };

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        gridCols[columns],
        className
      )}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          No products found
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[columns],
      className
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          showCategory={showCategory}
          showRating={showRating}
        />
      ))}
    </div>
  );
}
