import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types/database';

export class OrderService {
  private supabase = createClient();

  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product_name
          ),
          user_profiles (
            id,
            first_name,
            last_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all orders:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product_name
          ),
          user_profiles (
            id,
            first_name,
            last_name,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product_name
          ),
          user_profiles (
            id,
            first_name,
            last_name,
            phone
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<Order | null> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async searchOrders(query: string): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product_name
          ),
          user_profiles (
            id,
            first_name,
            last_name,
            phone
          )
        `)
        .or(`order_number.ilike.%${query}%,user_profiles.first_name.ilike.%${query}%,user_profiles.last_name.ilike.%${query}%,user_profiles.email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }

  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    try {
      const allOrders = await this.getAllOrders();
      
      const totalRevenue = allOrders
        .filter(order => order.payment_status === 'paid')
        .reduce((sum, order) => sum + Number(order.total_amount), 0);

      const completedOrders = allOrders.filter(order => order.payment_status === 'paid');
      const averageOrderValue = completedOrders.length > 0 
        ? totalRevenue / completedOrders.length 
        : 0;

      return {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        shipped: allOrders.filter(o => o.status === 'shipped').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length,
        totalRevenue,
        averageOrderValue,
      };
    } catch (error) {
      console.error('Error getting order stats:', error);
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      };
    }
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product_name
          ),
          user_profiles (
            id,
            first_name,
            last_name,
            phone
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent orders:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }
}

export const orderService = new OrderService();
