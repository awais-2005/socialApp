"use client";

import { useState } from "react";
import FileUpload from "./file-upload";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface CreditCardOfflinePaymentFormProps {
  amount: number;
  orderData: {
    service: string;
    option: string;
    quantity: string;
    serviceUrl: string;
  };
  onPaymentInitiated: (paymentData: Record<string, unknown>) => void;
  isAnimating?: boolean;
}

export default function CreditCardOfflinePaymentForm({
  amount,
  orderData,
  onPaymentInitiated,
  isAnimating = false,
}: CreditCardOfflinePaymentFormProps) {
  // Offline payment: show instructions and allow screenshot upload
  const [offlineScreenshot, setOfflineScreenshot] = useState<File | null>(null);
  const [offlineUploading, setOfflineUploading] = useState(false);
  const [offlineError, setOfflineError] = useState<string | null>(null);
  const [offlineSuccess, setOfflineSuccess] = useState(false);

  const handleUploadSuccess = (file: File) => {
    setOfflineScreenshot(file);
    setOfflineError(null);
    setOfflineSuccess(true);
  };

  const handleUploadError = (error: { message: string }) => {
    setOfflineError(error.message);
    setOfflineSuccess(false);
  };

  const handleSubmit = async () => {
    if (!offlineScreenshot) {
      setOfflineError("Please upload a screenshot of your payment.");
      return;
    }
    setOfflineUploading(true);
    setOfflineError(null);
    setTimeout(() => {
      setOfflineUploading(false);
      setOfflineSuccess(true);
      onPaymentInitiated({
        screenshot: offlineScreenshot,
        ...orderData,
        amount,
        method: "creditcard-offline",
      });
    }, 1200);
  };

  return (
    <div className={`space-y-6 ${isAnimating ? "animate-slide-right animation-delay-200" : ""}`}>
      <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-400 rounded-lg flex items-start gap-3">
        <span className="mt-1 text-yellow-400">
          <CreditCard className="w-6 h-6" />
        </span>
        <div>
          <div className="font-semibold text-yellow-300 mb-1">Sorry for the inconvenience.</div>
          <div className="text-yellow-100">
            We are working on our Credit Card gateway for online direct transactions.<br />
            For now, please make a manual payment to the following details and upload your payment receipt/screenshot.
          </div>
        </div>
      </div>
      <div className="bg-dark-gray/60 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <div>
            <div className="font-bold text-lg text-white">Bank Transfer (Credit Card)</div>
            <div className="text-gray-300 text-sm">Bank Name: <span className="font-semibold text-white">ABC Bank</span></div>
            <div className="text-gray-300 text-sm">Account Number: <span className="font-semibold text-white">1234 5678 9012 3456</span></div>
            <div className="text-gray-300 text-sm">Account Holder: <span className="font-semibold text-white">Muhammad Awais</span></div>
            <div className="text-gray-300 text-sm">Reference: <span className="font-semibold text-white">Order Payment</span></div>
          </div>
        </div>
        <div className="text-gray-400 text-xs mt-2">
          <b>Instructions:</b> Please transfer the amount shown below to the above account using your credit/debit card (via online banking or ATM). Take a screenshot or photo of your payment confirmation/receipt and upload it below.
        </div>
        <div className="flex items-center gap-2 text-lg text-primary font-bold">
          Amount:&nbsp;<span className="text-white">${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Upload Payment Screenshot</label>
        <FileUpload
          acceptedFileTypes={["image/png","image/jpeg","image/jpg","image/webp","application/pdf"]}
          maxFileSize={5 * 1024 * 1024}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="mt-2"
        />
        {offlineError && (
          <div className="mt-2 text-sm text-red-400 animate-fade-in-scale">{offlineError}</div>
        )}
        {offlineSuccess && (
          <div className="mt-2 text-sm text-green-400 animate-fade-in-scale">Screenshot uploaded successfully!</div>
        )}
      </div>
      <div>
        <Button
          onClick={handleSubmit}
          disabled={offlineUploading || !offlineScreenshot}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 rounded-xl transition-all duration-300 hover:scale-105"
        >
          {offlineUploading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Uploading...</span>
          ) : (
            "Submit Payment"
          )}
        </Button>
      </div>
    </div>
  );
}
