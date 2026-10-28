import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { closestCarouselCopy, wrapCarouselIndex } from '../lib/looping-carousel';

type Options = {
  count: number;
  initialIndex: number;
  onActiveChange: (index: number) => void;
};

/** Native scrolling with repeated covers; selection always refers to the original list. */
export function useLoopingWorkRail({ count, initialIndex, onActiveChange }: Options) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const physicalIndex = useRef(count + wrapCarouselIndex(initialIndex, count));
  const [active, setActive] = useState(wrapCarouselIndex(initialIndex, count));

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slides = Array.from(rail.children) as HTMLElement[];
    if (!slides.length) return;
    let mid = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let distance = Infinity;
    slides.forEach((slide, index) => {
      const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - mid);
      if (d < distance) { distance = d; best = index; }
    });

    const logical = wrapCarouselIndex(best, count);
    const outsideMiddle = best < count || best >= count * 2;
    // Rebase at a settled slide, or before a long gesture reaches a physical end.
    // Equivalent copies have identical neighbours, so the visible image does not change.
    if (outsideMiddle && (distance < 1.5 || best < 2 || best >= slides.length - 2)) {
      const middle = count + logical;
      const shift = slides[middle].offsetLeft - slides[best].offsetLeft;
      rail.scrollTo({ left: rail.scrollLeft + shift, behavior: 'instant' });
      best = middle;
      mid = rail.scrollLeft + rail.clientWidth / 2;
    }

    physicalIndex.current = best;
    slides.forEach((slide) => {
      const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - mid);
      const focus = Math.max(0, 1 - d / slide.offsetWidth);
      slide.style.setProperty('--cover-scale', String(0.8 + focus * 0.2));
      slide.style.setProperty('--cover-blur', `${(1 - focus) * 2.5}px`);
      slide.style.setProperty('--cover-opacity', String(0.65 + focus * 0.35));
      slide.style.zIndex = String(Math.round(focus * 10));
    });
    onActiveChange(logical);
    setActive(logical);
  }, [count, onActiveChange]);

  const goTo = useCallback((index: number, immediate = false) => {
    const rail = railRef.current;
    if (!rail) return;
    const target = immediate
      ? count + wrapCarouselIndex(index, count)
      : closestCarouselCopy(index, physicalIndex.current, count);
    const slide = rail.children[target] as HTMLElement | undefined;
    if (!slide) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - rail.clientWidth / 2,
      behavior: immediate || reduce ? 'instant' : 'smooth',
    });
  }, [count]);

  useLayoutEffect(() => {
    goTo(initialIndex, true);
    measure();
  }, [initialIndex, goTo, measure]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    let wheelDelta = 0;
    let lastWheel = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (performance.now() - lastWheel < 420) return;
      wheelDelta += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1);
      if (Math.abs(wheelDelta) < 24) return;
      goTo(wrapCarouselIndex(physicalIndex.current, count) + Math.sign(wheelDelta));
      lastWheel = performance.now();
      wheelDelta = 0;
    };
    const onResize = () => {
      goTo(wrapCarouselIndex(physicalIndex.current, count), true);
      measure();
    };
    const gallery = rail.parentElement;
    rail.addEventListener('scroll', onScroll, { passive: true });
    rail.addEventListener('scrollend', onScroll);
    gallery?.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener('scroll', onScroll);
      rail.removeEventListener('scrollend', onScroll);
      gallery?.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
  }, [count, measure, goTo]);

  return { railRef, active, goTo };
}
