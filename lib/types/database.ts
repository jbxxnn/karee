// Database types for the ecommerce application
// These types match the Supabase database schema

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type AddressType = 'billing' | 'shipping';
export type DiscountType = 'percentage' | 'fixed_amount';
export type UserRole = 'customer' | 'admin' | 'moderator';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  weight_grams?: number;
  dimensions_cm?: {
    length: number;
    width: number;
    height: number;
  };
  stock_quantity: number;
  low_stock_threshold: number;
  category_id?: string;
  brand?: string;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price_adjustment: number;
  stock_quantity: number;
  sku?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string;
  role: UserRole;
  preferences?: {
    newsletter?: boolean;
    marketing_emails?: boolean;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  type: AddressType;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address_id?: string;
  billing_address_id?: string;
  notes?: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  payment_method?: string;
  payment_reference?: string;
  paid_at?: string;
  payment_details?: Record<string, unknown>;
  is_guest_order?: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  created_at: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

// Extended types with relationships
export interface ProductWithImages extends Product {
  category?: Category;
  images: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductWithDetails extends ProductWithImages {
  reviews?: ProductReview[];
  average_rating?: number;
  review_count?: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant?: ProductVariant;
  images: ProductImage[];
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  shipping_address?: UserAddress;
  billing_address?: UserAddress;
}

export interface UserProfileWithAddresses extends UserProfile {
  addresses: UserAddress[];
}

// Database response types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, 'id' | 'created_at'>;
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, 'id' | 'created_at'>;
        Update: Partial<Omit<ProductVariant, 'id' | 'created_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_addresses: {
        Row: UserAddress;
        Insert: Omit<UserAddress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserAddress, 'id' | 'created_at' | 'updated_at'>>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CartItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at'>;
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
      };
      wishlist_items: {
        Row: WishlistItem;
        Insert: Omit<WishlistItem, 'id' | 'created_at'>;
        Update: Partial<Omit<WishlistItem, 'id' | 'created_at'>>;
      };
      product_reviews: {
        Row: ProductReview;
        Insert: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>>;
      };
      coupons: {
        Row: Coupon;
        Insert: Omit<Coupon, 'id' | 'used_count' | 'created_at'>;
        Update: Partial<Omit<Coupon, 'id' | 'used_count' | 'created_at'>>;
      };
      coupon_usage: {
        Row: CouponUsage;
        Insert: Omit<CouponUsage, 'id' | 'used_at'>;
        Update: Partial<Omit<CouponUsage, 'id' | 'used_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_product_with_images: {
        Args: { product_slug: string };
        Returns: ProductWithImages[];
      };
    };
    Enums: {
      order_status: OrderStatus;
      payment_status: PaymentStatus;
    };
  };
}
