import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { SentenceDot } from '../components/sentence-dot';
import '../styles/editorial.css';
import '../styles/make-it-work.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { internshipImages } from '../lib/works';

export const MakeItWork: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const meta = [
      { selector: 'meta[name="description"]', content: 'Flyers and visualisation made during my internship at Make It Work.' },
      { selector: 'meta[property="og:title"]', content: 'Make It Work — internship | Thành Lambeets' },
      { selector: 'meta[property="og:description"]', content: 'Flyers and visualisation made during my internship at Make It Work.' },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });

    document.title = 'Make It Work — internship | Thành Lambeets';
    return () => {
      document.title = previousTitle;
      meta.forEach(({ element, previousContent }) => {
        if (element && previousContent !== undefined) element.content = previousContent;
      });
    };
  }, []);

  return (
    <main className="ed ed-fit ed-make-it-work" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{make it work}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Make It Work — internship</h2>
          <p>
            These flyers were made during my internship at Make It Work<SentenceDot /> I followed what the team wanted,
            but the visualisation with the colourful hands was my own idea<SentenceDot /> The “Op zoek naar een toffe job?”
            flyer followed their direction.
          </p>
        </article>
      </div>

      <section className="ed-gallery ed-gallery--free" aria-label="Make It Work internship flyers and visualisation">
        {internshipImages.map((image) => (
          <EditorialFigure key={image.file} file={image.file} alt={image.alt} caption={image.caption.replace(/ — flyer$/, '').replace('Flyer — ', 'Flyer ')} eager />
        ))}
      </section>
    </main>
  );
};
