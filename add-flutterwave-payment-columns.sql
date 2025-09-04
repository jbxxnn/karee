-- Add missing columns to orders table for Flutterwave payment integration
-- This script adds the columns that the Flutterwave verification route needs

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
-- First check if the enum value exists, if not add it
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
