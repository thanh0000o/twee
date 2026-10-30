import { useEffect, useRef, useState, type FC, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'wouter';
import { withBlogOrigin } from '../components/blog-return-link';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { getPaletteLinkColor } from '../palette';
import { BlogFavourites } from '../components/blog-favourites';
import { RecentlyAddedMusic } from '../components/recently-added-music';
import { GuestbookChat } from '../components/guestbook-chat';
import { sortedPosts, type BlogPost, type PostBlock, type PostParagraph } from '../content/blog-posts';
import '../styles/editorial.css';
import '../styles/music.css';
import '../styles/blog-links.css';

const DESCRIPTION = 'Favourite websites, site updates, and notes about this corner of the internet by Thành Lambeets.';

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previous = meta?.content;
    document.title = title;
    if (meta) meta.content = description;
    return () => {
      document.title = previousTitle;
      if (meta && previous) meta.content = previous;
    };
  }, [title, description]);
}

const Shell: FC<{ children: ReactNode; left: ReactNode; title: string }> = ({ children, left, title }) => {
  const palette = useSavedPalette();
  return (
    <main className="ed blog-links-page" data-palette={palette.name} style={{
      '--blog-link-color': getPaletteLinkColor(palette.name),
      '--blog-link-filter': palette.filter,
      '--music-filter': palette.filter,
    } as CSSProperties}>
      <header className="subpage-header ed-top">
        <nav className="blog-top-links" aria-label="Blog navigation" style={{ ['--f' as string]: palette.filter }}>{left}</nav>
        <h1>{`{${title}}`}</h1>
      </header>
      {children}
    </main>
  );
};

const NavLink: FC<{ href: string; testid: string; children: string }> = ({ href, testid, children }) => {
  const palette = useSavedPalette();
  return (
    <Link href={href} className="subpage-return about-return blog-links-return" style={{ filter: palette.filter }} data-testid={testid}>
      {`{${children}}`}
    </Link>
  );
};

const Paragraph: FC<{ p: PostParagraph }> = ({ p }) => (
  <p>
    {p.map((s, i) => {
      if (typeof s === 'string') return s;
      if (s.kind === 'emphasis') return <em key={i}>{s.text}</em>;
      if (s.kind === 'external') {
        return <a key={i} href={s.href} className="home-nav-link home-nav-link-blog-links" target="_blank" rel="noopener noreferrer">{s.text}</a>;
      }
      if (s.href.startsWith('#')) {
        const scrollToTarget = (event: MouseEvent<HTMLAnchorElement>) => {
          const target = document.getElementById(s.href.slice(1));
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', s.href);
        };
        return <a key={i} href={s.href} onClick={scrollToTarget} className={`home-nav-link home-nav-link-${s.kind}`}>{s.text}</a>;
      }
      return <Link key={i} href={s.href} className={`home-nav-link home-nav-link-${s.kind}`}>{s.text}</Link>;
    })}
  </p>
);

type Lang = 'en' | 'nl';
const LANG_KEY = 'blog-opinion-lang';

const readLang = (): Lang => {
  try {
    return window.localStorage.getItem(LANG_KEY) === 'nl' ? 'nl' : 'en';
  } catch {
    return 'en';
  }
};

const LangToggle: FC<{ lang: Lang; onChange: (lang: Lang) => void }> = ({ lang, onChange }) => (
  <div className="blog-lang-toggle" role="group" aria-label="Language of the opinion pieces">
    {(['en', 'nl'] as const).map((code) => (
      <button
        key={code}
        type="button"
        className="blog-lang-option"
        aria-pressed={lang === code}
        onClick={() => onChange(code)}
        data-testid={`blog-lang-${code}`}
      >
        {code === 'en' ? 'english' : 'nederlands'}
      </button>
    ))}
  </div>
);

const Meta: FC<{ post: BlogPost; dateLabel?: string; nl?: boolean }> = ({ post, dateLabel, nl }) => (
  <p className="blog-post-meta">
    <time dateTime={post.dateTime}>{dateLabel ?? post.dateLabel}</time> — {nl ? 'door' : 'by'} {post.author}
  </p>
);

