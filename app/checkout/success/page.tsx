import { Suspense } from 'react';
import PaymentSuccess from '@/components/payments/payment-success';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}