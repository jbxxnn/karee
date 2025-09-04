-- Setup variant tables for body butter products
-- Run this in your Supabase SQL Editor

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('product_attributes', 'product_attribute_values', 'product_variant_attributes', 'product_variants_detailed')
ORDER BY table_name;

-- 2. Create product attributes table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'color', 'image', 'number')),
    is_required BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create product attribute values table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_attribute_values (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL,
    display_value VARCHAR(100) NOT NULL,
    color_code VARCHAR(7),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(attribute_id, value)
);

-- 4. Enhance product_variants table if needed
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'variant_combination') THEN
        ALTER TABLE product_variants ADD COLUMN variant_combination JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'weight_grams') THEN
        ALTER TABLE product_variants ADD COLUMN weight_grams INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'image_url') THEN
        ALTER TABLE product_variants ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'sort_order') THEN
        ALTER TABLE product_variants ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 5. Create product variant attributes table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_variant_attributes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    attribute_value_id UUID NOT NULL REFERENCES product_attribute_values(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(variant_id, attribute_id)
);

-- 6. Insert body butter specific attributes
INSERT INTO product_attributes (name, display_name, type, is_required, sort_order) VALUES
('size', 'Size', 'text', true, 1),
('scent', 'Scent', 'text', false, 2),
('type', 'Type', 'text', false, 3)
ON CONFLICT (name) DO NOTHING;

-- 7. Insert body butter specific attribute values
INSERT INTO product_attribute_values (attribute_id, value, display_value, sort_order) VALUES
-- Size values for body butter
((SELECT id FROM product_attributes WHERE name = 'size'), '100ml', '100ml', 1),
((SELECT id FROM product_attributes WHERE name = 'size'), '200ml', '200ml', 2),
((SELECT id FROM product_attributes WHERE name = 'size'), '300ml', '300ml', 3),
((SELECT id FROM product_attributes WHERE name = 'size'), '500ml', '500ml', 4),

-- Scent values
((SELECT id FROM product_attributes WHERE name = 'scent'), 'unscented', 'Unscented', 1),
((SELECT id FROM product_attributes WHERE name = 'scent'), 'lavender', 'Lavender', 2),
((SELECT id FROM product_attributes WHERE name = 'scent'), 'vanilla', 'Vanilla', 3),
((SELECT id FROM product_attributes WHERE name = 'scent'), 'coconut', 'Coconut', 4),
((SELECT id FROM product_attributes WHERE name = 'scent'), 'shea', 'Shea', 5),

-- Type values
((SELECT id FROM product_attributes WHERE name = 'type'), 'body-butter', 'Body Butter', 1),
((SELECT id FROM product_attributes WHERE name = 'type'), 'shea-butter', 'Shea Butter', 2),
((SELECT id FROM product_attributes WHERE name = 'type'), 'lotion', 'Lotion', 3)
ON CONFLICT (attribute_id, value) DO NOTHING;

-- 8. Create indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_variant_id ON product_variant_attributes(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_attribute_id ON product_variant_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_values_attribute_id ON product_attribute_values(attribute_id);

-- 9. Create the detailed view
CREATE OR REPLACE VIEW product_variants_detailed AS
SELECT 
    pv.id as variant_id,
    pv.product_id,
    p.name as product_name,
    pv.sku as variant_sku,
    pv.price_adjustment,
    pv.stock_quantity,
    pv.is_active as variant_active,
    pv.variant_combination,
    pv.image_url as variant_image,
    pv.weight_grams,
    pv.sort_order,
    -- Aggregate all attributes for this variant
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'attribute_name', pa.name,
                'attribute_display', pa.display_name,
                'value', pav.value,
                'display_value', pav.display_value,
                'color_code', pav.color_code
            ) ORDER BY pa.sort_order
        ) FILTER (WHERE pa.id IS NOT NULL),
        '[]'::jsonb
    ) as attributes
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN product_variant_attributes pva ON pv.id = pva.variant_id
LEFT JOIN product_attributes pa ON pva.attribute_id = pa.id
LEFT JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
GROUP BY pv.id, pv.product_id, p.name, pv.sku, pv.price_adjustment, pv.stock_quantity, pv.is_active, pv.variant_combination, pv.image_url, pv.weight_grams, pv.sort_order;

-- 10. Show success message
SELECT 'Body butter variant system setup complete!' as status;


