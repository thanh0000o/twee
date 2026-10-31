import { useEffect, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink, useBlogOrigin, withBlogOrigin } from '../components/blog-return-link';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { works, workTitleParts } from '../lib/works-list';
import '../styles/editorial.css';
import '../styles/works-index.css';

const number = (index: number) => String(index + 1).padStart(4, '0');

/** A text-only index of the works. */
export const WorksIndex: FC = () => {
  const palette = useSavedPalette();
  const fromBlog = useBlogOrigin();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'works — Thành Lambeets';
    if (description) description.content = 'Selected works by Thành Lambeets.';
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  const activeWork = active === null ? null : works[active];
  const hoverProps = (index: number) => ({
    onPointerEnter: () => setActive(index),
    onPointerLeave: () => setActive((current) => (current === index ? null : current)),
    onFocus: () => setActive(index),
    onBlur: () => setActive((current) => (current === index ? null : current)),
  });

  // A plain render helper (not a component), so links keep focus while hovering.
  const workLink = (index: number, children: ReactNode, className = '') => (
    <Link
      href={withBlogOrigin(works[index].href ?? '/works', fromBlog)}
      className={`wi-link ${className}`.trim()}
      data-active={active === index ? 'true' : undefined}
      {...hoverProps(index)}
    >
      {children}
    </Link>
  );

  return (
    <main
      className="ed works-text-index"
      data-palette={palette.name}
      data-hovering={active !== null ? 'true' : undefined}
      style={{ '--wi-accent': activeWork?.accent ?? '#c9c9c4' } as CSSProperties}
    >
      {/* A faint, still haze of colour behind the text. */}
      <div className="wi-backdrop" aria-hidden="true">
        <div className="wi-ambient" />
      </div>

      <header className="subpage-header ed-top">
        <nav className="subpage-return-links" aria-label="Return navigation">
          <Link href="/" className="subpage-return" style={{ filter: palette.filter }} data-testid="link-return-home">
            {'{return home}'}
          </Link>
          <BlogReturnLink />
        </nav>
        <h1>{'{works}'}</h1>
      </header>

      <section className="wi-intro" aria-label="About this index">
        <p>Selected work by Thành Lambeets</p>
      </section>

      <section className="wi-table" aria-labelledby="wi-table-title">
        <h2 id="wi-table-title" className="visually-hidden">Projects</h2>
        <div className="wi-row wi-head" aria-hidden="true">
          <span>{'{no.}'}</span>
          <span>{'{project}'}</span>
          <span>{'{year}'}</span>
          <span>{'{context}'}</span>
          <span>{'{kind}'}</span>
        </div>
        <ol className="wi-rows">
          {works.map((work, index) => {
            const { name } = workTitleParts(work.title);
            return (
              <li key={work.cover.file}>
                {workLink(index, <>
                  <span className="wi-number">{number(index)}</span>
                  <span className="wi-name">
                    <span className="wi-sphere" style={{ '--dot': work.accent } as CSSProperties} aria-hidden="true" />
                    <span className="wi-title">{name}</span>
                  </span>
                  <span className="wi-year">{work.year ?? '–'}</span>
                  <span className="wi-context">{work.context}</span>
                  <span className="wi-kind">{work.kind}</span>
                </>, 'wi-row')}
              </li>
            );
          })}
        </ol>
      </section>

    </main>
  );
};
