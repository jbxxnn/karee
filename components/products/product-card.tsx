'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductImage, Category } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart-store';

interface ProductCardProps {
  product: Product & {
    product_images: ProductImage[];
    category?: Category;
  };
  onAddToCart?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  className?: string;
  showCategory?: boolean;
  showRating?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  className,
  showCategory = true,
  showRating = true,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addToCart = useCartStore(state => state.addItem);

  const primaryImage = product.product_images.find(img => img.is_primary) || product.product_images[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add to cart store
      addToCart(product, 1);
      
      // Also call the optional callback if provided
      if (onAddToCart) {
        await onAddToCart(product.id, 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!onAddToWishlist) return;
    
    try {
      await onAddToWishlist(product.id);
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      "border-0 shadow-sm bg-white dark:bg-gray-900",
      className
    )}>
      <CardHeader className="p-0 relative">
        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            {primaryImage ? (
              <Image
                src={primaryImage.image_url}
                alt={primaryImage.alt_text || product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span>No Image</span>
              </div>
            )}
          </div>
        </Link>
          
          {/* Wishlist Button */}
          {onAddToWishlist && (
            <button
              onClick={handleAddToWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full transition-all duration-200",
                "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
                "hover:bg-white dark:hover:bg-gray-900",
                "shadow-sm hover:shadow-md",
                isWishlisted 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-gray-600 hover:text-red-500"
              )}
            >
              <Heart 
                size={18} 
                className={cn(
                  "transition-all duration-200",
                  isWishlisted && "fill-current"
                )}
              />
            </button>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
              {Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}% OFF
            </Badge>
          )}

          {/* Stock Status */}
          {product.stock_quantity <= 0 && (
            <Badge className="absolute bottom-2 left-2 bg-gray-500 text-white border-0">
              Out of Stock
            </Badge>
          )}
        </CardHeader>

      <CardContent className="p-4 pb-2">
        {/* Category */}
        {showCategory && product.category && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="block group">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    "text-gray-300 dark:text-gray-600",
                    i < 4 ? "text-yellow-400 fill-current" : ""
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              (4.0)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.compare_price!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {product.short_description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || product.stock_quantity <= 0}
          className={cn(
            "w-full transition-all duration-200",
            product.stock_quantity <= 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} />
              {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
