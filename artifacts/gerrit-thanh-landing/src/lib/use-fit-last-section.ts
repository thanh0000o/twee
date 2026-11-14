import { type RefObject, useLayoutEffect } from 'react';

// Keeps the scattered gallery clean on desktop:
// 1. No two photos overlap. The scattered positions are fixed in CSS, but the photo order is random
//    and wide photos take more room, so any photo that would touch one above it is moved down a bit.
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

function layoutSection(section: HTMLElement, isLast: boolean) {
  const cells = Array.from(section.children) as HTMLElement[];
  for (const cell of cells) cell.style.top = '';
  section.style.minHeight = '';
  section.style.height = '';
  // On phones the sections are a normal grid that already ends at its last photo.
  if (getComputedStyle(section).position === 'static') return;

  const sectionTop = section.getBoundingClientRect().top;
  const placed: Box[] = [];
  const ordered = cells
    .map((cell) => ({ cell, top: cell.getBoundingClientRect().top }))
    .sort((a, b) => a.top - b.top);

  let bottom = 0;
  for (const { cell } of ordered) {
    let box = photoBox(cell);
    if (!box) continue;
    let shift = 0;
    for (let guard = 0; guard < 20; guard++) {
      const hits = placed.filter((other) => overlaps(box!, other));
      if (hits.length === 0) break;
      const push = Math.max(...hits.map((other) => other.bottom + PHOTO_GAP - box!.top));
      shift += push;
      box = { ...box, top: box.top + push, bottom: box.bottom + push };
    }
    if (shift > 0) {
      const currentTop = parseFloat(getComputedStyle(cell).top) || 0;
      cell.style.top = `${currentTop + shift}px`;
    }
    placed.push(box);
    bottom = Math.max(bottom, box.bottom - sectionTop);
  }

  const cssMinHeight = parseFloat(getComputedStyle(section).minHeight) || 0;
  const needed = Math.ceil(bottom + (isLast ? BOTTOM_GAP : PHOTO_GAP * 2));
  const height = isLast ? needed : Math.max(cssMinHeight, needed);
  section.style.minHeight = `${height}px`;
  section.style.height = `${height}px`;
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
        sections.forEach((section, index) => layoutSection(section, index === sections.length - 1));
      });
    };

    layout();
    // Photos load lazily and only then get their real height, so lay out again when one changes size.
    const observer = new ResizeObserver(layout);
    for (const photo of Array.from(gallery.querySelectorAll('.viz-item-container'))) observer.observe(photo);
    window.addEventListener('resize', layout);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', layout);
      for (const section of sections) {
        section.style.minHeight = '';
        section.style.height = '';
        for (const cell of Array.from(section.children) as HTMLElement[]) cell.style.top = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
