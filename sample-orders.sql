-- Sample Orders for Testing Order Management System
-- Run this in your Supabase SQL Editor after setting up the database

-- Insert sample orders
INSERT INTO orders (
    id,
    order_number,
    user_id,
    status,
    payment_status,
    total_amount,
    subtotal,
    tax_amount,
    shipping_amount,
    discount_amount,
    shipping_address,
    billing_address,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'ORD-2024-001',
    (SELECT id FROM auth.users LIMIT 1),
    'pending',
    'pending',
    299.99,
    279.99,
    20.00,
    0.00,
    0.00,
    '{"first_name": "John", "last_name": "Doe", "company": "", "address_line_1": "123 Main St", "address_line_2": "Apt 4B", "city": "Lagos", "state": "Lagos", "postal_code": "100001", "country": "Nigeria", "phone": "+2348012345678"}',
    '{"first_name": "John", "last_name": "Doe", "company": "", "address_line_1": "123 Main St", "address_line_2": "Apt 4B", "city": "Lagos", "state": "Lagos", "postal_code": "100001", "country": "Nigeria", "phone": "+2348012345678"}',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
),
(
    gen_random_uuid(),
    'ORD-2024-002',
    (SELECT id FROM auth.users LIMIT 1),
    'processing',
    'paid',
    159.99,
    149.99,
    10.00,
    0.00,
    0.00,
    '{"first_name": "Jane", "last_name": "Smith", "company": "Beauty Co", "address_line_1": "456 Oak Avenue", "address_line_2": "", "city": "Abuja", "state": "FCT", "postal_code": "900001", "country": "Nigeria", "phone": "+2348098765432"}',
    '{"first_name": "Jane", "last_name": "Smith", "company": "Beauty Co", "address_line_1": "456 Oak Avenue", "address_line_2": "", "city": "Abuja", "state": "FCT", "postal_code": "900001", "country": "Nigeria", "phone": "+2348098765432"}',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
),
(
    gen_random_uuid(),
    'ORD-2024-003',
    (SELECT id FROM auth.users LIMIT 1),
    'shipped',
    'paid',
    89.99,
    79.99,
    10.00,
    0.00,
    0.00,
    '{"first_name": "Michael", "last_name": "Johnson", "company": "", "address_line_1": "789 Pine Street", "address_line_2": "Suite 12", "city": "Port Harcourt", "state": "Rivers", "postal_code": "500001", "country": "Nigeria", "phone": "+2348055555555"}',
    '{"first_name": "Michael", "last_name": "Johnson", "company": "", "address_line_1": "789 Pine Street", "address_line_2": "Suite 12", "city": "Port Harcourt", "state": "Rivers", "postal_code": "500001", "country": "Nigeria", "phone": "+2348055555555"}',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '12 hours'
),
(
    gen_random_uuid(),
    'ORD-2024-004',
    (SELECT id FROM auth.users LIMIT 1),
    'delivered',
    'paid',
    199.99,
    189.99,
    10.00,
    0.00,
    0.00,
    '{"first_name": "Sarah", "last_name": "Williams", "company": "Fashion House", "address_line_1": "321 Elm Road", "address_line_2": "", "city": "Kano", "state": "Kano", "postal_code": "700001", "country": "Nigeria", "phone": "+2348077777777"}',
    '{"first_name": "Sarah", "last_name": "Williams", "company": "Fashion House", "address_line_1": "321 Elm Road", "address_line_2": "", "city": "Kano", "state": "Kano", "postal_code": "700001", "country": "Nigeria", "phone": "+2348077777777"}',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '2 days'
),
(
    gen_random_uuid(),
    'ORD-2024-005',
    (SELECT id FROM auth.users LIMIT 1),
    'cancelled',
    'refunded',
    129.99,
    119.99,
    10.00,
    0.00,
    0.00,
    '{"first_name": "David", "last_name": "Brown", "company": "", "address_line_1": "654 Maple Drive", "address_line_2": "Unit 8", "city": "Ibadan", "state": "Oyo", "postal_code": "200001", "country": "Nigeria", "phone": "+2348066666666"}',
    '{"first_name": "David", "last_name": "Brown", "company": "", "address_line_1": "654 Maple Drive", "address_line_2": "Unit 8", "city": "Ibadan", "state": "Oyo", "postal_code": "200001", "country": "Nigeria", "phone": "+2348066666666"}',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '8 days'
);

-- Get the order IDs for inserting order items
DO $$
DECLARE
    order1_id UUID;
    order2_id UUID;
    order3_id UUID;
    order4_id UUID;
    order5_id UUID;
    product1_id UUID;
    product2_id UUID;
    product3_id UUID;
BEGIN
    -- Get order IDs
    SELECT id INTO order1_id FROM orders WHERE order_number = 'ORD-2024-001' LIMIT 1;
    SELECT id INTO order2_id FROM orders WHERE order_number = 'ORD-2024-002' LIMIT 1;
    SELECT id INTO order3_id FROM orders WHERE order_number = 'ORD-2024-003' LIMIT 1;
    SELECT id INTO order4_id FROM orders WHERE order_number = 'ORD-2024-004' LIMIT 1;
    SELECT id INTO order5_id FROM orders WHERE order_number = 'ORD-2024-005' LIMIT 1;
    
    -- Get product IDs (assuming you have products)
    SELECT id INTO product1_id FROM products LIMIT 1;
    SELECT id INTO product2_id FROM products OFFSET 1 LIMIT 1;
    SELECT id INTO product3_id FROM products OFFSET 2 LIMIT 1;
    
    -- Insert order items for Order 1
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES 
        (order1_id, product1_id, 2, 139.99, 279.98),
        (order1_id, product2_id, 1, 20.01, 20.01);
    
    -- Insert order items for Order 2
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES 
        (order2_id, product2_id, 1, 149.99, 149.99);
    
    -- Insert order items for Order 3
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES 
        (order3_id, product3_id, 1, 79.99, 79.99);
    
    -- Insert order items for Order 4
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES 
        (order4_id, product1_id, 1, 189.99, 189.99);
    
    -- Insert order items for Order 5
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES 
        (order5_id, product2_id, 1, 119.99, 119.99);
END $$;

-- Verify the orders were created
SELECT 
    o.order_number,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    up.first_name || ' ' || up.last_name as customer_name,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN user_profiles up ON o.user_id = up.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.created_at, up.first_name, up.last_name
ORDER BY o.created_at DESC;



