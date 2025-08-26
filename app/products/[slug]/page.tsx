'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { ProductDetail } from '@/components/products/product-detail';
import { RelatedProducts } from '@/components/products/related-products';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
          </div>
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
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
        </nav>

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
