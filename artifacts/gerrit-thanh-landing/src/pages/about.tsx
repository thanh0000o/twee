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
            Thành Lambeets lives in Brussels<SentenceDot /> He uses art, technology and design to look at how people see the world and what they're capable of.
          </p>
          <p>
            He starts by looking, and he takes his time with it, so ideas can form on their own<SentenceDot /> What keeps pulling him in is the space between the physical world and the things we feel but can't see, like memory, or the urge to be more than ordinary.
          </p>
          <p>
            He studied Innovation Management and taught himself design, 3D and a range of digital tools<SentenceDot /> That lets him follow a project from the first idea down to the work it takes to finish it<SentenceDot /> New technology interests him mostly for what it changes in the places where we live and work.
          </p>
          <p>
            He works with care and discipline, picked up through years of research and making things himself<SentenceDot /> Growing, for him, means learning all the time and giving an idea the time it needs to become solid<SentenceDot /> In his experience, good ideas come out of conversation: between people, and between the world as it is and the one we imagine<SentenceDot /> That's also why he wants to work close to clients and the teams that build for them, because that's where those conversations happen every day.
          </p>
        </article>
        <section className="ed-col about-portrait-column" aria-label="Portrait and résumé">
          <figure className="about-portrait">
            <span className="about-paper-print">
              <img
                ref={portraitRef}
                src={`${base}resume/portrait-selfie-monochrome-paper-straight.webp`}
                width="570"
                height="605"
                alt="Black-and-white enhanced close-up portrait of Thành Lambeets from his selfie, with a light matte-paper texture across the surface, balanced contrast, softly detailed face and hair and a clean neutral background and straight edges."
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
            <div><dt>2021–2024</dt><dd>Bachelor, Idea &amp; Innovation Management, Erasmushogeschool Brussel. Graduated cum laude. Thesis: phased implementation plan for a drone hub in Dún Laoghaire, graded 16/20.</dd></div>
            <div><dt>2012–2018</dt><dd>Secondary education, Accounting &amp; Computer Science, Koninklijk Atheneum Tervuren.</dd></div>
          </dl>
        </section>
        <section aria-labelledby="ab-exp">
          <h3 id="ab-exp">{`{experience}`}</h3>
          <dl>
            <div><dt>2025–2026</dt><dd>Sabbatical year, travel and learning.
              <ul>
                <li>Put my portfolio site online.</li>
                <li>Set up AI agents that check company websites for new vacancies and mail me the ones that fit.</li>
                <li>Working on my own online radio station with a retro 3D player and a live chat, launch coming soon.</li>
              </ul>
            </dd></div>
            <div><dt>2024</dt><dd>OneBonsai, intern: marketing, research and client presentations.
              <ul>
                <li>Audited the company website (UX issues, broken buttons, language versions) and led the session that turned it into a brief for the developer.</li>
                <li>Represented OneBonsai at Natural Disasters Expo Europe in Frankfurt, pitching VR training in English.</li>
                <li>Joined client meetings at Deloitte and Evere police.</li>
                <li>Ran a cold mail campaign to 100+ organisations: 27 hot leads.</li>
              </ul>
            </dd></div>
            <div><dt>2023</dt><dd>Make It Work, intern: youth coaching and communication.
              <ul>
                <li>Made flyers and a data visualisation for young people and helped run team brainstorms.</li>
              </ul>
            </dd></div>
            <div><dt>2022–2025</dt><dd>Bouf&apos;s restaurant, student kitchen helper: food preparation.</dd></div>
            <div><dt>2021–</dt><dd>Digital artist: cover art and creative visuals.</dd></div>
            <div><dt>2019–2022</dt><dd>Scouts en Gidsen Tervuren, leader: youth coordination and project organisation.
              <ul>
                <li>Planned activities with a team of leaders, divided tasks and kept deadlines for three years.</li>
              </ul>
            </dd></div>
            <div><dt>2018</dt><dd>Argenta Tervuren, student intern: banking operations and certification support.</dd></div>
          </dl>
        </section>
        <div className="about-capabilities">
          <section aria-labelledby="ab-skills">
            <h3 id="ab-skills">{`{skills}`}</h3>
            <p>Client communication; project planning &amp; follow-up; Scrum &amp; Agile; leading brainstorms &amp; workshops; website audits &amp; UX feedback; market &amp; trend research; business case development; trend-to-concept translation; brand &amp; rebranding strategy; visual &amp; conceptual creativity; AI-driven workflow &amp; tooling exploration; empathetic collaboration; self-directed with high personal standards.</p>
          </section>
          <section aria-labelledby="ab-software">
            <h3 id="ab-software" className="about-sub">{`{software}`}</h3>
            <p>Microsoft Office, Adobe Creative Suite, Blender, AI tools.</p>
          </section>
        </div>
        <section className="about-languages" aria-labelledby="ab-languages">
          <h3 id="ab-languages">{`{languages}`}</h3>
          <dl className="about-lang">
            <div><dt>Dutch</dt><dd>C2</dd></div>
            <div><dt>English</dt><dd>B2</dd></div>
            <div><dt>Vietnamese</dt><dd>B1</dd></div>
            <div><dt>French</dt><dd>A2, learning</dd></div>
          </dl>
        </section>
      </div>
    </main>
  );
};
