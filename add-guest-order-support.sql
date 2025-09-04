-- Add support for guest orders
-- This script adds a column to track guest orders

-- Add is_guest_order column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS is_guest_order BOOLEAN DEFAULT FALSE;

-- Add index for better performance on guest order queries
CREATE INDEX IF NOT EXISTS idx_orders_guest_order ON orders(is_guest_order);

-- Update RLS policies to allow guest orders
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;

-- Create new policies that allow guest orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (is_guest_order = true AND user_id IS NULL)
  );

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (is_guest_order = true AND user_id IS NULL)
  );

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Add comment to document the change
COMMENT ON COLUMN orders.is_guest_order IS 'Indicates if this is a guest order (no user account)';

