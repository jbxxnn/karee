import { createClient } from '@/lib/supabase/client';

export interface ProductAttribute {
  id: string;
  name: string;
  display_name: string;
  type: 'text' | 'color' | 'image' | 'number';
  is_required: boolean;
  sort_order: number;
}

export interface ProductAttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  display_value: string;
  color_code?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id?: string; // From direct table query
  variant_id?: string; // From view query
  product_id: string;
  sku?: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
  variant_active?: boolean; // From view query
  variant_combination?: any;
  image_url?: string;
  variant_image?: string; // From view query
  weight_grams?: number;
  sort_order: number;
  attributes?: Array<{
    attribute_name: string;
    attribute_display: string;
    value: string;
    display_value: string;
    color_code?: string;
  }>;
}

export interface CreateVariantData {
  product_id: string;
  sku?: string;
  price_adjustment?: number;
  stock_quantity?: number;
  image_url?: string;
  weight_grams?: number;
  sort_order?: number;
  attributes: Array<{
    attribute_id: string;
    attribute_value_id: string;
  }>;
}

export class ProductVariantService {
  private supabase = createClient();

  // Get all product attributes
  async getProductAttributes(): Promise<ProductAttribute[]> {
    try {
      const { data, error } = await this.supabase
        .from('product_attributes')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      return [];
    }
  }

  // Get attribute values for a specific attribute
  async getAttributeValues(attributeId: string): Promise<ProductAttributeValue[]> {
    try {
      const { data, error } = await this.supabase
        .from('product_attribute_values')
        .select('*')
        .eq('attribute_id', attributeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attribute values:', error);
      return [];
    }
  }

  // Get all variants for a product
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    try {
      const { data, error } = await this.supabase
        .from('product_variants_detailed')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching product variants:', error);
      return [];
    }
  }

