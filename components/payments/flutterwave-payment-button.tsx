'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FlutterwavePaymentButtonProps {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  orderItems: Array<{ name: string; quantity: number; price: number }>;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function FlutterwavePaymentButton({
  orderId,
  amount,
  customerEmail,
  customerName,
  customerPhone,
  orderItems,
  onPaymentSuccess,
  onPaymentError,
  className,
  disabled = false,
}: FlutterwavePaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Initialize payment
      const response = await fetch('/api/payments/flutterwave/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          customerEmail,
          customerName,
          customerPhone,
          orderItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to Flutterwave payment page
      window.location.href = data.paymentLink;

    } catch (error) {
      console.error('Payment initialization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`w-full ${className}`}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Pay with Flutterwave
        </>
      )}
    </Button>
  );
}

