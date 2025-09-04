import { createClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/lib/types/database';

export class UserService {
  private supabase = createClient();

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  async isAdmin(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .rpc('is_user_admin');

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  async getUserRole(): Promise<UserRole | null> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_user_role');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({ role })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  }

  async getDashboardStats() {
    try {
      const { data, error } = await this.supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        total_products: 0,
        pending_orders: 0,
        total_customers: 0,
        total_revenue: 0
      };
    }
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,user_id.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }
  }
}

export const userService = new UserService();
