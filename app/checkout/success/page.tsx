'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate a random order number for demo purposes
    // In production, this would come from the actual order
    const randomOrder = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(randomOrder);
    
    // Clear the cart since the order was successful
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
            Order Confirmed!
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Thank you for your purchase. We've received your order and will begin processing it right away.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Order Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                <Badge variant="secondary" className="font-mono">
                  {orderNumber}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Confirmed
                </Badge>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">What happens next?</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• You'll receive an order confirmation email shortly</p>
              <p>• We'll process your order within 1-2 business days</p>
              <p>• You'll get tracking information once your order ships</p>
              <p>• Estimated delivery: 3-5 business days</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="w-full">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/orders" className="w-full">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Questions about your order?</p>
            <p>Contact us at support@kareestore.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
