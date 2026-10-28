import { internshipCover, type WorkImage } from './works-assets';

export type Work = {
  title: string;
  accent: string;
  cover: Pick<WorkImage, 'file' | 'alt'>;
  href?: string;
};

export const works: Work[] = [
  {
    title: 'Allergen Menu Checker — Frontend MVP',
    accent: '#B45309',
    cover: { file: 'allergen-menu-checker-cover.svg', alt: 'Allergen Menu Checker portfolio cover on a white background' },
    href: '/works/allergen-menu-checker',
  },
  {
    title: 'Make It Work',
    accent: '#1d7f9c',
    cover: internshipCover,
    href: '/works/make-it-work',
  },
  {
    title: 'Drone Strategy — Bachelor’s Thesis',
    accent: '#176ec0',
    cover: { file: 'drone-strategy-portfolio-cover.svg', alt: 'English Drone Strategy portfolio cover with low-set type, one small blue dot and three black institutional logos' },
    href: '/works/drone-strategie',
  },
  {
    title: 'Flex Delivery — Trend Report',
    accent: '#23aa55',
    cover: { file: 'flex-delivery-spaced-cover.svg', alt: 'English Flex Delivery trend report cover with low-set type, one small green dot and matching-size black Erasmus Hogeschool Brussels logo beside a smaller black Flex Delivery wordmark, 2021–2022' },
    href: '/works/flex-delivery',
  },
  {
    title: 'Mokkatoff! — Website and Visual Identity',
    accent: '#E81733',
    cover: { file: 'mokkatoff-portfolio-cover.svg', alt: 'Mokkatoff! portfolio cover with the navy overlapping wordmark and red exclamation mark on white' },
    href: '/works/mokkatoff',
  },
  {
    title: 'Growing Portfolio — Interactive Website',
    accent: '#4D0A15',
    cover: { file: 'growing-portfolio-cover.svg', alt: 'Minimal white Growing Portfolio cover with a black title, one small burgundy dot and Scroll to reveal subtitle' },
    href: '/works/growing-portfolio',
  },
  {
    title: 'Digital Desktop Portfolio — Portfolio Concept',
    accent: '#176ec0',
    cover: { file: 'desktop-portfolio-cover.svg', alt: 'Minimal white Desktop Portfolio cover with a black title, glossy blue sphere and Interface and interaction subtitle' },
    href: '/works/desktop-portfolio',
  },
  {
    title: 'First Portfolio — Windows 95 Desktop',
    accent: '#6b7f2a',
    cover: { file: 'first-portfolio-cover.svg', alt: 'Minimal white First Portfolio cover with a black title, one small olive sphere and Windows 95 desktop subtitle' },
    href: '/works/first-portfolio',
  },
];

// Selection is shared by both views and survives client-side route changes.
let rememberedWorkFile: string | null = null;
export const getRememberedWorkIndex = () => Math.max(0, works.findIndex((work) => work.cover.file === rememberedWorkFile));
export const rememberWorkIndex = (index: number) => { rememberedWorkFile = works[index].cover.file; };

export const workTitleParts = (title: string) => {
  const [name, ...rest] = title.split(' — ');
  return { name, note: rest.join(' — ') };
};
