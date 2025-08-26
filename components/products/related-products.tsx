'use client';

import { useState, useEffect } from 'react';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
}

export function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
  }, [currentProductId, categoryId]);

  const loadRelatedProducts = async () => {
    try {
      setLoading(true);
      
      let products: ProductWithImages[] = [];
      
      // First try to get products from the same category
      if (categoryId) {
        const categoryProducts = await productService.getProductsByCategory(categoryId);
        products = categoryProducts.filter(p => p.id !== currentProductId).slice(0, 4);
      }
      
      // If not enough products from category, get featured products
      if (products.length < 4) {
        const featuredProducts = await productService.getFeaturedProducts();
        const additionalProducts = featuredProducts
          .filter(p => p.id !== currentProductId && !products.find(rp => rp.id === p.id))
          .slice(0, 4 - products.length);
        products = [...products, ...additionalProducts];
      }
      
      // If still not enough, get best sellers
      if (products.length < 4) {
        const bestSellers = await productService.getBestSellers();
        const additionalProducts = bestSellers
          .filter(p => p.id !== currentProductId && !products.find(rp => rp.id === p.id))
          .slice(0, 4 - products.length);
        products = [...products, ...additionalProducts];
      }
      
      setRelatedProducts(products);
    } catch (error) {
      console.error('Error loading related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">Loading related products...</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          You Might Also Like
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover more products that match your style
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showCategory={true}
            showRating={true}
          />
        ))}
      </div>

      <div className="text-center">
        <Link href="/products">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
}