const BlogScrollPanel: FC<{
  id: string;
  label: string;
  testid: string;
  className?: string;
  children: ReactNode;
}> = ({ id, label, testid, className = '', children }) => {
  const streamRef = useRef<HTMLDivElement>(null);

  const scrollByStep = (direction: -1 | 1) => {
    const stream = streamRef.current;
    if (!stream) return;
    const step = Math.max(40, Math.min(72, Math.round(stream.clientHeight * 0.08)));
    stream.scrollTop += step * direction;
  };

  return (
    <div className={`blog-scroll-panel ${className}`.trim()}>
      <div
        id={id}
        ref={streamRef}
        className="blog-post-stream"
        tabIndex={0}
        aria-label={label}
        data-testid={testid}
      >
        {children}
      </div>
      <div className="blog-scroll-controls" role="group" aria-label={`${label} scroll controls`}>
        <button type="button" className="blog-scroll-button" aria-label={`Scroll ${label} up`} aria-controls={id} onClick={() => scrollByStep(-1)}>
          <svg aria-hidden="true" width="8" height="5" viewBox="0 0 8 5">
            <path d="M0 5 4 0 8 5Z" fill="currentColor" />
          </svg>
        </button>
        <button type="button" className="blog-scroll-button" aria-label={`Scroll ${label} down`} aria-controls={id} onClick={() => scrollByStep(1)}>
          <svg aria-hidden="true" width="8" height="5" viewBox="0 0 8 5">
            <path d="M0 0 8 0 4 5Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BlogPosts: FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const siteUpdates = posts.filter((post) => post.category === 'site-update');
  const opinions = posts.filter((post) => post.category === 'opinion');

  const [lang, setLang] = useState<Lang>(readLang);
  const changeLang = (next: Lang) => {
    setLang(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // The choice still holds for this visit.
    }
  };

  const renderPosts = (group: BlogPost[], language: Lang = 'en') => group.map((post) => {
    const translated = language === 'nl' ? post.nl : undefined;
    const title = translated?.title ?? post.title;
    const body = translated?.body ?? post.body;
    const sources = translated?.sources ?? post.sources;
    return (
      <article key={post.slug} className="blog-post" aria-labelledby={`title-${post.slug}`} data-testid={`blog-post-${post.slug}`} lang={translated ? 'nl' : 'en'}>
        <header>
          <h2 id={`title-${post.slug}`}>{`{${title}}`}</h2>
          <Meta post={post} dateLabel={translated?.dateLabel} nl={Boolean(translated)} />
        </header>
        {language === 'nl' && !translated && (
          <p className="blog-post-lang-note">Dit stuk is (nog) alleen in het Engels.</p>
        )}
        {body.map((block: PostBlock, i) => (
          Array.isArray(block)
            ? <Paragraph key={i} p={block} />
            : <h3 key={i} className="blog-post-subheading">{block.heading}</h3>
        ))}
        {sources && sources.length > 0 && (
          <ul className="blog-post-sources" aria-label={translated ? 'Bronnen' : 'Sources'}>
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer">{source.text}</a>
              </li>
            ))}
          </ul>
        )}
      </article>
    );
  });

  return (
    <section className="blog-posts" aria-label="Blog posts" data-testid="blog-posts">
      <section className="blog-column blog-updates-column" aria-label="Site updates">
        <section className="blog-post-group" aria-labelledby="site-updates-heading">
          <h2 id="site-updates-heading">{'{site updates}'}</h2>
          <BlogScrollPanel id="blog-site-updates-stream" label="site updates" testid="blog-site-updates">
            {renderPosts(siteUpdates)}
          </BlogScrollPanel>
        </section>
        <section id="guestbook" className="blog-extra-group blog-guestbook-group" aria-labelledby="blog-guestbook-heading" data-testid="blog-guestbook">
          <h2 id="blog-guestbook-heading">{'{guestbook}'}</h2>
          <div className="gb-page gb-embedded">
            <GuestbookChat />
          </div>
        </section>
      </section>
      <section className="blog-column blog-opinion-column" aria-label="Opinion pieces, favourite links, and recently added music">
        <section className="blog-post-group" aria-labelledby="opinion-pieces-heading">
          <div className="blog-extra-heading-row blog-opinion-heading-row">
            <h2 id="opinion-pieces-heading">{'{opinion pieces}'}</h2>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
          <BlogScrollPanel id="blog-opinion-stream" label="opinion pieces" testid="blog-opinion-pieces">
            {renderPosts(opinions, lang)}
          </BlogScrollPanel>
        </section>
        <div className="blog-bottom-extras" aria-label="More from the blog">
          <section className="blog-extra-group" aria-labelledby="blog-favourite-links-heading">
            <h2 id="blog-favourite-links-heading">{'{favourite links}'}</h2>
            <BlogScrollPanel id="blog-favourite-links-stream" label="favourite website links" testid="blog-favourite-links" className="blog-extra-stream">
              <BlogFavourites />
            </BlogScrollPanel>
          </section>
          <section className="blog-extra-group" aria-labelledby="blog-recent-music-heading">
            <div className="blog-extra-heading-row">
              <h2 id="blog-recent-music-heading">{'{recently added music}'}</h2>
              <Link href={withBlogOrigin('/music', true)} className="music-link" data-testid="link-blog-full-music" aria-label="Open the full music page">
                music page
              </Link>
            </div>
            <BlogScrollPanel id="blog-recent-music-stream" label="recently added music" testid="blog-recent-music" className="blog-extra-stream blog-recent-music-stream">
              <RecentlyAddedMusic />
            </BlogScrollPanel>
          </section>
        </div>
      </section>
    </section>
  );
};

export const BlogLinks: FC = () => {
  const posts = sortedPosts();
  usePageMeta('blog+links — Thành Lambeets', DESCRIPTION);

  useEffect(() => {
    if (window.location.hash !== '#guestbook') return;
    const frame = requestAnimationFrame(() => {
      document.getElementById('guestbook')?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Shell title="blog+links" left={<NavLink href="/" testid="link-return-home">return home</NavLink>}>
      <div className="blog-links-intro-row">
        <article className="ed-col" aria-label="Welcome" data-testid="blog-links-welcome">
          <p>
            Welcome to blog+links — a little space for favourite websites, site updates,
            and notes about this corner of the internet.
          </p>
        </article>
      </div>
      <BlogPosts posts={posts} />
    </Shell>
  );
};
