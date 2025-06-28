import Link from "next/link"
import { CheckCircle, ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-gray/50 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">
          Your order has been confirmed and will be processed within 24 hours. You&apos;ll receive updates via SMS and email.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}
