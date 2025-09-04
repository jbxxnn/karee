-- Check the current products table structure
-- Run this in your Supabase SQL Editor

-- 1. Check the current products table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 2. Check if there are any existing product variants or attributes tables
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%product%'
ORDER BY table_name;

-- 3. Check for any existing foreign key constraints on products
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'products';

-- 4. Sample some existing product data to understand current structure
SELECT 
  id,
  name,
  description,
  price,
  stock_quantity,
  category_id,
  is_active,
  created_at
FROM products 
LIMIT 5;

-- 5. Check if there are any product-related tables that might handle variants
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND (
  table_name LIKE '%variant%' OR 
  table_name LIKE '%attribute%' OR 
  table_name LIKE '%option%' OR
  column_name LIKE '%variant%' OR
  column_name LIKE '%attribute%' OR
  column_name LIKE '%option%'
)
ORDER BY table_name, ordinal_position;


