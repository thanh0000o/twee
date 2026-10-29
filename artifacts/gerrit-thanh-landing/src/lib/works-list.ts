import { internshipCover, type WorkImage } from './works';

export type Work = {
  title: string;
  accent: string;
  cover: Pick<WorkImage, 'file' | 'alt'>;
  href?: string;
  /** Text index: year (only where known), kind, a small hover preview and context. */
  year?: string;
  kind: 'AI' | 'Web' | 'Research' | 'Visual';
  preview?: string;
  context?: string;
};

// Each work's carousel dot matches its cover accent; every work uses a unique colour.
export const works: Work[] = [
  {
    title: 'My Job-Search Agent — AI Agents',
    accent: '#176ec0',
    cover: { file: 'vacature-agent-cover.svg', alt: 'White My Job-Search Agent cover with a black title and a small glossy blue sphere' },
    href: '/works/vacature-agent',
    year: '2026 – ongoing',
    kind: 'AI',
    context: "Personal project",
  },
  {
    title: 'Music Agent — AI Agents',
    accent: '#A569BD',
    cover: { file: 'music-agent-cover.svg', alt: 'White Music Agent cover with a black title and one small glossy purple sphere' },
    href: '/works/music-agent',
    year: '2026 – ongoing',
    kind: 'AI',
    context: "Personal project",
  },
  {
    title: 'Allergen Menu Checker — Frontend MVP',
    accent: '#B45309',
    cover: { file: 'allergen-menu-checker-cover.svg', alt: 'Allergen Menu Checker portfolio cover on a white background' },
    href: '/works/allergen-menu-checker',
    year: '2026',
    kind: 'Web',
    preview: 'allergen-menu-checker/service-mode.webp',
    context: "Student kitchen job, in progress",
  },
  {
    title: 'Make It Work',
    accent: '#1E8793',
    cover: internshipCover,
    href: '/works/make-it-work',
    year: '2023',
    kind: 'Visual',
    preview: 'internship-make-it-work-front.webp',
    context: "Internship, Make It Work",
  },
  {
    title: 'Drone Strategy — Bachelor’s Thesis',
    accent: '#6C5CE7',
    cover: { file: 'drone-strategy-portfolio-cover.svg', alt: 'English Drone Strategy portfolio cover with low-set type, one small violet sphere and three black institutional logos' },
    href: '/works/drone-strategie',
    year: '2023 – 2024',
    kind: 'Research',
    preview: 'drone-strategy.webp',
    context: "Bachelor's thesis for Smart Dún Laoghaire",
  },
  {
    title: 'Flex Delivery — Trend Report',
    accent: '#23aa55',
    cover: { file: 'flex-delivery-spaced-cover.svg', alt: 'English Flex Delivery trend report cover with low-set type, one small green dot and matching-size black Erasmus Hogeschool Brussels logo beside a smaller black Flex Delivery wordmark, 2021–2022' },
    href: '/works/flex-delivery',
    year: '2021 – 2022',
    kind: 'Research',
    preview: 'trendrapport-flex-delivery.webp',
    context: "Trendwatching course, Erasmushogeschool",
  },
  {
    title: 'Mokkatoff! — Website and Visual Identity',
    accent: '#E81733',
    cover: { file: 'mokkatoff-portfolio-cover.svg', alt: 'Mokkatoff! portfolio cover with the navy overlapping wordmark and red exclamation mark on white' },
    href: '/works/mokkatoff',
    year: '2026',
    kind: 'Web',
    preview: 'mokkatoff/website-hero.png',
    context: "For a friend's family business",
  },
  {
    title: 'Growing Portfolio — Interactive Website',
    accent: '#4D0A15',
    cover: { file: 'growing-portfolio-cover.svg', alt: 'Minimal white Growing Portfolio cover with a black title, one small burgundy dot and Scroll to reveal subtitle' },
    href: '/works/growing-portfolio',
    year: '2026',
    kind: 'Web',
    preview: 'growing-portfolio/growing-branches-growth.webp',
    context: "Portfolio concept",
  },
  {
    title: 'Digital Desktop Portfolio — Portfolio Concept',
    accent: '#F1C40F',
    cover: { file: 'desktop-portfolio-cover.svg', alt: 'Minimal white Desktop Portfolio cover with a black title, glossy gold sphere and Interface and interaction subtitle' },
    href: '/works/desktop-portfolio',
    year: '2025',
    kind: 'Web',
    preview: 'desktop-portfolio/main-view.jpg',
    context: "Portfolio concept",
  },
  {
    title: 'First Portfolio — Windows 95 Desktop',
    accent: '#6b7f2a',
    cover: { file: 'first-portfolio-cover.svg', alt: 'Minimal white First Portfolio cover with a black title, one small olive sphere and Windows 95 desktop subtitle' },
    href: '/works/first-portfolio',
    year: '2025',
    kind: 'Web',
    preview: 'first-portfolio/desktop.jpeg',
    context: "First portfolio, still online",
  },
];

// Selection is shared by both views and survives client-side route changes.
let rememberedWorkFile: string | null = null;
export const getRememberedWorkIndex = () => Math.max(0, works.findIndex((work) => work.cover.file === rememberedWorkFile));
export const getRememberedWorkSelection = () => rememberedWorkFile === null ? null : getRememberedWorkIndex();
export const rememberWorkIndex = (index: number) => { rememberedWorkFile = works[index].cover.file; };

export const workTitleParts = (title: string) => {
  const [name, ...rest] = title.split(' — ');
  return { name, note: rest.join(' — ') };
};
