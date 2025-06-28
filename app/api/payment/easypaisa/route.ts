import { type NextRequest, NextResponse } from "next/server"
import { createEasypaisaPaymentData, generateOrderReference } from "@/lib/easypaisa-utils"
import { EASYPAISA_CONFIG } from "@/lib/easypaisa-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, service, option, quantity, customerData } = body

    // Validate required fields
    if (!amount || !service || !option || !quantity) {
      return NextResponse.json({ error: "Missing required payment data" }, { status: 400 })
    }

    // Generate unique order reference
    const orderRefNum = generateOrderReference()

    // Create payment data for Easypaisa
    const paymentData = createEasypaisaPaymentData(Number.parseFloat(amount), orderRefNum, customerData)

    // Store order details in database (you would implement this)
    // await storeOrderDetails({
    //   orderRefNum,
    //   amount,
    //   service,
    //   option,
    //   quantity,
    //   serviceUrl,
    //   status: 'pending',
    //   paymentMethod: 'easypaisa'
    // })

    console.log("Payment Data Created:", {
      orderRefNum,
      amount,
      service,
      option,
      quantity,
      paymentData,
    })

    return NextResponse.json({
      success: true,
      paymentData,
      redirectUrl: EASYPAISA_CONFIG.API_URL,
      orderRefNum,
    })
  } catch (error) {
    console.error("Easypaisa payment error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
