import { useEffect, useState } from 'react';
import { getSavedPaletteIndex, PALETTE_STORAGE_KEY, PALETTES } from '../palette';

export const useSavedPalette = () => {
  const [paletteIndex, setPaletteIndex] = useState(getSavedPaletteIndex);

  useEffect(() => {
    const syncPalette = (event: StorageEvent) => {
      if (event.key === PALETTE_STORAGE_KEY || event.key === null) {
        setPaletteIndex(getSavedPaletteIndex());
      }
    };
    window.addEventListener('storage', syncPalette);
    return () => window.removeEventListener('storage', syncPalette);
  }, []);

  return PALETTES[paletteIndex];
};