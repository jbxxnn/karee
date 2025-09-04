// Flutterwave SDK initialized

export interface FlutterwavePaymentData {
  tx_ref: string;
  amount: string; // Flutterwave expects amount as string
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    phonenumber: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
  meta?: Record<string, string>;
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

export interface FlutterwaveVerificationResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      token: string;
      expiry: string;
    };
    created_at: string;
    status: string;
    payment_type: string;
    account_id: number;
    customer: {
      id: number;
      phone_number: string;
      name: string;
      email: string;
      created_at: string;
    };
  };
}

export class FlutterwaveService {
  /**
   * Initialize payment with Flutterwave
   */
  static async initializePayment(paymentData: FlutterwavePaymentData): Promise<FlutterwaveResponse> {
    try {
      // For hosted payment page, we need to use the Flutterwave API directly
      // The flutterwave-node-v3 SDK doesn't seem to have a direct method for hosted payments
      // Let's use the REST API directly
      
      console.log('Sending payment data to Flutterwave:', JSON.stringify(paymentData, null, 2));
      
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Flutterwave API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Flutterwave payment initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  /**
   * Verify payment transaction
   */
  static async verifyPayment(transactionId: string): Promise<FlutterwaveVerificationResponse> {
    try {
      // Use Flutterwave REST API for verification
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Flutterwave payment verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  /**
   * Create payment link for checkout
   */
  static async createPaymentLink(
    orderId: string,
    amount: number,
    customerEmail: string,
    customerName: string,
    customerPhone: string,
    orderItems: Array<{ name: string; quantity: number; price: number }>
  ): Promise<string> {
    try {
      const paymentData: FlutterwavePaymentData = {
        tx_ref: `KAREE_${orderId}_${Date.now()}`,
        amount: amount.toString(), // Ensure amount is a string
        currency: 'NGN', // Default to Naira, can be made configurable
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
        customer: {
          email: customerEmail.toString(),
          phonenumber: customerPhone.toString(),
          name: customerName.toString(),
        },
        customizations: {
          title: 'Kareè - Premium Skincare',
          description: `Payment for order #${orderId}`,
          logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`, // Add your logo
        },
        meta: {
          order_id: orderId.toString(),
          items_count: orderItems.length.toString(),
          items_summary: orderItems.map(item => `${item.name} (${item.quantity}x)`).join(', '),
          source: 'karee_website',
        },
      };

      const response = await this.initializePayment(paymentData);
      return response.data.link;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw new Error('Failed to create payment link');
    }
  }

  /**
   * Handle webhook from Flutterwave
   */
  static async handleWebhook(payload: Record<string, unknown>): Promise<boolean> {
    try {
      // Verify webhook signature (implement based on Flutterwave docs)
      // For now, we'll process the webhook
      
      if (payload.event === 'charge.completed' && (payload.data as Record<string, unknown>)?.status === 'successful') {
        // Payment was successful
        const transactionId = (payload.data as Record<string, unknown>)?.id;
        
        // Verify the payment
        const verification = await this.verifyPayment(transactionId?.toString() || '');
        
        if (verification.status === 'success' && verification.data.status === 'successful') {
          // Update order status in database
          // This will be handled by the order service
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Webhook processing error:', error);
      return false;
    }
  }

  /**
   * Get supported currencies
   */
  static getSupportedCurrencies(): string[] {
    return [
      'NGN', // Nigerian Naira
      'USD', // US Dollar
      'EUR', // Euro
      'GBP', // British Pound
      'GHS', // Ghanaian Cedi
      'KES', // Kenyan Shilling
      'ZAR', // South African Rand
    ];
  }

  /**
   * Format amount for Flutterwave (amount should be in kobo for NGN)
   */
  static formatAmount(amount: number, currency: string = 'NGN'): number {
    if (currency === 'NGN') {
      return Math.round(amount * 100); // Convert to kobo
    }
    return amount;
  }
}
