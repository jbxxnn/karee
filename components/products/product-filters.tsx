'use client';

import { useState } from 'react';
import { Category } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest' | 'rating';
  inStock: boolean;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const defaultFilters: ProductFilters = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 1000,
  sortBy: 'newest',
  inStock: false,
};

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 0 && value !== 1000 && value !== false
  );

  const handleFilterChange = (key: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters(defaultFilters);
    onClearFilters();
  };

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search products..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filters
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X size={16} />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={localFilters.category === '' ? 'default' : 'secondary'}
                className={cn(
                  "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900",
                  localFilters.category === '' && "bg-blue-600 text-white"
                )}
                onClick={() => handleFilterChange('category', '')}
              >
                All Categories
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={localFilters.category === category.id ? 'default' : 'secondary'}
                  className={cn(
                    "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900",
                    localFilters.category === category.id && "bg-blue-600 text-white"
                  )}
                  onClick={() => handleFilterChange('category', category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Price Range: ${localFilters.minPrice} - ${localFilters.maxPrice}
            </Label>
            <Slider
              value={[localFilters.minPrice, localFilters.maxPrice]}
              onValueChange={([min, max]) => {
                handleFilterChange('minPrice', min);
                handleFilterChange('maxPrice', max);
              }}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {/* Sort and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select
                value={localFilters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Availability</Label>
                           <div className="flex items-center space-x-2">
               <input
                 type="checkbox"
                 id="inStock"
                 checked={localFilters.inStock}
                 onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                 className="rounded border-gray-300"
                 aria-label="Show only products in stock"
               />
               <Label htmlFor="inStock" className="text-sm">
                 In Stock Only
               </Label>
             </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
                     {filters.search && (
             <Badge variant="secondary" className="gap-1">
               Search: {filters.search}
               <button
                 onClick={() => handleFilterChange('search', '')}
                 className="ml-1 hover:text-red-600"
                 aria-label={`Remove search filter: ${filters.search}`}
                 title={`Remove search filter: ${filters.search}`}
               >
                 <X size={12} />
               </button>
             </Badge>
           )}
           {filters.category && (
             <Badge variant="secondary" className="gap-1">
               Category: {categories.find(c => c.id === filters.category)?.name}
               <button
                 onClick={() => handleFilterChange('category', '')}
                 className="ml-1 hover:text-red-600"
                 aria-label={`Remove category filter: ${categories.find(c => c.id === filters.category)?.name}`}
                 title={`Remove category filter: ${categories.find(c => c.id === filters.category)?.name}`}
               >
                 <X size={12} />
               </button>
             </Badge>
           )}
           {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
             <Badge variant="secondary" className="gap-1">
               Price: ${filters.minPrice} - ${filters.maxPrice}
               <button
                 onClick={() => {
                   handleFilterChange('minPrice', 0);
                   handleFilterChange('maxPrice', 1000);
                 }}
                 className="ml-1 hover:text-red-600"
                 aria-label="Remove price filter"
                 title="Remove price filter"
               >
                 <X size={12} />
               </button>
             </Badge>
           )}
           {filters.inStock && (
             <Badge variant="secondary" className="gap-1">
               In Stock Only
               <button
                 onClick={() => handleFilterChange('inStock', false)}
                 className="ml-1 hover:text-red-600"
                 aria-label="Remove in stock filter"
                 title="Remove in stock filter"
               >
                 <X size={12} />
               </button>
             </Badge>
           )}
        </div>
      )}
    </div>
  );
}
