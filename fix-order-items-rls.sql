-- Fix RLS policies for order_items table to allow users to insert order items

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

-- Create new policies for order_items
-- Users can view order items from their own orders
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- Users can insert order items for their own orders
CREATE POLICY "Users can insert own order items" ON order_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- Users can update order items for their own orders (if needed)
CREATE POLICY "Users can update own order items" ON order_items FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- Admins can manage all order items
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Also ensure orders table has proper INSERT policy for users
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow guest orders (user_id can be null)
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
);

