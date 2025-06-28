"use client"

import { useEffect, useRef } from 'react';

export const useAnimeOnScroll = (
  target: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = { threshold: 0.1 }
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger animation logic here - assuming animation is handled by CSS class
          entry.target.classList.add('animate-on-scroll-visible'); // Using a generic class name
          // Optionally unobserve if animation should only happen once
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, options);

    const current = target.current;
    if (current) observerRef.current.observe(current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [target, options]); // Dependencies must include all used variables
};
