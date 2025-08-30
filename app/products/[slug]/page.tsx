'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { ProductDetail } from '@/components/products/product-detail';
import { RelatedProducts } from '@/components/products/related-products';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading product with slug:', slug);
      const productData = await productService.getProductBySlug(slug);
      console.log('📦 Product data loaded:', productData);
      
      if (!productData) {
        setError('Product not found');
        return;
      }
      
      setProduct(productData);
    } catch (err) {
      console.error('❌ Error loading product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-col lg:flex-row gap-0 mb-12 items-start pl-0 pt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Image Gallery Skeleton */}
            <div className="lg:w-[63%] space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg" />
              <div className="flex gap-4">
                <div className="w-[65%] aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                <div className="w-[35%] flex flex-col gap-4">
                  <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                  <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="lg:w-[37%] lg:sticky lg:top-0">
              <div className="p-[4rem] pt-[10rem] space-y-6">
                <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-3/4" />
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-full" />
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {error || 'Product not found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <div className="space-y-2">
              <Button onClick={loadProduct} variant="outline" className="w-full">
                Try Again
              </Button>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mx-auto">
        {/* Breadcrumb */}
        {/* <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-brand-black dark:text-brand-black">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-gray-900 dark:hover:text-gray-100">
                Products
              </Link>
            </li>
            {product.category && (
              <>
                <li>/</li>
                <li>
                  <Link 
                    href={`/products?category=${product.category.slug}`}
                    className="hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 dark:text-gray-100 font-medium">
              {product.name}
            </li>
          </ol>
        </nav> */}

        {/* Product Detail */}
        <ProductDetail product={product} />

        {/* Related Products */}
        <RelatedProducts 
          currentProductId={product.id}
          categoryId={product.category?.id}
        />
      </div>
    </Layout>
  );
}
