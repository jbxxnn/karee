-- Enhance the product variants system for better variable product management
-- Run this in your Supabase SQL Editor

-- 1. First, let's check what we currently have
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'product_variants' 
ORDER BY ordinal_position;

-- 2. Create product attributes table (for defining variant types like Size, Color, etc.)
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g., "Size", "Color", "Material"
    display_name VARCHAR(100) NOT NULL, -- e.g., "Size", "Color", "Material"
    type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'color', 'image', 'number')),
    is_required BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create product attribute values table (for defining specific values like "Small", "Red", etc.)
CREATE TABLE IF NOT EXISTS product_attribute_values (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL, -- e.g., "Small", "Red", "Cotton"
    display_value VARCHAR(100) NOT NULL, -- e.g., "Small", "Red", "Cotton"
    color_code VARCHAR(7), -- For color attributes, store hex color
    image_url TEXT, -- For image attributes
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(attribute_id, value)
);

-- 4. Enhance the existing product_variants table
-- Add columns if they don't exist
DO $$
BEGIN
    -- Add variant_combination column to store JSON of all variant attributes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'variant_combination') THEN
        ALTER TABLE product_variants ADD COLUMN variant_combination JSONB;
    END IF;
    
    -- Add weight_grams column for variant-specific weight
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'weight_grams') THEN
        ALTER TABLE product_variants ADD COLUMN weight_grams INTEGER;
    END IF;
    
    -- Add image_url column for variant-specific images
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'image_url') THEN
        ALTER TABLE product_variants ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add sort_order column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'sort_order') THEN
        ALTER TABLE product_variants ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 5. Create product variant attributes table (links variants to their specific attribute values)
CREATE TABLE IF NOT EXISTS product_variant_attributes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    attribute_value_id UUID NOT NULL REFERENCES product_attribute_values(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(variant_id, attribute_id)
);

-- 6. Insert some common product attributes
INSERT INTO product_attributes (name, display_name, type, is_required, sort_order) VALUES
('size', 'Size', 'text', true, 1),
('color', 'Color', 'color', false, 2),
('material', 'Material', 'text', false, 3),
('style', 'Style', 'text', false, 4)
ON CONFLICT (name) DO NOTHING;

-- 7. Insert some common attribute values
INSERT INTO product_attribute_values (attribute_id, value, display_value, color_code, sort_order) VALUES
-- Size values
((SELECT id FROM product_attributes WHERE name = 'size'), 'xs', 'XS', NULL, 1),
((SELECT id FROM product_attributes WHERE name = 'size'), 's', 'S', NULL, 2),
((SELECT id FROM product_attributes WHERE name = 'size'), 'm', 'M', NULL, 3),
((SELECT id FROM product_attributes WHERE name = 'size'), 'l', 'L', NULL, 4),
((SELECT id FROM product_attributes WHERE name = 'size'), 'xl', 'XL', NULL, 5),
((SELECT id FROM product_attributes WHERE name = 'size'), 'xxl', 'XXL', NULL, 6),

-- Color values
((SELECT id FROM product_attributes WHERE name = 'color'), 'black', 'Black', '#000000', 1),
((SELECT id FROM product_attributes WHERE name = 'color'), 'white', 'White', '#FFFFFF', 2),
((SELECT id FROM product_attributes WHERE name = 'color'), 'red', 'Red', '#FF0000', 3),
((SELECT id FROM product_attributes WHERE name = 'color'), 'blue', 'Blue', '#0000FF', 4),
((SELECT id FROM product_attributes WHERE name = 'color'), 'green', 'Green', '#008000', 5),
((SELECT id FROM product_attributes WHERE name = 'color'), 'yellow', 'Yellow', '#FFFF00', 6),
((SELECT id FROM product_attributes WHERE name = 'color'), 'purple', 'Purple', '#800080', 7),
((SELECT id FROM product_attributes WHERE name = 'color'), 'pink', 'Pink', '#FFC0CB', 8),

-- Material values
((SELECT id FROM product_attributes WHERE name = 'material'), 'cotton', 'Cotton', NULL, 1),
((SELECT id FROM product_attributes WHERE name = 'material'), 'polyester', 'Polyester', NULL, 2),
((SELECT id FROM product_attributes WHERE name = 'material'), 'wool', 'Wool', NULL, 3),
((SELECT id FROM product_attributes WHERE name = 'material'), 'silk', 'Silk', NULL, 4),
((SELECT id FROM product_attributes WHERE name = 'material'), 'leather', 'Leather', NULL, 5),

-- Style values
((SELECT id FROM product_attributes WHERE name = 'style'), 'casual', 'Casual', NULL, 1),
((SELECT id FROM product_attributes WHERE name = 'style'), 'formal', 'Formal', NULL, 2),
((SELECT id FROM product_attributes WHERE name = 'style'), 'sport', 'Sport', NULL, 3),
((SELECT id FROM product_attributes WHERE name = 'style'), 'vintage', 'Vintage', NULL, 4)
ON CONFLICT (attribute_id, value) DO NOTHING;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_variant_id ON product_variant_attributes(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_attributes_attribute_id ON product_variant_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_values_attribute_id ON product_attribute_values(attribute_id);

-- 9. Create a view for easy variant querying
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
    jsonb_agg(
        jsonb_build_object(
            'attribute_name', pa.name,
            'attribute_display', pa.display_name,
            'value', pav.value,
            'display_value', pav.display_value,
            'color_code', pav.color_code
        ) ORDER BY pa.sort_order
    ) as attributes
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN product_variant_attributes pva ON pv.id = pva.variant_id
LEFT JOIN product_attributes pa ON pva.attribute_id = pa.id
LEFT JOIN product_attribute_values pav ON pva.attribute_value_id = pav.id
GROUP BY pv.id, pv.product_id, p.name, pv.sku, pv.price_adjustment, pv.stock_quantity, pv.is_active, pv.variant_combination, pv.image_url, pv.weight_grams, pv.sort_order;

-- 10. Show the enhanced structure
SELECT 'Enhanced product variants system created successfully!' as status;


