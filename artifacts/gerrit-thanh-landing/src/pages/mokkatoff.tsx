import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { SentenceDot } from '../components/sentence-dot';
import { WorkImagePreview } from '../components/work-image-preview';
import '../styles/editorial.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { workAssetUrl } from '../lib/works';

const colors = [
  { name: 'Ice white', hex: '#F7FBFD', rgb: '247, 251, 253', hsl: '204 60% 98%', use: 'page and light surfaces' },
  { name: 'Navy', hex: '#0A1E4D', rgb: '10, 30, 77', hsl: '222 78% 17%', use: 'type, outlines, shadows' },
  { name: 'Blue', hex: '#095ECE', rgb: '9, 94, 206', hsl: '214 92% 42%', use: 'buttons and footer' },
  { name: 'Red', hex: '#E81733', rgb: '232, 23, 51', hsl: '352 82% 50%', use: 'exclamation mark, accent' },
  { name: 'Aqua', hex: '#4CDBF0', rgb: '76, 219, 240', hsl: '188 85% 62%', use: 'opening-hours borders' },
  { name: 'Deep navy', hex: '#051139', rgb: '5, 17, 57', hsl: '226 85% 12%', use: 'opening-hours background' },
];

const visuals = [
  { file: 'mokkatoff/website-hero.png', caption: 'Website hero', alt: 'Mokkatoff website hero with the overlapping wordmark' },
  { file: 'mokkatoff/website-overview.png', caption: 'Website footer', alt: 'White Mokkatoff wordmark on the blue website footer' },
  { file: 'mokkatoff/opening-hours.png', caption: 'Opening hours', alt: 'Mokkatoff opening hours panel in deep navy with aqua borders' },
  { file: 'mokkatoff/flavour-menu.png', caption: 'Flavour menu', alt: 'Mokkatoff flavour menu page' },
];

export const Mokkatoff: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const meta = [
      { selector: 'meta[name="description"]', content: 'Mokkatoff! — a playful Dutch/French website and visual identity for an artisanal ice cream shop in Tervuren. Original logo, brand colors and website details.' },
      { selector: 'meta[property="og:title"]', content: 'Mokkatoff! — Website and Visual Identity | Thành Lambeets' },
      { selector: 'meta[property="og:description"]', content: 'An expressive wordmark, six solid brand colors and a bilingual ice cream website.' },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });
    document.title = 'Mokkatoff! — Website and Visual Identity | Gerrit Thành Lambeets';
    return () => {
      document.title = previousTitle;
      meta.forEach(({ element, previousContent }) => {
        if (element && previousContent !== undefined) element.content = previousContent;
      });
    };
  }, []);

  return (
    <main className="ed ed-fit ed-compact-work ed-compact-brand" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{mokkatoff!}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Mokkatoff! — Website and visual identity</h2>
          <p>
            I made this first version for a friend whose parents own Mokkatoff<SentenceDot />
            I felt their existing website could better reflect the business, so I built a quick alternative<SentenceDot />
            It is still an early concept and has not been deployed yet<SentenceDot />
            My friend plans to take over the business in the future, and we’ll work closely together to develop the website further.
          </p>
        </article>
        <section className="ed-col" aria-label="Mokkatoff! logo">
          <div className="ed-logo">
            <div className="ed-stage">
              <WorkImagePreview src={workAssetUrl('mokkatoff/mokkatoff-logo.svg')} alt="Mokkatoff! wordmark in navy letters with a red exclamation mark" label="Open the original Mokkatoff vector logo at full size">
                <img src={workAssetUrl('mokkatoff/mokkatoff-logo.svg')} alt="Mokkatoff! wordmark in navy letters with a red exclamation mark" />
              </WorkImagePreview>
            </div>
          </div>
        </section>
        <section className="ed-col" aria-label="Brand colours">
          <h3>Colours</h3>
          <ul className="ed-list">
            {colors.map((c) => (
              <li key={c.hex}>
                <span className="ed-swatch" style={{ background: c.hex }} aria-hidden="true" />
                <span title={`RGB ${c.rgb} · HSL ${c.hsl} · ${c.use}`}>
                  {c.name} <code>{c.hex}</code>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ed-fit-zone"><section className="ed-gallery ed-gallery--shots" aria-label="Mokkatoff project visuals">
        {visuals.map((v, i) => (
          <EditorialFigure key={v.file} file={v.file} alt={v.alt} caption={v.caption} primary={i === 0} />
        ))}
      </section></div>
    </main>
  );
};
