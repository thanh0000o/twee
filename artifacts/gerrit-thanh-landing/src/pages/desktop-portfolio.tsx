import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import '../styles/editorial.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';

const screenshots = [
  {
    file: 'desktop-portfolio/main-view.jpg',
    caption: 'Main view — sculpted frame',
    alt: 'Portfolio desktop with blue cloud wallpaper, a sculpted frame and twelve artwork icons',
  },
  {
    file: 'desktop-portfolio/minimal-view.jpg',
    caption: 'Minimal view — the same collection',
    alt: 'The portfolio’s minimal view with blue cloud wallpaper and the same artwork icons, without the decorative frame',
  },
];

export const DesktopPortfolio: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'Digital Desktop Portfolio — Portfolio Concept | Gerrit Thành Lambeets';
    if (description) {
      description.content = 'I made this portfolio concept, but it never became a live website.';
    }
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
    };
  }, []);

  return (
    <main className="ed ed-fit ed-compact-work" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{desktop portfolio}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Digital Desktop Portfolio — Portfolio concept</h2>
          <p>
            I made this portfolio concept, but it never became a live website.
          </p>
        </article>
      </div>

      <section className="ed-gallery ed-gallery--pair" aria-label="Digital Desktop Portfolio screenshots">
        {screenshots.map((image) => (
          <EditorialFigure key={image.file} file={image.file} alt={image.alt} caption={image.caption.split(' — ')[0]} />
        ))}
      </section>
    </main>
  );
};
