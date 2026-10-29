// Shared timing for all scroll motion. Change values here, not in components.
// The rules behind these numbers live in .claude/skills/website-motion/SKILL.md.

export const motion = {
  // Durations in seconds (GSAP units).
  duration: {
    quick: 0.25,
    base: 0.6,
    slow: 0.9,
  },
  // Retro site: calm easing, no bounce or elastic.
  ease: 'power2.out',
  // Reveal distance in px. Keep it small.
  revealDistance: 16,
  // Where a reveal starts: element top reaches 88% of the viewport height.
  revealStart: 'top 88%',
  // Lenis smoothing. 1 = native feel, lower = smoother/slower.
  lenisLerp: 0.1,
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
