-- Fix RLS Policies for Kareè E-commerce
-- Run this in your Supabase SQL Editor to fix the infinite recursion issue

-- Drop all existing policies on user_profiles to fix recursion
-- This will drop ALL policies on user_profiles table
DO $$ 
BEGIN
    -- Drop all policies on user_profiles table
    EXECUTE (
        SELECT string_agg(format('DROP POLICY IF EXISTS %I ON user_profiles;', polname), ' ')
        FROM pg_policies 
        WHERE tablename = 'user_profiles'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- If the query fails, just continue with manual drops
        NULL;
END $$;

-- Manual drops for common policy names
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles 
FOR SELECT USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles 
FOR UPDATE USING (user_id = auth.uid());

-- Allow authenticated users to insert their own profile (for the trigger)
CREATE POLICY "Users can insert own profile" ON user_profiles 
FOR INSERT WITH CHECK (user_id = auth.uid());

-- For admin operations, we'll use a different approach
-- Create a function to check admin status without RLS recursion
CREATE OR REPLACE FUNCTION is_user_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    -- This function bypasses RLS by using SECURITY DEFINER
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = user_uuid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user role without RLS recursion
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS user_role AS $$
BEGIN
    -- This function bypasses RLS by using SECURITY DEFINER
    RETURN (
        SELECT role FROM user_profiles 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create admin policies using the functions
CREATE POLICY "Admins can view all profiles" ON user_profiles 
FOR SELECT USING (is_user_admin());

CREATE POLICY "Admins can update any profile" ON user_profiles 
FOR UPDATE USING (is_user_admin());

CREATE POLICY "Admins can insert profiles" ON user_profiles 
FOR INSERT WITH CHECK (is_user_admin());

CREATE POLICY "Admins can delete profiles" ON user_profiles 
FOR DELETE USING (is_user_admin());

-- Update other admin policies to use the function
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (is_user_admin());

DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (is_user_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_user_admin());

DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL USING (is_user_admin());

DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
CREATE POLICY "Admins can manage product variants" ON product_variants FOR ALL USING (is_user_admin());

DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (is_user_admin());

DROP POLICY IF EXISTS "Admins can manage product reviews" ON product_reviews;
CREATE POLICY "Admins can manage product reviews" ON product_reviews FOR ALL USING (is_user_admin());

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION is_user_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;
