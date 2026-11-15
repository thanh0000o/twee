import { type RefObject, useLayoutEffect } from 'react';

// Keeps the scattered gallery clean on desktop:
// 1. No two photos overlap. The scattered positions are fixed in CSS, but the photo order is random
//    and wide photos take more room, so a photo that would touch another one moves to the nearest free
//    spot, preferably sideways, and not straight under another photo.
// 2. The last section ends a short gap after its last photo, instead of keeping the full height
//    made for ten photos.
const PHOTO_GAP = 28;
const BOTTOM_GAP = 80;

type Box = { left: number; right: number; top: number; bottom: number };

const photoBox = (cell: HTMLElement): Box | null => {
  const photo = cell.querySelector<HTMLElement>('.viz-item-container');
  if (!photo) return null;
  const caption = cell.querySelector<HTMLElement>('.viz-fungus-caption-wrap');
  const a = photo.getBoundingClientRect();
  const bottom = caption ? Math.max(a.bottom, caption.getBoundingClientRect().bottom) : a.bottom;
  return { left: a.left, right: a.right, top: a.top, bottom };
};

const overlaps = (a: Box, b: Box) =>
  a.left < b.right + PHOTO_GAP && b.left < a.right + PHOTO_GAP && a.top < b.bottom + PHOTO_GAP && b.top < a.bottom + PHOTO_GAP;

// Photos stacked right under each other look like a column, which breaks the scattered look.
const stackedUnder = (box: Box, other: Box) => {
  const sharedWidth = Math.min(box.right, other.right) - Math.max(box.left, other.left);
  const narrow = Math.min(box.right - box.left, other.right - other.left);
  const gapBelow = box.top - other.bottom;
  return sharedWidth > narrow * 0.3 && gapBelow >= -PHOTO_GAP && gapBelow < 520;
};

function layoutSection(section: HTMLElement, isLast: boolean, above: Box[]) {
  const cells = Array.from(section.children) as HTMLElement[];
  for (const cell of cells) {
    cell.style.top = '';
    cell.style.left = '';
    cell.style.right = '';
  }
  section.style.minHeight = '';
  section.style.height = '';
  // On phones the sections are a normal grid that already ends at its last photo.
  if (getComputedStyle(section).position === 'static') return [];

  const area = section.getBoundingClientRect();
  const minX = area.left + 8;
  const maxX = area.right - 8;
  // Photos of the sections above count too, so nothing lines up under them across the boundary.
  const placed: Box[] = [...above];
  const ordered = cells
    .map((cell) => ({ cell, top: cell.getBoundingClientRect().top }))
    .sort((a, b) => a.top - b.top);

  let bottom = 0;
  for (const { cell } of ordered) {
    const start = photoBox(cell);
    if (!start) continue;
    const width = start.right - start.left;
    const free = (box: Box) => box.left >= minX && box.right <= maxX && !placed.some((other) => overlaps(box, other));

    // Look for the free spot closest to where the photo was meant to be. Moving sideways is cheap,
    // moving down costs more, and landing right under another photo costs most.
    let best = { dx: 0, dy: 0, score: Infinity };
    const stepX = Math.max(24, width / 6);
    for (let dy = 0; dy <= 1600 && dy * 2.5 < best.score; dy += 40) {
      for (let dx = minX - start.left; start.left + dx + width <= maxX; dx += stepX) {
        const box = { left: start.left + dx, right: start.right + dx, top: start.top + dy, bottom: start.bottom + dy };
        if (!free(box)) continue;
        const score = Math.abs(dx) + dy * 2.5 + (placed.some((other) => stackedUnder(box, other)) ? 1200 : 0);
        if (score < best.score) best = { dx, dy, score };
      }
      // Also try the original column exactly, which the stepping can skip.
      const box = { ...start, top: start.top + dy, bottom: start.bottom + dy };
      if (free(box)) {
        const score = dy * 2.5 + (placed.some((other) => stackedUnder(box, other)) ? 1200 : 0);
        if (score < best.score) best = { dx: 0, dy, score };
      }
    }
    if (best.score === Infinity) best = { dx: 0, dy: 0, score: 0 };

    const style = getComputedStyle(cell);
    if (best.dy) cell.style.top = `${(parseFloat(style.top) || 0) + best.dy}px`;
    if (best.dx) {
      const left = cell.getBoundingClientRect().left - area.left;
      cell.style.right = 'auto';
      cell.style.left = `${left + best.dx}px`;
    }
    const box = { left: start.left + best.dx, right: start.right + best.dx, top: start.top + best.dy, bottom: start.bottom + best.dy };
    placed.push(box);
    bottom = Math.max(bottom, box.bottom - area.top);
  }

  const cssMinHeight = parseFloat(getComputedStyle(section).minHeight) || 0;
  const needed = Math.ceil(bottom + (isLast ? BOTTOM_GAP : PHOTO_GAP * 2));
  const height = isLast ? needed : Math.max(cssMinHeight, needed);
  section.style.minHeight = `${height}px`;
  section.style.height = `${height}px`;
  return placed;
}

export function useFitLastSection(galleryRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const sections = Array.from(gallery.querySelectorAll<HTMLElement>(':scope > section'));
    if (sections.length === 0) return;

    let frame = 0;
    const layout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let above: Box[] = [];
        sections.forEach((section, index) => {
          // Boxes are in viewport coordinates; later sections only move after this one is final.
          above = layoutSection(section, index === sections.length - 1, above).slice(-12);
        });
      });
    };

    layout();
    // Every photo has its size reserved before it loads (see media-ratios.ts), so the layout is set
    // once and stays put while scrolling. It only runs again when the window gets wider or narrower,
    // or when a photo without a known size turns out to have a different height.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      layout();
    };
    const observer = new ResizeObserver(layout);
    for (const media of Array.from(gallery.querySelectorAll<HTMLElement>('.viz-img'))) {
      if (!media.style.aspectRatio) observer.observe(media.closest('.viz-item-container') ?? media);
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      for (const section of sections) {
        section.style.minHeight = '';
        section.style.height = '';
        for (const cell of Array.from(section.children) as HTMLElement[]) {
          cell.style.top = '';
          cell.style.left = '';
          cell.style.right = '';
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
