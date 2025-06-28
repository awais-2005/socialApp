"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface AnimationProps {
  translateY?: [number, number]
  opacity?: [number, number]
  scale?: [number, number]
  duration?: number
  delay?: number
  easing?: string
}

export const useAnimeOnScroll = (
  target: React.RefObject<HTMLElement>,
  animationProps: AnimationProps,
  threshold = 0.1,
) => {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const currentTarget = target.current
    if (!currentTarget) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const duration = animationProps.duration || 800
            const delay = animationProps.delay || 0

            setTimeout(() => {
              element.style.transition = `all ${duration}ms ease-out`

              if (animationProps.translateY) {
                element.style.transform = `translateY(${animationProps.translateY[1]}px)`
              }
              if (animationProps.opacity) {
                element.style.opacity = animationProps.opacity[1].toString()
              }
              if (animationProps.scale) {
                element.style.transform += ` scale(${animationProps.scale[1]})`
              }
            }, delay)

            // Unobserve after animation to prevent re-triggering
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold },
    )

    observer.observe(currentTarget)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [target, animationProps, threshold])
}
