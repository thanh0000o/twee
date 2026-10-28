import { type FC, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink } from '../components/blog-return-link';
import { SentenceDot } from '../components/sentence-dot';
import '../styles/editorial.css';
import '../styles/about-details.css';
import { useSavedPalette } from '../hooks/use-saved-palette';

const DESCRIPTION =
  'About Thành Lambeets, a Brussels-based visual thinker and builder exploring art, technology, design, and what makes us human.';

const base = import.meta.env.BASE_URL;

export const About: FC = () => {
  const palette = useSavedPalette();
  const pageRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const portrait = portraitRef.current;
    const grid = portrait?.closest<HTMLElement>('.ed-cols');
    if (!page || !portrait || !grid) return;

    // The photo is narrower than its grid track when matching the biography's height.
    // Align the text and divider to the actual print, not the unused track width.
    const alignPortraitDetails = () => {
      const photo = portrait.getBoundingClientRect();
      if (!photo.width) return;
      page.style.setProperty('--about-portrait-width', `${photo.width}px`);
      page.style.setProperty('--about-content-width', `${photo.right - grid.getBoundingClientRect().left}px`);
    };
    alignPortraitDetails();
    const observer = new ResizeObserver(alignPortraitDetails);
    observer.observe(portrait);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = metaDescription?.content;

    document.title = 'about Thành Lambeets — visual thinker in Brussels';
    if (metaDescription) metaDescription.content = DESCRIPTION;

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription) metaDescription.content = previousDescription;
    };
  }, []);

  return (
    <main ref={pageRef} className="ed ed-about" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <nav className="subpage-return-links" aria-label="Return navigation">
          <Link href="/" className="subpage-return about-return" style={{ filter: palette.filter }}>{`{return home}`}</Link>
          <BlogReturnLink />
        </nav>
        <h1>{`{about me}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col about-biography">
          <p>
            Thành Lambeets is based in Brussels<SentenceDot /> He sees art,
            technology, and design as a chance to constantly explore what makes us human, how
            we see the world, and what we can achieve.
          </p>
          <p>
            His process always starts with observing things carefully, a slow, thoughtful way
            of thinking that allows ideas to form naturally<SentenceDot /> This quiet focus leads to a strong
            interest in how we move between the real, physical world and the forces we can’t
            see but feel every day: things like memory, desire, change, and the subtle urge to
            be more than ordinary.
          </p>
          <p>
            With a background in Innovation Management and self-taught experience in design,
            3D and digital tools, Thành is comfortable moving between big concepts and the
            technical work needed to finish a project<SentenceDot /> He is always curious about new
            technologies and digital ways of working, and how they change the environments we
            live in, both personally and together.
          </p>
          <p>
            He works with empathy, clear thinking, and discipline, qualities shaped by years of
            research and hands-on making<SentenceDot /> Growth, for him, means constantly learning and
            giving every idea the time it needs to become something solid<SentenceDot /> He treats good ideas
            less as a flash of genius and more as a conversation between people, between tools,
            and between the world as it is and the world we imagine it could be.
          </p>
          <p>
            In all his work, Thành wants to create chances for people to pause, reflect, and
            find the simple beauty hidden inside complex things<SentenceDot /> His goal is to build
            thoughtful, impactful experiences that successfully mix imagination, technology,
            and human understanding into work that truly connects with people.
          </p>
        </article>
        <section className="ed-col about-portrait-column" aria-label="Portrait and résumé">
          <figure className="about-portrait">
            <span className="about-paper-print">
              <img
                ref={portraitRef}
                src={`${base}resume/portrait-selfie-monochrome-paper.webp`}
                width="580"
                height="613"
                alt="Black-and-white enhanced close-up portrait of Thành Lambeets from his selfie, with a light matte-paper texture across the surface, balanced contrast, softly detailed face and hair and a clean neutral background, without an added frame or folds."
              />
            </span>
          </figure>
          <p className="ed-links">
            <a href={`${base}resume/Thanh-Lambeets-CV-2026-10.pdf`} style={{ filter: palette.filter }} download="Thanh-Lambeets-Resume.pdf">{`{download résumé, pdf}`}</a>
            <a href={`${base}resume/Thanh-Lambeets-CV-2026-10.pdf`} style={{ filter: palette.filter }} target="_blank" rel="noopener noreferrer">{`{open in new tab}`}</a>
          </p>
        </section>
      </div>
      <div className="about-details">
        <section aria-labelledby="ab-edu">
          <h3 id="ab-edu">{`{education}`}</h3>
          <dl>
            <div><dt>2021–2024</dt><dd>Bachelor, Idea &amp; Innovation Management, Erasmushogeschool Brussel. Graduated Cum Laude.</dd></div>
            <div><dt>2025</dt><dd>Master, Business Administration, Vrije Universiteit Brussel. Not completed; paused for now, with the plan to continue.</dd></div>
            <div><dt>2012–2018</dt><dd>Accounting &amp; Computer Science, Koninklijk Atheneum Tervuren.</dd></div>
          </dl>
        </section>
        <section aria-labelledby="ab-exp">
          <h3 id="ab-exp">{`{experience}`}</h3>
          <dl>
            <div><dt>2024</dt><dd>OneBonsai, intern: marketing, research and client presentations.</dd></div>
            <div><dt>2023</dt><dd>Make It Work, intern: youth-coaching support and visual communication.</dd></div>
            <div><dt>2022–2025</dt><dd>Bouf&apos;s restaurant, student kitchen helper: food preparation.</dd></div>
            <div><dt>2021–</dt><dd>Digital artist: cover art and creative visuals.</dd></div>
            <div><dt>2019–2022</dt><dd>Scouts en Gidsen Tervuren, leader: youth coordination and project organisation.</dd></div>
            <div><dt>2018</dt><dd>Argenta Tervuren, student intern: banking operations and certification support.</dd></div>
          </dl>
        </section>
        <div className="about-capabilities">
          <section aria-labelledby="ab-skills">
            <h3 id="ab-skills">{`{skills}`}</h3>
            <p>An innovation-driven builder mindset; business cases and basic financial modelling; turning trends into concepts; brand and rebranding strategy; visual and conceptual creativity; empathetic collaboration; self-directed, with high standards.</p>
          </section>
          <section aria-labelledby="ab-software">
            <h3 id="ab-software" className="about-sub">{`{software}`}</h3>
            <p>Using and learning: Illustrator, InDesign, Photoshop, Blender, Microsoft Office, AI tools. Exploring Replit, Figma and AI agents for automation.</p>
          </section>
        </div>
        <section className="about-languages" aria-labelledby="ab-languages">
          <h3 id="ab-languages">{`{languages}`}</h3>
          <dl className="about-lang">
            <div><dt>Dutch</dt><dd>C2</dd></div>
            <div><dt>English</dt><dd>B2</dd></div>
            <div><dt>French</dt><dd>A2</dd></div>
            <div><dt>Vietnamese</dt><dd>B1</dd></div>
          </dl>
        </section>
      </div>
    </main>
  );
};
