# Flutterwave Test Cards

This document contains the test card information for testing Flutterwave payment integration in the Kareè e-commerce application.

## Test Cards

### Visa Test Card
- **Card Number**: `4187427415564246`
- **CVV**: `828`
- **Expiry Date**: `09/32`
- **Pin**: `3310`
- **OTP**: `12345`

### Mastercard Test Card
- **Card Number**: `5438898014560229`
- **CVV**: `564`
- **Expiry Date**: `10/31`
- **Pin**: `3310`
- **OTP**: `12345`

### American Express Test Card
- **Card Number**: `374245455400001`
- **CVV**: `0005`
- **Expiry Date**: `12/25`
- **Pin**: `3310`
- **OTP**: `12345`

## Test Scenarios

### Successful Payment
Use any of the above test cards with the provided details. The payment should process successfully and redirect to the success page.

### Failed Payment
To test failed payments, use:
- **Card Number**: `4000000000000002`
- **CVV**: `123`
- **Expiry Date**: `12/25`
- **Pin**: `3310`

### Insufficient Funds
To test insufficient funds scenario:
- **Card Number**: `4000000000009995`
- **CVV**: `123`
- **Expiry Date**: `12/25`
- **Pin**: `3310`

## Important Notes

1. **Test Mode Only**: These cards only work in Flutterwave's test/sandbox environment
2. **No Real Charges**: These cards will not charge real money
3. **OTP**: Always use `12345` as the OTP when prompted
4. **Pin**: Use `3310` as the PIN when prompted
5. **Environment**: Ensure you're using the test API keys, not production keys

## Environment Variables Required

Make sure these environment variables are set in your `.env.local` file:

```env
FLUTTERWAVE_PUBLIC_KEY=your_test_public_key
FLUTTERWAVE_SECRET_KEY=your_test_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_test_encryption_key
```

## Testing Checklist

- [ ] Test successful payment with Visa card
- [ ] Test successful payment with Mastercard
- [ ] Test successful payment with American Express
- [ ] Test failed payment scenario
- [ ] Test insufficient funds scenario
- [ ] Verify order creation in database
- [ ] Verify payment verification works
- [ ] Test redirect to success page
- [ ] Test redirect to failure page

## Support

For more test cards and scenarios, refer to the [Flutterwave Test Cards Documentation](https://developer.flutterwave.com/docs/integration-guides/testing/test-cards/).





http://localhost:3000/checkout/success?status=successful&tx_ref=KAREE_2b78a4aa-7d11-452b-8d09-3db1fe91e02e_1756995181322&transaction_id=9615544