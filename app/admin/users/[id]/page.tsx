'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { userManagementService, UserWithProfile } from '@/lib/services/user-management-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  UserCheck, 
  UserX,
  Loader2,
  Save,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { UserRole } from '@/lib/types/database';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'customer' as UserRole,
    is_active: true,
  });

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await userManagementService.getUserById(userId);
      if (userData) {
        setUser(userData);
        setFormData({
          first_name: userData.user_profiles?.first_name || '',
          last_name: userData.user_profiles?.last_name || '',
          phone: userData.user_profiles?.phone || '',
          role: userData.user_profiles?.role || 'customer',
          is_active: userData.user_profiles?.is_active ?? true,
        });
      } else {
        toast.error('User not found');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await userManagementService.updateUserProfile(userId, formData);
      toast.success('User profile updated successfully!');
      setIsEditing(false);
      await loadUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleUpdate = async (newRole: UserRole) => {
    if (!user) return;

    try {
      await userManagementService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully!');
      await loadUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleStatusUpdate = async (isActive: boolean) => {
    if (!user) return;

    try {
      await userManagementService.updateUserStatus(userId, isActive);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
      await loadUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'moderator': return <Shield className="h-4 w-4" />;
      case 'customer': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            User Not Found
          </h2>
          <Link href="/admin/users">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
                         <h1 className="text-3xl font-bold text-gray-900">
               {user.user_profiles?.first_name && user.user_profiles?.last_name
                 ? `${user.user_profiles.first_name} ${user.user_profiles.last_name}`
                 : 'User Profile'
               }
             </h1>
             <p className="text-gray-600">ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getRoleColor(user.user_profiles?.role || 'customer')}>
            {getRoleIcon(user.user_profiles?.role || 'customer')}
            <span className="ml-1">{user.user_profiles?.role || 'customer'}</span>
          </Badge>
                     <Badge className="bg-green-100 text-green-800">
             Active
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>User Information</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.user_profiles?.first_name || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.user_profiles?.last_name || 'Not provided'}
                    </p>
                  )}
                </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     User ID
                   </label>
                   <p className="text-gray-900">{user.id}</p>
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.user_profiles?.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-600">Status</span>
                 <span className="text-sm text-gray-500">Active (N/A)</span>
               </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Role</span>
                                 <select
                   value={user.user_profiles?.role || 'customer'}
                   onChange={(e) => handleRoleUpdate(e.target.value as UserRole)}
                   className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                   aria-label="Update user role"
                 >
                  <option value="customer">Customer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                             <div className="flex items-center space-x-2">
                 <Mail className="h-4 w-4 text-gray-400" />
                 <div>
                   <p className="text-sm font-medium text-gray-600">Email Status</p>
                   <p className="text-sm text-gray-900">N/A</p>
                 </div>
               </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Joined</p>
                  <p className="text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
                             <div className="flex items-center space-x-2">
                 <Calendar className="h-4 w-4 text-gray-400" />
                 <div>
                   <p className="text-sm font-medium text-gray-600">Last Sign In</p>
                   <p className="text-sm text-gray-900">N/A</p>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
