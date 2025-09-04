import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  MapPin, 
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_attributes?: Record<string, string>;
  product_image?: string;
}

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch order details
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_id,
        variant_id,
        product_name,
        variant_name,
        quantity,
        unit_price,
        total_price,
        variant_attributes
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <Layout>
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="rounded-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border">
                      <div className="flex-1">
                        {item.product_image && (
                          <Image
                            src={item.product_image}
                            alt={item.product_name || 'Product Image'}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        )}
                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600 mt-1">
                            Variant: {item.variant_name}
                          </p>
                        )}
                        {item.variant_attributes && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.variant_attributes).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value as string}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.unit_price)} each
                        </p>
                        <p className="font-semibold text-lg">
                          {formatCurrency(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </div>
                    <div>{order.shipping_address.address}</div>
                    <div>
                      {order.shipping_address.city}, {order.shipping_address.state}
                    </div>
                    <div>
                      {order.shipping_address.country} {order.shipping_address.zip_code}
                    </div>
                    {order.shipping_address.phone && (
                      <div className="text-sm text-gray-600">
                        Phone: {order.shipping_address.phone}
                      </div>
                    )}
                    {order.shipping_address.email && (
                      <div className="text-sm text-gray-600">
                        Email: {order.shipping_address.email}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="rounded-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="rounded-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{order.payment_method || 'Not specified'}</span>
                </div>
                {order.payment_reference && (
                  <div className="flex justify-between items-center">
                    <span>Reference:</span>
                    <span className="text-[10px] font-mono">
                      {order.payment_reference}
                    </span>
                  </div>
                )}
                {order.paid_at && (
                  <div className="flex justify-between">
                    <span>Paid on:</span>
                    <span>{formatDate(order.paid_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="rounded-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {order.status === 'paid' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Payment Confirmed</p>
                        <p className="text-xs text-gray-600">
                          {order.paid_at ? formatDate(order.paid_at) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'completed' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Order Completed</p>
                        <p className="text-xs text-gray-600">
                          {order.updated_at ? formatDate(order.updated_at) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  );
}
