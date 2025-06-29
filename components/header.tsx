"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Rocket } from "lucide-react"

// Move flags outside the Header component for global access
export const flags = [
  { code: "CN", emoji: "🇨🇳", currency: "CNY", symbol: "¥" },
  { code: "US", emoji: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "PK", emoji: "🇵🇰", currency: "PKR", symbol: "₨" },
  { code: "IN", emoji: "🇮🇳", currency: "INR", symbol: "₹" },
  { code: "BD", emoji: "🇧🇩", currency: "BDT", symbol: "৳" },
  { code: "IR", emoji: "🇮🇷", currency: "IRR", symbol: "﷼" },
  { code: "IQ", emoji: "🇮🇶", currency: "IQD", symbol: "ع.د" },
];

export function getCurrencyInfo(selectedCode: string) {
  const rates: Record<string, number> = {
    USD: 1,
    CNY: 7.25,
    PKR: 278,
    INR: 83,
    BDT: 117,
    IRR: 42000,
    IQD: 1310,
  };
  const flag = flags.find((f) => f.code === selectedCode) || flags[2]; // default to PK
  return {
    symbol: flag.symbol,
    rate: rates[flag.currency] || 1,
    currency: flag.currency,
  };
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("PK")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headerElement = document.querySelector(".header-anim") as HTMLElement
    if (headerElement) {
      setTimeout(() => {
        headerElement.style.transform = "translateY(0)"
        headerElement.style.opacity = "1"
      }, 2800)
    }

  }, [])

  useEffect(() => {
    if (open && dropdownRef.current) {
      dropdownRef.current.style.display = "block"
      dropdownRef.current.style.opacity = "1"
      dropdownRef.current.style.transform = "translateY(0)"
    } else if (dropdownRef.current) {
      dropdownRef.current.style.display = "none"
      dropdownRef.current.style.opacity = "0"
      dropdownRef.current.style.transform = "translateY(-20px)"
    }
  }, [open])

  // When user selects a country, store it in localStorage for global access
  useEffect(() => {
    if (selected) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCountry', selected)
      }
    }
  }, [selected])

  return (
    <header className="header-anim fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-8 lg:px-16 bg-rich-black/50 backdrop-blur-lg border-b border-white/10 transform -translate-y-12 opacity-0 transition-all duration-800 ease-out">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Rocket className="w-7 h-7 text-primary group-hover:animate-pulse" />
          <span className="text-2xl font-bold text-white tracking-wider">ViralVortex</span>
        </Link>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-normal focus:outline-none"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="text-2xl">{flags.find(f => f.code === selected)?.emoji}</span>
            <svg className={`ml-2 w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div
            ref={dropdownRef}
            style={{ display: open ? "block" : "none", opacity: open ? 1 : 0, position: "absolute", right: 0, marginTop: "0.5rem", minWidth: "10rem", background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", zIndex: 50, padding: "0.5rem 0", transition: "opacity 0.3s, transform 0.3s", transform: open ? "translateY(0)" : "translateY(-20px)" }}
            tabIndex={-1}
            role="listbox"
          >
            {flags.map(flag => (
              <button
                key={flag.code}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-white/10 text-white ${selected === flag.code ? "bg-white/10" : ""}`}
                onClick={() => { setSelected(flag.code); setOpen(false) }}
                role="option"
                aria-selected={selected === flag.code}
              >
                <span className="text-2xl">{flag.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
