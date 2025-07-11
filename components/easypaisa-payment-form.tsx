"use client"

import { useEffect, useState } from "react";
import FileUpload from "./file-upload";
import { createWorker } from 'tesseract.js'; // Use tesseract.js for OCR
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
  onPaymentInitiated: (paymentData: Record<string, unknown>) => void
  isAnimating?: boolean
}

import { getCurrencyInfo } from "./header"

export default function EasypaisaPaymentForm({
  amount,
  orderData,
  onPaymentInitiated,
  isAnimating = false,
}: EasypaisaPaymentFormProps) {
  // Currency selection
  const selectedCountry = (typeof window !== 'undefined' && localStorage.getItem('selectedCountry')) || 'US';
  const { symbol, rate } = getCurrencyInfo(selectedCountry);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Offline payment: store_ID/hash_key are not available
  const store_ID = "N/A";
  const hash_key = "N/A";
  const [offlineScreenshot, setOfflineScreenshot] = useState<File | null>(null);
  const [offlineUploading, setOfflineUploading] = useState(false);
  const [offlineError, setOfflineError] = useState<string | null>(null);
  const [offlineSuccess, setOfflineSuccess] = useState(false);
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

  const createEasypaisaForm = (paymentData: Record<string, string | number | boolean>, redirectUrl: string) => {
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

  // If store_ID/hash_key are not available, show offline payment UI
  if (store_ID === "N/A" || hash_key === "N/A") {
    return (
      <div className="space-y-6">
        {/* Apology/Notice for users */}
        <div className="bg-yellow-900/40 border border-yellow-600/40 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
          <span className="text-yellow-200 text-sm font-medium">Sorry for the inconvenience. We are working on Easypaisa gateway for online direct transactions.</span>
        </div>
        {/* Payment Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Offline Easypaisa Payment</h3>
              <p className="text-gray-400 text-sm">Manual transfer via mobile wallet</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Service:</span>
              <span className="text-white">{orderData.service} {orderData.option}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white">{mounted ? Number.parseInt(orderData.quantity).toLocaleString() : Number.parseInt(orderData.quantity)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
  <span className="text-gray-300">Total Amount:</span>
  <span className="text-primary">{symbol}{(amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
</div>
          </div>
        </div>
        {/* Offline Payment Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="mb-3">
            <h4 className="text-white font-medium text-sm mb-1">Send Payment To:</h4>
            <div className="text-gray-300 text-base font-semibold">03163853822</div>
            <div className="text-gray-400 text-sm">Muhammad Awais</div>
          </div>
          <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside mb-2">
            <li>Send the total amount to the Easy Paisa number above.</li>
            <li>Take a screenshot of your transaction confirmation.</li>
            <li>Upload the screenshot below to complete your order.</li>
          </ol>
        </div>
        {/* Screenshot Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Upload Transaction Screenshot *</label>
          <FileUpload
            onUploadSuccess={(file: File) => {
              setOfflineScreenshot(file);
              setOfflineError(null);
              setOfflineSuccess(true);
            }}
            onUploadError={() => {
              setOfflineError("Upload failed. Please try again.");
              setOfflineSuccess(false);
            }}
            acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
            maxFileSize={5 * 1024 * 1024}
            className="w-full"
          />
          {offlineError && <p className="text-red-400 text-sm mt-1 animate-slide-in-right">{offlineError}</p>}
          {offlineSuccess && <p className="text-green-400 text-sm mt-1 animate-slide-in-right">Screenshot uploaded successfully! Your order will be processed soon.</p>}
        </div>
        <Button
          onClick={async () => {
            setOfflineError(null);
            setOfflineSuccess(false);
            if (!offlineScreenshot) {
              setOfflineError("Please upload a screenshot of your transaction.");
              return;
            }
            setOfflineUploading(true);
            try {
              // 1. Apply OCR to the uploaded screenshot using tesseract.js
              let ocrText = '';
              try {
                const worker = await createWorker('eng');
                const {
                  data: { text },
                } = await worker.recognize(offlineScreenshot);
                ocrText = text;
                await worker.terminate();
              } catch (ocrErr) {
                setOfflineUploading(false);
                setOfflineError("Failed to extract text from screenshot. Please try again with a clearer image.");
                console.error('OCR Error:', ocrErr);
                return;
              }
              // 2. Send order details and OCR text to WhatsApp via Netlify function
              const USD_TO_PKR = 278; // Update this rate as needed
              const amountPKR = Math.round(amount * USD_TO_PKR);
              const orderDetails = `*Service:* \`${orderData.service} ${orderData.option}\`\n*Quantity:* \`${orderData.quantity}\`\n*Service URL:* \`${orderData.serviceUrl}\`\n*Bill Amount:* \`Rs. ${amountPKR}\``;
              try {
                const res = await fetch('/.netlify/functions/send-whatsapp', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderDetails, ocrText }),
                });
                if (!res.ok) {
                  let errorData: { error?: string } = {};
                  try {
                    errorData = await res.json();
                  } catch (jsonErr) {
                    try {
                      const textErr = await res.text();
                      errorData = { error: textErr };
                    } catch (finalErr) {
                      errorData = { error: 'Unknown error' };
                    }
                  }
                  setOfflineUploading(false);
                  setOfflineError(
                    errorData && errorData.error
                      ? `WhatsApp message failed: ${errorData.error}`
                      : 'Failed to send WhatsApp message. Please try again.'
                  );
                  console.error('WhatsApp Error:', errorData);
                  return;
                }
              } catch (waErr) {
                setOfflineUploading(false);
                setOfflineError('Network error while sending WhatsApp message. Please try again.');
                console.error('WhatsApp Network Error:', waErr);
                return;
              }
              setOfflineUploading(false);
              setOfflineSuccess(true);
              onPaymentInitiated({
                paymentMethod: "offline-easypaisa",
                ocrText,
                phoneNumber: "03163853822",
                holderName: "Muhammad Awais",
                amount,
                orderData,
              });
            } catch (err: any) {
              setOfflineUploading(false);
              setOfflineError("Unexpected error. Please try again.");
              console.error('Unexpected Error:', err);
            }
          }}
          disabled={offlineUploading || !offlineScreenshot}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-base md:text-lg py-4 md:py-6 rounded-xl transition-all duration-300 hover:scale-105"
        >
          {offlineUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading Screenshot...
            </>
          ) : (
            <>
              <Smartphone className="w-5 h-5 mr-2" />
              Submit Offline Payment
            </>
          )}
        </Button>
      </div>
    );
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
              <li>Click &quot;Pay with Easypaisa&quot; to proceed</li>
              <li>You&apos;ll be redirected to Easypaisa payment page</li>
              <li>Enter your Easypaisa PIN to complete payment</li>
              <li>You&apos;ll receive confirmation via SMS</li>
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
