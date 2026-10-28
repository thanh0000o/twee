import type { MusicRecord } from '@workspace/api-client-react';

export type MusicGroup = {
  name: string;
  kind: 'series' | 'artist' | 'catalogue';
  records: MusicRecord[];
};

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

// Title families in this collection, not guesses based on label or genre.
const seriesRules: { name: string; pattern: RegExp }[] = [
  { name: 'Dance Opera Trips', pattern: /^(?:The\s+)?Dance Opera\s+Trip\b/i },
  { name: 'DJ-Kicks', pattern: /^DJ[\s\u2010-\u2014-]*Kicks\b/i },
  { name: 'Earth', pattern: /^Earth\s+(?:Volume|Vol\.?)\s/i },
  { name: 'Freezone', pattern: /^Free\s*zone\b/i },
  { name: 'Jungle Jazz', pattern: /^Jungle Jazz\b/i },
  { name: 'LateNightTales', pattern: /^Late\s*Night\s*Tales\b/i },
  { name: 'Logical Progression', pattern: /^Logical Progression\b/i },
  { name: 'Looking Back', pattern: /^Looking Back\s+\d/i },
  { name: 'Park Sessions', pattern: /^Park Sessions\s+\d/i },
  { name: 'Points in Time', pattern: /^Points In Time\s+\d/i },
  { name: 'Producer', pattern: /^Producer\s+\d/i },
  { name: 'Progression Sessions', pattern: /^Progression Sessions\b/i },
  { name: 'Promised Land', pattern: /^Promised Land(?:\s*\(|\s+Volume)/i },
  { name: 'New Beat Takes', pattern: /^New Beat\s*[-:]?\s*Take\b/i },
  { name: 'Serious Beats', pattern: /^Serious Beats\b/i },
  { name: 'Room with a View', pattern: /^Room With A View(?:\s+Too)?$/i },
  { name: 'The Best of Lounge', pattern: /^The Best Of Lounge\s*:/i },
];

function artistName(artist: string): string {
  const base = artist.split(/\s+(?:feat\.?|featuring)\s+/i)[0].trim();
  const key = base.toLowerCase().replace(/[^a-z0-9]/g, '');
  // Discogs release credits sometimes spell the same artist differently.
  const aliases: Record<string, string> = {
    ltjbukem: 'LTJ Bukem',
    kruderdorfmeister: 'Kruder & Dorfmeister',
    djkrust: 'Krust',
    krust: 'Krust',
    thieverycorporation: 'Thievery Corporation',
    svenvanhees: 'Sven Van Hees',
  };
  return aliases[key] || base || 'Various';
}

function groupingArtist(record: MusicRecord): string {
  // This Sven Van Hees selection is credited to Various on Discogs.
  // Use its curator for placement without rewriting the release's credits.
  if (/^Blue Note['’]s Sidetracks Vol\.?\s*3\s*[-–—]\s*Into Blue$/i.test(record.title)) {
    return 'Sven Van Hees';
  }
  return artistName(record.artist);
}

function volume(title: string): number | undefined {
  if (/^(?:The\s+)?Dance Opera Trip$/i.test(title)) return 1;
  if (/^Room With A View$/i.test(title)) return 1;
  if (/^Room With A View Too$/i.test(title)) return 2;
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 };
  const word = title.match(/\bVolume\s+(One|Two|Three|Four|Five|Six|Seven)\b/i)?.[1]
    ?? title.match(/^Free\s*zone\s*\(?\s*(One|Two|Three|Four|Five|Six|Seven)\b/i)?.[1];
  if (word) return words[word.toLowerCase()];
  const numbered = title.match(/\b(?:Level|Volume|Vol\.?|Sessions|Producer|Back|Time|Trip|Take|Beats)\s*(\d+)\b/i)
    ?? title.match(/^(?:Free\s*zone|Jungle Jazz)\s*[:.]?\s*(\d+)\b/i);
  if (numbered) return Number(numbered[1]);
  if (/^(?:Logical Progression|Progression Sessions)$/i.test(title)) return 1;
  return undefined;
}

function byArtist(a: MusicRecord, b: MusicRecord): number {
  return collator.compare(artistName(a.artist), artistName(b.artist))
    || ((a.year || Infinity) - (b.year || Infinity))
    || collator.compare(a.title, b.title)
    || a.id - b.id;
}

export function groupMusicCollection(records: MusicRecord[]): MusicGroup[] {
  return groupRecords(records, true);
}

function groupRecords(records: MusicRecord[], includeCatalogue: boolean): MusicGroup[] {
  const groups = new Map<string, MusicGroup>();
  for (const record of records) {
    const catalogue = includeCatalogue && [
      { name: 'Antler-Subway', labels: ['antlersubway'] },
      { name: 'Dance Opera', labels: ['danceopera'] },
      { name: 'Round And Round', labels: ['roundandround'] },
      { name: 'Subway', labels: ['subway', 'subwaydance'] },
    ].find(rule => record.labels.some(label =>
      rule.labels.includes(label.replace(/\s+\(\d+\)$/, '').toLowerCase().replace(/[^a-z0-9]/g, '')),
    ));
    const series = seriesRules.find(rule => rule.pattern.test(record.title));
    const kind = catalogue ? 'catalogue' : series ? 'series' : 'artist';
    const name = catalogue ? catalogue.name : series?.name ?? groupingArtist(record);
    // Unrelated "Various" compilations are not one artist: moving dance
    // compilations down must not also move anonymous jazz/ambient releases.
    const scene = kind === 'artist' && name === 'Various'
      ? (musicOrderBucket(record) === 3 ? ':dance' : ':other') : '';
    const key = `${kind}:${name.toLowerCase()}${scene}`;
    const group = groups.get(key) ?? { name, kind, records: [] };
    group.records.push(record);
    groups.set(key, group);
  }
  return [...groups.values()]
    .sort((a, b) => ({ series: 0, catalogue: 1, artist: 2 }[a.kind]
      - { series: 0, catalogue: 1, artist: 2 }[b.kind])
      || collator.compare(a.name, b.name))
    .map(group => ({
      ...group,
      records: group.kind === 'catalogue'
        ? groupRecords(group.records, false).flatMap(inner => inner.records)
        : group.records.sort((a, b) => {
        const aVolume = volume(a.title);
        const bVolume = volume(b.title);
        const volumeOrder = group.kind === 'series'
          ? (aVolume ?? Infinity) - (bVolume ?? Infinity) : 0;
        return (Number.isNaN(volumeOrder) ? 0 : volumeOrder) || byArtist(a, b);
      }),
    }));
}

export function musicOrderBucket(record: MusicRecord): number {
  const goodLooking = record.labels.some(label => {
    const name = label.replace(/\s+\(\d+\)$/, '').trim().toLowerCase();
    return /^(?:good looking|looking good)\b/.test(name)
      || ['earth', 'earth records', "cookin' records", 'cookin records',
        '720 degrees', 'ascendant grooves', 'deep rooted records', 'nexus records'].includes(name);
  });
  if (goodLooking) return 0;
  const drumAndBassOrJungle = record.styles.some(style =>
    ['drumnbass', 'drumandbass', 'drumbass', 'jungle', 'jumpup']
      .includes(style.toLowerCase().replace(/[^a-z]/g, '')),
  );
  if (drumAndBassOrJungle) return 1;
  const dance = record.styles.some(style =>
    ['acid', 'acidhouse', 'acidtechno', 'techno', 'detroittechno', 'minimaltechno',
      'hardtechno', 'techhouse', 'trance', 'hardtrance', 'progressivetrance',
      'goatrance', 'psytrance', 'newbeat', 'rave', 'hardcore', 'eurohouse']
      .includes(style.toLowerCase().replace(/[^a-z]/g, '')),
  );
  return dance ? 3 : 2;
}

// Owner-selected neighbours, including garage/breakbeat releases whose tags
// alone would place them outside the early jungle block.
const earlyBreakbeatArtists = new Set([
  'lennie de ice', 'main phase', 'mantra', 'mystic moods',
  'omni trio', 'orca', 'wax doctor',
]);

function groupPriority(group: MusicGroup): number {
  if (group.kind === 'series' && group.name === 'Promised Land') return -1;
  if (group.kind === 'catalogue') return 3;
  if (group.kind === 'artist' && group.name.toLowerCase() === 'happy tunes') return 0.5;
  if (group.kind === 'artist' && earlyBreakbeatArtists.has(group.name.toLowerCase())) return 0.75;
  if (group.kind === 'artist' && group.name.toLowerCase() === 'moby') return 2;
  const buckets = group.records.map(musicOrderBucket);
  const first = Math.min(...buckets);
  // Preserve whole Good Looking / jungle series near the top; otherwise a
  // dance group belongs at the end, even when some of its albums are mixed.
  return first < 2 ? first : buckets.includes(3) ? 3 : 2;
}

function loungeClusterRank(record: MusicRecord): number | undefined {
  if (/^Den Of Thieves\b/i.test(record.title)) return 0;
  const artist = artistName(record.artist).toLowerCase();
  if (artist === 'thievery corporation') return 1;
  if (artist === 'morcheeba') return 2;
  if (/^(?:The\s+)?K\s*&\s*D\s+Sessions\b/i.test(record.title)) return 3;
  if (/^Blue Note Trip\b/i.test(record.title)) return 4;
  if (artist === 'miles davis') return 5;
  return undefined;
}

function placeLoungeCluster(records: MusicRecord[]): MusicRecord[] {
  const cluster = records.filter(record => loungeClusterRank(record) !== undefined);
  if (!cluster.length) return records;
  // The owner's explicit artist/album placement overrides DJ-Kicks grouping
  // for Thievery Corporation's entry, but leaves the other DJ-Kicks together.
  const anchor = records.findIndex(record => loungeClusterRank(record) === 0);
  const anchorIndex = anchor >= 0 ? anchor : records.findIndex(record => loungeClusterRank(record) !== undefined);
  const insertion = records.slice(0, anchorIndex).filter(record => loungeClusterRank(record) === undefined).length;
  const rest = records.filter(record => loungeClusterRank(record) === undefined);
  cluster.sort((a, b) => loungeClusterRank(a)! - loungeClusterRank(b)! || byArtist(a, b));
  return [...rest.slice(0, insertion), ...cluster, ...rest.slice(insertion)];
}

function placeHappyTunes(records: MusicRecord[]): MusicRecord[] {
  const isHappyTunes = (record: MusicRecord) => artistName(record.artist).toLowerCase() === 'happy tunes';
  const happyTunes = records.filter(isHappyTunes);
  if (!happyTunes.length) return records;
  const rest = records.filter(record => !isHappyTunes(record));
  const anchor = rest.findLastIndex(record =>
    musicOrderBucket(record) === 0 || artistName(record.artist) === 'LTJ Bukem',
  );
  if (anchor < 0) return records;
  return [...rest.slice(0, anchor + 1), ...happyTunes, ...rest.slice(anchor + 1)];
}

function placeSvenVanHees(records: MusicRecord[]): MusicRecord[] {
  const isSven = (record: MusicRecord) => groupingArtist(record) === 'Sven Van Hees';
  const albums = records.filter(isSven);
  if (!albums.length) return records;
  const rest = records.filter(record => !isSven(record));
  // Into Blue originally occupied the slot directly before Den of Thieves.
  const anchor = rest.findIndex(record => /^Den Of Thieves\b/i.test(record.title));
  if (anchor < 0) return records;
  return [...rest.slice(0, anchor), ...albums, ...rest.slice(anchor)];
}

function placeAmbientOne(records: MusicRecord[]): MusicRecord[] {
  const isAmbientOne = (record: MusicRecord) =>
    artistName(record.artist).toLowerCase() === 'brian eno'
    && /^Ambient\s+1\b/i.test(record.title.trim());
  const albums = records.filter(isAmbientOne);
  if (!albums.length) return records;
  const rest = records.filter(record => !isAmbientOne(record));
  // Keep Happy Tunes beside Good Looking / LTJ, then the owner's new Eno LP.
  const anchor = rest.findLastIndex(record =>
    musicOrderBucket(record) === 0
    || artistName(record.artist) === 'LTJ Bukem'
    || artistName(record.artist).toLowerCase() === 'happy tunes',
  );
  if (anchor < 0) return records;
  return [...rest.slice(0, anchor + 1), ...albums, ...rest.slice(anchor + 1)];
}

export function orderMusicCollection(records: MusicRecord[]): MusicRecord[] {
  // Group before applying catalogue/genre priority. Mixed-style series such
  // as DJ-Kicks and Freezone must not be split across genre buckets.
  const ordered = groupMusicCollection(records)
    .map(group => ({
      group,
      priority: groupPriority(group),
    }))
    .sort((a, b) => a.priority - b.priority)
    .flatMap(({ group }) => group.records);
  const curated = placeAmbientOne(placeSvenVanHees(placeHappyTunes(placeLoungeCluster(ordered))));
  // Owner-selected placement, not a change to this album's Jazz metadata.
  const soundsOf94 = (record: MusicRecord) => /^Sounds Of\s+['’]?94$/i.test(record.title.trim());
  return [...curated.filter(record => !soundsOf94(record)), ...curated.filter(soundsOf94)];
}
