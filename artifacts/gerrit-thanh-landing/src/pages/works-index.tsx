import { useEffect, useRef, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink, useBlogOrigin, withBlogOrigin } from '../components/blog-return-link';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { workAssetUrl } from '../lib/works';
import { works, workTitleParts } from '../lib/works-list';
import '../styles/editorial.css';
import '../styles/works-index.css';

const number = (index: number) => String(index + 1).padStart(4, '0');

/** A text-only index of the works. Hovering a title shows a small glimpse of the project. */
export const WorksIndex: FC = () => {
  const palette = useSavedPalette();
  const fromBlog = useBlogOrigin();
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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

  // The glimpse follows the pointer without re-rendering the page.
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const preview = previewRef.current;
      if (!preview) return;
      preview.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 14}px, 0)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
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
      {/* Soft, blurred field of colour behind the text, taken from the hovered project. */}
      <div className="wi-backdrop" aria-hidden="true">
        <div className="wi-ambient" />
        {works.map((work, index) => (
          <div key={work.cover.file} className="wi-backdrop-layer" data-show={active === index ? 'true' : undefined}
            style={{ '--wi-layer-accent': work.accent } as CSSProperties}>
            {work.preview && <img src={workAssetUrl(work.preview)} alt="" decoding="async" />}
          </div>
        ))}
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
          <span>No.</span>
          <span>Project</span>
          <span>Year</span>
          <span>Context</span>
          <span>Kind</span>
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

      <div ref={previewRef} className="wi-preview" aria-hidden="true">
        {works.map((work, index) => (
          <div key={work.cover.file} className="wi-preview-card" data-show={active === index ? 'true' : undefined}>
            {work.preview
              ? <img src={workAssetUrl(work.preview)} alt="" decoding="async" />
              : <span className="wi-preview-dot" style={{ '--dot': work.accent } as CSSProperties} />}
          </div>
        ))}
      </div>
    </main>
  );
};
