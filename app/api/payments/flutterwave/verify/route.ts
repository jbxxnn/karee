import { NextRequest, NextResponse } from 'next/server';
import { FlutterwaveService } from '@/lib/services/flutterwave-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, txRef } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Verify payment with Flutterwave
    console.log('Verifying payment with transaction ID:', transactionId);
    const verification = await FlutterwaveService.verifyPayment(transactionId);
    console.log('Verification response:', verification);

    if (verification.status !== 'success' || verification.data.status !== 'successful') {
      console.log('Payment verification failed:', {
        status: verification.status,
        dataStatus: verification.data?.status
      });
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Extract order ID from tx_ref
    const orderId = txRef?.split('_')[1];
    if (!orderId) {
      return NextResponse.json(
        { error: 'Invalid transaction reference' },
        { status: 400 }
      );
    }

    // Update order status in database
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_method: 'flutterwave',
        payment_reference: verification.data.flw_ref,
        paid_at: new Date().toISOString(),
        payment_details: {
          transaction_id: verification.data.id,
          amount: verification.data.amount,
          currency: verification.data.currency,
          payment_type: verification.data.payment_type,
          customer: verification.data.customer,
        }
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Update product stock quantities
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity, variant_id')
      .eq('order_id', orderId);

    if (orderItems) {
      for (const item of orderItems) {
        if (item.variant_id) {
          // Get current variant stock and update
          const { data: variant } = await supabase
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', item.variant_id)
            .single();
            
          if (variant) {
            await supabase
              .from('product_variants')
              .update({
                stock_quantity: Math.max(0, variant.stock_quantity - item.quantity)
              })
              .eq('id', item.variant_id);
          }
        } else {
          // Get current product stock and update
          const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();
            
          if (product) {
            await supabase
              .from('products')
              .update({
                stock_quantity: Math.max(0, product.stock_quantity - item.quantity)
              })
              .eq('id', item.product_id);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId,
      transactionId: verification.data.id,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
