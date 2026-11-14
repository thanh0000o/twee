import { type RefObject, useLayoutEffect } from 'react';

// The scattered gallery sections have a fixed height made for ten photos. The last section often
// holds fewer, which left a big empty area below the final photo. This trims that last section
// to its real content, so scrolling stops a short gap after the last photo.
const BOTTOM_GAP = 80;

export function useFitLastSection(galleryRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const section = gallery.querySelector<HTMLElement>(':scope > section:last-child');
    if (!section) return;

    const fit = () => {
      section.style.minHeight = '';
      // On phones the sections are a normal grid that already ends at its last photo.
      if (getComputedStyle(section).position === 'static') return;
      const sectionTop = section.getBoundingClientRect().top;
      let bottom = 0;
      for (const cell of Array.from(section.children) as HTMLElement[]) {
        bottom = Math.max(bottom, cell.getBoundingClientRect().bottom - sectionTop);
      }
      if (bottom > 0) section.style.minHeight = `${Math.ceil(bottom + BOTTOM_GAP)}px`;
      section.style.height = section.style.minHeight ? section.style.minHeight : '';
    };

    fit();
    const observer = new ResizeObserver(fit);
    for (const cell of Array.from(section.children)) observer.observe(cell);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
      section.style.minHeight = '';
      section.style.height = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
