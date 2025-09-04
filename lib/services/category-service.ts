import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/types/database';

export class CategoryService {
  private supabase = createClient();

  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  }

  async getActiveCategories(): Promise<Category[]> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active categories:', error);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return null;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Check if category has products
      const { data: products, error: productsError } = await this.supabase
        .from('products')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (productsError) throw productsError;

      if (products && products.length > 0) {
        throw new Error('Cannot delete category that has products');
      }

      const { error } = await this.supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async getCategoryStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const allCategories = await this.getAllCategories();
      
      return {
        total: allCategories.length,
        active: allCategories.filter(c => c.is_active).length,
        inactive: allCategories.filter(c => !c.is_active).length,
      };
    } catch (error) {
      console.error('Error getting category stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
      };
    }
  }
}

export const categoryService = new CategoryService();




