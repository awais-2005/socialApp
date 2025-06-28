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
