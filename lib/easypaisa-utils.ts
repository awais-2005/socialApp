import crypto from "crypto"
import { EASYPAISA_CONFIG } from "./easypaisa-config"
import type { EasypaisaPaymentData } from "./easypaisa-types" // Assuming EasypaisaPaymentData is declared in easypaisa-types.ts

export function generateOrderReference(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `VV-${timestamp}-${random}`
}

export function generateExpiryDate(): string {
  const now = new Date()
  const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

  const year = expiry.getFullYear()
  const month = String(expiry.getMonth() + 1).padStart(2, "0")
  const day = String(expiry.getDate()).padStart(2, "0")
  const hours = String(expiry.getHours()).padStart(2, "0")
  const minutes = String(expiry.getMinutes()).padStart(2, "0")
  const seconds = String(expiry.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

export function generateHash(data: {
  amount: string
  orderRefNum: string
  storeId: string
  postBackURL: string
  expiryDate: string
}): string {
  // Easypaisa hash generation format
  const hashString = `${data.amount}&${data.orderRefNum}&${data.storeId}&${data.postBackURL}&${data.expiryDate}&${EASYPAISA_CONFIG.HASH_KEY}`

  // Generate SHA-256 hash
  const hash = crypto.createHash("sha256").update(hashString).digest("hex")
  return hash.toUpperCase()
}

export function createEasypaisaPaymentData(
  amount: number,
  orderRefNum: string,
  customerData?: {
    email?: string
    mobile?: string
  },
): EasypaisaPaymentData {
  const amountStr = amount.toFixed(2)
  const expiryDate = generateExpiryDate()

  const hashData = {
    amount: amountStr,
    orderRefNum,
    storeId: EASYPAISA_CONFIG.STORE_ID,
    postBackURL: EASYPAISA_CONFIG.RETURN_URL,
    expiryDate,
  }

  const merchantHashedReq = generateHash(hashData)

  return {
    storeId: EASYPAISA_CONFIG.STORE_ID,
    amount: amountStr,
    postBackURL: EASYPAISA_CONFIG.RETURN_URL,
    orderRefNum,
    expiryDate,
    merchantHashedReq,
    autoRedirect: "1",
    paymentMethod: "MA_PAYMENT_METHOD",
    emailAddr: customerData?.email,
    mobileNum: customerData?.mobile,
  }
}
