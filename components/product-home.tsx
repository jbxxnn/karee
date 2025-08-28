'use client';

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ProductWithImages } from "@/lib/services/product-service";
import { ProductService } from "@/lib/services/product-service";
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
// import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';

export function ProductHome() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const productService = new ProductService();
        const fetchedProducts = await productService.getProducts();
        // Take the latest 3 products for the bento grid
        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const handleAddToCart = (product: ProductWithImages) => {
    addToCart(product, 1);
  };

  if (loading) {
    return (
      <BentoGrid className="w-full px-0 md:px-6 lg:px-6">
        {[...Array(4)].map((_, i) => (
          <BentoGridItem
            key={i}
            title=""
            price=""
            short_description=""
            header={<ProductSkeleton />}
            className={i === 4 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    );
  }

  return (
    <BentoGrid className="w-full px-0 md:px-6 lg:px-6">
      {products.map((product, i) => (
        <BentoGridItem
          key={product.id}
          title={product.name}
          price={`₦${product.price.toFixed(2)}`}
          short_description={product.short_description}
          header={
            <ProductHeader 
              product={product} 
              onAddToCart={handleAddToCart}
              isLarge={i === 4 || i === 6}
            />
          }
          className={i === 4 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const ProductHeader = ({ 
  product, 
  // onAddToCart, 
  isLarge 
}: { 
  product: ProductWithImages; 
  onAddToCart: (product: ProductWithImages) => void;
  isLarge: boolean;
}) => {
  const primaryImage = product.product_images.find(img => img.is_primary) || product.product_images[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div className="relative w-full h-full group cursor-pointer">
      {/* Product Image - Clickable Link */}
      <Link href={`/products/${product.slug}`} className="block w-full h-full">
        <div className="relative w-full h-full overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-800 text-gray-400">
              <span>No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button - Positioned outside Link to avoid conflicts */}
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="absolute top-3 right-3 p-2 bg-brand-cream text-brand-black hover:bg-brand-secondary rounded-full transition-colors pointer-events-auto z-10"
        aria-label="Add to cart"
      >
        <ShoppingCart size={20} />
      </button> */}

      {/* Discount Badge */}
      {hasDiscount && (
        <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 z-10">
          {Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}% OFF
        </Badge>
      )}

      {/* Stock Status */}
      {product.stock_quantity <= 0 && (
        <Badge className="absolute top-3 right-16 bg-gray-500 text-white border-0 z-10">
          Out of Stock
        </Badge>
      )}
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse"></div>
);
