import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { SentenceDot } from '../components/sentence-dot';
import { WorkImagePreview } from '../components/work-image-preview';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { workAssetUrl } from '../lib/works';
import './allergen-menu-checker.css';

const visuals = [
  { file: 'allergen-menu-checker/allergen-checker.webp', caption: 'Allergen checker', alt: 'Allergen checker screen with milk selected, traces and safe-only toggles and a dish list' },
  { file: 'allergen-menu-checker/service-mode.webp', caption: 'Service Mode', alt: 'Service Mode screen showing read-only dish results' },
  { file: 'allergen-menu-checker/menu-management.webp', caption: 'Menu management', alt: 'Menu management screen with a dish list and availability controls' },
  { file: 'allergen-menu-checker/allergen-management.webp', caption: 'Allergen management', alt: 'Allergen management screen listing the 14 EU allergens and custom entries' },
  { file: 'allergen-menu-checker/dish-form.webp', caption: 'New dish', alt: 'Modal form for adding a new dish with ingredients and allergens' },
];

export const AllergenMenuChecker: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const meta = [
      { selector: 'meta[name="description"]', content: 'Allergen Menu Checker — a work-in-progress tablet-friendly frontend prototype for sharing dish and allergen information between kitchen and front-of-house staff.' },
      { selector: 'meta[property="og:title"]', content: 'Allergen Menu Checker — Frontend MVP | Thành Lambeets' },
      { selector: 'meta[property="og:description"]', content: 'An unfinished prototype that grew out of kitchen shifts: a clearer way to share allergen information during service.' },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });
    document.title = 'Allergen Menu Checker — Frontend MVP | Gerrit Thành Lambeets';
    return () => {
      document.title = previousTitle;
      meta.forEach(({ element, previousContent }) => {
        if (element && previousContent !== undefined) element.content = previousContent;
      });
    };
  }, []);

  return (
    <main className="amc" data-palette={palette.name}>
      <header className="subpage-header amc-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{allergen menu checker}`}</h1>
      </header>

      <div className="amc-cols">
      <article className="amc-col">
        <h2>Allergen Menu Checker — Frontend MVP</h2>
        <p>
          This project is still in progress, and there is a lot left to figure out<SentenceDot />
          This idea grew out of problems we ran into during shifts when I was working in a kitchen as a student<SentenceDot />
          I wanted to explore a clearer way for the kitchen and front-of-house staff to share dish and allergen information during service.
        </p>
        <nav className="amc-screenshots" aria-label="Screenshot index">
          <h3>Screenshots</h3>
          <ol className="amc-index">
            {visuals.map((visual, index) => (
              <li key={visual.file}>
                <a href={`#allergen-screenshot-${index + 1}`}>{visual.caption}</a>
              </li>
            ))}
          </ol>
        </nav>
      </article>

      <section className="amc-col" aria-label="How it works">
        <h3>How it works</h3>
        <p>
          It is a tablet-friendly frontend prototype for restaurant staff and chefs<SentenceDot />
          The kitchen maintains dishes, ingredients, directly present allergens, possible traces, availability and internal notes<SentenceDot />
          Staff select a guest’s allergens, search or browse categories, optionally include traces and open dish details<SentenceDot />
          Service Mode is a focused, read-only view of the results; it is not an access-permission system<SentenceDot />
          The 14 core EU allergen categories are included, plus custom additions defined by the restaurant<SentenceDot />
          Allergens are assigned manually; there is no AI recipe analysis and nothing is inferred automatically<SentenceDot />
          Interface labels are in Dutch, French and English, while dish text is not translated automatically.
        </p>
      </section>

      <section className="amc-col" aria-label="Limits of the prototype">
        <h3>What “Safe” means, and what is missing</h3>
        <p>
          In the interface, “Safe” only means that no selected allergen matches in the stored data, with possible traces considered only when that option is enabled<SentenceDot />
          It is not a food-safety guarantee: real recipes, ingredient changes and cross-contact remain uncertain, so staff must always check with the kitchen<SentenceDot />
          The React, TypeScript and Vite prototype stores data only in the browser, with no shared database, sync or backups<SentenceDot />
          The PIN login is a mock rather than real authentication, there are no enforced staff or admin roles, and pricing is UI-only with no real payments<SentenceDot />
          It has no compliance certification and has not been verified for safety<SentenceDot />
          Before real restaurant use it would need reliable menu updates, shared data, real access control and testing during service<SentenceDot />
          The screenshots below show demo data, not real restaurant results.
        </p>
      </section>
      </div>

      <div className="amc-fit-zone"><section className="amc-gallery" aria-label="Allergen Menu Checker screenshots">
        {visuals.map((v, i) => (
          <figure className={`amc-fig${i === 0 ? ' amc-primary' : ''}`} key={v.file} id={`allergen-screenshot-${i + 1}`}>
            <div className="amc-stage">
              <WorkImagePreview src={workAssetUrl(v.file)} alt={v.alt} label={`Open ${v.caption} at full size`}>
                <img src={workAssetUrl(v.file)} alt={v.alt} loading="lazy" decoding="async" />
              </WorkImagePreview>
            </div>
            <figcaption>{v.caption}</figcaption>
          </figure>
        ))}
      </section></div>
    </main>
  );
};
