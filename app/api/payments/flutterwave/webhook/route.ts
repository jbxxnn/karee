import { NextRequest, NextResponse } from 'next/server';
import { FlutterwaveService } from '@/lib/services/flutterwave-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // const signature = request.headers.get('verif-hash');

    // Verify webhook signature (implement proper verification)
    // For now, we'll process the webhook
    console.log('Flutterwave webhook received:', body);

    // Handle the webhook
    const isProcessed = await FlutterwaveService.handleWebhook(body);

    if (isProcessed) {
      // Extract order information
      const txRef = body.data?.tx_ref;
      const transactionId = body.data?.id;
      const status = body.data?.status;

      if (txRef && transactionId && status === 'successful') {
        const orderId = txRef.split('_')[1];

        // Update order status
        const supabase = await createClient();
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_method: 'flutterwave',
            payment_reference: body.data.flw_ref,
            paid_at: new Date().toISOString(),
            payment_details: {
              transaction_id: transactionId,
              amount: body.data.amount,
              currency: body.data.currency,
              payment_type: body.data.payment_type,
              customer: body.data.customer,
            }
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order from webhook:', updateError);
        } else {
          console.log(`Order ${orderId} updated successfully from webhook`);
        }
      }
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Flutterwave webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
