import { NextRequest, NextResponse } from 'next/server';
import { FlutterwaveService } from '@/lib/services/flutterwave-service';
import { createClient } from '@/lib/supabase/server';
import { validateFlutterwaveConfig } from '@/lib/config/flutterwave';

export async function POST(request: NextRequest) {
  try {
    // Validate Flutterwave configuration
    if (!validateFlutterwaveConfig()) {
      return NextResponse.json(
        { error: 'Flutterwave configuration is missing' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { orderId, amount, customerEmail, customerName, customerPhone, orderItems } = body;

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is already paid
    if (order.status === 'paid' || order.status === 'completed') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      );
    }

    // Create payment link
    const paymentLink = await FlutterwaveService.createPaymentLink(
      orderId,
      amount,
      customerEmail,
      customerName,
      customerPhone,
      orderItems || []
    );

    // Update order with payment reference
    const txRef = `KAREE_${orderId}_${Date.now()}`;
    await supabase
      .from('orders')
      .update({ 
        payment_reference: txRef,
        status: 'pending_payment'
      })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      paymentLink,
      txRef,
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
