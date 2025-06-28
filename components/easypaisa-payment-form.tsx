"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Loader2, Shield, Clock } from "lucide-react"

interface EasypaisaPaymentFormProps {
  amount: number
  orderData: {
    service: string
    option: string
    quantity: string
    serviceUrl: string
  }
  onPaymentInitiated: (paymentData: any) => void
  isAnimating?: boolean
}

export default function EasypaisaPaymentForm({
  amount,
  orderData,
  onPaymentInitiated,
  isAnimating = false,
}: EasypaisaPaymentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({})

  const validateForm = () => {
    const newErrors: { phone?: string; email?: string } = {}

    if (!phoneNumber) {
      newErrors.phone = "Phone number is required"
    } else if (!/^03\d{9}$/.test(phoneNumber)) {
      newErrors.phone = "Please enter a valid Pakistani mobile number (03XXXXXXXXX)"
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment/easypaisa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toString(),
          ...orderData,
          customerData: {
            mobile: phoneNumber,
            email: email || undefined,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        onPaymentInitiated(result)
        // Create and submit form to Easypaisa
        createEasypaisaForm(result.paymentData, result.redirectUrl)
      } else {
        throw new Error(result.error || "Payment initiation failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const createEasypaisaForm = (paymentData: any, redirectUrl: string) => {
    // Create a hidden form to submit to Easypaisa
    const form = document.createElement("form")
    form.method = "POST"
    form.action = redirectUrl
    form.style.display = "none"

    // Add all payment data as hidden inputs
    Object.keys(paymentData).forEach((key) => {
      if (paymentData[key] !== undefined && paymentData[key] !== null) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = paymentData[key].toString()
        form.appendChild(input)
      }
    })

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div
        className={`bg-primary/5 border border-primary/20 rounded-xl p-4 ${isAnimating ? "animate-fade-in-scale animation-delay-200" : ""}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Easypaisa Payment</h3>
            <p className="text-gray-400 text-sm">Secure mobile wallet payment</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Service:</span>
            <span className="text-white">
              {orderData.service} {orderData.option}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Quantity:</span>
            <span className="text-white">{Number.parseInt(orderData.quantity).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
            <span className="text-gray-300">Total Amount:</span>
            <span className="text-primary">${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <div className={`${isAnimating ? "animate-fade-in-scale animation-delay-300" : ""}`}>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number *</label>
          <Input
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value)
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
            }}
            className={`w-full bg-rich-black/50 border-2 text-white py-3 rounded-xl transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.phone ? "border-red-500" : "border-white/20"
            }`}
            maxLength={11}
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1 animate-slide-in-right">{errors.phone}</p>}
        </div>

        <div className={`${isAnimating ? "animate-fade-in-scale animation-delay-400" : ""}`}>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address (Optional)</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            className={`w-full bg-rich-black/50 border-2 text-white py-3 rounded-xl transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              errors.email ? "border-red-500" : "border-white/20"
            }`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1 animate-slide-in-right">{errors.email}</p>}
        </div>
      </div>

      {/* Security Information */}
      <div
        className={`bg-dark-gray/30 border border-white/10 rounded-xl p-4 ${isAnimating ? "animate-fade-in-scale animation-delay-500" : ""}`}
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Secure Payment</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Your payment is processed securely through Easypaisa</li>
              <li>• No card details are stored on our servers</li>
              <li>• 256-bit SSL encryption protects your data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div
        className={`bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 ${isAnimating ? "animate-fade-in-scale animation-delay-600" : ""}`}
      >
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Payment Process</h4>
            <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
              <li>Click "Pay with Easypaisa" to proceed</li>
              <li>You'll be redirected to Easypaisa payment page</li>
              <li>Enter your Easypaisa PIN to complete payment</li>
              <li>You'll receive confirmation via SMS</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing || !phoneNumber}
        className={`w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-base md:text-lg py-4 md:py-6 rounded-xl transition-all duration-300 hover:scale-105 ${isAnimating ? "animate-slide-up animation-delay-700" : ""}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Smartphone className="w-5 h-5 mr-2" />
            Pay ${amount.toFixed(2)} with Easypaisa
          </>
        )}
      </Button>
    </div>
  )
}
