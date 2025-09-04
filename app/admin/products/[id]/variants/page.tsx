'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { productVariantService, ProductVariant, ProductAttribute, ProductAttributeValue, CreateVariantData } from '@/lib/services/product-variant-service';
import { productService } from '@/lib/services/product-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

export default function ProductVariantsPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, ProductAttributeValue[]>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateVariantData>({
    product_id: productId,
    sku: '',
    price_adjustment: 0,
    stock_quantity: 0,
    image_url: '',
    weight_grams: 0,
    sort_order: 0,
    attributes: []
  });

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load product details
      const productData = await productService.getProductById(productId);
      if (productData) {
        setProduct(productData);
      }

      // Load variants
      const variantsData = await productVariantService.getProductVariants(productId);
      setVariants(variantsData);

      // Load attributes
      const attributesData = await productVariantService.getProductAttributes();
      setAttributes(attributesData);

      // Load attribute values for each attribute
      const valuesMap: Record<string, ProductAttributeValue[]> = {};
      for (const attr of attributesData) {
        if (attr.id) {
          const values = await productVariantService.getAttributeValues(attr.id);
          valuesMap[attr.id] = values;
        }
      }
      setAttributeValues(valuesMap);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load product variants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVariant = async () => {
    try {
      const newVariant = await productVariantService.createVariant(formData);
      if (newVariant) {
        setVariants([...variants, newVariant]);
        setShowCreateForm(false);
        resetForm();
        toast.success('Variant created successfully!');
      } else {
        toast.error('Failed to create variant');
      }
    } catch (error) {
      console.error('Error creating variant:', error);
      toast.error('Failed to create variant');
    }
  };

  const handleUpdateVariant = async (variantId: string) => {
    if (!variantId || variantId === 'undefined') {
      toast.error('Invalid variant ID');
      return;
    }

    try {
      const updatedVariant = await productVariantService.updateVariant(variantId, formData);
      if (updatedVariant) {
        setVariants(variants.map(v => (v.id || v.variant_id) === variantId ? updatedVariant : v));
        setEditingVariant(null);
        resetForm();
        toast.success('Variant updated successfully!');
      } else {
        toast.error('Failed to update variant');
      }
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!variantId || variantId === 'undefined') {
      toast.error('Invalid variant ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this variant?')) return;

    try {
      const success = await productVariantService.deleteVariant(variantId);
      if (success) {
        setVariants(variants.filter(v => (v.id || v.variant_id) !== variantId));
        toast.success('Variant deleted successfully!');
      } else {
        toast.error('Failed to delete variant');
      }
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: productId,
      sku: '',
      price_adjustment: 0,
      stock_quantity: 0,
      image_url: '',
      weight_grams: 0,
      sort_order: 0,
      attributes: []
    });
  };

  const startEdit = (variant: ProductVariant) => {
    setEditingVariant(variant.id || variant.variant_id || '');
    setFormData({
      product_id: productId,
      sku: variant.sku || '',
      price_adjustment: variant.price_adjustment,
      stock_quantity: variant.stock_quantity,
      image_url: variant.image_url || '',
      weight_grams: variant.weight_grams || 0,
      sort_order: variant.sort_order,
      attributes: variant.attributes?.map(attr => ({
        attribute_id: attributes.find(a => a.name === attr.attribute_name)?.id || '',
        attribute_value_id: attributeValues[attributes.find(a => a.name === attr.attribute_name)?.id || '']?.find(v => v.value === attr.value)?.id || ''
      })) || []
    });
  };

  const addAttributeToForm = (attributeId: string, valueId: string) => {
    const existingIndex = formData.attributes.findIndex(attr => attr.attribute_id === attributeId);
    if (existingIndex >= 0) {
      // Update existing attribute
      const newAttributes = [...formData.attributes];
      newAttributes[existingIndex].attribute_value_id = valueId;
      setFormData({ ...formData, attributes: newAttributes });
    } else {
      // Add new attribute
      setFormData({
        ...formData,
        attributes: [...formData.attributes, { attribute_id: attributeId, attribute_value_id: valueId }]
      });
    }
  };

  const removeAttributeFromForm = (attributeId: string) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter(attr => attr.attribute_id !== attributeId)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product variants...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
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
          <Link href={`/admin/products/${productId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Variants</h1>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingVariant) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingVariant ? 'Edit Variant' : 'Create New Variant'}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingVariant(null);
                  resetForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Variant SKU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price_adjustment}
                  onChange={(e) => setFormData({ ...formData, price_adjustment: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                <Input
                  type="number"
                  value={formData.weight_grams}
                  onChange={(e) => setFormData({ ...formData, weight_grams: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Attributes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attributes</label>
              <div className="space-y-2">
                {attributes.map(attribute => (
                  <div key={attribute.id} className="flex items-center space-x-2">
                    <span className="text-sm font-medium w-24">{attribute.display_name}:</span>
                    <select
                      title={attribute.display_name}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => {
                        if (e.target.value) {
                          addAttributeToForm(attribute.id || '', e.target.value);
                        } else {
                          removeAttributeFromForm(attribute.id || '');
                        }
                      }}
                      value={formData.attributes.find(attr => attr.attribute_id === attribute.id)?.attribute_value_id || ''}
                    >
                      <option value="">Select {attribute.display_name}</option>
                      {attributeValues[attribute.id || '']?.map(value => (
                        <option key={value.id} value={value.id}>
                          {value.display_value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingVariant(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => editingVariant ? handleUpdateVariant(editingVariant) : handleCreateVariant()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingVariant ? 'Update' : 'Create'} Variant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants List */}
      <div className="space-y-4">
        {variants.map((variant) => (
          <Card key={variant.id || variant.variant_id || `variant-${Math.random()}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {variant.sku || `Variant ${(variant.id || variant.variant_id || 'unknown').slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Base Price: ${product.price.toFixed(2)} + ${variant.price_adjustment.toFixed(2)} = ${(product.price + variant.price_adjustment).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={(variant.is_active || variant.variant_active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {(variant.is_active || variant.variant_active) ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        Stock: {variant.stock_quantity}
                      </Badge>
                    </div>
                  </div>

                  {/* Variant Attributes */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Attributes:</p>
                    <div className="flex flex-wrap gap-2">
                      {variant.attributes?.map((attr, index) => (
                        <Badge key={index} variant="outline">
                          {attr.attribute_display}: {attr.display_value}
                          {attr.color_code && (
                            <span 
                              className="ml-2 w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: attr.color_code }}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Variant Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">SKU:</span>
                      <p className="text-gray-900">{variant.sku || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Weight:</span>
                      <p className="text-gray-900">{variant.weight_grams ? `${variant.weight_grams}g` : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Sort Order:</span>
                      <p className="text-gray-900">{variant.sort_order}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Image:</span>
                      <p className="text-gray-900">{(variant.image_url || variant.variant_image) ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(variant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id || variant.variant_id || '')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {variants.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No variants found
            </h3>
            <p className="text-gray-600 mb-4">
              This product doesn&apos;t have any variants yet. Create variants for different sizes, colors, or other attributes.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Variant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
