-- Sample Categories for Kareè E-commerce
-- Run this in your Supabase SQL Editor to add sample categories

-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active, sort_order, meta_title, meta_description) VALUES
-- Skincare Categories
('Cleansers', 'cleansers', 'Gentle facial cleansers for all skin types. Remove dirt, oil, and makeup without stripping your skin.', true, 1, 'Facial Cleansers - Kareè Skincare', 'Discover gentle and effective facial cleansers for all skin types. Remove impurities while maintaining your skin\'s natural balance.'),
('Moisturizers', 'moisturizers', 'Hydrating moisturizers to keep your skin soft, supple, and healthy. Suitable for all skin types.', true, 2, 'Face Moisturizers - Kareè Skincare', 'Keep your skin hydrated and healthy with our range of moisturizers. From lightweight gels to rich creams for every skin type.'),
('Serums', 'serums', 'Concentrated treatments targeting specific skin concerns like aging, acne, and hyperpigmentation.', true, 3, 'Facial Serums - Kareè Skincare', 'Target specific skin concerns with our potent serums. Anti-aging, brightening, and acne-fighting formulas for visible results.'),
('Sunscreen', 'sunscreen', 'Broad-spectrum sun protection to shield your skin from harmful UV rays and prevent premature aging.', true, 4, 'Sunscreen & Sun Protection - Kareè', 'Protect your skin from harmful UV rays with our broad-spectrum sunscreens. Prevent premature aging and maintain healthy skin.'),
('Masks', 'masks', 'Weekly treatments to deep clean, hydrate, or treat specific skin concerns for a radiant complexion.', true, 5, 'Face Masks - Kareè Skincare', 'Weekly treatments for deep cleansing, hydration, and targeted skin concerns. Achieve a radiant complexion with our face masks.'),

-- Body Care Categories
('Body Care', 'body-care', 'Complete body care solutions including body washes, lotions, and treatments for smooth, healthy skin.', true, 6, 'Body Care Products - Kareè', 'Complete body care solutions for smooth, healthy skin. From gentle cleansers to nourishing lotions and treatments.'),
('Hand Care', 'hand-care', 'Nourishing hand creams and treatments to keep your hands soft, smooth, and well-maintained.', true, 7, 'Hand Care Products - Kareè', 'Keep your hands soft and smooth with our nourishing hand creams and treatments. Perfect for daily use and special care.'),

-- Specialized Categories
('Anti-Aging', 'anti-aging', 'Advanced formulations designed to reduce fine lines, wrinkles, and signs of aging for youthful skin.', true, 8, 'Anti-Aging Skincare - Kareè', 'Advanced anti-aging formulations to reduce fine lines and wrinkles. Maintain youthful, radiant skin with our specialized treatments.'),
('Acne Solutions', 'acne-solutions', 'Targeted treatments for acne-prone skin, including cleansers, spot treatments, and prevention products.', true, 9, 'Acne Treatment Products - Kareè', 'Effective acne solutions for clear, healthy skin. From gentle cleansers to powerful spot treatments for all acne types.'),
('Sensitive Skin', 'sensitive-skin', 'Gentle, fragrance-free products specially formulated for sensitive and reactive skin types.', true, 10, 'Sensitive Skin Products - Kareè', 'Gentle, fragrance-free products for sensitive skin. Soothing formulations that won\'t irritate or cause reactions.'),

-- Seasonal Categories
('Summer Essentials', 'summer-essentials', 'Lightweight, oil-free products perfect for hot weather and outdoor activities.', true, 11, 'Summer Skincare - Kareè', 'Lightweight, oil-free products perfect for summer. Stay fresh and protected during hot weather and outdoor activities.'),
('Winter Care', 'winter-care', 'Rich, nourishing products to combat dry winter air and keep skin hydrated and protected.', true, 12, 'Winter Skincare - Kareè', 'Rich, nourishing products for winter. Combat dry air and keep your skin hydrated and protected during cold weather.'),

-- Gift Categories
('Gift Sets', 'gift-sets', 'Curated collections perfect for gifting. Complete skincare routines in beautiful packaging.', true, 13, 'Skincare Gift Sets - Kareè', 'Perfect gift sets for skincare lovers. Curated collections in beautiful packaging for every occasion.'),
('Travel Size', 'travel-size', 'Compact, travel-friendly versions of your favorite products for on-the-go skincare.', true, 14, 'Travel Skincare - Kareè', 'Travel-friendly versions of your favorite products. Compact, TSA-approved sizes for on-the-go skincare.'),

-- Inactive/Testing Categories
('Test Category', 'test-category', 'This is a test category for development purposes.', false, 15, 'Test Category - Kareè', 'Test category for development and testing purposes.');

-- Note: These categories provide a good foundation for testing the category management system
-- You can modify, add, or remove categories as needed for your specific product catalog
