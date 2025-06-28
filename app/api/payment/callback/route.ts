import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { EASYPAISA_CONFIG } from "@/lib/easypaisa-config"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract callback data from Easypaisa
    const orderRefNum = formData.get("orderRefNum") as string
    const amount = formData.get("amount") as string
    const paymentStatus = formData.get("paymentStatus") as string
    const transactionId = formData.get("transactionId") as string
    const receivedHash = formData.get("merchantHashedReq") as string

    // Verify hash for security
    const expectedHashString = `${amount}&${orderRefNum}&${EASYPAISA_CONFIG.STORE_ID}&${paymentStatus}&${EASYPAISA_CONFIG.HASH_KEY}`
    const expectedHash = crypto.createHash("sha256").update(expectedHashString).digest("hex").toUpperCase()

    if (receivedHash !== expectedHash) {
      console.error("Hash verification failed")
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 })
    }

    // Update order status in database
    // await updateOrderStatus(orderRefNum, {
    //   status: paymentStatus === '1' ? 'completed' : 'failed',
    //   transactionId,
    //   paymentDate: new Date()
    // })

    console.log("Payment Callback:", {
      orderRefNum,
      amount,
      paymentStatus,
      transactionId,
      status: paymentStatus === "1" ? "Success" : "Failed",
    })

    // Redirect based on payment status
    const redirectUrl = paymentStatus === "1" ? EASYPAISA_CONFIG.RETURN_URL : EASYPAISA_CONFIG.CANCEL_URL

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 })
  }
}
