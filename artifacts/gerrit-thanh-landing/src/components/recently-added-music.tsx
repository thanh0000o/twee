import { useState, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMusicCollection, type MusicRecord } from '@workspace/api-client-react';
import { correctMusicRecord, musicCover } from '../lib/music-cover';

const COLLECTION_QUERY = {
  sort: 'added' as const,
  sort_order: 'desc' as const,
  per_page: 100,
};

const featuredRecordRules: Array<{ matches: (record: MusicRecord) => boolean }> = [
  {
    matches: record =>
      record.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === 'the future sound of jazz vol 3'
      && /\bcd\b/i.test(record.format),
  },
  {
    matches: record =>
      record.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === 'the future sound of jazz vol 4'
      && /\bcd\b/i.test(record.format),
  },
  {
    matches: record =>
      record.artist.toLowerCase() === 'brian eno'
      && record.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === 'ambient 1 music for airports'
      && /\b(?:vinyl|lp)\b/i.test(record.format),
  },
  {
    matches: record =>
      record.artist.toLowerCase() === 'maestro'
      && record.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === 'blue note trip goin down gettin up'
      && /\bcd\b/i.test(record.format)
      && record.labels.some(label => label.trim().toLowerCase() === 'blue note'),
  },
  {
    matches: record =>
      record.artist.toLowerCase() === 'maestro'
      && record.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === 'blue note trip sunset sunrise'
      && /\bcd\b/i.test(record.format)
      && record.labels.some(label => label.trim().toLowerCase() === 'blue note'),
  },
];

const Cover: FC<{ record: MusicRecord }> = ({ record }) => {
  const [failed, setFailed] = useState(false);
  const src = musicCover(record, import.meta.env.BASE_URL);
  if (!src || failed) return <span className="music-fallback">No cover</span>;
  return (
    <img
      src={src}
      alt={`${record.artist} — ${record.title}`}
      width="150"
      height="150"
      decoding="async"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

function selectFeaturedRecords(records: MusicRecord[]): MusicRecord[] {
  return featuredRecordRules
    .map(rule => records.find(rule.matches))
    .filter((record): record is MusicRecord => record !== undefined);
}

async function loadFeaturedRecords(signal: AbortSignal): Promise<MusicRecord[]> {
  const firstPage = await getMusicCollection(
    { ...COLLECTION_QUERY, page: 1 },
    { signal, cache: 'no-cache' },
  );
  const records = [...firstPage.records];
  let selected = selectFeaturedRecords(records);

  for (let page = 2; selected.length < featuredRecordRules.length && page <= firstPage.pages; page += 1) {
    const nextPage = await getMusicCollection(
      { ...COLLECTION_QUERY, page },
      { signal, cache: 'no-cache' },
    );
    if (nextPage.page !== page || nextPage.pages !== firstPage.pages || nextPage.total !== firstPage.total) {
      throw new Error('The collection changed while loading. Please try again.');
    }
    records.push(...nextPage.records);
    selected = selectFeaturedRecords(records);
  }

  if (selected.length !== featuredRecordRules.length) {
    throw new Error('The selected recent additions were not found in the collection.');
  }
  return selected.map(record => correctMusicRecord(record, import.meta.env.BASE_URL));
}

export const RecentlyAddedMusic = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/music/collection', 'recent-additions-highlights', featuredRecordRules.length],
    queryFn: ({ signal }) => loadFeaturedRecords(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    retry: 1,
  });

  if (isLoading && !data) {
    return <p className="blog-recent-music-status" aria-busy="true">Loading highlighted additions…</p>;
  }

  if (isError && !data) {
    return (
      <p className="blog-recent-music-status" role="alert">
        Recent additions are unavailable right now.{' '}
        <button type="button" className="blog-recent-music-retry" onClick={() => refetch()}>
          try again
        </button>
      </p>
    );
  }

  if (!data || data.length === 0) {
    return <p className="blog-recent-music-status">No recent additions yet.</p>;
  }

  return (
    <>
      {isError && (
        <p className="blog-recent-music-status" role="status">
          Discogs could not refresh; showing the last loaded records.
        </p>
      )}
      <ul className="music-grid blog-recent-music-list" aria-label="Five highlighted recent additions">
        {data.map((record) => (
          <li key={record.id} className="music-card blog-recent-music-record">
            <a
              href={record.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${record.artist} — ${record.title} on Discogs (opens in a new tab)`}
            >
              <div className="ed-stage">
                <Cover record={record} />
              </div>
              <div className="music-meta">
                <span>{record.artist}</span>
                <span className="music-title">{record.title}</span>
                <span className="music-sub">
                  {[record.year > 0 ? record.year : null, record.format].filter(Boolean).join(' · ')}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
