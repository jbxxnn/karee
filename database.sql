-- Ecommerce Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'moderator');

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    compare_price DECIMAL(10,2) CHECK (compare_price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    weight_grams INTEGER CHECK (weight_grams >= 0),
    dimensions_cm JSONB, -- {length, width, height}
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images table
CREATE TABLE product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table (for different sizes, colors, etc.)
CREATE TABLE product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., "Size", "Color"
    value VARCHAR(100) NOT NULL, -- e.g., "Large", "Red"
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    avatar_url TEXT,
    role user_role DEFAULT 'customer',
    preferences JSONB, -- {newsletter, marketing_emails, etc.}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User addresses table
CREATE TABLE user_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('billing', 'shipping')), -- billing or shipping
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart table
CREATE TABLE cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- For guest users
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id),
    UNIQUE(session_id, product_id, variant_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address_id UUID REFERENCES user_addresses(id),
    billing_address_id UUID REFERENCES user_addresses(id),
    notes TEXT,
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    product_name VARCHAR(255) NOT NULL, -- Snapshot of product name at time of order
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Product reviews table
CREATE TABLE product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id), -- To verify purchase
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, order_id)
);

-- Coupons table
CREATE TABLE coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon usage tracking
CREATE TABLE coupon_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coupon_id, user_id, order_id)
);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_slug ON products(slug);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_sort_order ON product_images(sort_order);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply order number trigger
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

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

-- Create trigger to call handle_new_user when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Products: Public read access for active products, admins can see all
CREATE POLICY "Active products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all products" ON products FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Product images: Public read access
CREATE POLICY "Product images are viewable by everyone" ON product_images FOR SELECT USING (true);

-- Product variants: Public read access for active variants
CREATE POLICY "Active product variants are viewable by everyone" ON product_variants FOR SELECT USING (is_active = true);

-- User profiles: Users can only see their own profile, admins can see all
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any profile" ON user_profiles FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User addresses: Users can only see their own addresses
CREATE POLICY "Users can view own addresses" ON user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id);

-- Cart items: Users can only see their own cart items
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Orders: Users can only see their own orders, admins can see all
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: Users can only see items from their own orders
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Wishlist: Users can only see their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id);

-- Product reviews: Public read access for approved reviews, users can manage their own
CREATE POLICY "Approved reviews are viewable by everyone" ON product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own reviews" ON product_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);

-- Coupons: Public read access for active coupons
CREATE POLICY "Active coupons are viewable by everyone" ON coupons FOR SELECT USING (is_active = true);

-- Coupon usage: Users can only see their own usage
CREATE POLICY "Users can view own coupon usage" ON coupon_usage FOR SELECT USING (auth.uid() = user_id);

-- Insert some sample data
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Latest electronic devices and gadgets'),
('Clothing', 'clothing', 'Fashion and apparel for all ages'),
('Home & Garden', 'home-garden', 'Everything for your home and garden'),
('Books', 'books', 'Books for all interests and ages'),
('Sports', 'sports', 'Sports equipment and athletic wear');

-- Insert sample products
INSERT INTO products (name, slug, description, price, stock_quantity, category_id) VALUES
('Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'High-quality wireless headphones with noise cancellation', 99.99, 50, (SELECT id FROM categories WHERE slug = 'electronics')),
('Cotton T-Shirt', 'cotton-t-shirt', 'Comfortable 100% cotton t-shirt', 19.99, 100, (SELECT id FROM categories WHERE slug = 'clothing')),
('Garden Tool Set', 'garden-tool-set', 'Complete set of essential garden tools', 49.99, 25, (SELECT id FROM categories WHERE slug = 'home-garden')),
('Programming Fundamentals', 'programming-fundamentals', 'Learn the basics of programming', 29.99, 75, (SELECT id FROM categories WHERE slug = 'books')),
('Yoga Mat', 'yoga-mat', 'Non-slip yoga mat for home workouts', 24.99, 60, (SELECT id FROM categories WHERE slug = 'sports'));

-- Insert sample product images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
((SELECT id FROM products WHERE slug = 'wireless-bluetooth-headphones'), 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Wireless Bluetooth Headphones', true),
((SELECT id FROM products WHERE slug = 'cotton-t-shirt'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'Cotton T-Shirt', true),
((SELECT id FROM products WHERE slug = 'garden-tool-set'), 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500', 'Garden Tool Set', true),
((SELECT id FROM products WHERE slug = 'programming-fundamentals'), 'https://images.unsplash.com/photo-1517842645767-c63914237733?w=500', 'Programming Fundamentals Book', true),
((SELECT id FROM products WHERE slug = 'yoga-mat'), 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', 'Yoga Mat', true);

-- Create a function to get product details with images
CREATE OR REPLACE FUNCTION get_product_with_images(product_slug TEXT)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    stock_quantity INTEGER,
    category_name VARCHAR(100),
    images JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.stock_quantity,
        c.name as category_name,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', pi.id,
                    'image_url', pi.image_url,
                    'alt_text', pi.alt_text,
                    'is_primary', pi.is_primary,
                    'sort_order', pi.sort_order
                ) ORDER BY pi.sort_order, pi.is_primary DESC
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'::jsonb
        ) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.slug = product_slug AND p.is_active = true
    GROUP BY p.id, p.name, p.slug, p.description, p.price, p.stock_quantity, c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
