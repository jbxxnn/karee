// Flutterwave Configuration
export const FLUTTERWAVE_CONFIG = {
  // These should be set in your environment variables
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
  encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || '',
  
  // Default settings
  defaultCurrency: 'NGN',
  defaultCountry: 'NG',
  
  // Supported currencies for Kareè
  supportedCurrencies: [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  ],
  
  // Payment methods
  paymentMethods: [
    'card',
    'banktransfer',
    'ussd',
    'qr',
    'mpesa',
    'mobilemoney',
    'barter',
  ],
  
  // Webhook events to handle
  webhookEvents: [
    'charge.completed',
    'charge.failed',
    'transfer.completed',
    'transfer.failed',
  ],
};

// Validation function
export function validateFlutterwaveConfig(): boolean {
  return !!(
    FLUTTERWAVE_CONFIG.publicKey &&
    FLUTTERWAVE_CONFIG.secretKey &&
    FLUTTERWAVE_CONFIG.encryptionKey
  );
}

// Get currency symbol
export function getCurrencySymbol(currencyCode: string): string {
  const currency = FLUTTERWAVE_CONFIG.supportedCurrencies.find(
    c => c.code === currencyCode
  );
  return currency?.symbol || currencyCode;
}

// Format amount based on currency
export function formatAmount(amount: number, currency: string = 'NGN'): number {
  if (currency === 'NGN') {
    return Math.round(amount * 100); // Convert to kobo
  }
  return amount;
}

