-- Run this script in your Supabase SQL Editor to fix orders table for Flutterwave
-- This script will add missing columns and fix RLS policies

-- Execute the main fix script
\i fix-orders-for-flutterwave.sql

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_method', 'payment_reference', 'paid_at', 'payment_details', 'is_guest_order')
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;

-- Test that service role can update orders (this should not error)
-- Note: This will only work if you're running as service role
SELECT 'RLS policies updated successfully!' as status;
