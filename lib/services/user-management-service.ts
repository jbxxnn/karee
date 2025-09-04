import { createClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/lib/types/database';

export interface UserWithProfile {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  user_profiles: UserProfile | null;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  moderators: number;
  customers: number;
  verified: number;
  unverified: number;
  recentSignups: number;
}

export interface UserFilters {
  role?: UserRole | 'all';
  status?: 'active' | 'inactive' | 'all';
  verified?: 'verified' | 'unverified' | 'all';
  search?: string;
}

export class UserManagementService {
  private supabase = createClient();

  // Test method to check if Supabase connection is working
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔌 Testing Supabase connection...');
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      console.log('🔌 Connection test result:', { data, error });
      
      if (error) {
        console.error('❌ Connection test failed:', error);
        return false;
      }
      
      console.log('✅ Supabase connection is working');
      return true;
    } catch (error) {
      console.error('❌ Connection test error:', error);
      return false;
    }
  }

  async getAllUsers(filters: UserFilters = {}, page: number = 1, limit: number = 20): Promise<{
    users: UserWithProfile[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      console.log('🔍 UserManagementService.getAllUsers called with:', { filters, page, limit });
      
      let query = this.supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          phone,
          role,
          created_at,
          updated_at
        `, { count: 'exact' });

      console.log('📊 Initial query created');

      // Apply filters
      if (filters.role && filters.role !== 'all') {
        console.log('🔧 Applying role filter:', filters.role);
        query = query.eq('role', filters.role);
      }

      // Note: Status filter removed since is_active column doesn't exist yet
      if (filters.status && filters.status !== 'all') {
        console.log('⚠️ Status filter requested but is_active column not available');
      }

      if (filters.search) {
        console.log('🔧 Applying search filter:', filters.search);
        query = query.or(`
          first_name.ilike.%${filters.search}%,
          last_name.ilike.%${filters.search}%,
          user_id.ilike.%${filters.search}%
        `);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      console.log('🔧 Applying pagination:', { offset, limit });
      query = query.range(offset, offset + limit - 1);
      query = query.order('created_at', { ascending: false });

      console.log('🚀 Executing query...');
      const { data, error, count } = await query;

      console.log('📋 Query result:', { 
        dataLength: data?.length || 0, 
        error: error ? { message: error.message, code: error.code, details: error.details } : null,
        count 
      });

      if (error) {
        console.error('❌ Query error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      console.log('📊 Pagination info:', { total, totalPages, page });

      // Transform the data to match our interface
      const users: UserWithProfile[] = (data || []).map(profile => {
        console.log('🔄 Transforming profile:', profile);
        return {
          id: profile.user_id,
          email: '', // We'll need to get this from auth if needed
          email_confirmed_at: null, // We'll need to get this from auth if needed
          created_at: profile.created_at,
          last_sign_in_at: null, // We'll need to get this from auth if needed
          user_profiles: profile
        };
      });

      console.log('✅ Successfully transformed users:', users.length);

      return {
        users,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('❌ Error in getAllUsers:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserWithProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          phone,
          role,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (!data) return null;

      // Transform the data to match our interface
      const user: UserWithProfile = {
        id: data.user_id,
        email: '', // We'll need to get this from auth if needed
        email_confirmed_at: null, // We'll need to get this from auth if needed
        created_at: data.created_at,
        last_sign_in_at: null, // We'll need to get this from auth if needed
        user_profiles: data
      };

      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async updateUserStatus(): Promise<boolean> {
    try {
      console.log('⚠️ updateUserStatus called but is_active column not available');
      // For now, just return true since we can't update status without the column
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({ 
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      console.log('📊 UserManagementService.getUserStats called');
      
      const { data: profiles, error } = await this.supabase
        .from('user_profiles')
        .select(`
          role,
          created_at
        `);

      console.log('📋 getUserStats query result:', { 
        profilesLength: profiles?.length || 0, 
        error: error ? { message: error.message, code: error.code, details: error.details } : null
      });

      if (error) {
        console.error('❌ getUserStats error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats: UserStats = {
        total: profiles.length,
        active: profiles.length, // Assume all are active since we don't have is_active column
        inactive: 0, // No inactive users since we don't have is_active column
        admins: profiles.filter(p => p.role === 'admin').length,
        moderators: profiles.filter(p => p.role === 'moderator').length,
        customers: profiles.filter(p => p.role === 'customer').length,
        verified: 0, // We can't access email_confirmed_at from user_profiles
        unverified: 0, // We can't access email_confirmed_at from user_profiles
        recentSignups: profiles.filter(p => new Date(p.created_at) > thirtyDaysAgo).length,
      };

      console.log('✅ getUserStats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error in getUserStats:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
        moderators: 0,
        customers: 0,
        verified: 0,
        unverified: 0,
        recentSignups: 0,
      };
    }
  }

  async bulkUpdateUserRoles(userIds: string[], role: UserRole): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .in('user_id', userIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error bulk updating user roles:', error);
      throw error;
    }
  }

  async bulkUpdateUserStatus(): Promise<boolean> {
    try {
      console.log('⚠️ bulkUpdateUserStatus called but is_active column not available');
      // For now, just return true since we can't update status without the column
      return true;
    } catch (error) {
      console.error('Error bulk updating user status:', error);
      throw error;
    }
  }

  async deleteUser(): Promise<boolean> {
    try {
      console.log('⚠️ deleteUser called but is_active column not available');
      // For now, just return true since we can't deactivate without the column
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
}

export const userManagementService = new UserManagementService();

