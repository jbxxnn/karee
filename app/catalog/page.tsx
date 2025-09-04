'use client';

import { useState, useEffect, useMemo } from 'react';
import { productService, ProductWithImages } from '@/lib/services/product-service';
// import { Category } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { AlertCircle, Grid3X3, List, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/layout';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { 
  // ProductFilters, 
  ProductFilters as ProductFiltersType } from '@/components/catalog/product-filters';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/stores/cart-store';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bento' | 'grid'>('bento');
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 100000, // Increased from 1000 to accommodate higher prices
    sortBy: 'newest',
    inStock: false,
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  const addToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      
      // const categoriesData = await productService.getCategories();
      // setCategories(categoriesData);
      
      const productsData = await productService.getProducts();
      setProducts(productsData);

      // Wait for data to load, then continue countdown to 100
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
      console.error('Error loading data:', err);
      setError('Failed to load products. Please try again.');
      setLoading(false); // Only set loading to false on error
    }
    // Remove the finally block - loading will be set to false by the animation complete handler
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.short_description?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category?.id === filters.category);
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        // For now, we'll sort by name since we don't have ratings yet
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, filters]);

  // const handleFiltersChange = (newFilters: ProductFiltersType) => {
  //   setFilters(newFilters);
  // };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 100000, // Keep the higher max price
      sortBy: 'newest',
      inStock: false,
    });
  };

  const handleAddToCart = (product: ProductWithImages) => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = async (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Adding to wishlist:', productId);
    // For now, just show a success message
    alert('Added to wishlist!');
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
      <div className="container mx-auto px-4 py-[10rem]">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl italic font-pp-editorial text-gray-900 dark:text-gray-100 mb-4">
            Our Products
          </h1>
        </div>

        {/* Header with results count and view controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Products
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'bento' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('bento')}
                className="rounded-none border-0"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none border-0"
              >
                <List size={16} />
              </Button>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        {/* <ProductFilters
          categories={categories}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        /> */}

        {/* Products Display */}
        {viewMode === 'bento' ? (
          <BentoGrid className="w-full px-0 md:px-6 lg:px-6 mt-8">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className={`${i % 6 === 4 || i % 6 === 6 ? "md:col-span-2" : ""} h-full`}>
                <Link href={`/products/${product.slug}`} className="block h-full">
                  <BentoGridItem
                    title={product.name}
                    price={`₦${product.price.toFixed(2)}`}
                    short_description={product.short_description}
                    header={
                      <ProductHeader 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        isLarge={i % 6 === 4 || i % 6 === 6}
                      />
                    }
                    className="h-full [&_.text-brand-cream]:text-brand-black cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                  />
                </Link>
              </div>
            ))}
          </BentoGrid>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No products match your criteria
            </div>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Product Header Component (same as in product-home.tsx)
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
    <div className="relative w-full flex-1 group cursor-pointer">
      {/* Product Image */}
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

      {/* Discount Badge */}
      {hasDiscount && (
        <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 z-10">
          {Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}% OFF
        </Badge>
      )}

      {/* Stock Status */}
      {product.stock_quantity <= 0 && (
        <Badge className="absolute top-3 right-3 bg-gray-500 text-white border-0 z-10">
          Out of Stock
        </Badge>
      )}
    </div>
  );
};

// Simple Product Card for Grid View
const ProductCard = ({ 
  product, 
  onAddToCart, 
  // onAddToWishlist 
}: { 
  product: ProductWithImages; 
  onAddToCart: (product: ProductWithImages) => void;
  onAddToWishlist: (productId: string) => void;
}) => {
  const primaryImage = product.product_images.find(img => img.is_primary) || product.product_images[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div className="group cursor-pointer">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-800 text-gray-400">
              <span>No Image</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
              {Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}% OFF
            </Badge>
          )}

          {/* Stock Status */}
          {product.stock_quantity <= 0 && (
            <Badge className="absolute top-2 right-2 bg-gray-500 text-white border-0">
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {product.short_description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            ₦{product.price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            disabled={product.stock_quantity <= 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
