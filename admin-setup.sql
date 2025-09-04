-- Admin Setup for Kareè E-commerce
-- Run this in your Supabase SQL Editor to set up admin functionality

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to user_profiles table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE user_profiles ADD COLUMN role user_role DEFAULT 'customer';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, first_name, last_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call handle_new_user when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add admin policies for user_profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
CREATE POLICY "Admins can update any profile" ON user_profiles FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for products
DROP POLICY IF EXISTS "Admins can view all products" ON products;
CREATE POLICY "Admins can view all products" ON products FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for categories
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for product_images
DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for product_variants
DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
CREATE POLICY "Admins can manage product variants" ON product_variants FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for order_items
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for product_reviews
DROP POLICY IF EXISTS "Admins can manage product reviews" ON product_reviews;
CREATE POLICY "Admins can manage product reviews" ON product_reviews FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add admin policies for coupons
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = user_uuid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM user_profiles 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO anon, authenticated;

-- Insert a default admin user (you'll need to replace with actual user ID)
-- This is optional - you can manually set a user as admin through the Supabase dashboard
-- INSERT INTO user_profiles (user_id, first_name, last_name, role) 
-- VALUES ('your-user-id-here', 'Admin', 'User', 'admin');

-- Create admin dashboard views
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM user_profiles WHERE role = 'customer') as total_customers,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered') as total_revenue;

-- Grant access to the view
GRANT SELECT ON admin_dashboard_stats TO authenticated;




