import { type FC, useEffect } from 'react';
import { Link } from 'wouter';
import { useSavedPalette } from '../hooks/use-saved-palette';
import '../styles/editorial.css';

/** Placeholder until the radio is built. */
export const Radio: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previous = document.title;
    document.title = 'radio — Thành Lambeets';
    return () => { document.title = previous; };
  }, []);

  return (
    <main className="ed radio-page" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <nav className="blog-top-links" aria-label="Radio navigation">
          <Link href="/" className="subpage-return about-return" style={{ filter: palette.filter }} data-testid="link-return-home">
            {'{return home}'}
          </Link>
        </nav>
        <h1>{'{radio}'}</h1>
      </header>
      <article className="ed-col" aria-label="Radio">
        <p>Coming soon.</p>
      </article>
    </main>
  );
};
