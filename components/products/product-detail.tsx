'use client';

import { useState } from 'react';
import { ProductWithImages } from '@/lib/services/product-service';
import { ProductGallery } from './product-gallery';
import { ProductVariants } from './product-variants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  product: ProductWithImages & {
    product_variants?: Array<{
      id: string;
      name: string;
      price: number;
      stock_quantity?: number;
    }>;
    specifications?: Record<string, string | number>;
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const addToCart = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const currentPrice = selectedVariant?.price || product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_price! - currentPrice) / product.compare_price!) * 100)
    : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(product, quantity, selectedVariant || undefined);
      openCart(); // Open cart drawer to show added item
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Left Column - Product Images */}
      <div>
        <ProductGallery images={product.product_images} />
      </div>

      {/* Right Column - Product Info */}
      <div className="space-y-6">
        {/* Category */}
        {product.category && (
          <Badge variant="secondary" className="text-sm">
            {product.category.name}
          </Badge>
        )}

        {/* Product Name */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  "text-gray-300 dark:text-gray-600",
                  i < 4 ? "text-yellow-400 fill-current" : ""
                )}
              />
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            (4.0) • 128 reviews
          </span>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  ${product.compare_price!.toFixed(2)}
                </span>
                <Badge className="bg-red-500 text-white border-0">
                  {discountPercentage}% OFF
                </Badge>
              </>
            )}
          </div>
          {hasDiscount && (
            <p className="text-sm text-green-600 dark:text-green-400">
              You save ${(product.compare_price! - currentPrice).toFixed(2)}!
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.stock_quantity > 0 ? (
            <span className="text-green-600 dark:text-green-400 text-sm">
              ✓ In Stock ({product.stock_quantity} available)
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400 text-sm">
              ✗ Out of Stock
            </span>
          )}
        </div>

        {/* Product Variants */}
        {product.product_variants && product.product_variants.length > 0 && (
          <ProductVariants
            variants={product.product_variants}
            selectedVariant={selectedVariant}
            onVariantSelect={setSelectedVariant}
          />
        )}

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 p-0"
            >
              -
            </Button>
            <span className="w-16 text-center font-medium">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock_quantity}
              className="w-10 h-10 p-0"
            >
              +
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock_quantity <= 0}
            size="lg"
            className="w-full"
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding to Cart...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Add to Cart
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={toggleWishlist}
            size="lg"
            className="w-full"
          >
            <Heart 
              size={20} 
              className={cn(
                "mr-2",
                isWishlisted && "fill-current text-red-500"
              )}
            />
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        </div>

        {/* Product Features */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                30-day money-back guarantee
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Easy returns and exchanges
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {product.description && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Specifications
            </h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
