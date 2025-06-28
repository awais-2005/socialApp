// Easypaisa Configuration
export const EASYPAISA_CONFIG = {
  // These should be stored in environment variables in production
  STORE_ID: process.env.EASYPAISA_STORE_ID || "YOUR_STORE_ID_HERE",
  HASH_KEY: process.env.EASYPAISA_HASH_KEY || "YOUR_HASH_KEY_HERE",
  API_URL: process.env.EASYPAISA_API_URL || "https://easypaisa.com.pk/easypay/Index.jsf",
  RETURN_URL: process.env.NEXT_PUBLIC_BASE_URL + "/payment/success" || "http://localhost:3000/payment/success",
  CANCEL_URL: process.env.NEXT_PUBLIC_BASE_URL + "/payment/cancel" || "http://localhost:3000/payment/cancel",
}

export interface EasypaisaPaymentData {
  storeId: string
  amount: string
  postBackURL: string
  orderRefNum: string
  expiryDate: string
  merchantHashedReq: string
  autoRedirect: string
  paymentMethod: string
  emailAddr?: string
  mobileNum?: string
}
