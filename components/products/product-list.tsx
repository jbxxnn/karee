'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, ProductImage, Category } from '@/lib/types/database';
import { ProductGrid } from './product-grid';
import { ProductFilters, ProductFilters as ProductFiltersType } from './product-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw, Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductListProps {
  products: (Product & {
    product_images: ProductImage[];
    category?: Category;
  })[];
  categories: Category[];
  onAddToCart?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  loading?: boolean;
  className?: string;
}

export function ProductList({
  products,
  categories,
  onAddToCart,
  onAddToWishlist,
  loading = false,
  className,
}: ProductListProps) {
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'newest',
    inStock: false,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState<1 | 2 | 3 | 4 | 5 | 6>(4);

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

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'newest',
      inStock: false,
    });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    if (mode === 'grid') {
      setColumns(4);
    } else {
      setColumns(1);
    }
  };

  const handleColumnsChange = (newColumns: 1 | 2 | 3 | 4 | 5 | 6) => {
    setColumns(newColumns);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with results count and view controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="rounded-none border-0"
            >
              <Grid3X3 size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="rounded-none border-0"
            >
              <List size={16} />
            </Button>
          </div>

          {/* Grid Columns (only for grid view) */}
          {viewMode === 'grid' && (
            <div className="flex items-center border rounded-lg overflow-hidden">
              {[2, 3, 4, 5, 6].map((col) => (
                <Button
                  key={col}
                  variant={columns === col ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleColumnsChange(col as 1 | 2 | 3 | 4 | 5 | 6)}
                  className="rounded-none border-0 min-w-[40px]"
                >
                  {col}
                </Button>
              ))}
            </div>
          )}

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
      <ProductFilters
        categories={categories}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Products Grid/List */}
      <ProductGrid
        products={filteredProducts}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        columns={columns}
        loading={loading}
        showCategory={true}
        showRating={true}
      />

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
  );
}
