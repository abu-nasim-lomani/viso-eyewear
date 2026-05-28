import ApiError from './ApiError.js'

/**
 * Payment gateway entry point. COD is live now; the online gateways are
 * scaffolded — wire each one here once its credentials are in server/.env.
 *
 * Returns `{ gatewayUrl }` — null for COD (nothing to redirect to).
 */
export async function preparePayment(method /* , order */) {
  switch (method) {
    case 'cod':
      return { gatewayUrl: null }

    case 'sslcommerz':
      // TODO: import 'sslcommerz-lts', init with SSLCOMMERZ_STORE_ID/PASS,
      //       return response.GatewayPageURL.
      throw new ApiError(501, 'SSLCommerz is not configured yet. Add SSLCOMMERZ_STORE_ID/PASS to server/.env. Use Cash on Delivery for now.')

    case 'bkash':
      // TODO: bKash tokenized checkout (BKASH_APP_KEY/SECRET/USERNAME/PASSWORD).
      throw new ApiError(501, 'bKash is not configured yet. Use Cash on Delivery for now.')

    case 'nagad':
      throw new ApiError(501, 'Nagad is not configured yet. Use Cash on Delivery for now.')

    case 'card':
      throw new ApiError(501, 'Card payment is not configured yet. Use Cash on Delivery for now.')

    default:
      throw new ApiError(400, 'Unknown payment method.')
  }
}