  // Get a specific variant by ID
  async getVariantById(variantId: string): Promise<ProductVariant | null> {
    try {
      const { data, error } = await this.supabase
        .from('product_variants_detailed')
        .select('*')
        .eq('variant_id', variantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching variant:', error);
      return null;
    }
  }

  // Create a new product variant
  async createVariant(variantData: CreateVariantData): Promise<ProductVariant | null> {
    try {
      // Clean the data - remove empty strings for unique fields
      const cleanedData = {
        product_id: variantData.product_id,
        name: this.generateVariantNameSync(variantData.attributes), // Generate variant name from attributes
        value: this.generateVariantValue(variantData.attributes), // Generate variant value from attributes
        sku: variantData.sku || undefined,
        price_adjustment: variantData.price_adjustment || 0,
        stock_quantity: variantData.stock_quantity || 0,
        image_url: variantData.image_url || undefined,
        weight_grams: variantData.weight_grams || undefined,
        sort_order: variantData.sort_order || 0,
        variant_combination: this.buildVariantCombination(variantData.attributes)
      };

      // Remove undefined values
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key as keyof typeof cleanedData] === undefined) {
          delete cleanedData[key as keyof typeof cleanedData];
        }
      });

      // Start a transaction
      const { data: variant, error: variantError } = await this.supabase
        .from('product_variants')
        .insert(cleanedData)
        .select()
        .single();

      if (variantError) {
        console.error('Variant creation error:', variantError);
        throw variantError;
      }

      // Insert variant attributes
      if (variantData.attributes.length > 0) {
        const variantAttributes = variantData.attributes.map(attr => ({
          variant_id: variant.id,
          attribute_id: attr.attribute_id,
          attribute_value_id: attr.attribute_value_id
        }));

        const { error: attributesError } = await this.supabase
          .from('product_variant_attributes')
          .insert(variantAttributes);

        if (attributesError) throw attributesError;
      }

      // Return the created variant with full details
      return await this.getVariantById(variant.id);
    } catch (error) {
      console.error('Error creating variant:', error);
      return null;
    }
  }

  // Update a product variant
  async updateVariant(variantId: string, variantData: Partial<CreateVariantData>): Promise<ProductVariant | null> {
    try {
      // Update variant basic info
      const updateData: any = {};
      if (variantData.sku !== undefined) updateData.sku = variantData.sku;
      if (variantData.price_adjustment !== undefined) updateData.price_adjustment = variantData.price_adjustment;
      if (variantData.stock_quantity !== undefined) updateData.stock_quantity = variantData.stock_quantity;
      if (variantData.image_url !== undefined) updateData.image_url = variantData.image_url;
      if (variantData.weight_grams !== undefined) updateData.weight_grams = variantData.weight_grams;
      if (variantData.sort_order !== undefined) updateData.sort_order = variantData.sort_order;

      if (variantData.attributes) {
        updateData.variant_combination = this.buildVariantCombination(variantData.attributes);
      }

      if (Object.keys(updateData).length > 0) {
        const { error: variantError } = await this.supabase
          .from('product_variants')
          .update(updateData)
          .eq('id', variantId);

        if (variantError) throw variantError;
      }

      // Update variant attributes if provided
      if (variantData.attributes) {
        // Delete existing attributes
        await this.supabase
          .from('product_variant_attributes')
          .delete()
          .eq('variant_id', variantId);

        // Insert new attributes
        if (variantData.attributes.length > 0) {
          const variantAttributes = variantData.attributes.map(attr => ({
            variant_id: variantId,
            attribute_id: attr.attribute_id,
            attribute_value_id: attr.attribute_value_id
          }));

          const { error: attributesError } = await this.supabase
            .from('product_variant_attributes')
            .insert(variantAttributes);

          if (attributesError) throw attributesError;
        }
      }

      return await this.getVariantById(variantId);
    } catch (error) {
      console.error('Error updating variant:', error);
      return null;
    }
  }

  // Delete a product variant
  async deleteVariant(variantId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting variant:', error);
      return false;
    }
  }

  // Update variant stock
  async updateVariantStock(variantId: string, stockQuantity: number): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('product_variants')
        .update({ stock_quantity: stockQuantity })
        .eq('id', variantId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating variant stock:', error);
      return false;
    }
  }

  // Get variant combinations for a product (useful for frontend variant selection)
  async getVariantCombinations(productId: string): Promise<{
    attributes: ProductAttribute[];
    combinations: Array<{
      variant_id: string;
      sku?: string;
      price_adjustment: number;
      stock_quantity: number;
      is_active: boolean;
      attributes: Record<string, string>;
    }>;
  }> {
    try {
      const variants = await this.getProductVariants(productId);
      const attributes = await this.getProductAttributes();

      const combinations = variants.map(variant => {
        const variantAttributes: Record<string, string> = {};
        variant.attributes?.forEach(attr => {
          variantAttributes[attr.attribute_name] = attr.value;
        });

        return {
          variant_id: variant.id,
          sku: variant.sku,
          price_adjustment: variant.price_adjustment,
          stock_quantity: variant.stock_quantity,
          is_active: variant.is_active,
          attributes: variantAttributes
        };
      });

      return { attributes, combinations };
    } catch (error) {
      console.error('Error getting variant combinations:', error);
      return { attributes: [], combinations: [] };
    }
  }

  // Helper method to build variant combination JSON
  private buildVariantCombination(attributes: Array<{ attribute_id: string; attribute_value_id: string }>): any {
    // This would typically build a JSON object representing the combination
    // For now, we'll store the attributes array
    return { attributes };
  }

  // Helper method to generate variant name from attributes (synchronous)
  private generateVariantNameSync(attributes: Array<{ attribute_id: string; attribute_value_id: string }>): string {
    if (attributes.length === 0) {
      return 'Default Variant';
    }

    // For now, return a simple name based on the number of attributes
    // The actual attribute names will be populated when the variant is retrieved
    return `Variant ${attributes.length} attributes`;
  }

  // Helper method to generate variant value from attributes (synchronous)
  private generateVariantValue(attributes: Array<{ attribute_id: string; attribute_value_id: string }>): string {
    if (attributes.length === 0) {
      return 'default';
    }

    // For now, return a simple value based on the number of attributes
    // The actual attribute values will be stored in the product_variant_attributes table
    return `variant-${attributes.length}`;
  }
}

export const productVariantService = new ProductVariantService();
