# Flutterwave Integration Setup Guide

## 🚀 Getting Started with Flutterwave

This guide will help you set up Flutterwave payment integration for your Kareè e-commerce platform.

## 📋 Prerequisites

1. **Flutterwave Account**: Sign up at [Flutterwave Dashboard](https://dashboard.flutterwave.com/)
2. **API Keys**: Get your public and secret keys from the dashboard
3. **Webhook URL**: Set up webhook endpoint for payment notifications

## 🔧 Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Flutterwave Configuration
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_flutterwave_encryption_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔑 Getting Your API Keys

1. **Login to Flutterwave Dashboard**
2. **Go to Settings > API Keys**
3. **Copy your keys:**
   - **Public Key**: Used for frontend integration
   - **Secret Key**: Used for backend API calls
   - **Encryption Key**: Used for webhook verification

## 🌐 Webhook Configuration

1. **In Flutterwave Dashboard:**
   - Go to **Settings > Webhooks**
   - Add webhook URL: `https://yourdomain.com/api/payments/flutterwave/webhook`
   - Select events: `charge.completed`, `charge.failed`

2. **For local development:**
   - Use ngrok or similar tool to expose your local server
   - Set webhook URL to your ngrok URL

## 💳 Supported Payment Methods

Flutterwave supports multiple payment methods:

- **Card Payments**: Visa, Mastercard, American Express
- **Bank Transfer**: Direct bank transfers
- **USSD**: Mobile banking codes
- **QR Code**: Scan and pay
- **Mobile Money**: M-Pesa, MTN Mobile Money, etc.
- **Barter**: Cryptocurrency payments

## 🏦 Supported Currencies

- **NGN**: Nigerian Naira (Default)
- **USD**: US Dollar
- **EUR**: Euro
- **GBP**: British Pound
- **GHS**: Ghanaian Cedi
- **KES**: Kenyan Shilling
- **ZAR**: South African Rand

## 🔒 Security Features

- **PCI DSS Compliant**: Secure card processing
- **3D Secure**: Additional authentication
- **Webhook Verification**: Secure payment notifications
- **Encryption**: All data encrypted in transit

## 📱 Testing

### Test Cards (Nigeria)
```
Visa: 4187427415564246
Mastercard: 5438898014560229
Expiry: Any future date
CVV: Any 3 digits
```

### Test Bank Account
```
Account Number: 0690000032
Bank: Access Bank
```

## 🚀 Deployment Checklist

- [ ] Set production environment variables
- [ ] Update webhook URL to production domain
- [ ] Test payment flow in production
- [ ] Set up monitoring and logging
- [ ] Configure backup payment methods

## 📞 Support

- **Flutterwave Support**: [support@flutterwave.com](mailto:support@flutterwave.com)
- **Documentation**: [Flutterwave Docs](https://developer.flutterwave.com/)
- **Status Page**: [Flutterwave Status](https://status.flutterwave.com/)

## 🔄 Next Steps

1. **Set up your Flutterwave account**
2. **Add environment variables**
3. **Test the integration**
4. **Deploy to production**
5. **Monitor transactions**

## 💡 Tips

- Always test with small amounts first
- Keep your secret keys secure
- Monitor webhook delivery
- Set up proper error handling
- Use proper logging for debugging

---

**Happy coding! 🎉**

