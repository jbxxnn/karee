-- Check the product_variants table and related structure
-- Run this in your Supabase SQL Editor

-- 1. Check if product_variants table exists and its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_variants' 
ORDER BY ordinal_position;

-- 2. Check if there are any existing product variants
SELECT 
  pv.id,
  pv.product_id,
  p.name as product_name,
  pv.name as variant_name,
  pv.value as variant_value,
  pv.price_adjustment,
  pv.stock_quantity,
  pv.sku,
  pv.is_active
FROM product_variants pv
LEFT JOIN products p ON pv.product_id = p.id
LIMIT 10;

-- 3. Check how many products have variants
SELECT 
  COUNT(DISTINCT pv.product_id) as products_with_variants,
  COUNT(pv.id) as total_variants
FROM product_variants pv;

-- 4. Check for any existing product attributes or options tables
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
  table_name LIKE '%attribute%' OR 
  table_name LIKE '%option%' OR
  table_name LIKE '%variant%'
)
ORDER BY table_name;

-- 5. Sample some products to see which ones might benefit from variants
SELECT 
  id,
  name,
  price,
  stock_quantity,
  category_id,
  is_active
FROM products 
WHERE is_active = true
LIMIT 10;


