'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, CheckCircle } from 'lucide-react';

import { CheckoutAuthSection } from '@/components/checkout/checkout-auth-section';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function CheckoutForm() {
  // const router = useRouter();
  const { items, total } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [showAuthSection, setShowAuthSection] = useState(true);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [formData, setFormData] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
  });

  const supabase = createClient();

  // Check if user is already logged in and load their address
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setShowAuthSection(false);
        
        // Pre-fill form with user data if available
        if (user.user_metadata) {
          setFormData(prev => ({
            ...prev,
            firstName: user.user_metadata.first_name || prev.firstName,
            lastName: user.user_metadata.last_name || prev.lastName,
            email: user.email || prev.email,
          }));
        }

        // Load user's saved address
        setIsLoadingAddress(true);
        try {
          const { data: userAddress, error } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'shipping')
            .single();

          if (userAddress && !error) {
            console.log('Loading saved address:', userAddress);
            setHasSavedAddress(true);
            setFormData(prev => ({
              ...prev,
              firstName: userAddress.first_name || prev.firstName,
              lastName: userAddress.last_name || prev.lastName,
              email: user.email || prev.email,
              phone: userAddress.phone || prev.phone,
              address: userAddress.address_line_1 || prev.address,
              city: userAddress.city || prev.city,
              state: userAddress.state || prev.state,
              zipCode: userAddress.postal_code || prev.zipCode,
              country: userAddress.country || prev.country,
            }));
          } else {
            console.log('No saved address found or error:', error);
            setHasSavedAddress(false);
          }
        } catch (error) {
          console.error('Error loading user address:', error);
          setHasSavedAddress(false);
        } finally {
          setIsLoadingAddress(false);
        }
      }
    };
    checkUser();
  }, [supabase.auth]);

  const handleInputChange = (field: keyof ShippingForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => {
            const price = item.selectedVariant?.price || item.product.price;
            return {
              product_id: item.product.id,
              variant_id: item.selectedVariant?.id || null,
              quantity: item.quantity,
              unit_price: price,
              total_price: price * item.quantity,
              product_name: item.product.name,
              product_sku: item.product.sku,
              variant_name: item.selectedVariant?.name || null,
              variant_attributes: item.product.variant_attributes || null,
            };
          }),
          shipping_address: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            country: formData.country,
          },
          total_amount: total,
          status: 'pending_payment',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleAuthSuccess = (user: User) => {
    console.log('Auth success callback called with user:', user);
    setCurrentUser(user);
    setShowAuthSection(false);
    toast.success('Welcome back!');
    console.log('Auth success - user set, auth section hidden');
  };

  const handleGuestCheckout = () => {
    setIsGuestCheckout(true);
    setShowAuthSection(false);
  };


  return (
    <div className="space-y-6">
      {/* Authentication Section */}
      {showAuthSection && (
        <CheckoutAuthSection
          onAuthSuccess={handleAuthSuccess}
          onGuestCheckout={handleGuestCheckout}
          initialEmail={formData.email}
        />
      )}

      {/* User Status Display */}
      {(currentUser || isGuestCheckout) && (
        <Card className="rounded-none shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {currentUser ? `Logged in as ${currentUser.email}` : 'Checking out as guest'}
                </p>
                <p className="text-sm text-gray-600">
                  {currentUser ? 'Your order will be saved to your account' : 'You can create an account after checkout'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAuthSection(true);
                  setCurrentUser(null);
                  setIsGuestCheckout(false);
                }}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checkout Form - Only show if authenticated or guest checkout */}
      {(currentUser || isGuestCheckout) && (
        <div className="space-y-6">
      {/* Shipping Information */}
          <Card className="rounded-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Shipping Information
          </CardTitle>
            {isLoadingAddress && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading saved address...
              </div>
            )}
            {hasSavedAddress && !isLoadingAddress && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Using saved address
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="John"
                className="rounded-none shadow-none h-12 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="john@example.com"
                className="rounded-none shadow-none h-12 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                placeholder="(555) 123-4567"
                className="rounded-none shadow-none h-12 text-gray-500"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              placeholder="123 Main St"
              className="rounded-none shadow-none h-12 text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                placeholder="New York"
                className="rounded-none shadow-none h-12 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
                placeholder="NY"
                className="rounded-none shadow-none h-12 text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                required
                placeholder="10001"
                className="rounded-none shadow-none h-12 text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              required
              className="rounded-none shadow-none h-12 text-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="rounded-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Payment
          </CardTitle>
          <p className="text-sm text-gray-600">
            All transactions are secure and encrypted.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Method Selection */}
          <div className="border border-gray-200 rounded-none p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="credit-card"
                  name="payment-method"
                  value="credit-card"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="credit-card" className="text-sm font-medium text-gray-900">
                  Credit card
                </label>
          </div>
              <div className="flex items-center gap-2">
                {/* Credit Card Logos */}
                <div className="flex items-center gap-1">
                  <Image
                    src="/visa.sxIq5Dot.svg"
                    alt="Visa"
                    width={38}
                    height={24}
                    className="rounded"
                  />
                  <Image
                    src="/mastercard.1c4_lyMp.svg"
                    alt="Mastercard"
                    width={38}
                    height={24}
                    className="rounded"
                  />
                  <Image
                    src="/amex.Csr7hRoy.svg"
                    alt="American Express"
                    width={38}
                    height={24}
                    className="rounded"
                  />
                  <Image
                    src="/discover.C7UbFpNb.svg"
                    alt="Discover"
                    width={38}
                    height={24}
                    className="rounded"
                  />
                  <div className="w-6 h-5 bg-white border border-gray-300 rounded text-gray-600 text-xs flex items-center justify-center font-bold">
                    +2
                  </div>
                </div>
            </div>
            </div>
          </div>

          {/* Payment Provider Info */}
          <div className="text-center p-4 bg-gray-50 rounded-none">
            <p className="flex items-center justify-center mb-2">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="-252.3 356.1 163 80.9" 
            width="50" 
            height="30">
              <path 
              fill="none" 
              stroke="#000000" 
              stroke-miterlimit="10" 
              stroke-width="2px" 
              d="M-108.9 404.1v30c0 1.1-.9 2-2 2H-231c-1.1 0-2-.9-2-2v-75c0-1.1.9-2 2-2h120.1c1.1 0 2 .9 2 2v37m-124.1-29h124.1" 
              stroke-opacity="0.56">
                </path>
                <circle 
                cx="-227.8" 
                cy="361.9" 
                r="1.8" 
                fill="#000000" 
                fill-opacity="0.56">
                  </circle>
                  <circle 
                  cx="-222.2" 
                  cy="361.9" 
                  r="1.8" 
                  fill="#000000" 
                  fill-opacity="0.56">
                    </circle><circle 
                    cx="-216.6" 
                    cy="361.9" 
                    r="1.8" 
                    fill="#000000" 
                    fill-opacity="0.56">
                      </circle>
                      <path 
                      fill="none" 
                      stroke="#000000" 
                      stroke-miterlimit="10" 
                      stroke-width="2px" 
                      d="M-128.7 400.1H-92m-3.6-4.1 4 4.1-4 4.1" 
                      stroke-opacity="0.56">
                        </path>
                        </svg>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>After clicking &quot;Pay with Flutterwave&quot;, you will be redirected to Flutterwave to complete your purchase securely.</span>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-center">
      
        
        <Button
          type="button"
          size="lg"
          disabled={isProcessing}
          onClick={async () => {
            setIsProcessing(true);
            try {
              // Create order first
              const newOrderId = await createOrder();
              
              // Process payment through API route
              if (newOrderId) {
                const response = await fetch('/api/checkout/process-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: newOrderId,
                    amount: total,
                    customerEmail: formData.email,
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    customerPhone: formData.phone,
                    orderItems: items.map(item => ({
                      name: item.product.name,
                      quantity: item.quantity,
                      price: (item.selectedVariant?.price || item.product.price).toString(),
                    }))
                  })
                });

                const result = await response.json();

                if (result.success && result.paymentUrl) {
                  // Redirect to Flutterwave payment page
                  window.location.href = result.paymentUrl;
                } else {
                  toast.error(result.error || 'Failed to initialize payment');
                }
              }
            } catch (error) {
              console.error('Error processing payment:', error);
              toast.error('Failed to process payment');
            } finally {
              setIsProcessing(false);
            }
          }}
          className="w-full rounded-none"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Pay with Flutterwave
            </div>
          )}
        </Button>
      </div>
        </div>
      )}
    </div>
  );
}
