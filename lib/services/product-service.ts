import { createClient } from '@/lib/supabase/client';
import { Product, ProductImage, Category } from '@/lib/types/database';

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  category?: Category;
}

export class ProductService {
  private supabase = createClient();

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getProducts(): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductsByCategory(categorySlug: string): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async getProductBySlug(slug: string): Promise<ProductWithImages | null> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  }

  async searchProducts(query: string): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getFeaturedProducts(): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  async getBestSellers(): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('is_bestseller', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
  }

  async getRelatedProducts(categoryId: string, excludeProductId: string, limit: number = 4): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .neq('id', excludeProductId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  }

  async getRandomRelatedProduct(categoryId: string, excludeProductId: string): Promise<ProductWithImages | null> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .neq('id', excludeProductId)
        .limit(1);

      if (error) throw error;
      
      // If we have data, randomly select one product
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching random related product:', error);
      return null;
    }
  }

  // Admin Methods
  async getAllProducts(): Promise<ProductWithImages[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<ProductWithImages | null> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  async createProduct(productData: Partial<Product>, images: File[] = []): Promise<Product | null> {
    try {
      // Clean the data - remove empty strings for UUID fields and unique fields
      const cleanedData = { ...productData };
      if (cleanedData.category_id === '') {
        delete cleanedData.category_id;
      }
      if (cleanedData.sku === '') {
        delete cleanedData.sku;
      }
      if (cleanedData.barcode === '') {
        delete cleanedData.barcode;
      }
      
      // First, create the product
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .insert([cleanedData])
        .select()
        .single();

      if (productError) throw productError;

      // Then, upload and create product images
      if (images.length > 0) {
        await this.uploadProductImages(product.id, images);
      }

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    try {
      // Clean the data - remove empty strings for UUID fields and unique fields
      const cleanedData = { ...productData };
      if (cleanedData.category_id === '') {
        delete cleanedData.category_id;
      }
      if (cleanedData.sku === '') {
        delete cleanedData.sku;
      }
      if (cleanedData.barcode === '') {
        delete cleanedData.barcode;
      }
      
      const { data, error } = await this.supabase
        .from('products')
        .update(cleanedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      // First, delete associated product images
      const { error: imagesError } = await this.supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);

      if (imagesError) throw imagesError;

      // Then, delete the product
      const { error: productError } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) throw productError;

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async uploadProductImages(productId: string, images: File[]): Promise<ProductImage[]> {
    try {
      const uploadedImages: ProductImage[] = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `${productId}/${Date.now()}-${i}-${image.name}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await this.supabase.storage
          .from('product-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = this.supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        // Create product image record
        const { data: imageRecord, error: imageError } = await this.supabase
          .from('product_images')
          .insert([{
            product_id: productId,
            image_url: urlData.publicUrl,
            alt_text: image.name,
            is_primary: i === 0, // First image is primary
            sort_order: i
          }])
          .select()
          .single();

        if (imageError) throw imageError;
        uploadedImages.push(imageRecord);
      }

      return uploadedImages;
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw error;
    }
  }

  async deleteProductImage(imageId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  }

  async setPrimaryImage(productId: string, imageId: string): Promise<boolean> {
    try {
      // First, unset all primary images for this product
      const { error: unsetError } = await this.supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      if (unsetError) throw unsetError;

      // Then, set the specified image as primary
      const { error: setError } = await this.supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (setError) throw setError;

      return true;
    } catch (error) {
      console.error('Error setting primary image:', error);
      throw error;
    }
  }

  async getProductStats(): Promise<{
    total: number;
    active: number;
    featured: number;
    outOfStock: number;
  }> {
    try {
      const allProducts = await this.getAllProducts();
      
      return {
        total: allProducts.length,
        active: allProducts.filter(p => p.is_active).length,
        featured: allProducts.filter(p => p.is_featured).length,
        outOfStock: allProducts.filter(p => p.stock_quantity <= 0).length,
      };
    } catch (error) {
      console.error('Error getting product stats:', error);
      return {
        total: 0,
        active: 0,
        featured: 0,
        outOfStock: 0,
      };
    }
  }
}

export const productService = new ProductService();
