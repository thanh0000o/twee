import { MEDIA_RATIOS } from './media-ratios';

// Maps each gallery file's final URL to its width / height, so a photo's box has the right size
// before the photo itself has loaded.
const files = import.meta.glob(
  [
    '@/assets/artwork/*.{jpg,jpeg,png,webp}',
    '@/assets/artwork/videos/*.{mp4,webm}',
    '@/assets/visualisations/*.{jpg,jpeg,png,webp}',
    '@/assets/visualisations/fungi/*.webp',
  ],
  { eager: true, import: 'default' },
) as Record<string, string>;

const ratioByUrl = new Map<string, number>();
for (const [path, url] of Object.entries(files)) {
  const key = path.replace(/^.*\/assets\//, '');
  const ratio = MEDIA_RATIOS[key];
  if (ratio) ratioByUrl.set(url, ratio);
}

export const mediaRatio = (url: string): number | undefined => ratioByUrl.get(url);
