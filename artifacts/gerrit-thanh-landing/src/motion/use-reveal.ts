import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, prefersReducedMotion } from './tokens';

gsap.registerPlugin(ScrollTrigger);

// Fades an element in and lifts it a few pixels the first time it scrolls into view.
// Pass enabled = false for content that is already visible on load.
export function useReveal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        autoAlpha: 0,
        y: motion.revealDistance,
        duration: motion.duration.base,
        ease: motion.ease,
        scrollTrigger: { trigger: el, start: motion.revealStart, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [enabled]);

  return ref;
}
