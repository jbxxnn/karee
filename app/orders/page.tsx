import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';

interface OrderItem {
  id: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_attributes?: Record<string, string>;
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user's orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_name,
        variant_name,
        quantity,
        unit_price,
        total_price,
        variant_attributes
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
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
      <div className="max-w-6xl mx-auto min-h-[calc(80vh-100px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card className="rounded-none shadow-none">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="rounded-none shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(order.total_amount)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
                      <div className="space-y-2">
                        {order.order_items?.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-medium">{item.product_name}</span>
                              {item.variant_name && (
                                <span className="text-gray-600 ml-2">
                                  ({item.variant_name})
                                </span>
                              )}
                              {item.variant_attributes && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {Object.entries(item.variant_attributes).map(([key, value]) => (
                                    <span key={key} className="mr-2">
                                      {key}: {value as string}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div>Qty: {item.quantity}</div>
                              <div className="font-medium">
                                {formatCurrency(item.total_price)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                   

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {order.payment_method && (
                          <span>Paid via {order.payment_method}</span>
                        )}
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
}
