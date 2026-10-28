import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { SentenceDot } from '../components/sentence-dot';
import '../styles/editorial.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';

const covers = [
  {
    file: 'drone-strategy-portfolio-cover.svg',
    alt: 'English Drone Strategy portfolio cover with low-set type, one small blue dot, three black institutional logos, the year and all three contributors',
    caption: 'Portfolio cover',
  },
  {
    file: 'drone-strategy.webp',
    alt: 'Original Dutch Drone Strategy bachelor’s thesis cover for Smart Dún Laoghaire, 2023–2024',
    caption: 'Original document cover',
  },
];

export const DroneStrategie: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const meta = [
      {
        selector: 'meta[name="description"]',
        content: 'Drone Strategy bachelor’s thesis for Smart Dún Laoghaire: a research-based proposal for sustainable urban drone infrastructure.',
      },
      {
        selector: 'meta[property="og:title"]',
        content: 'Drone Strategy — Bachelor’s Thesis | Thành Lambeets',
      },
      {
        selector: 'meta[property="og:description"]',
        content: 'A research-based droneport concept for Smart Dún Laoghaire, with a summary of the report’s conclusion.',
      },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });

    document.title = 'Drone Strategy — Bachelor’s Thesis | Thành Lambeets';
    return () => {
      document.title = previousTitle;
      meta.forEach(({ element, previousContent }) => {
        if (element && previousContent !== undefined) element.content = previousContent;
      });
    };
  }, []);

  return (
    <main className="ed ed-fit ed-compact-work ed-compact-covers" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{`{drone strategy · thesis}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Drone Strategy — Bachelor’s Thesis for Smart Dún Laoghaire</h2>
          <p>
            A bachelor’s thesis assignment developed in collaboration with Smart Dún Laoghaire<SentenceDot />
            Final grade: 16/20.
          </p>
          <p>
            In this 2023–2024 bachelor’s thesis, I worked with Aramis Charlier and Hidde van den Brande
            on a drone strategy for Smart Dún Laoghaire, part of the Smart Dublin initiative<SentenceDot /> We explored
            how a droneport in Dún Laoghaire could support more sustainable urban transport while taking
            the economic impact and the needs of local residents into account.
          </p>
        </article>
        <div className="ed-col">
          <p>
            The report examines possible uses for drones, from deliveries and emergency services to
            infrastructure inspection<SentenceDot /> We looked at existing drone initiatives and at practical obstacles:
            aviation rules, safety, privacy, noise, technical limitations and public acceptance<SentenceDot /> From that
            research came Skylink, a proposed shared drone hub with test and fabrication facilities and
            charging-and-shelter towers called “Spikes”<SentenceDot /> The concept connects government, researchers,
            businesses and residents through shared infrastructure, education and public events.
          </p>
          <p>
            We also outlined a phased implementation plan and a hypothetical financial model<SentenceDot /> Skylink is
            a proposed strategy, not a droneport that has already been built.
          </p>
        </div>
        <section className="ed-col works-project-conclusion" aria-labelledby="drone-conclusion">
          <h3 id="drone-conclusion">Conclusion</h3>
          <p>
            The report does include a formal conclusion<SentenceDot /> In essence, it proposes Skylink as a way to
            bring drone infrastructure, operators and research together so that drone services could
            become safer, more efficient and more sustainable in Dún Laoghaire<SentenceDot /> Shared facilities and
            the Spikes would support operations; collaboration with local businesses and universities
            could create opportunities for innovation.
          </p>
        </section>
        <div className="ed-col">
          <p>
            The conclusion also stresses that technology alone is not enough<SentenceDot /> Cooperation between the
            local authority, universities, companies and residents, along with education and public
            engagement, would be essential to building trust and making the concept useful to the
            community<SentenceDot /> The report presents this as a direction for future development, not as an
            already completed implementation.
          </p>
          <p className="ed-note works-project-cover-note">
            Condensed English rendering of the report’s conclusion (p. 74) and future outlook (pp. 75–76).
          </p>
        </div>
      </div>

      <section className="ed-gallery ed-gallery--covers" aria-label="Drone Strategy portfolio and original covers">
        {covers.map((cover) => (
          <EditorialFigure key={cover.file} file={cover.file} alt={cover.alt} caption={cover.caption} label={`Open Drone Strategy ${cover.caption.toLowerCase()} at full size`} eager />
        ))}
      </section>
    </main>
  );
};
