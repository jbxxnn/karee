'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productService, ProductWithImages } from '@/lib/services/product-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  // Upload,
  // X,
  Package,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { categoryService } from '@/lib/services/category-service';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [categories, setCategories] = useState<Array<{id: string; name: string}>>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: 0,
    compare_price: 0,
    cost_price: 0,
    sku: '',
    barcode: '',
    weight_grams: 0,
    stock_quantity: 0,
    low_stock_threshold: 5,
    brand: '',
    is_active: true,
    is_featured: false,
    is_bestseller: false,
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
    category_id: '',
  });

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
    loadCategories();
  }, [productId]);

  const loadCategories = async () => {
    try {
      const activeCategories = await categoryService.getActiveCategories();
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProductById(productId);
      if (productData) {
        setProduct(productData);
        setFormData({
          name: productData.name || '',
          slug: productData.slug || '',
          description: productData.description || '',
          short_description: productData.short_description || '',
          price: productData.price || 0,
          compare_price: productData.compare_price || 0,
          cost_price: productData.cost_price || 0,
          sku: productData.sku || '',
          barcode: productData.barcode || '',
          weight_grams: productData.weight_grams || 0,
          stock_quantity: productData.stock_quantity || 0,
          low_stock_threshold: productData.low_stock_threshold || 5,
          brand: productData.brand || '',
          is_active: productData.is_active || false,
          is_featured: productData.is_featured || false,
          is_bestseller: productData.is_bestseller || false,
          meta_title: productData.meta_title || '',
          meta_description: productData.meta_description || '',
          tags: productData.tags || [],
          category_id: productData.category_id || '',
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Update the product
      const updatedProduct = await productService.updateProduct(productId, formData);
      
      if (updatedProduct) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/admin/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/products/${productId}/variants`}>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Manage Variants
            </Button>
          </Link>
          <Badge variant={product.is_active ? "default" : "secondary"}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {product.is_featured && <Badge variant="secondary">Featured</Badge>}
          {product.is_bestseller && <Badge variant="secondary">Best Seller</Badge>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="product-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    placeholder="Brief description for product cards"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed product description"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="compare_price">Compare Price</Label>
                    <Input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      value={formData.compare_price}
                      onChange={(e) => handleInputChange('compare_price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => handleInputChange('cost_price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) => handleInputChange('low_stock_threshold', parseInt(e.target.value) || 5)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight_grams">Weight (grams)</Label>
                    <Input
                      id="weight_grams"
                      type="number"
                      value={formData.weight_grams}
                      onChange={(e) => handleInputChange('weight_grams', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO & Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO description for search engines"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.product_images.length > 0 ? (
                  <div className="space-y-2">
                    <Label>Current Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.product_images.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.image_url}
                            alt={image.alt_text || product.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <div className="absolute top-1 right-1">
                            {image.is_primary && (
                              <Badge variant="secondary" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No images uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => handleInputChange('is_bestseller', checked)}
                  />
                  <Label htmlFor="is_bestseller">Best Seller</Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
