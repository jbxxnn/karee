-- Sample product variants for testing
-- Run this in your Supabase SQL Editor after running the enhance-product-variants.sql script

-- First, let's check if we have any products to add variants to
SELECT id, name, price FROM products WHERE is_active = true LIMIT 5;

-- Create sample variants for the first product (replace with actual product ID)
-- You'll need to replace 'YOUR_PRODUCT_ID' with an actual product ID from your products table

-- Example: Create variants for a T-shirt product
-- Assuming you have a product with ID, let's create size and color variants

-- Get the first active product ID
DO $$
DECLARE
    product_uuid UUID;
    variant_id_1 UUID;
    variant_id_2 UUID;
    variant_id_3 UUID;
    variant_id_4 UUID;
    size_attr_id UUID;
    color_attr_id UUID;
    size_s_id UUID;
    size_m_id UUID;
    size_l_id UUID;
    color_black_id UUID;
    color_white_id UUID;
BEGIN
    -- Get the first active product
    SELECT id INTO product_uuid FROM products WHERE is_active = true LIMIT 1;
    
    IF product_uuid IS NOT NULL THEN
        -- Get attribute IDs
        SELECT id INTO size_attr_id FROM product_attributes WHERE name = 'size';
        SELECT id INTO color_attr_id FROM product_attributes WHERE name = 'color';
        
        -- Get attribute value IDs
        SELECT id INTO size_s_id FROM product_attribute_values WHERE attribute_id = size_attr_id AND value = 's';
        SELECT id INTO size_m_id FROM product_attribute_values WHERE attribute_id = size_attr_id AND value = 'm';
        SELECT id INTO size_l_id FROM product_attribute_values WHERE attribute_id = size_attr_id AND value = 'l';
        SELECT id INTO color_black_id FROM product_attribute_values WHERE attribute_id = color_attr_id AND value = 'black';
        SELECT id INTO color_white_id FROM product_attribute_values WHERE attribute_id = color_attr_id AND value = 'white';
        
        -- Create variant 1: Small, Black
        INSERT INTO product_variants (product_id, sku, price_adjustment, stock_quantity, sort_order, variant_combination)
        VALUES (product_uuid, 'TSHIRT-S-BLK', 0, 50, 1, '{"size": "s", "color": "black"}')
        RETURNING id INTO variant_id_1;
        
        -- Create variant 2: Medium, Black
        INSERT INTO product_variants (product_id, sku, price_adjustment, stock_quantity, sort_order, variant_combination)
        VALUES (product_uuid, 'TSHIRT-M-BLK', 0, 75, 2, '{"size": "m", "color": "black"}')
        RETURNING id INTO variant_id_2;
        
        -- Create variant 3: Large, Black
        INSERT INTO product_variants (product_id, sku, price_adjustment, stock_quantity, sort_order, variant_combination)
        VALUES (product_uuid, 'TSHIRT-L-BLK', 0, 60, 3, '{"size": "l", "color": "black"}')
        RETURNING id INTO variant_id_3;
        
        -- Create variant 4: Medium, White
        INSERT INTO product_variants (product_id, sku, price_adjustment, stock_quantity, sort_order, variant_combination)
        VALUES (product_uuid, 'TSHIRT-M-WHT', 0, 40, 4, '{"size": "m", "color": "white"}')
        RETURNING id INTO variant_id_4;
        
        -- Link variants to their attributes
        -- Variant 1: Small, Black
        INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
        (variant_id_1, size_attr_id, size_s_id),
        (variant_id_1, color_attr_id, color_black_id);
        
        -- Variant 2: Medium, Black
        INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
        (variant_id_2, size_attr_id, size_m_id),
        (variant_id_2, color_attr_id, color_black_id);
        
        -- Variant 3: Large, Black
        INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
        (variant_id_3, size_attr_id, size_l_id),
        (variant_id_3, color_attr_id, color_black_id);
        
        -- Variant 4: Medium, White
        INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES
        (variant_id_4, size_attr_id, size_m_id),
        (variant_id_4, color_attr_id, color_white_id);
        
        RAISE NOTICE 'Created 4 variants for product %', product_uuid;
    ELSE
        RAISE NOTICE 'No active products found. Please create a product first.';
    END IF;
END $$;

-- Verify the variants were created
SELECT 
    pv.id,
    p.name as product_name,
    pv.sku,
    pv.price_adjustment,
    pv.stock_quantity,
    pv.variant_combination,
    jsonb_agg(
        jsonb_build_object(
            'attribute', pa.display_name,
            'value', pav.display_value
        )
    ) as attributes
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN product_variant_attributes pva ON pv.id = pva.variant_id
LEFT JOIN product_attributes pa ON pva.attribute_id = pa.id
LEFT JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
GROUP BY pv.id, p.name, pv.sku, pv.price_adjustment, pv.stock_quantity, pv.variant_combination
ORDER BY pv.sort_order;


