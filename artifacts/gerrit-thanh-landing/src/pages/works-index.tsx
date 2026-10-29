import { useEffect, useRef, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink, useBlogOrigin, withBlogOrigin } from '../components/blog-return-link';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { workAssetUrl } from '../lib/works';
import { works, workTitleParts, type Work } from '../lib/works-list';
import '../styles/editorial.css';
import '../styles/works-index.css';

const KINDS: Work['kind'][] = ['AI agents', 'Websites and interfaces', 'Research and strategy', 'Visual communication'];
const number = (index: number) => String(index + 1).padStart(2, '0');

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

      <div className="wi-cols">
        <section className="wi-col" aria-labelledby="wi-index">
          <h2 id="wi-index">Index</h2>
          <p>Selected work by Thành Lambeets, Brussels.</p>
          <p>Research and strategy, websites and interfaces, and a few small AI tools, made at school, during internships and on my own.</p>
          <p className="wi-mute">
            {works.length} projects. <span className="wi-hint-hover">Hover a title for a glimpse, click to open it.</span>
            <span className="wi-hint-touch">Tap a title to open it.</span>
          </p>
        </section>

        <section className="wi-col" aria-labelledby="wi-projects">
          <h2 id="wi-projects">Projects</h2>
          <ol className="wi-projects">
            {works.map((work, index) => {
              const { name } = workTitleParts(work.title);
              return (
                <li key={work.cover.file}>
                  {workLink(index, <>
                    <span className="wi-number">{number(index)}</span>
                    <span className="wi-name">
                      {name}
                      {work.year && <span className="wi-year"> ({work.year})</span>}
                    </span>
                  </>)}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="wi-col" aria-labelledby="wi-kinds">
          <h2 id="wi-kinds" className="visually-hidden">By kind</h2>
          {KINDS.map((kind) => {
            const group = works.map((work, index) => ({ work, index })).filter(({ work }) => work.kind === kind);
            return (
              <div className="wi-group" key={kind}>
                <h3>{kind}</h3>
                <p>
                  {group.map(({ work, index }, position) => (
                    <span key={work.cover.file}>
                      {workLink(index, workTitleParts(work.title).name)}
                      {position < group.length - 1 && <span className="wi-sep">, </span>}
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </section>

        <section className="wi-col" aria-labelledby="wi-context">
          <h2 id="wi-context">Context</h2>
          <ul className="wi-context">
            {works.map((work, index) => (
              <li key={work.cover.file}>
                {workLink(index, <>
                  <span className="wi-number">{number(index)}</span>
                  <span>{work.context}</span>
                </>, 'wi-context-link')}
              </li>
            ))}
          </ul>
        </section>
      </div>

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
