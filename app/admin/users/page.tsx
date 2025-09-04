'use client';

import { useState, useEffect } from 'react';
import { userManagementService, UserWithProfile, UserStats, UserFilters } from '@/lib/services/user-management-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Mail,
  MailCheck,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { UserRole } from '@/lib/types/database';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    moderators: 0,
    customers: 0,
    verified: 0,
    unverified: 0,
    recentSignups: 0,
  });
  
  // Filters and pagination
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Bulk operations
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Test connection first
    const testAndLoad = async () => {
      console.log('🚀 AdminUsersPage useEffect triggered');
      const connectionOk = await userManagementService.testConnection();
      if (connectionOk) {
        loadUsers();
        loadStats();
      } else {
        console.error('❌ Supabase connection test failed, skipping data load');
        toast.error('Database connection failed');
      }
    };
    
    testAndLoad();
  }, [filters, currentPage]);

  const loadUsers = async () => {
    try {
      console.log('🔄 AdminUsersPage.loadUsers called');
      setLoading(true);
      
      const filtersToUse = { ...filters, search: searchQuery };
      console.log('📋 Filters being used:', filtersToUse);
      console.log('📋 Current page:', currentPage);
      
      const result = await userManagementService.getAllUsers(
        filtersToUse,
        currentPage,
        20
      );
      
      console.log('📊 loadUsers result:', result);
      
      setUsers(result.users);
      setTotalPages(result.totalPages);
      setTotalUsers(result.total);
      
      console.log('✅ loadUsers completed successfully');
    } catch (error) {
      console.error('❌ Error in loadUsers:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('📊 AdminUsersPage.loadStats called');
      const userStats = await userManagementService.getUserStats();
      console.log('📊 loadStats result:', userStats);
      setStats(userStats);
      console.log('✅ loadStats completed successfully');
    } catch (error) {
      console.error('❌ Error in loadStats:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      await userManagementService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully!');
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      await userManagementService.updateUserStatus(userId, isActive);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleBulkRoleUpdate = async (role: UserRole) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    try {
      await userManagementService.bulkUpdateUserRoles(selectedUsers, role);
      toast.success(`Updated ${selectedUsers.length} users to ${role} role`);
      setSelectedUsers([]);
      setSelectAll(false);
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Error bulk updating user roles:', error);
      toast.error('Failed to update user roles');
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    try {
      await userManagementService.bulkUpdateUserStatus(selectedUsers, isActive);
      toast.success(`${selectedUsers.length} users ${isActive ? 'activated' : 'deactivated'}`);
      setSelectedUsers([]);
      setSelectAll(false);
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Error bulk updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'moderator': return <ShieldCheck className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => { loadUsers(); loadStats(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
                 <Card>
           <CardContent className="p-4">
             <div className="flex items-center space-x-2">
               <Calendar className="h-5 w-5 text-purple-500" />
               <div>
                 <p className="text-sm font-medium text-gray-600">Recent Signups</p>
                 <p className="text-2xl font-bold text-gray-900">{stats.recentSignups}</p>
               </div>
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                                     placeholder="Search users by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
                         <select
               value={filters.role || 'all'}
               onChange={(e) => handleFilterChange('role', e.target.value)}
               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               aria-label="Filter by role"
             >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
                         
            
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} user(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex space-x-2">
                                 <select
                   onChange={(e) => handleBulkRoleUpdate(e.target.value as UserRole)}
                   className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                   aria-label="Bulk update role"
                 >
                  <option value="">Update Role</option>
                  <option value="customer">Customer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({totalUsers})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Verification</th>
                  <th className="text-left p-3">Joined</th>
                  <th className="text-left p-3">Last Sign In</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                      />
                    </td>
                                         <td className="p-3">
                       <div>
                         <div className="font-medium text-gray-900">
                           {user.user_profiles?.first_name && user.user_profiles?.last_name
                             ? `${user.user_profiles.first_name} ${user.user_profiles.last_name}`
                             : 'No Name'
                           }
                         </div>
                         <div className="text-sm text-gray-600">ID: {user.id.slice(0, 8)}...</div>
                       </div>
                     </td>
                    <td className="p-3">
                      <Badge className={getRoleColor(user.user_profiles?.role || 'customer')}>
                        {getRoleIcon(user.user_profiles?.role || 'customer')}
                        <span className="ml-1">{user.user_profiles?.role || 'customer'}</span>
                      </Badge>
                    </td>
                                         <td className="p-3">
                       <Badge className="bg-green-100 text-green-800">
                         Active
                       </Badge>
                     </td>
                                         <td className="p-3">
                       <Badge className="bg-gray-100 text-gray-800">
                         <Mail className="h-3 w-3 mr-1" />
                         N/A
                       </Badge>
                     </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                                         <td className="p-3 text-sm text-gray-600">
                       N/A
                     </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                                                 <select
                           value={user.user_profiles?.role || 'customer'}
                           onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                           className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                           aria-label={`Update role for user ${user.user_profiles?.first_name || user.id}`}
                         >
                          <option value="customer">Customer</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          title="Status management not available (is_active column missing)"
                        >
                          N/A
                        </Button>
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalUsers} total users)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

