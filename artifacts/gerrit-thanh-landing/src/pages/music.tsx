import { useEffect, useMemo, useState, type FC, type CSSProperties } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getMusicCollection } from '@workspace/api-client-react';
import { BlogReturnLink } from '../components/blog-return-link';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { orderMusicCollection } from '../lib/music-groups';
import { loadCompleteMusicCollection } from '../lib/load-music-collection';
import { correctMusicRecord, musicCover } from '../lib/music-cover';
import '../styles/editorial.css';
import '../styles/music.css';

const DEFAULT_COLLECTION = 'https://www.discogs.com/user/Thanh66/collection';

const Cover: FC<{ src: string; alt: string; eager: boolean }> = ({ src, alt, eager }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <span className="music-fallback">No cover</span>;
  return <img src={src} alt={alt} width="150" height="150" decoding="async"
    loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'}
    onError={() => setFailed(true)} />;
};

export const Music: FC = () => {
  const palette = useSavedPalette();
  const query = useQuery({
    queryKey: ['/api/music/collection', 'complete-sharp-covers'],
    queryFn: ({ signal }) => loadCompleteMusicCollection(
      page => getMusicCollection({ page }, { signal, cache: 'no-cache' }),
    ),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    retry: 1,
  });
  const { data, isLoading, isError, refetch } = query;
  const orderedRecords = useMemo(
    () => orderMusicCollection((data?.records ?? []).map(
      record => correctMusicRecord(record, import.meta.env.BASE_URL),
    )),
    [data?.records],
  );

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'music — Thành Lambeets';
    if (description) description.content = 'The music corner of Thành Lambeets’ personal website.';
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  const collectionUrl = data?.collectionUrl || DEFAULT_COLLECTION;

  return (
    <main className="ed" data-palette={palette.name} style={{ '--music-filter': palette.filter } as CSSProperties}>
      <header className="subpage-header ed-top">
        <nav className="subpage-return-links" aria-label="Return navigation">
          <Link href="/" className="subpage-return about-return music-return" style={{ filter: palette.filter }}>
            {`{return home}`}
          </Link>
          <BlogReturnLink />
        </nav>
        <h1>{`{music}`}</h1>
      </header>
      <section className="music-intro" aria-label="About this collection">
        <p>
          My record collection, as catalogued on{' '}
          <a className="music-link" href={collectionUrl} target="_blank" rel="noopener noreferrer" data-testid="link-discogs-collection">Discogs</a>
          {data ? <> — {data.total} {data.total === 1 ? 'release' : 'releases'}.</> : '.'}
        </p>
        <p>
          Collecting music is a passion that started at home. My parents opened my ears to all
          kinds of music, especially my dad. Through my teens and into my twenties, I kept
          exploring SoundCloud and YouTube, looking for new sounds and niche discoveries.
        </p>
      </section>

      {isLoading && (
        <ul className="music-grid" aria-busy="true" aria-label="Loading collection">
          {Array.from({ length: 12 }, (_, i) => <li key={i} className="music-skel" />)}
        </ul>
      )}

      {isError && !data && (
        <div className="music-status" role="alert" data-testid="status-music-error">
          <p>The collection could not be loaded right now.</p>
          <button type="button" className="music-link" onClick={() => refetch()} data-testid="button-music-retry">try again</button>
        </div>
      )}

      {isError && data && (
        <div className="music-status" role="alert">
          <p>Showing the last loaded collection. Discogs could not be refreshed.</p>
          <button type="button" className="music-link" onClick={() => refetch()}>try again</button>
        </div>
      )}

      {data && data.records.length === 0 && (
        <div className="music-status" data-testid="status-music-empty">
          <p>There are no records to show yet.</p>
        </div>
      )}

      {data && data.records.length > 0 && (
          <ul className="music-grid">
            {orderedRecords.map((r, index) => (
              <li key={r.id} className="music-card" data-testid={`card-record-${r.id}`}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.artist} — ${r.title} on Discogs (opens in a new tab)`}>
                  <div className="ed-stage"><Cover src={musicCover(r, import.meta.env.BASE_URL)} alt={`${r.artist} — ${r.title}`} eager={index < 7} /></div>
                  <div className="music-meta">
                    <span>{r.artist}</span>
                    <span className="music-title">{r.title}</span>
                    <span className="music-sub">{[r.year > 0 ? r.year : null, r.format].filter(Boolean).join(' · ')}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
      )}

      <p className="music-status">
        Data from <a className="music-link" href={collectionUrl} target="_blank" rel="noopener noreferrer">Discogs</a>.
        {' '}This site is not affiliated with Discogs.
      </p>
    </main>
  );
};
