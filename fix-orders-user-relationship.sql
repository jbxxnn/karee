-- Fix the relationship between orders and user_profiles
-- Run this in your Supabase SQL Editor

-- 1. First, let's check the current structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('orders', 'user_profiles')
AND column_name LIKE '%user%'
ORDER BY table_name, ordinal_position;

-- 2. Check if there are any existing foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'orders';

-- 3. Add the foreign key constraint if it doesn't exist
-- This will link orders.user_id to user_profiles.user_id
DO $$
BEGIN
  -- Check if the foreign key already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_orders_user_id'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE orders 
    ADD CONSTRAINT fk_orders_user_id 
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Foreign key constraint fk_orders_user_id added successfully';
  ELSE
    RAISE NOTICE 'Foreign key constraint fk_orders_user_id already exists';
  END IF;
END $$;

-- 4. Verify the foreign key was created
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
  AND tc.table_name = 'orders';

-- 5. Test the relationship by trying to select orders with user profiles
-- This should now work if the foreign key is properly set up
SELECT 
  o.id,
  o.order_number,
  o.user_id,
  up.first_name,
  up.last_name,
  up.phone
FROM orders o
LEFT JOIN user_profiles up ON o.user_id = up.user_id
LIMIT 5;


