"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, X, CreditCard, ArrowLeft } from "lucide-react"
import EasypaisaPaymentForm from "./easypaisa-payment-form"
import { getCurrencyInfo } from "./header"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: any
}

type ModalStep = "service" | "payment" | "details"

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1000")
  const [currentStep, setCurrentStep] = useState<ModalStep>("service")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [serviceUrl, setServiceUrl] = useState<string>("")
  const [urlError, setUrlError] = useState<string>("")
  const [formData, setFormData] = useState({
    // Credit Card
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [servicePrices, setServicePrices] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      setHasAnimated(false)
      document.body.style.overflow = "hidden"
      // Reset all states when modal opens
      setSelectedOption("")
      setQuantity("1000")
      setCurrentStep("service")
      setPaymentMethod("")
      setServiceUrl("")
      setUrlError("")
      setFormData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      })

      // Fetch latest prices dynamically
      fetch("/service-prices.json")
        .then((res) => res.json())
        .then((data) => setServicePrices(data))
        .catch(() => setServicePrices({}));

      // Set hasAnimated to true after initial animation
      setTimeout(() => {
        setHasAnimated(true)
      }, 800)
    } else {
      document.body.style.overflow = "unset"
      setHasAnimated(false)
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Reset animation state when step changes
  useEffect(() => {
    if (currentStep !== "service") {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 600)
    }
  }, [currentStep])

  if (!service || !isOpen) return null

  const getServiceOptions = () => {
    if (!service?.platform) return [];
    // Normalize platform name for lookup (case-insensitive)
    const platformKey = Object.keys(servicePrices).find(
      key => key.toLowerCase() === service.platform.toLowerCase()
    );
    const prices = platformKey ? servicePrices[platformKey] : {};
    // Helper to safely parse price, return null if invalid
    const safeNumber = (val: any) => {
      // Accept any number (including 0), only null for undefined or not a number
      return (val === undefined || val === null || isNaN(Number(val))) ? null : Number(val);
    };
    // Fix: For Instagram, use 'follower', 'like', 'view' keys (not plural)
    if (platformKey && platformKey.toLowerCase() === "youtube") {
      return [
        { id: "subscribers", label: "Subscribers", price: safeNumber(prices.subscriber), icon: "\uD83D\uDC65", unit: "subscriber" },
        { id: "likes", label: "Likes", price: safeNumber(prices.like), icon: "\uD83D\uDC4D", unit: "like" },
        { id: "views", label: "Views", price: safeNumber(prices.view), icon: "\uD83D\uDC41\uFE0F", unit: "view" },
      ];
    }
    // For Instagram and others, use singular keys
    return [
      { id: "followers", label: "Followers", price: safeNumber(prices.follower), icon: "\uD83D\uDC65", unit: "follower" },
      { id: "likes", label: "Likes", price: safeNumber(prices.like), icon: "\u2764\uFE0F", unit: "like" },
      { id: "views", label: "Views", price: safeNumber(prices.view), icon: "\uD83D\uDC41\uFE0F", unit: "view" },
    ];
  }

  const getQuantityOptions = () => {
    return ["100", "250", "500", "1000", "2500", "5000", "10000", "25000", "50000", "100000"]
  }

  const calculateAmount = () => {
    const serviceOptions = getServiceOptions()
    const selectedService = serviceOptions.find((opt) => opt.id === selectedOption)
    if (!selectedService || selectedService.price === null) return 0
    const basePrice = selectedService.price
    const qty = Number.parseInt(quantity) || 0
    return basePrice * qty // Price per unit
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    const element = document.querySelector(`[data-option="${option}"]`)
    if (element) {
      element.classList.add("animate-pop")
      setTimeout(() => {
        element.classList.remove("animate-pop")
      }, 300)
    }
  }

  const handleBuyNow = () => {
    if (!selectedOption) return

    if (!serviceUrl) {
      setUrlError("Please enter a URL")
      return
    }

    if (!serviceUrl.startsWith("http")) {
      setUrlError("URL must start with http:// or https://")
      return
    }

    if (!serviceUrl.includes(service.platform.toLowerCase())) {
      setUrlError(`Please enter a valid ${service.platform} URL`)
      return
    }

    setCurrentStep("payment")
    setIsAnimating(true)
  }

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method)
    setTimeout(() => {
      setCurrentStep("details")
      setIsAnimating(true)
    }, 300)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEasypaisaPayment = (paymentData: any) => {
    console.log("Easypaisa payment initiated:", paymentData)
    // The form submission to Easypaisa will happen automatically
    // You can add any additional tracking or analytics here
  }

  const handleCreditCardPayment = () => {
    console.log("Processing credit card payment:", {
      service: service.platform,
      option: selectedOption,
      quantity,
      amount: calculateAmount(),
      formData,
    })
    // Here you would integrate with credit card payment processor
    onClose()
  }

  const goBack = () => {
    if (currentStep === "details") {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("service")
    }
    setIsAnimating(true)
  }

  const serviceOptions = getServiceOptions()
  const quantityOptions = getQuantityOptions()
  const totalAmount = calculateAmount()

  // Get currency info from header utility
  const selectedCountry = (typeof window !== 'undefined' && localStorage.getItem('selectedCountry')) || 'US';
  const { symbol, rate } = getCurrencyInfo(selectedCountry)

  const renderServiceStep = () => {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Service Type Selection */}
        <div className={`space-y-4 ${!hasAnimated ? "animate-slide-up animation-delay-300" : ""}`}>
          <h4 className="text-lg md:text-xl font-semibold text-white">Select Service Type:</h4>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {serviceOptions.map((option, index) => (
              <button
                key={option.id}
                data-option={option.id}
                onClick={() => option.price !== null && handleOptionSelect(option.id)}
                className={`relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  !hasAnimated ? `animate-fade-in-scale` : ""
                } ${
                  selectedOption === option.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 animate-pulse-glow"
                    : "border-white/10 bg-dark-gray/50 hover:border-white/20"
                } ${option.price === null ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{
                  animationDelay: !hasAnimated ? `${400 + index * 100}ms` : "0ms",
                  opacity: hasAnimated ? 1 : undefined,
                }}
                disabled={option.price === null}
              >
                <div className="text-xl md:text-2xl mb-1 md:mb-2">{option.icon}</div>
                <span className="font-semibold text-white text-xs md:text-sm">{option.label}</span>
                <span className="text-xs text-gray-400">
                  {option.price !== null
                    ? `${symbol}${(option.price * rate).toLocaleString(undefined, { maximumFractionDigits: 4 })} `
                    : "N/A "}
                  <span className="text-[10px] text-gray-500">/ {option.unit}</span>
                </span>
                {selectedOption === option.id && option.price !== null && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center animate-bounce-in">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className={`space-y-3 ${!hasAnimated ? "animate-slide-up animation-delay-600" : ""}`}>
          <label className="text-base md:text-lg font-semibold text-white">Quantity:</label>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="w-full bg-rich-black/50 border-white/20 text-white text-base md:text-lg py-4 md:py-6 rounded-xl hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent className="bg-dark-gray border-white/20 text-white animate-dropdown-in">
              {quantityOptions.map((qty) => (
                <SelectItem
                  key={qty}
                  value={qty}
                  className="hover:bg-primary/20 focus:bg-primary/20 text-white cursor-pointer py-3"
                >
                  {Number.parseInt(qty).toLocaleString()} {selectedOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced URL Input Section */}
        {selectedOption && (
          <div
            className={`space-y-3 transition-all duration-500 ${!hasAnimated ? "animate-slide-up animation-delay-700" : ""}`}
          >
            <label className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              {selectedOption === "followers" || selectedOption === "subscribers" ? (
                <>
                  <span className="text-2xl">👤</span>
                  {service.platform} {selectedOption === "subscribers" ? "Channel" : "Account"} URL:
                </>
              ) : (
                <>
                  <span className="text-2xl">{selectedOption === "likes" ? "❤️" : "📹"}</span>
                  {service.platform} {selectedOption === "likes" ? "Post" : "Video"} URL:
                </>
              )}
            </label>

            <div className="relative group">
              <Input
                type="url"
                value={serviceUrl}
                onChange={(e) => {
                  setServiceUrl(e.target.value)
                  setUrlError("")

                  // Real-time validation
                  const value = e.target.value
                  if (value && !value.startsWith("http")) {
                    setUrlError("URL must start with http:// or https://")
                  } else if (value && !value.includes(service.platform.toLowerCase())) {
                    setUrlError(`Please enter a valid ${service.platform} URL`)
                  }
                }}
                placeholder={
                  selectedOption === "followers" || selectedOption === "subscribers"
                    ? `https://${service.platform.toLowerCase()}.com/your-${selectedOption === "subscribers" ? "channel" : "profile"}`
                    : `https://${service.platform.toLowerCase()}.com/your-${selectedOption === "likes" ? "post" : "video"}`
                }
                className={`w-full bg-rich-black/50 border-2 text-white text-sm md:text-base py-4 md:py-5 pl-4 pr-12 rounded-xl transition-all duration-300 group-hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  urlError
                    ? "border-red-500 animate-shake"
                    : serviceUrl && !urlError
                      ? "border-green-500 animate-glow-pulse"
                      : "border-white/20"
                }`}
              />

              {/* URL Status Indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {serviceUrl && !urlError ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-in">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                ) : urlError ? (
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center animate-bounce-in">
                    <span className="text-red-400 text-sm">✗</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">🔗</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {urlError && (
              <div className="flex items-center gap-2 text-sm text-red-400 animate-slide-in-right">
                <span>⚠️</span>
                <p>{urlError}</p>
              </div>
            )}

            {/* Help Text */}
            {!urlError && (
              <div className="flex items-start gap-2 text-xs text-gray-400 animate-fade-in-scale">
                <span className="text-blue-400 mt-0.5">💡</span>
                <p>
                  {selectedOption === "followers" || selectedOption === "subscribers"
                    ? `Copy and paste your ${service.platform} ${selectedOption === "subscribers" ? "channel" : "profile"} URL. Make sure it's public and accessible.`
                    : `Copy the direct link to your ${service.platform} ${selectedOption === "likes" ? "post" : "video"}. Ensure it's not private or restricted.`}
                </p>
              </div>
            )}

            {/* URL Preview */}
            {serviceUrl && !urlError && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg animate-slide-down">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary">🎯</span>
                  <span className="text-gray-300">Target:</span>
                  <span className="text-white font-medium truncate">{serviceUrl}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Preview */}
        {selectedOption && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">{symbol}{(totalAmount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        {/* Buy Now Button */}
        <div className="pb-4 md:pb-6">
          <Button
            onClick={handleBuyNow}
            disabled={!selectedOption || !serviceUrl || !!urlError || !serviceOptions.find(opt => opt.id === selectedOption)?.price}
            className={`w-full bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-base md:text-lg py-4 md:py-6 rounded-xl transition-all duration-300 hover:scale-105 ${!hasAnimated ? "animate-slide-up animation-delay-700" : ""}`}
          >
            Continue to Payment <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  const renderPaymentStep = () => (
    <div className="p-4 md:p-6 space-y-6">
      <div className={`space-y-4 ${isAnimating ? "animate-slide-left animation-delay-200" : ""}`}>
        <h4 className="text-lg md:text-xl font-semibold text-white">Select Payment Method:</h4>

        <div className="space-y-3">
          {/* Easypaisa Option */}
          <button
            onClick={() => handlePaymentMethodSelect("easypaisa")}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-white/10 bg-dark-gray/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 ${isAnimating ? "animate-fade-in-scale animation-delay-300" : ""}`}
          >
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <div className="flex-1 text-left">
              <h5 className="text-white font-semibold">Easypaisa</h5>
              <p className="text-gray-400 text-sm">Pay with your mobile wallet</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Credit Card Option */}
          <button
            onClick={() => handlePaymentMethodSelect("creditcard")}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-white/10 bg-dark-gray/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 ${isAnimating ? "animate-fade-in-scale animation-delay-400" : ""}`}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h5 className="text-white font-semibold">Credit Card</h5>
              <p className="text-gray-400 text-sm">Visa, Mastercard, American Express</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="p-4 md:p-6 space-y-6">
      {paymentMethod === "easypaisa" ? (
        <EasypaisaPaymentForm
          amount={totalAmount}
          orderData={{
            service: service.platform,
            option: selectedOption,
            quantity,
            serviceUrl,
          }}
          onPaymentInitiated={handleEasypaisaPayment}
          isAnimating={isAnimating}
        />
      ) : (
        <div className={`space-y-4 ${isAnimating ? "animate-slide-right animation-delay-200" : ""}`}>
          <h4 className="text-lg md:text-xl font-semibold text-white">Credit Card Details</h4>

          <div className="space-y-4">
            <div className={`${isAnimating ? "animate-fade-in-scale animation-delay-300" : ""}`}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                className="w-full bg-rich-black/50 border-white/20 text-white py-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
            <div className={`${isAnimating ? "animate-fade-in-scale animation-delay-400" : ""}`}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                className="w-full bg-rich-black/50 border-white/20 text-white py-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`${isAnimating ? "animate-fade-in-scale animation-delay-500" : ""}`}>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className="w-full bg-rich-black/50 border-white/20 text-white py-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
              <div className={`${isAnimating ? "animate-fade-in-scale animation-delay-600" : ""}`}>
                <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                <Input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  className="w-full bg-rich-black/50 border-white/20 text-white py-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="pb-4 md:pb-6">
            <Button
              onClick={handleCreditCardPayment}
              className={`w-full bg-primary hover:bg-primary/90 text-white font-bold text-base md:text-lg py-4 md:py-6 rounded-xl transition-all duration-300 hover:scale-105 ${isAnimating ? "animate-slide-up animation-delay-700" : ""}`}
            >
              Pay {symbol}{(totalAmount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })} <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="w-full h-full md:w-auto md:h-auto md:max-w-[420px] md:max-h-[90vh] bg-dark-gray/95 backdrop-blur-xl border-0 md:border border-white/20 text-white md:rounded-2xl overflow-hidden animate-modal-scale-in flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 md:p-6 border-b border-white/10 relative flex-shrink-0">
            {/* Back button for payment steps */}
            {currentStep !== "service" && (
              <button
                onClick={goBack}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors animate-fade-in-scale"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className={`${currentStep !== "service" ? "pl-12" : ""} pr-12`}>
              <div
                className={`flex items-center gap-3 mb-2 animate-slide-down ${isAnimating ? "animation-delay-100" : ""}`}
              >
                {service.iconUrl && (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <img
                      src={service.iconUrl || "/placeholder.svg"}
                      alt={`${service.platform} icon`}
                      className="w-6 h-6 md:w-7 md:h-7 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class="w-6 h-6 md:w-7 md:h-7 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">${service.platform.charAt(0)}</div>`
                        }
                      }}
                    />
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  {currentStep === "service"
                    ? service.platform
                    : currentStep === "payment"
                      ? "Payment Method"
                      : "Payment Details"}
                </h2>
              </div>
              <p
                className={`text-gray-300 text-sm md:text-base animate-slide-down ${isAnimating ? "animation-delay-200" : ""}`}
              >
                {currentStep === "service"
                  ? service.description
                  : currentStep === "payment"
                    ? "Choose your preferred payment method"
                    : "Complete your payment"}
              </p>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain modal-scroll">
            {currentStep === "service" && renderServiceStep()}
            {currentStep === "payment" && renderPaymentStep()}
            {currentStep === "details" && renderDetailsStep()}
          </div>
        </div>
      </div>
    </>
  )
}
