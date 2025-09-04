'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { GuestAccountCreation } from '@/components/checkout/guest-account-creation';
import { toast } from 'react-hot-toast';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isGuestOrder, setIsGuestOrder] = useState(false);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [showAccountCreation, setShowAccountCreation] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transaction_id');
        const txRef = searchParams.get('tx_ref');
        const status = searchParams.get('status');

        if (!transactionId || !txRef) {
          setVerificationStatus('error');
          return;
        }

        if (status === 'cancelled') {
          setVerificationStatus('error');
          toast.error('Payment was cancelled');
          return;
        }

        // Extract order ID from tx_ref
        const extractedOrderId = txRef.split('_')[1];
        setOrderId(extractedOrderId);

        // Verify payment with backend
        const response = await fetch('/api/payments/flutterwave/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId,
            txRef,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationStatus('success');
          toast.success('Payment verified successfully!');
          
          // Check if this is a guest order and get customer email
          const { data: orderData } = await supabase
            .from('orders')
            .select('is_guest_order, shipping_address')
            .eq('id', extractedOrderId)
            .single();
            
          if (orderData?.is_guest_order) {
            setIsGuestOrder(true);
            setCustomerEmail(orderData.shipping_address?.email || '');
            setShowAccountCreation(true);
          }
        } else {
          setVerificationStatus('error');
          toast.error(data.error || 'Payment verification failed');
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('error');
        toast.error('Failed to verify payment');
      }
    };

    verifyPayment();
  }, [searchParams, supabase]);

  const handleContinueShopping = () => {
    router.push('/products');
  };

  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/orders/${orderId}`);
    }
  };

  const handleAccountCreated = () => {
    setShowAccountCreation(false);
    toast.success('Account created successfully!');
  };

  const handleSkipAccountCreation = () => {
    setShowAccountCreation(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 mb-4">
              {verificationStatus === 'loading' && (
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              )}
              {verificationStatus === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
              {verificationStatus === 'error' && (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {verificationStatus === 'loading' && 'Verifying Payment...'}
              {verificationStatus === 'success' && 'Payment Successful!'}
              {verificationStatus === 'error' && 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {verificationStatus === 'loading' && (
              <p className="text-gray-600">
                Please wait while we verify your payment...
              </p>
            )}
            
            {verificationStatus === 'success' && (
              <>
                <p className="text-gray-600">
                  Thank you for your purchase! Your payment has been processed successfully.
                </p>
                {orderId && (
                  <p className="text-sm text-gray-500">
                    Order ID: {orderId}
                  </p>
                )}
                <div className="space-y-2">
                  <Button onClick={handleViewOrder} className="w-full">
                    View Order Details
                  </Button>
                  <Button onClick={handleContinueShopping} variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <p className="text-gray-600">
                  There was an issue processing your payment. Please try again or contact support.
                </p>
                <div className="space-y-2">
                  <Button onClick={() => router.push('/checkout')} className="w-full">
                    Try Again
                  </Button>
                  <Button onClick={handleContinueShopping} variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Guest Account Creation */}
        {showAccountCreation && isGuestOrder && orderId && (
          <GuestAccountCreation
            orderId={orderId}
            customerEmail={customerEmail}
            onAccountCreated={handleAccountCreated}
            onSkip={handleSkipAccountCreation}
          />
        )}
      </div>
    </div>
  );
}
