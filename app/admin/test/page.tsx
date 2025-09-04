'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/lib/services/user-service';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminTestPage() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get current auth user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        setAuthUser(user);
        
        if (user) {
          // Get user profile
          const profile = await userService.getCurrentUserProfile();
          setUserProfile(profile);
          
          // Check admin status
          const adminStatus = await userService.isAdmin();
          setIsAdmin(adminStatus);
          
          // Get user role
          const role = await userService.getUserRole();
          setUserRole(role);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-black mx-auto"></div>
          <p className="mt-4 text-brand-black">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-black mb-2">Admin Authentication Test</h1>
          <p className="text-gray-600">Debugging admin access issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication User</CardTitle>
            </CardHeader>
            <CardContent>
              {authUser ? (
                <div className="space-y-2">
                  <p><strong>ID:</strong> {authUser.id}</p>
                  <p><strong>Email:</strong> {authUser.email}</p>
                  <p><strong>Created:</strong> {new Date(authUser.created_at).toLocaleString()}</p>
                  <p><strong>Last Sign In:</strong> {new Date(authUser.last_sign_in_at).toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-red-500">No authenticated user found</p>
              )}
            </CardContent>
          </Card>

          {/* User Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="space-y-2">
                  <p><strong>Profile ID:</strong> {userProfile.id}</p>
                  <p><strong>User ID:</strong> {userProfile.user_id}</p>
                  <p><strong>First Name:</strong> {userProfile.first_name || 'Not set'}</p>
                  <p><strong>Last Name:</strong> {userProfile.last_name || 'Not set'}</p>
                  <p><strong>Role:</strong> <span className="font-bold text-blue-600">{userProfile.role}</span></p>
                  <p><strong>Created:</strong> {new Date(userProfile.created_at).toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-red-500">No user profile found</p>
              )}
            </CardContent>
          </Card>

          {/* Admin Status */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Status Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Is Admin Function:</strong> 
                  <span className={`ml-2 font-bold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {isAdmin === null ? 'Loading...' : isAdmin ? 'TRUE' : 'FALSE'}
                  </span>
                </p>
                <p><strong>User Role Function:</strong> 
                  <span className={`ml-2 font-bold ${userRole === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                    {userRole || 'Loading...'}
                  </span>
                </p>
                <p><strong>Should Have Access:</strong> 
                  <span className={`ml-2 font-bold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {isAdmin ? 'YES' : 'NO'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleRefresh} className="w-full">
                Refresh Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/admin'}
              >
                Try Admin Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Loading State:</strong> {loading ? 'true' : 'false'}</p>
              <p><strong>Auth User:</strong> {authUser ? 'Present' : 'Missing'}</p>
              <p><strong>User Profile:</strong> {userProfile ? 'Present' : 'Missing'}</p>
              <p><strong>Admin Check:</strong> {isAdmin === null ? 'Pending' : isAdmin ? 'Admin' : 'Not Admin'}</p>
              <p><strong>Role Check:</strong> {userRole || 'Pending'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




