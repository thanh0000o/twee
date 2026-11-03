import type { MusicRecord } from '@workspace/api-client-react';

export type MusicView = 'mine' | 'recent' | 'artist' | 'year';

export const VIEWS: { id: MusicView; label: string }[] = [
  { id: 'mine', label: 'my order' },
  { id: 'recent', label: 'recently added' },
  { id: 'artist', label: 'artist a–z' },
  { id: 'year', label: 'oldest first' },
];

// Discogs styles grouped into a handful of genres a visitor can pick from.
const GENRES: { id: string; label: string; styles: string[] }[] = [
  { id: 'dnb', label: 'drum & bass / jungle', styles: ['drumnbass', 'drumandbass', 'jungle', 'jumpup', 'liquidfunk', 'atmosphericdrumnbass'] },
  { id: 'jazz', label: 'future jazz / nu jazz', styles: ['futurejazz', 'nujazz', 'acidjazz', 'jazzyhiphop', 'fusion', 'souljazz', 'contemporaryjazz', 'cooljazz', 'hardbop', 'bop', 'modal', 'jazzfunk', 'latinjazz'] },
  { id: 'downtempo', label: 'downtempo / trip hop', styles: ['downtempo', 'triphop', 'lounge', 'chillout', 'abstract'] },
  { id: 'ambient', label: 'ambient', styles: ['ambient', 'darkambient', 'newage', 'drone', 'experimental'] },
  { id: 'house', label: 'house / garage', styles: ['house', 'deephouse', 'garagehouse', 'ukgarage', 'speedgarage', 'twostep', 'chicagohouse', 'acidhouse', 'progressivehouse', 'techhouse', 'eurohouse', 'disco', 'nudisco'] },
  { id: 'techno', label: 'techno / trance', styles: ['techno', 'detroittechno', 'minimaltechno', 'hardtechno', 'acidtechno', 'trance', 'progressivetrance', 'goatrance', 'psytrance', 'hardtrance', 'newbeat', 'rave', 'hardcore'] },
  { id: 'breaks', label: 'breaks / big beat', styles: ['breakbeat', 'breaks', 'bigbeat', 'breakstep', 'electro', 'idm'] },
  { id: 'dub', label: 'dub / reggae', styles: ['dub', 'reggae', 'roots', 'dancehall', 'dubtechno'] },
  { id: 'hiphop', label: 'hip hop / soul', styles: ['hiphop', 'boombap', 'instrumental', 'soul', 'funk', 'rnbswing', 'neosoul'] },
];

const key = (style: string) => style.toLowerCase().replace(/[^a-z]/g, '');

export const genresOf = (record: MusicRecord) => {
  const styles = new Set(record.styles.map(key));
  return GENRES.filter((genre) => genre.styles.some((s) => styles.has(s))).map((genre) => genre.id);
};

/** Genres that actually occur in the collection, with how many records each has. */
export const availableGenres = (records: MusicRecord[]) =>
  GENRES.map((genre) => ({
    id: genre.id,
    label: genre.label,
    count: records.filter((record) => genresOf(record).includes(genre.id)).length,
  })).filter((genre) => genre.count > 0);

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const artistKey = (artist: string) => artist.replace(/^the\s+/i, '');

/** Applies a view and genre on top of the owner's own order (which stays the default). */
export const viewRecords = (ordered: MusicRecord[], view: MusicView, genre: string | null) => {
  const picked = genre ? ordered.filter((record) => genresOf(record).includes(genre)) : ordered;
  switch (view) {
    // Discogs gives each copy a rising id when it is added, so a higher id means added later.
    case 'recent': return [...picked].sort((a, b) => b.id - a.id);
    case 'artist': return [...picked].sort((a, b) => collator.compare(artistKey(a.artist), artistKey(b.artist)) || (a.year || 9999) - (b.year || 9999));
    case 'year': return [...picked].sort((a, b) => (a.year || 9999) - (b.year || 9999) || collator.compare(a.artist, b.artist));
    default: return picked;
  }
};
