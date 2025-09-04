'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/hooks/use-admin';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Home,
  User,
  Shield,
  FolderOpen
} from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/lib/services/user-service';
import { UserProfile } from '@/lib/types/database';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isAdmin, userRole, loading, hasPermission } = useAdmin();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await userService.getCurrentUserProfile();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Only redirect if we've finished loading and user is definitely not admin
    if (!loading && isAdmin === false) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase/client');
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-black mx-auto"></div>
          <p className="mt-4 text-brand-black">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show access denied only if we've finished loading and user is definitely not admin
  if (!loading && isAdmin === false) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-brand-black mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin panel.
          </p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      permission: 'admin' as const
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      permission: 'admin' as const
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
      permission: 'admin' as const
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      permission: 'admin' as const
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      permission: 'admin' as const
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      permission: 'admin' as const
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-brand-black" />
                  <span className="text-xl font-bold text-brand-black">Kareè Admin</span>
                </Link>
                <Badge variant="secondary" className="bg-brand-cream text-brand-black">
                  {userRole}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, {currentUser?.first_name || 'Admin'}
                </div>
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Store
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  if (!hasPermission(item.permission)) return null;
                  
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-brand-black transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
