import { useCallback, useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink, useBlogOrigin, withBlogOrigin } from '../components/blog-return-link';
import { workAssetUrl } from '../lib/works';
import { getRememberedWorkIndex, rememberWorkIndex, works } from '../lib/works-list';
import { getSavedPaletteFilter } from '../palette';
import { useLoopingWorkRail } from '../hooks/use-looping-work-rail';

const loopingWorks = [0, 1, 2].flatMap((cycle) => works.map((work, index) => ({ work, index, cycle })));

export const WorksCarousel: FC = () => {
  const fromBlog = useBlogOrigin();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [initialIndex] = useState(getRememberedWorkIndex);
  const rememberActive = useCallback((index: number) => {
    rememberWorkIndex(index);
  }, []);
  const { railRef, active, goTo } = useLoopingWorkRail({ count: works.length, initialIndex, onActiveChange: rememberActive });

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

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth + (parseFloat(getComputedStyle(document.body).paddingRight) || 0)}px`;
    }
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedIndex(null);
      } else if (event.key === 'Tab') {
        const buttons = Array.from(panelRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      openerRef.current?.focus();
    };
  }, [selectedIndex]);

  const openWork = (index: number, button: HTMLButtonElement) => {
    openerRef.current = button;
    setSelectedIndex(index);
  };

  const selectedWork = selectedIndex === null ? null : works[selectedIndex];

  return (
    <main className="about-page works-page works-index-page">
      <header className="subpage-header about-header">
        <nav className="subpage-return-links" aria-label="Return navigation">
          <Link href="/" className="subpage-return about-return works-return" style={{ filter: getSavedPaletteFilter() }} data-testid="link-return-home">
            {`{return home}`}
          </Link>
          <BlogReturnLink />
        </nav>
        <h1>{`{works}`}</h1>
      </header>

      <section className="works-gallery" aria-label="Selected works">
        <div
          className="works-rail"
          id="works-rail"
          ref={railRef}
          tabIndex={0}
          role="group"
          aria-label="Works gallery, use left and right arrow keys to browse"
          data-testid="rail-works"
          data-active={active}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); }
            else if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); }
          }}
        >
          {loopingWorks.map(({ work, index, cycle }) => (
            <figure className="works-cover" key={`${cycle}-${work.cover.file}`} data-active={cycle === 1 && active === index} aria-hidden={cycle !== 1 ? true : undefined}>
              <div className="works-cover-stage">
                <span className="works-cover-plate" aria-hidden="true" />
                {work.href ? (
                  <Link
                    href={withBlogOrigin(work.href, fromBlog)}
                    className="works-cover-button"
                    aria-label={`View ${work.title} project`}
                    tabIndex={cycle === 1 ? 0 : -1}
                    data-testid={cycle === 1 ? `link-open-work-${index + 1}` : undefined}
                    onClick={(event) => {
                      if (index !== active && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                        event.preventDefault();
                        goTo(index);
                      } else if (index === active) {
                        rememberWorkIndex(index);
                      }
                    }}
                    onFocus={() => goTo(index)}
                  >
                    <img src={workAssetUrl(work.cover.file)} alt={work.cover.alt} loading="eager" decoding="async" draggable={false} />
                  </Link>
                ) : (
                  <button
                    className="works-cover-button"
                    type="button"
                    tabIndex={cycle === 1 ? 0 : -1}
                    onClick={(event) => index === active ? openWork(index, event.currentTarget) : goTo(index)}
                    onFocus={() => goTo(index)}
                    aria-label={`View ${work.title} cover`}
                    data-testid={cycle === 1 ? `button-open-work-${index + 1}` : undefined}
                  >
                    <img src={workAssetUrl(work.cover.file)} alt={work.cover.alt} loading="eager" decoding="async" draggable={false} />
                  </button>
                )}
              </div>
            </figure>
          ))}
        </div>
        <div className="works-controls">
          <button
            type="button"
            className="works-arrow"
            style={{ filter: getSavedPaletteFilter() }}
            aria-label="Previous work"
            aria-controls="works-rail"
            onClick={() => goTo(active - 1)}
            data-testid="button-works-previous"
          >
            <span aria-hidden="true">
              <svg viewBox="0 0 18 18" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 4-5 5 5 5" />
              </svg>
            </span>
          </button>
          <div className="works-dots">
            {works.map((work, index) => (
              <button
                type="button"
                key={work.cover.file}
                className="works-dot"
                aria-label={`Show ${work.title}`}
                aria-current={active === index ? 'true' : undefined}
                onClick={() => goTo(index)}
                data-testid={`button-works-dot-${index + 1}`}
              >
                <span className="works-dot-sphere" aria-hidden="true" style={{ '--dot': work.accent } as CSSProperties} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="works-arrow"
            style={{ filter: getSavedPaletteFilter() }}
            aria-label="Next work"
            aria-controls="works-rail"
            onClick={() => goTo(active + 1)}
            data-testid="button-works-next"
          >
            <span aria-hidden="true">
              <svg viewBox="0 0 18 18" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 4 5 5-5 5" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {selectedWork && (
        <div
          className="works-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedWork.title} image viewer`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
          data-testid="dialog-work-viewer"
        >
          <div className="works-viewer-backdrop" aria-hidden="true" onMouseDown={() => setSelectedIndex(null)} />
          <div className="works-viewer-panel" ref={panelRef}>
            <div className="works-viewer-topline">
              <span data-testid="text-viewer-title">{selectedWork.title}</span>
              <button type="button" ref={closeRef} onClick={() => setSelectedIndex(null)} aria-label="Close image viewer" data-testid="button-close-viewer">
                close ×
              </button>
            </div>
            <div
              className="works-viewer-image-wrap"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setSelectedIndex(null);
              }}
            >
              <img
                className="works-viewer-image"
                src={workAssetUrl(selectedWork.cover.file)}
                alt={selectedWork.cover.alt}
                data-testid="img-viewer-work"
              />
            </div>
            <div className="works-viewer-controls">
              <span>cover</span>
              <span className="works-viewer-hint">esc to close</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};