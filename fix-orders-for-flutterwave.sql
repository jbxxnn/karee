-- Comprehensive fix for orders table to support Flutterwave payment verification
-- This script adds missing columns and fixes RLS policies

-- ==============================================
-- 1. ADD MISSING PAYMENT COLUMNS
-- ==============================================

-- Add missing payment-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_details JSONB;

-- Add index for better performance on payment queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders(paid_at);

-- Update the order_status enum to include 'paid' if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'paid' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')) THEN
        ALTER TYPE order_status ADD VALUE 'paid';
    END IF;
END $$;

-- Update the payment_status enum to include more statuses if needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'paid' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payment_status')) THEN
        ALTER TYPE payment_status ADD VALUE 'paid';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'failed' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payment_status')) THEN
        ALTER TYPE payment_status ADD VALUE 'failed';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'refunded' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payment_status')) THEN
        ALTER TYPE payment_status ADD VALUE 'refunded';
    END IF;
END $$;

-- Add comments to document the new columns
COMMENT ON COLUMN orders.payment_method IS 'Payment method used (e.g., flutterwave, stripe, etc.)';
COMMENT ON COLUMN orders.payment_reference IS 'Payment reference from payment provider';
COMMENT ON COLUMN orders.paid_at IS 'Timestamp when payment was completed';
COMMENT ON COLUMN orders.payment_details IS 'JSON object containing payment provider specific details';

-- Update existing orders to have default values for new columns
UPDATE orders 
SET 
    payment_method = 'unknown',
    payment_status = 'pending'
WHERE payment_method IS NULL;

-- ==============================================
-- 2. FIX RLS POLICIES FOR ORDERS TABLE
-- ==============================================

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

-- ==============================================
-- 3. FIX RLS POLICIES FOR ORDER_ITEMS TABLE
-- ==============================================

-- Drop existing order_items policies
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

-- ==============================================
-- 4. UPDATE TRIGGERS
-- ==============================================

-- Make sure the updated_at trigger is working
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders table if it doesn't exist
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 5. FINAL COMMENTS
-- ==============================================

-- Add comments to document the changes
COMMENT ON TABLE orders IS 'Orders table with Flutterwave payment support and RLS policies allowing service role updates for payment verification';
COMMENT ON TABLE order_items IS 'Order items table with RLS policies allowing service role updates for payment verification';

-- Display success message
SELECT 'Orders table successfully updated for Flutterwave payment verification!' as status;
