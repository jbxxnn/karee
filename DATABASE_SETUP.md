# Database Setup Guide

This guide will help you set up the database schema for your ecommerce website in Supabase.

## Prerequisites

1. **Supabase Account**: Make sure you have a Supabase account and project created
2. **Project URL and API Keys**: You'll need your project URL and anon key

## Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Navigate to the **SQL Editor** in the left sidebar

## Step 2: Run the Database Schema

1. In the SQL Editor, click **New Query**
2. Copy the entire contents of `database-schema.sql`
3. Paste it into the query editor
4. Click **Run** to execute the schema

## Step 3: Verify the Setup

After running the schema, you should see:

### Tables Created:
- ✅ `categories` - Product categories
- ✅ `products` - Product information
- ✅ `product_images` - Product images
- ✅ `product_variants` - Product variants (sizes, colors, etc.)
- ✅ `user_profiles` - Extended user information
- ✅ `user_addresses` - User billing/shipping addresses
- ✅ `cart_items` - Shopping cart
- ✅ `orders` - Customer orders
- ✅ `order_items` - Individual items in orders
- ✅ `wishlist_items` - User wishlists
- ✅ `product_reviews` - Product reviews and ratings
- ✅ `coupons` - Discount coupons
- ✅ `coupon_usage` - Coupon usage tracking

### Sample Data:
- 5 product categories (Electronics, Clothing, Home & Garden, Books, Sports)
- 5 sample products with images
- Sample product images from Unsplash

### Functions Created:
- `get_product_with_images(product_slug)` - Get product details with images
- `update_updated_at_column()` - Auto-update timestamps
- `generate_order_number()` - Auto-generate order numbers

## Step 4: Configure Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Step 5: Test the Database

You can test the database by running this query in the SQL Editor:

```sql
-- Test getting a product with images
SELECT * FROM get_product_with_images('wireless-bluetooth-headphones');

-- Test getting all categories
SELECT * FROM categories;

-- Test getting all products
SELECT p.*, c.name as category_name 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id;
```

## Database Features

### 🔒 Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Public read access for products and categories
- Secure user data isolation

### 📊 Performance Optimized
- Indexes on frequently queried columns
- Efficient foreign key relationships
- Optimized queries for product listings

### 🛒 Ecommerce Ready
- Complete product management system
- Shopping cart functionality
- Order processing and tracking
- User profiles and addresses
- Review and rating system
- Coupon and discount system

### 🔄 Automatic Features
- Auto-generated order numbers
- Automatic timestamp updates
- Cascading deletes for related data

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Make sure you're using the correct API keys
2. **Table Already Exists**: Drop existing tables first if needed
3. **RLS Policy Errors**: Check that policies are created correctly

### Reset Database (if needed):

```sql
-- Drop all tables (WARNING: This will delete all data)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

## Next Steps

After setting up the database:

1. **Update Supabase Client**: Ensure your client uses the new types
2. **Create Product Components**: Build the UI for displaying products
3. **Implement Cart System**: Add shopping cart functionality
4. **Add Authentication**: Extend user profiles and addresses
5. **Build Checkout**: Implement the order process

## Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify all SQL commands executed successfully
3. Ensure environment variables are correctly set
4. Check the browser console for client-side errors

---

**Note**: This schema includes sample data for testing. Remove or modify the sample data as needed for your production environment.
