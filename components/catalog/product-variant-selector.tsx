'use client';

import { useState, useEffect } from 'react';
import { productVariantService, ProductVariant, ProductAttribute } from '@/lib/services/product-variant-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

interface ProductVariantSelectorProps {
  productId: string;
  basePrice: number;
  onVariantSelect?: (variant: ProductVariant | null, finalPrice: number) => void;
  onAddToCart?: (variant: ProductVariant, quantity: number) => void;
  onVariantsLoaded?: (hasVariants: boolean) => void;
}

interface SelectedAttributes {
  [attributeName: string]: string;
}

export default function ProductVariantSelector({
  productId,
  basePrice,
  onVariantSelect,
  onAddToCart,
  onVariantsLoaded
}: ProductVariantSelectorProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttributes>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVariants();
  }, [productId]);

  const loadVariants = async () => {
    try {
      setLoading(true);
      const variantsData = await productVariantService.getProductVariants(productId);
      const attributesData = await productVariantService.getProductAttributes();
      
      setVariants(variantsData);
      setAttributes(attributesData);
      
      // Notify parent about variants status
      onVariantsLoaded?.(variantsData.length > 0);
      
      // Auto-select first variant if available
      if (variantsData.length > 0) {
        const firstVariant = variantsData[0];
        setSelectedVariant(firstVariant);
        onVariantSelect?.(firstVariant, basePrice + firstVariant.price_adjustment);
      }
    } catch (error) {
      console.error('Error loading variants:', error);
      toast.error('Failed to load product variants');
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeName]: value
    };
    
    setSelectedAttributes(newSelectedAttributes);
    
    // Find matching variant
    const matchingVariant = variants.find(variant => {
      if (!variant.attributes) return false;
      
      return variant.attributes.every(attr => {
        const selectedValue = newSelectedAttributes[attr.attribute_name];
        return selectedValue && attr.value === selectedValue;
      });
    });
    
    setSelectedVariant(matchingVariant || null);
    
    if (matchingVariant) {
      const finalPrice = basePrice + matchingVariant.price_adjustment;
      onVariantSelect?.(matchingVariant, finalPrice);
    } else {
      onVariantSelect?.(null, basePrice);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    
    if (selectedVariant.stock_quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    
    onAddToCart?.(selectedVariant, quantity);
  };

  const getAvailableValues = (attributeName: string) => {
    const availableValues = new Set<string>();
    
    variants.forEach(variant => {
      if (variant.attributes) {
        variant.attributes.forEach(attr => {
          if (attr.attribute_name === attributeName) {
            availableValues.add(attr.value);
          }
        });
      }
    });
    
    return Array.from(availableValues);
  };

  const isValueAvailable = (attributeName: string, value: string) => {
    const currentSelection = { ...selectedAttributes };
    currentSelection[attributeName] = value;
    
    return variants.some(variant => {
      if (!variant.attributes) return false;
      
      return variant.attributes.every(attr => {
        const selectedValue = currentSelection[attr.attribute_name];
        return !selectedValue || attr.value === selectedValue;
      });
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (variants.length === 0) {
    return null; // No variants to display
  }

  const finalPrice = selectedVariant ? basePrice + selectedVariant.price_adjustment : basePrice;
  const isOutOfStock = selectedVariant ? selectedVariant.stock_quantity === 0 : false;

  return (
    <div className="w-full space-y-6">
        {/* Variant Selection */}
        <div className="space-y-4">
          {attributes.map(attribute => {
            const availableValues = getAvailableValues(attribute.name);
            
            if (availableValues.length === 0) return null;
            
            return (
              <div key={attribute.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {attribute.display_name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableValues.map(value => {
                    const isSelected = selectedAttributes[attribute.name] === value;
                    const isAvailable = isValueAvailable(attribute.name, value);
                    
                    return (
                      <Button
                        key={value}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        disabled={!isAvailable}
                        onClick={() => handleAttributeChange(attribute.name, value)}
                        className={`min-w-[80px] ${
                          !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {value}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Variant Info */}
        {selectedVariant && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Selected Variant:</span>
              <div className="flex flex-wrap gap-1">
                {selectedVariant.attributes?.map((attr, index) => (
                  <Badge key={index} variant="secondary">
                    {attr.attribute_display}: {attr.display_value}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Stock:</span>
              <span className={`text-sm ${selectedVariant.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedVariant.stock_quantity > 0 ? `${selectedVariant.stock_quantity} available` : 'Out of stock'}
              </span>
            </div>
          </div>
        )}

        {/* Price Display */}
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Price:</span>
          <span className="text-2xl text-green-600">
            ${finalPrice.toFixed(2)}
            {selectedVariant && selectedVariant.price_adjustment !== 0 && (
              <span className="text-sm text-gray-500 ml-2">
                (Base: ${basePrice.toFixed(2)} + ${selectedVariant.price_adjustment.toFixed(2)})
              </span>
            )}
          </span>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-r-none border-r-0"
              >
                -
              </Button>
              <span className="px-3 py-1 text-sm min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={selectedVariant ? quantity >= selectedVariant.stock_quantity : false}
                className="rounded-l-none border-l-0"
              >
                +
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isOutOfStock}
            className="flex-1"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>

        {/* Error Messages */}
        {!selectedVariant && Object.keys(selectedAttributes).length > 0 && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            This combination is not available. Please select different options.
          </div>
        )}
    </div>
  );
}
