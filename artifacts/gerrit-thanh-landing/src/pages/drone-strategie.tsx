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
        content: "Drone Strategy, my bachelor's thesis for Smart Dún Laoghaire: a plan for a shared drone hub in the town.",
      },
      {
        selector: 'meta[property="og:title"]',
        content: "Drone Strategy, bachelor's thesis | Thành Lambeets",
      },
      {
        selector: 'meta[property="og:description"]',
        content: "A droneport plan for Smart Dún Laoghaire, with a short version of the report's conclusion.",
      },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });

    document.title = "Drone Strategy, bachelor's thesis | Thành Lambeets";
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
          <h2>Drone Strategy, bachelor's thesis for Smart Dún Laoghaire</h2>
          <p>
            My bachelor's thesis, made together with Smart Dún Laoghaire<SentenceDot /> Final grade: 16/20.
          </p>
          <p>
            In 2023–2024 I worked with Aramis Charlier and Hidde van den Brande on a drone strategy
            for Smart Dún Laoghaire, which is part of Smart Dublin<SentenceDot /> Our question was how a droneport
            in Dún Laoghaire could make transport in the town more sustainable, without losing sight
            of the costs or of the people who live there.
          </p>
        </article>
        <div className="ed-col">
          <p>
            We started with what drones could be used for, like deliveries, emergency services and
            checking bridges and buildings<SentenceDot /> Then we looked at drone projects elsewhere and at what
            gets in the way: aviation rules, safety, privacy, noise, the limits of the technology and
            whether people would accept it<SentenceDot /> That research led to Skylink, a shared drone hub with
            space to test and build drones, and towers called "Spikes" where drones can charge and
            shelter<SentenceDot /> Government, researchers, businesses and residents would use the same hub, and
            it would host courses and public events.
          </p>
          <p>
            We also wrote a plan to roll it out in phases and a rough financial model<SentenceDot /> Skylink only
            exists on paper; nobody has built it.
          </p>
        </div>
        <section className="ed-col works-project-conclusion" aria-labelledby="drone-conclusion">
          <h3 id="drone-conclusion">Conclusion</h3>
          <p>
            The report ends with a formal conclusion<SentenceDot /> It argues that Skylink could bring drone
            infrastructure, operators and research under one roof, so drone services in Dún Laoghaire
            become safer and greener<SentenceDot /> The shared facilities and the Spikes would handle daily
            operations, and working with local companies and universities would leave room for new ideas.
          </p>
        </section>
        <div className="ed-col">
          <p>
            The conclusion also says the technology on its own won't do it<SentenceDot /> The local authority,
            universities, companies and residents have to work together, and people need to learn
            about drones and get a say before they'll trust the idea and use it<SentenceDot /> The report sees all
            of this as a direction for later, since nothing has been put in place yet.
          </p>
          <p className="ed-note works-project-cover-note">
            A short English version of the report's conclusion (p. 74) and future outlook (pp. 75–76).
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
