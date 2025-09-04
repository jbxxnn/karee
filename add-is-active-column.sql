-- Add is_active column to user_profiles table
-- Run this in your Supabase SQL Editor

-- Add the is_active column with default value true
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing records to be active by default
UPDATE user_profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- Make the column NOT NULL
ALTER TABLE user_profiles 
ALTER COLUMN is_active SET NOT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'is_active';


