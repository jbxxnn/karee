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
}

export const productService = new ProductService();
