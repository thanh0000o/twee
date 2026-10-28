import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import '../styles/editorial.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';
import archive from '../data/first-portfolio-gallery.json';
import '../styles/first-portfolio.css';

const shots = [
  { file: 'first-portfolio/desktop.jpeg', caption: 'The desktop', alt: 'Full portfolio desktop on a black background with widgets and folder icons', primary: true },
  { file: 'first-portfolio/workspace.png', caption: 'Workspace window', alt: 'Main Dreamweaver-like navigation window of the portfolio' },
  { file: 'first-portfolio/collections.png', caption: 'Art collections', alt: 'Five ArtGallery folders inside a Windows 95 style window' },
  { file: 'first-portfolio/cover-gallery.png', caption: 'Covers in the explorer', alt: 'Cover images shown inside an explorer-style window' },
  { file: 'first-portfolio/image-viewer.png', caption: 'Image viewer', alt: 'Standalone artwork viewer window' },
];

export const FirstPortfolio: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'First Portfolio — Windows 95 Desktop | Gerrit Thành Lambeets';
    if (description) description.content = 'My first live portfolio: a personal Windows 95 style desktop of folders, windows and files.';
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
    };
  }, []);

  return (
    <main className="ed ed-first-portfolio" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{first portfolio}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>First Portfolio — Windows 95 Desktop</h2>
          <p>
            This was my first portfolio, and a project I was proud of for a long time. It is still online. Instead of simply listing projects, I built a personal desktop that brought my work, ideas and personality together.
          </p>
          <p>
            Visitors explore work and personal information as files and applications. Folders open into draggable windows, with art collections, a music player, a guestbook and other personal file-like sections.
          </p>
        </article>
        <section className="ed-col" aria-label="Inspiration">
          <h3>Inspiration</h3>
          <p>
            The site is fully inspired by early-2000s webdesign and the personal-web culture of Neocities. Windows 95-style frames, pixel icons and a workspace inspired by older design software make browsing feel like a small exploration.
          </p>
          <div className="ed-links">
            <a href="https://thanhlambeets.com/" target="_blank" rel="noopener noreferrer" data-testid="link-first-portfolio-live">Visit the original portfolio</a>
            <a href="https://neocities.org/" target="_blank" rel="noopener noreferrer" data-testid="link-neocities">Explore Neocities</a>
          </div>
        </section>
      </div>

      <section className="ed-gallery" aria-label="First Portfolio screenshots">
        {shots.map((s) => (
          <EditorialFigure key={s.file} file={s.file} alt={s.alt} caption={s.caption} eager={s.primary} numberedOnly />
        ))}
        {archive.flatMap((group) => group.figures).map((figure) => (
          <EditorialFigure key={figure.file} {...figure} numberedOnly />
        ))}
      </section>
    </main>
  );
};
