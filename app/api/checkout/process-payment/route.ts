import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlutterwaveService } from '@/lib/services/flutterwave-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      amount, 
      customerEmail, 
      customerName, 
      customerPhone, 
      orderItems 
    } = body;

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    // Initialize Flutterwave payment
    const paymentUrl = await FlutterwaveService.createPaymentLink(
      orderId,
      amount,
      customerEmail,
      customerName,
      customerPhone,
      orderItems || []
    );

    if (!paymentUrl) {
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      paymentUrl 
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    console.error('Payment data received:', { 
      orderId, 
      amount, 
      customerEmail, 
      customerName, 
      customerPhone, 
      orderItemsCount: orderItems?.length 
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
