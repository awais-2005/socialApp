"use client";

import React, { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderConfirmationProps {
  isOpen: boolean;
  serviceType: string;
  platform: string;
  quantity: number;
  totalBill: number;
  onClose?: () => void;
}

const AnimatedCheckmark = () => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.2,
    }}
    className="bg-primary rounded-full p-3 text-primary-foreground mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary))]"
  >
    <Rocket className="w-10 h-10" strokeWidth={2.5} />
  </motion.div>
);

export function OrderConfirmation({
  isOpen,
  serviceType,
  platform,
  quantity,
  totalBill,
  onClose
}: OrderConfirmationProps) {

  const triggerConfetti = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';
    document.body.appendChild(canvas);
    
    const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });

    myConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16e2b3', '#5fd6ff', '#f8fafc']
    });

    setTimeout(() => {
        if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
        }
    }, 4000)

  }, []);

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen, triggerConfetti]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="confirmation-title" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            className={cn(
                "relative w-full max-w-md transform text-center bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border border-border"
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            tabIndex={-1}
          >
            {/* Small Cross Button */}
            {onClose && (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 text-gray-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             )}
             <div className="p-8">
              <AnimatedCheckmark />
              
              <h2 id="confirmation-title" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Order Complete!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your boost is now being processed.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground text-sm">Service:</p>
                    <p className="font-semibold text-foreground">{serviceType}</p>
                </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground text-sm">Platform:</p>
                    <p className="font-semibold text-foreground">{platform}</p>
                </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground text-sm">Quantity:</p>
                    <p className="font-semibold text-foreground">{quantity.toLocaleString()}</p>
                </div>
                  <div className="flex justify-between items-center border-t border-border pt-3 mt-3">
                    <p className="text-muted-foreground text-base">Total:</p>
                    {/* Show total in selected currency */}
                    {(() => {
                      let symbol = "$";
                      let rate = 1;
                      if (typeof window !== "undefined") {
                        const selectedCountry = localStorage.getItem("selectedCountry") || "US";
                        try {
                          // Dynamically require to avoid SSR issues
                          // eslint-disable-next-line @typescript-eslint/no-var-requires
                          const { getCurrencyInfo } = require("./header");
                          const info = getCurrencyInfo(selectedCountry);
                          symbol = info.symbol || "$";
                          rate = info.rate || 1;
                        } catch (e) {
                          // fallback
                        }
                      }
                      return (
                        <p className="font-bold text-primary text-lg">
                          {symbol}{(totalBill * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      );
                    })()}

                </div>
              </div>

              {/* Close (X) Icon Button in Top Right */}
            
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
