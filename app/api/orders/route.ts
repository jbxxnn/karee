import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  product_sku?: string;
  variant_name?: string;
  variant_attributes?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Order creation API called');
    const body = await request.json();
    console.log('Request body received:', body);
    
    const { items, shipping_address, total_amount, status = 'pending_payment' } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!shipping_address || !total_amount) {
      return NextResponse.json(
        { error: 'Shipping address and total amount are required' },
        { status: 400 }
      );
    }

    // Get authenticated user (optional for guest checkout)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Allow guest checkout if no user is authenticated
    const userId = user?.id || null;

    // Calculate subtotal from order items
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);

    console.log('Items received:', items);
    console.log('Creating order with data:', {
      userId,
      status,
      subtotal,
      total_amount,
      itemsCount: items.length,
      isGuestOrder: !userId
    });

    // Create order
    const orderData = {
      order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      status,
      payment_status: 'pending',
      subtotal: subtotal,
      tax_amount: 0,
      shipping_amount: 0,
      discount_amount: 0,
      total_amount: total_amount,
      currency: 'NGN',
      shipping_address: shipping_address,
      payment_method: null,
      payment_reference: null,
      paid_at: null,
      payment_details: null,
      is_guest_order: !userId, // Mark as guest order if no user
    };

    console.log('Order data to insert:', orderData);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: OrderItem) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      product_name: item.product_name,
      product_sku: item.product_sku || null,
      variant_name: item.variant_name || null,
      variant_attributes: item.variant_attributes || null,
    }));

    console.log('Order items to insert:', orderItems);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Update user profile with shipping information (if user is logged in)
    if (userId && shipping_address) {
      try {
        console.log('Updating user profile for user:', userId);
        
        // First check if profile exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              first_name: shipping_address.first_name,
              last_name: shipping_address.last_name,
              phone: shipping_address.phone,
            })
            .eq('user_id', userId);
          
          if (updateError) {
            console.error('Error updating user profile:', updateError);
          } else {
            console.log('User profile updated successfully');
          }
        } else {
          // Create new profile
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: userId,
              first_name: shipping_address.first_name,
              last_name: shipping_address.last_name,
              phone: shipping_address.phone,
            });
          
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            console.log('User profile created successfully');
          }
        }
      } catch (profileError) {
        console.error('Error with user profile:', profileError);
        // Don't fail the order creation if profile update fails
      }

      // Create or update user address
      try {
        console.log('Starting address creation/update for user:', userId);
        console.log('Shipping address data:', shipping_address);
        
        // Check if user already has an address
        const { data: existingAddress, error: addressCheckError } = await supabase
          .from('user_addresses')
          .select('id')
          .eq('user_id', userId)
          .single();

        console.log('Existing address check:', { existingAddress, addressCheckError });

        if (existingAddress) {
          console.log('Updating existing address for user:', userId);
          // Update existing address
          const { error: updateError } = await supabase
            .from('user_addresses')
            .update({
              type: 'shipping', // Add the required type field
              first_name: shipping_address.first_name,
              last_name: shipping_address.last_name,
              phone: shipping_address.phone,
              address_line_1: shipping_address.address,
              city: shipping_address.city,
              state: shipping_address.state,
              postal_code: shipping_address.zip_code,
              country: shipping_address.country,
            })
            .eq('user_id', userId);
          
          console.log('Address update result:', { updateError });
        } else {
          console.log('Creating new address for user:', userId);
          // Create new address
          const { data: newAddress, error: insertError } = await supabase
            .from('user_addresses')
            .insert({
              user_id: userId,
              type: 'shipping', // Add the required type field
              first_name: shipping_address.first_name,
              last_name: shipping_address.last_name,
              phone: shipping_address.phone,
              address_line_1: shipping_address.address,
              city: shipping_address.city,
              state: shipping_address.state,
              postal_code: shipping_address.zip_code,
              country: shipping_address.country,
            })
            .select();
          
          console.log('Address creation result:', { newAddress, insertError });
        }
      } catch (addressError) {
        console.error('Error updating user address:', addressError);
        // Don't fail the order creation if address update fails
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          quantity,
          unit_price,
          total_price,
          product_name,
          variant_name,
          variant_attributes
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
