-- Test script to check orders table access
-- Run this in your Supabase SQL Editor to test

-- 1. Check if orders table exists and has data
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_count,
  COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_count,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count
FROM orders;

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 3. Check if order_items table exists and has data
SELECT 
  COUNT(*) as total_order_items,
  COUNT(DISTINCT order_id) as orders_with_items
FROM order_items;

-- 4. Check order_items table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- 5. Check RLS policies on orders table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'orders';

-- 6. Check RLS policies on order_items table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'order_items';

-- 7. Sample data (first 3 orders with their items)
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.payment_status,
  o.total_amount,
  o.created_at,
  oi.id as item_id,
  oi.product_name,
  oi.quantity,
  oi.unit_price,
  oi.total_price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC
LIMIT 10;

-- 8. Check if user_profiles table has the data we need
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN first_name IS NOT NULL THEN 1 END) as with_first_name,
  COUNT(CASE WHEN last_name IS NOT NULL THEN 1 END) as with_last_name,
  COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone
FROM user_profiles;


