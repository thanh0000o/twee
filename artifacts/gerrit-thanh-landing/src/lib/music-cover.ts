import type { MusicRecord } from '@workspace/api-client-react';

// Owner-supplied artwork is matched to the exact pressing, not its title.
const ownerCovers: Record<string, string> = {
  'https://www.discogs.com/release/1847578': 'salute-the-kings-victory.webp',
};

export function musicCover(
  record: Pick<MusicRecord, 'url' | 'image'>,
  basePath: string,
): string {
  const local = ownerCovers[record.url];
  return local ? `${basePath}music/${local}` : record.image;
}

// Discogs has no year for these copies. Looked up elsewhere: the release year of
// this edition where it could be found, otherwise the year of the original album.
const missingYears: Record<string, number> = {
  'https://www.discogs.com/release/371244': 1995, // Billie Holiday - Loveless Love (GFS 017)
  'https://www.discogs.com/release/4467704': 1990, // Black Uhuru - Reggae Rock, single from Now
  'https://www.discogs.com/release/14169973': 1995, // Reno - Graffiti On The Moon (Deepoint)
  'https://www.discogs.com/release/30555439': 1959, // Miles Davis - Porgy And Bess, original album
  'https://www.discogs.com/release/1451897': 1964, // Getz / Gilberto, original album
};

const withYear = (record: MusicRecord): MusicRecord => {
  if (record.year > 0) return record;
  const year = missingYears[record.url]
    ?? (/^virgin prunes$/i.test(record.artist) && /faculties of a broken heart/i.test(record.title) ? 1982 : undefined);
  return year ? { ...record, year } : record;
};

/** Owner-confirmed correction for this collection copy, not every Volume 2. */
export function correctMusicRecord(input: MusicRecord, basePath: string): MusicRecord {
  const record = withYear(input);
  if (record.id !== 2194317222 || record.url !== 'https://www.discogs.com/release/30210') {
    return record;
  }
  return {
    ...record,
    title: 'The Future Sound Of Jazz - Vol. 3',
    image: `${basePath}music/future-sound-of-jazz-vol-3.webp`,
  };
}
