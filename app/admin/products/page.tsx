'use client';

import { useState, useEffect } from 'react';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.is_active) ||
                         (filterStatus === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        toast.success('Product deleted successfully!');
        await loadProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.is_featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock_quantity <= 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const primaryImage = product.product_images.find(img => img.is_primary) || product.product_images[0];
          
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      SKU: {product.sku || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {product.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    {product.is_bestseller && (
                      <Badge variant="secondary" className="text-xs">
                        Best Seller
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Product Image */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.image_url}
                      alt={primaryImage.alt_text || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={product.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm text-gray-600">
                      Stock: {product.stock_quantity}
                    </span>
                  </div>
                  
                  {product.short_description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                  
                  {product.category && (
                    <p className="text-xs text-gray-500">
                      Category: {product.category.name}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'
              }
            </p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
