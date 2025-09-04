'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/lib/services/product-service';
import { productVariantService } from '@/lib/services/product-variant-service';
import ProductVariantSelector from '@/components/catalog/product-variant-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TestVariantsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant: any, finalPrice: number) => {
    console.log('Selected variant:', variant);
    console.log('Final price:', finalPrice);
  };

  const handleAddToCart = (variant: any, quantity: number) => {
    console.log('Adding to cart:', { variant, quantity });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Product Variants</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-colors ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="outline">
                      {product.product_variants?.length || 0} variants
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Variant Selector */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Variant Selector</h2>
          {selectedProduct ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedProduct.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Base Price: ${selectedProduct.price.toFixed(2)}
                  </p>
                </CardHeader>
                <CardContent>
                  <ProductVariantSelector
                    productId={selectedProduct.id}
                    basePrice={selectedProduct.price}
                    onVariantSelect={handleVariantSelect}
                    onAddToCart={handleAddToCart}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Select a product to test variants</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


