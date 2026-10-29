import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'wouter';
import { motion, prefersReducedMotion } from './tokens';

gsap.registerPlugin(ScrollTrigger);

// Smooth page scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger
// and Lenis stay in sync. Skipped entirely when the visitor asks for reduced motion.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: motion.lenisLerp,
      // Lists, chat windows and the works rail keep their own native scrolling.
      allowNestedScroll: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page: start at the top and let ScrollTrigger measure the new layout.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location]);

  return <>{children}</>;
}
