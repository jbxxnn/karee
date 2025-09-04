-- Sample Orders for Testing Order Management System (Fixed Version)
-- Run this in your Supabase SQL Editor after setting up the database

-- First, let's create some sample addresses for the orders
INSERT INTO user_addresses (
    id,
    user_id,
    type,
    first_name,
    last_name,
    company,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    country,
    phone,
    is_default
) VALUES 
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'shipping',
    'John',
    'Doe',
    '',
    '123 Main St',
    'Apt 4B',
    'Lagos',
    'Lagos',
    '100001',
    'Nigeria',
    '+2348012345678',
    true
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'billing',
    'John',
    'Doe',
    '',
    '123 Main St',
    'Apt 4B',
    'Lagos',
    'Lagos',
    '100001',
    'Nigeria',
    '+2348012345678',
    true
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'shipping',
    'Jane',
    'Smith',
    'Beauty Co',
    '456 Oak Avenue',
    '',
    'Abuja',
    'FCT',
    '900001',
    'Nigeria',
    '+2348098765432',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'billing',
    'Jane',
    'Smith',
    'Beauty Co',
    '456 Oak Avenue',
    '',
    'Abuja',
    'FCT',
    '900001',
    'Nigeria',
    '+2348098765432',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'shipping',
    'Michael',
    'Johnson',
    '',
    '789 Pine Street',
    'Suite 12',
    'Port Harcourt',
    'Rivers',
    '500001',
    'Nigeria',
    '+2348055555555',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'billing',
    'Michael',
    'Johnson',
    '',
    '789 Pine Street',
    'Suite 12',
    'Port Harcourt',
    'Rivers',
    '500001',
    'Nigeria',
    '+2348055555555',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'shipping',
    'Sarah',
    'Williams',
    'Fashion House',
    '321 Elm Road',
    '',
    'Kano',
    'Kano',
    '700001',
    'Nigeria',
    '+2348077777777',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'billing',
    'Sarah',
    'Williams',
    'Fashion House',
    '321 Elm Road',
    '',
    'Kano',
    'Kano',
    '700001',
    'Nigeria',
    '+2348077777777',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'shipping',
    'David',
    'Brown',
    '',
    '654 Maple Drive',
    'Unit 8',
    'Ibadan',
    'Oyo',
    '200001',
    'Nigeria',
    '+2348066666666',
    false
),
(
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'billing',
    'David',
    'Brown',
    '',
    '654 Maple Drive',
    'Unit 8',
    'Ibadan',
    'Oyo',
    '200001',
    'Nigeria',
    '+2348066666666',
    false
);

-- Now let's create the orders using the address IDs
DO $$
DECLARE
    user_id UUID;
    shipping_address1_id UUID;
    billing_address1_id UUID;
    shipping_address2_id UUID;
    billing_address2_id UUID;
    shipping_address3_id UUID;
    billing_address3_id UUID;
    shipping_address4_id UUID;
    billing_address4_id UUID;
    shipping_address5_id UUID;
    billing_address5_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM auth.users LIMIT 1;
    
    -- Get address IDs
    SELECT id INTO shipping_address1_id FROM user_addresses WHERE first_name = 'John' AND type = 'shipping' LIMIT 1;
    SELECT id INTO billing_address1_id FROM user_addresses WHERE first_name = 'John' AND type = 'billing' LIMIT 1;
    SELECT id INTO shipping_address2_id FROM user_addresses WHERE first_name = 'Jane' AND type = 'shipping' LIMIT 1;
    SELECT id INTO billing_address2_id FROM user_addresses WHERE first_name = 'Jane' AND type = 'billing' LIMIT 1;
    SELECT id INTO shipping_address3_id FROM user_addresses WHERE first_name = 'Michael' AND type = 'shipping' LIMIT 1;
    SELECT id INTO billing_address3_id FROM user_addresses WHERE first_name = 'Michael' AND type = 'billing' LIMIT 1;
    SELECT id INTO shipping_address4_id FROM user_addresses WHERE first_name = 'Sarah' AND type = 'shipping' LIMIT 1;
    SELECT id INTO billing_address4_id FROM user_addresses WHERE first_name = 'Sarah' AND type = 'billing' LIMIT 1;
    SELECT id INTO shipping_address5_id FROM user_addresses WHERE first_name = 'David' AND type = 'shipping' LIMIT 1;
    SELECT id INTO billing_address5_id FROM user_addresses WHERE first_name = 'David' AND type = 'billing' LIMIT 1;
    
    -- Insert orders
    INSERT INTO orders (
        order_number,
        user_id,
        status,
        payment_status,
        subtotal,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        shipping_address_id,
        billing_address_id,
        created_at,
        updated_at
    ) VALUES 
    (
        'ORD-2024-001',
        user_id,
        'pending',
        'pending',
        279.99,
        20.00,
        0.00,
        0.00,
        299.99,
        shipping_address1_id,
        billing_address1_id,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
    ),
    (
        'ORD-2024-002',
        user_id,
        'processing',
        'paid',
        149.99,
        10.00,
        0.00,
        0.00,
        159.99,
        shipping_address2_id,
        billing_address2_id,
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '1 day'
    ),
    (
        'ORD-2024-003',
        user_id,
        'shipped',
        'paid',
        79.99,
        10.00,
        0.00,
        0.00,
        89.99,
        shipping_address3_id,
        billing_address3_id,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '12 hours'
    ),
    (
        'ORD-2024-004',
        user_id,
        'delivered',
        'paid',
        189.99,
        10.00,
        0.00,
        0.00,
        199.99,
        shipping_address4_id,
        billing_address4_id,
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '2 days'
    ),
    (
        'ORD-2024-005',
        user_id,
        'cancelled',
        'refunded',
        119.99,
        10.00,
        0.00,
        0.00,
        129.99,
        shipping_address5_id,
        billing_address5_id,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '8 days'
    );
END $$;

-- Now let's create order items
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
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES 
        (order1_id, product1_id, 'Product 1', 2, 139.99, 279.98),
        (order1_id, product2_id, 'Product 2', 1, 20.01, 20.01);
    
    -- Insert order items for Order 2
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES 
        (order2_id, product2_id, 'Product 2', 1, 149.99, 149.99);
    
    -- Insert order items for Order 3
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES 
        (order3_id, product3_id, 'Product 3', 1, 79.99, 79.99);
    
    -- Insert order items for Order 4
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES 
        (order4_id, product1_id, 'Product 1', 1, 189.99, 189.99);
    
    -- Insert order items for Order 5
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
    VALUES 
        (order5_id, product2_id, 'Product 2', 1, 119.99, 119.99);
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



