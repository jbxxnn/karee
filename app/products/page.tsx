'use client';

import { useState, useEffect } from 'react';
import { ProductList } from '@/components/products/product-list';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { Category } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/layout';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
      
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    // This is now handled by the cart store in ProductCard
    console.log('Product added to cart:', { productId, quantity });
  };

  const handleAddToWishlist = async (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Adding to wishlist:', productId);
    // For now, just show a success message
    alert('Added to wishlist!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={loadData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our amazing collection of products. Use the filters below to find exactly what you're looking for.
          </p>
        </div>

        {/* Product List Component */}
        <ProductList
          products={products}
          categories={categories}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          loading={loading}
        />
      </div>
    </Layout>
  );
}
