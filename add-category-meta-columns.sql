-- Add missing meta columns to categories table
-- Run this in your Supabase SQL Editor

-- Add meta_title and meta_description columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Update existing categories to have default values
UPDATE categories 
SET 
    meta_title = name,
    meta_description = description
WHERE meta_title IS NULL OR meta_description IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN categories.meta_title IS 'SEO title for search engines';
COMMENT ON COLUMN categories.meta_description IS 'SEO description for search engines';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories' 
AND column_name IN ('meta_title', 'meta_description')
ORDER BY column_name;




