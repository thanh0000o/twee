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

/** Owner-confirmed correction for this collection copy, not every Volume 2. */
export function correctMusicRecord(record: MusicRecord, basePath: string): MusicRecord {
  if (record.id !== 2194317222 || record.url !== 'https://www.discogs.com/release/30210') {
    return record;
  }
  return {
    ...record,
    title: 'The Future Sound Of Jazz - Vol. 3',
    image: `${basePath}music/future-sound-of-jazz-vol-3.webp`,
  };
}
