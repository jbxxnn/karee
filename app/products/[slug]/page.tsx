'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { ProductDetail } from '@/components/catalog/product-detail';
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
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      // Start the countdown from 0 to 90
      const countTo90 = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(countTo90);
            return 90;
          }
          return prev + 5;
        });
      }, 150); // Slower countdown
      
      console.log('🔍 Loading product with slug:', slug);
      const productData = await productService.getProductBySlug(slug);
      console.log('📦 Product data loaded:', productData);
      
      if (!productData) {
        setError('Product not found');
        return;
      }
      
      // Set product data
      setProduct(productData);
      
      // Wait a moment, then continue countdown to 100
      setTimeout(() => {
                 const countTo100 = setInterval(() => {
           setLoadingProgress(prev => {
             if (prev >= 100) {
               clearInterval(countTo100);
               return 100;
             }
             return prev + 1;
           });
         }, 80); // Slower final countdown
      }, 300);
      
    } catch (err) {
      console.error('❌ Error loading product:', err);
      setError('Failed to load product. Please try again.');
      setLoading(false); // Only set loading to false on error
    }
    // Remove the finally block - loading will be set to false by the animation complete handler
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          {/* Loading Percentage Counter */}
          <motion.div
            className="text-9xl md:text-[12rem] font-light text-brand-black mb-4 font-pp-mori"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loadingProgress}
          </motion.div>
          
          {/* Subtle Loading Indicator */}
          <motion.div
            className="w-3 h-3 border border-gray-400 rounded-full mx-auto opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          
          {/* Fade Effect when loading completes */}
          {loadingProgress === 100 && (
            <motion.div
              className="fixed inset-0 bg-brand-cream z-50"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              onAnimationComplete={() => {
                setLoading(false);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-brand-black dark:text-gray-100 mb-2">
              {error || 'Product not found'}
            </h2>
            <p className="text-brand-black dark:text-gray-400 mb-4">
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
        {/* Product Detail */}
        <ProductDetail product={product} />
      </div>
    </Layout>
  );
}
