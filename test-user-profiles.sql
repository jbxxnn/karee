-- Test script to check user_profiles table access
-- Run this in your Supabase SQL Editor to test

-- 1. First, check the table structure to see what columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 2. Check if user_profiles table exists and has data (without is_active for now)
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'customer' THEN 1 END) as customer_count
FROM user_profiles;

-- 3. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 4. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 5. Sample data (first 5 records)
SELECT id, user_id, first_name, last_name, role, created_at
FROM user_profiles 
LIMIT 5;
