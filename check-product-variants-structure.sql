-- Check the current product_variants table structure
-- Run this in your Supabase SQL Editor

-- 1. Check the current product_variants table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_variants' 
ORDER BY ordinal_position;

-- 2. Check if there are any existing variants
SELECT COUNT(*) as variant_count FROM product_variants;


