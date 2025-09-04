'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/lib/services/user-service';
import { UserRole } from '@/lib/types/database';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // First check if user is authenticated
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setUserRole(null);
          setLoading(false);
          return;
        }
        
        // Then check admin status and role
        const [adminStatus, role] = await Promise.all([
          userService.isAdmin(),
          userService.getUserRole()
        ]);
        
        setIsAdmin(adminStatus);
        setUserRole(role);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'customer': 0,
      'moderator': 1,
      'admin': 2
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  return {
    isAdmin,
    userRole,
    loading,
    hasPermission
  };
}
