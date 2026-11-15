import { type RefObject, useLayoutEffect } from 'react';

// Lays out the scattered gallery on desktop.
// Every photo goes to the highest free spot, so there are no big empty areas, and has a random
// preferred position sideways, so it still looks scattered instead of like a grid. A photo never
// overlaps another one, and landing straight under another photo is avoided where possible.
// All photo sizes are known before they load (media-ratios.ts), so this runs once and nothing jumps
// while scrolling; it only runs again when the window gets wider or narrower.
const GAP_X = 90;
const GAP_Y = 60;
const BOTTOM_GAP = 80;
const STEPS = 14;

type Box = { left: number; right: number; top: number; bottom: number };
type Size = { width: number; height: number; offsetX: number; offsetY: number };

const overlaps = (a: Box, b: Box) =>
  a.left < b.right + GAP_X && b.left < a.right + GAP_X && a.top < b.bottom + GAP_Y && b.top < a.bottom + GAP_Y;

const stackedUnder = (box: Box, other: Box) => {
  const shared = Math.min(box.right, other.right) - Math.max(box.left, other.left);
  const narrow = Math.min(box.right - box.left, other.right - other.left);
  const gap = box.top - other.bottom;
  return shared > narrow * 0.3 && gap >= 0 && gap < 480;
};

// Seeded random numbers, so the same photo always prefers the same spot.
const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function measure(cell: HTMLElement): Size | null {
  const photo = cell.querySelector<HTMLElement>('.viz-item-container');
  if (!photo) return null;
  const caption = cell.querySelector<HTMLElement>('.viz-fungus-caption-wrap');
  const c = cell.getBoundingClientRect();
  const p = photo.getBoundingClientRect();
  const bottom = caption ? Math.max(p.bottom, caption.getBoundingClientRect().bottom) : p.bottom;
  return { width: p.width, height: bottom - p.top, offsetX: p.left - c.left, offsetY: p.top - c.top };
}

function reset(gallery: HTMLElement) {
  for (const section of Array.from(gallery.querySelectorAll<HTMLElement>(':scope > section'))) {
    section.style.minHeight = '';
    section.style.height = '';
    section.style.padding = '';
    for (const cell of Array.from(section.children) as HTMLElement[]) {
      cell.style.top = '';
      cell.style.left = '';
      cell.style.right = '';
    }
  }
}

function layoutGallery(gallery: HTMLElement) {
  reset(gallery);
  const sections = Array.from(gallery.querySelectorAll<HTMLElement>(':scope > section'));
  // On phones the sections are a normal grid that already ends at its last photo.
  if (sections.length === 0 || getComputedStyle(sections[0]).position === 'static') return;

  const width = gallery.getBoundingClientRect().width;
  const items = sections.flatMap((section) =>
    (Array.from(section.children) as HTMLElement[]).map((cell) => ({ cell, section, size: measure(cell) })),
  );

  // Place every photo, in gallery coordinates (y = 0 is the top of the first section).
  const placed: { cell: HTMLElement; section: HTMLElement; box: Box; size: Size }[] = [];
  let floor = 0;
  items.forEach(({ cell, section, size }, index) => {
    if (!size) return;
    const span = Math.max(1, width - size.width);
    const preferred = seeded(index + 1) * span;
    const near = placed.map((item) => item.box).filter((box) => box.bottom + GAP_Y > floor);

    let best: { x: number; y: number; score: number } | null = null;
    // A random extra drop per photo keeps the rows from lining up.
    const drop = seeded(index + 101) * 240;
    const ys = [floor, ...near.map((box) => box.bottom + GAP_Y)]
      .map((y) => y + drop)
      .filter((y) => y >= floor)
      .sort((a, b) => a - b);
    // Only look near the photo's own random spot, so photos don't neatly fill row after row.
    const xs = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
      .map((k) => Math.min(span, Math.max(0, preferred + (k * span) / STEPS)));
    for (const x of xs) {
      for (const y of ys) {
        const box = { left: x, right: x + size.width, top: y, bottom: y + size.height };
        if (near.some((other) => overlaps(box, other))) continue;
        const stacked = near.some((other) => stackedUnder(box, other));
        // Photos side by side at the same height read as a row; push them out of line.
        const inLine = near.filter((other) => Math.abs(other.top - y) < 110 || Math.abs(other.bottom - box.bottom) < 110).length;
        const score = y + Math.abs(x - preferred) * 0.45 + (stacked ? 340 : 0) + inLine * 170;
        if (!best || score < best.score) best = { x, y, score };
        break; // the lowest free spot for this x
      }
    }
    if (!best) best = { x: preferred, y: Math.max(floor, ...near.map((box) => box.bottom + GAP_Y)), score: 0 };
    const box = { left: best.x, right: best.x + size.width, top: best.y, bottom: best.y + size.height };
    placed.push({ cell, section, box, size });
    // Keep the order roughly top to bottom: a photo can't go much higher than the last few.
    floor = Math.max(floor, Math.min(...placed.slice(-5).map((item) => item.box.top)) - 120);
  });

  // Each section gets the height of its own photos; the photos are positioned inside it.
  for (const section of sections) section.style.padding = '0';
  let start = 0;
  sections.forEach((section, index) => {
    const mine = placed.filter((item) => item.section === section);
    const end = mine.length ? Math.max(...mine.map((item) => item.box.bottom)) : start;
    const isLast = index === sections.length - 1;
    const height = Math.max(0, Math.ceil(end - start + (isLast ? BOTTOM_GAP : 0)));
    section.style.minHeight = `${height}px`;
    section.style.height = `${height}px`;
    for (const { cell, box, size } of mine) {
      cell.style.right = 'auto';
      cell.style.left = `${box.left - size.offsetX}px`;
      cell.style.top = `${box.top - start - size.offsetY}px`;
    }
    start += height;
  });
}

export function useFitLastSection(galleryRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    let frame = 0;
    const layout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => layoutGallery(gallery));
    };

    layout();
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      layout();
    };
    // Only a photo without a known size can still change height after loading.
    const observer = new ResizeObserver(layout);
    for (const media of Array.from(gallery.querySelectorAll<HTMLElement>('.viz-img'))) {
      if (!media.style.aspectRatio) observer.observe(media.closest('.viz-item-container') ?? media);
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      reset(gallery);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
