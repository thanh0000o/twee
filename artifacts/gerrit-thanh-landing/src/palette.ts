export const PALETTES = [
  { name: 'blue', filter: 'none', highlight: '#00ffff' },
  { name: 'green', filter: 'hue-rotate(-85deg)', highlight: '#b6ff79' },
  { name: 'violet', filter: 'hue-rotate(55deg)', highlight: '#d8b4ff' },
  { name: 'rose', filter: 'hue-rotate(115deg)', highlight: '#ffb9db' },
  { name: 'lime', filter: 'hue-rotate(-130deg)', highlight: '#e0ff83' },
  // Frutiger Aero: a painted sky panel instead of a tinted gradient, so no colour filter.
  { name: 'aero', filter: 'none', highlight: '#8fdcff' },
];

export const PALETTE_STORAGE_KEY = 'thanh-landing-palette';

export const getPaletteLinkColor = (name: string) =>
  name === 'rose' ? '#ff8c7e' :
  name === 'aero' ? '#1aa8e0' :
  name === 'violet' ? '#ff8e98' :
  name === 'blue' ? 'var(--color-accent-red)' :
  '#ff6070';

let currentPaletteIndex = 0;

export const savePaletteIndex = (index: number) => {
  currentPaletteIndex = PALETTES[index] ? index : 0;
  try {
    window.localStorage.setItem(PALETTE_STORAGE_KEY, PALETTES[currentPaletteIndex].name);
  } catch {
    // Keep the chosen color during this visit even when storage is unavailable.
  }
};

export const initializeVisitPalette = () => {
  savePaletteIndex(Math.floor(Math.random() * PALETTES.length));
};

export const getSavedPaletteIndex = () => {
  if (typeof window === 'undefined') return currentPaletteIndex;
  try {
    const savedName = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    const index = PALETTES.findIndex((palette) => palette.name === savedName);
    return index === -1 ? currentPaletteIndex : index;
  } catch {
    return currentPaletteIndex;
  }
};

export const getSavedPaletteFilter = () => PALETTES[getSavedPaletteIndex()].filter;
