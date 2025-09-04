-- Fix RLS policies for orders table to allow updates after payment verification
-- This script allows the server-side API routes to update orders after payment verification

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;

-- Create comprehensive RLS policies for orders table

-- 1. Users can view their own orders (including guest orders)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
    auth.uid() = user_id OR 
    (is_guest_order = true AND user_id IS NULL)
);

-- 2. Users can insert their own orders (including guest orders)
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (is_guest_order = true AND user_id IS NULL)
);

-- 3. Users can update their own orders (for status changes, etc.)
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (
    auth.uid() = user_id OR 
    (is_guest_order = true AND user_id IS NULL)
);

-- 4. Allow service role to update orders (for payment verification)
-- This is crucial for server-side API routes to update order status
CREATE POLICY "Service role can update orders" ON orders FOR UPDATE USING (
    auth.role() = 'service_role'
);

-- 5. Allow service role to insert orders (for server-side operations)
CREATE POLICY "Service role can insert orders" ON orders FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
);

-- 6. Allow service role to select orders (for server-side operations)
CREATE POLICY "Service role can select orders" ON orders FOR SELECT USING (
    auth.role() = 'service_role'
);

-- 7. Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- 8. Admins can manage all orders
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- Also ensure order_items table has proper policies for service role
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Users can update own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

-- Recreate order_items policies with service role support
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR (orders.is_guest_order = true AND orders.user_id IS NULL))
    )
);

CREATE POLICY "Users can insert own order items" ON order_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR (orders.is_guest_order = true AND orders.user_id IS NULL))
    )
);

CREATE POLICY "Users can update own order items" ON order_items FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR (orders.is_guest_order = true AND orders.user_id IS NULL))
    )
);

-- Allow service role to manage order items
CREATE POLICY "Service role can manage order items" ON order_items FOR ALL USING (
    auth.role() = 'service_role'
);

-- Admins can manage all order items
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- Add comment to document the changes
COMMENT ON TABLE orders IS 'Orders table with RLS policies allowing service role updates for payment verification';
COMMENT ON TABLE order_items IS 'Order items table with RLS policies allowing service role updates for payment verification';
