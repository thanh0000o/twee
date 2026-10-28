import { useEffect, useRef, type FC, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'wouter';
import { withBlogOrigin } from '../components/blog-return-link';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { getPaletteLinkColor } from '../palette';
import { BlogFavourites } from '../components/blog-favourites';
import { RecentlyAddedMusic } from '../components/recently-added-music';
import { sortedPosts, type BlogPost, type PostParagraph } from '../content/blog-posts';
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
      return <Link key={i} href={s.href} className={`home-nav-link home-nav-link-${s.kind}`}>{s.text}</Link>;
    })}
  </p>
);

const Meta: FC<{ post: BlogPost }> = ({ post }) => (
  <p className="blog-post-meta">
    <time dateTime={post.dateTime}>{post.dateLabel}</time> — by {post.author}
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

  const renderPosts = (group: BlogPost[]) => group.map((post) => (
    <article key={post.slug} className="blog-post" aria-labelledby={`title-${post.slug}`} data-testid={`blog-post-${post.slug}`}>
      <header>
        <h2 id={`title-${post.slug}`}>{`{${post.title}}`}</h2>
        <Meta post={post} />
      </header>
      {post.body.map((para, i) => <Paragraph key={i} p={para} />)}
    </article>
  ));

  return (
    <section className="blog-posts" aria-label="Blog posts" data-testid="blog-posts">
      <section className="blog-column blog-updates-column" aria-label="Site updates">
        <section className="blog-post-group" aria-labelledby="site-updates-heading">
          <h2 id="site-updates-heading">{'{site updates}'}</h2>
          <BlogScrollPanel id="blog-site-updates-stream" label="site updates" testid="blog-site-updates">
            {renderPosts(siteUpdates)}
          </BlogScrollPanel>
        </section>
      </section>
      <section className="blog-column blog-opinion-column" aria-label="Opinion pieces, favourite links, and recently added music">
        <section className="blog-post-group" aria-labelledby="opinion-pieces-heading">
          <h2 id="opinion-pieces-heading">{'{opinion pieces}'}</h2>
          <BlogScrollPanel id="blog-opinion-stream" label="opinion pieces" testid="blog-opinion-pieces">
            {renderPosts(opinions)}
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
