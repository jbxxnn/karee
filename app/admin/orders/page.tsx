'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/lib/services/order-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  Package, 
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from '@/lib/types/database';

interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  created_at: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product_name: string;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'all'>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    loadOrders();
    loadStats();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const orderStats = await orderService.getOrderStats();
      setStats(orderStats);
    } catch (error) {
      console.error('Error loading order stats:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully!');
      await loadOrders(); // Refresh the list
      await loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user_profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (order.user_profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (order.user_profiles?.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.payment_status === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage customer orders</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.averageOrderValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by order status"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value as PaymentStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by payment status"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()} at{' '}
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer</p>
                      <p className="text-gray-900">
                        {order.user_profiles ? 
                          `${order.user_profiles.first_name} ${order.user_profiles.last_name}` : 
                          'Customer Info N/A'
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.user_profiles?.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Items</p>
                      <p className="text-gray-900">
                        {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Items:</p>
                    <div className="flex flex-wrap gap-2">
                                             {order.order_items.slice(0, 3).map((item, index) => (
                         <div key={item.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                           <span className="text-sm text-gray-900">
                             {item.product_name} x{item.quantity}
                           </span>
                         </div>
                       ))}
                      {order.order_items.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{order.order_items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  
                                     {/* Quick Status Update */}
                   <select
                     value={order.status}
                     onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                     className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                     aria-label={`Update status for order ${order.order_number}`}
                   >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterPayment !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Orders will appear here once customers start placing them'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
