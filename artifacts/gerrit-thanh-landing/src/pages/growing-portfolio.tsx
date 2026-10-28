import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { SentenceDot } from '../components/sentence-dot';
import '../styles/editorial.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';

const visuals = [
  { file: 'growing-portfolio/starting-canvas-growth.webp', caption: 'Scroll to begin', alt: 'The scroll prompt before the portfolio tree begins growing' },
  { file: 'growing-portfolio/growing-branches-growth.webp', caption: 'Branches grow', alt: 'Fine curved branches growing outward from the central trunk' },
  { file: 'growing-portfolio/project-markers-growth.webp', caption: 'Projects appear', alt: 'The grown tree with burgundy square project markers and small numbers' },
];

export const GrowingPortfolio: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const meta = [
      { selector: 'meta[name="description"]', content: 'Growing Portfolio — an interactive website concept in which a central trunk and fine branches grow into 20 selectable project markers.' },
      { selector: 'meta[property="og:title"]', content: 'Growing Portfolio — Interactive Website | Thành Lambeets' },
      { selector: 'meta[property="og:description"]', content: 'A portfolio concept that grows from a quiet white canvas into a tree of project markers.' },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });
    document.title = 'Growing Portfolio — Interactive Website | Gerrit Thành Lambeets';
    return () => {
      document.title = previousTitle;
      meta.forEach(({ element, previousContent }) => {
        if (element && previousContent !== undefined) element.content = previousContent;
      });
    };
  }, []);

  return (
    <main className="ed ed-fit ed-growing-portfolio" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{growing portfolio}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Growing Portfolio — Interactive website</h2>
          <p>
            I designed this portfolio concept to let visitors discover my work gradually<SentenceDot />
            The page begins as a quiet canvas; as visitors scroll, a central trunk draws upward and organic branches unfold into project markers<SentenceDot />
            Selecting one of the 20 markers reveals an image, category, title and short description without interrupting the visual experience.
          </p>
        </article>
        <section className="ed-col" aria-label="Accent colour">
          <h3>Colour</h3>
          <ul className="ed-list">
            <li>
              <span className="ed-swatch" style={{ background: '#4D0A15' }} aria-hidden="true" />
              <span>Burgundy <code>#4D0A15</code> — project markers. White background and fine dark lines.</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="ed-gallery ed-gallery--crop" aria-label="Growing Portfolio screenshots">
        {visuals.map((v) => (
          <EditorialFigure key={v.file} file={v.file} alt={v.alt} caption={v.caption} />
        ))}
      </section>
    </main>
  );
};
