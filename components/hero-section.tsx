"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Instagram, Twitter, Youtube, Zap, Facebook } from "lucide-react"

const baseClasses = "social-icon absolute w-12 h-12 md:w-14 md:h-14 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md transform scale-0 opacity-0 transition-all duration-1000 ease-out hover:scale-125 hover:border-white/40";

const SocialIcon = ({
  icon: Icon,
  className = '',
  brandColor,
  ...props
}: {
  icon: React.ElementType
  className?: string
  brandColor?: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  // SSR-safe: data-mounted is false initially and set to true on load
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.dataset.mounted = "true";
    }
  }, []);

  return (
    <div
      ref={divRef}
      className={`${baseClasses} ${className}`}
      data-mounted="false"
      style={{
        background: brandColor || "rgba(31, 41, 55, 0.5)",
        boxShadow: `0 8px 32px ${brandColor ? brandColor + "40" : "rgba(0,0,0,0.3)"}`,
      }}
      {...props}
    >
      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
    </div>
  );
};

export default function HeroSection() {
  const heroRef = useRef(null)

  useEffect(() => {
    // Animate hero title characters
    const chars = document.querySelectorAll(".hero-title .char")
    chars.forEach((char, index) => {
      setTimeout(
        () => {
          const element = char as HTMLElement
          element.style.transform = "translateY(0)"
          element.style.opacity = "1"
        },
        500 + index * 30,
      )
    })

    // Animate subtitle
    setTimeout(() => {
      const subtitle = document.querySelector(".hero-subtitle") as HTMLElement
      if (subtitle) {
        subtitle.style.transform = "translateY(0)"
        subtitle.style.opacity = "1"
      }
    }, 1200)

    // Animate social icons
    const socialIcons = document.querySelectorAll(".social-icon")
    socialIcons.forEach((icon, index) => {
      setTimeout(
        () => {
          const element = icon as HTMLElement
          element.style.transform = "scale(1)"
          element.style.opacity = "1"
        },
        2000 + index * 100,
      )
    })
  }, [])

  const HeroTitle = ({ text, isGradient = false }: { text: string; isGradient?: boolean }) => {
    return (
      <h1
        className={`hero-title text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter ${
          isGradient ? "text-gradient-simulated" : "text-white"
        }`}
        aria-label={text}
      >
        {text.split("").map((char, index) => (
          <span
            className="char inline-block transform translate-y-24 opacity-0 transition-all duration-1000 ease-out"
            key={index}
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    )
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4 py-20"
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <HeroTitle text="Elevate" isGradient={true} />
        <HeroTitle text="Your Social" />
        <HeroTitle text="Presence" isGradient={true} />
        <p className="hero-subtitle transform translate-y-12 opacity-0 transition-all duration-1000 ease-out max-w-2xl mx-auto mt-6 text-base md:text-xl text-gray-300 px-4">
          The ultimate marketplace for premium social media engagement. Real followers, authentic views, and genuine
          likes to skyrocket your growth.
        </p>
      </div>

      {/* Floating Social Media Platform Icons - Mobile Safe Positioning */}

      {/* Desktop positioning */}
      <div className="hidden md:block">
        {/* Instagram - Top Left */}
        <SocialIcon icon={Instagram} className="top-[15%] left-[10%]" brandColor="#E4405F" data-float-y="20" />

        {/* YouTube - Top Right */}
        <SocialIcon icon={Youtube} className="top-[25%] right-[8%]" brandColor="#FF0000" data-float-y="15" />

        {/* Twitter - Bottom Left */}
        <SocialIcon icon={Twitter} className="bottom-[20%] left-[20%]" brandColor="#1DA1F2" data-float-y="18" />

        {/* Facebook - Middle Left */}
        <SocialIcon icon={Facebook} className="top-[40%] left-[5%]" brandColor="#1877F2" data-float-y="16" />

        {/* TikTok - Bottom Right */}
        <SocialIcon icon={Zap} className="bottom-[15%] right-[18%]" brandColor="#FF0050" data-float-y="16" />

        {/* Additional bubbles for desktop */}
        <SocialIcon icon={Instagram} className="top-[35%] right-[12%]" brandColor="#E4405F" data-float-y="14" />

        <SocialIcon icon={Youtube} className="bottom-[35%] left-[8%]" brandColor="#FF0000" data-float-y="20" />

        <SocialIcon icon={Facebook} className="top-[45%] left-[15%]" brandColor="#1877F2" data-float-y="13" />
      </div>

      {/* Mobile positioning - Only in safe vacant spaces */}
      <div className="block md:hidden">
        {/* Top corners only - far from content */}
        <SocialIcon icon={Instagram} className="top-[5%] left-[5%]" brandColor="#E4405F" data-float-y="15" />

        <SocialIcon icon={Youtube} className="top-[5%] right-[5%]" brandColor="#FF0000" data-float-y="12" />

        {/* Bottom corners only - below buttons */}
        <SocialIcon icon={Twitter} className="bottom-[8%] left-[8%]" brandColor="#1DA1F2" data-float-y="18" />

        <SocialIcon icon={Zap} className="bottom-[8%] right-[8%]" brandColor="#FF0050" data-float-y="16" />

        {/* Far edges - avoiding central content area */}
        <SocialIcon icon={Facebook} className="top-[20%] left-[2%]" brandColor="#1877F2" data-float-y="14" />
      </div>
    </section>
  )
}
