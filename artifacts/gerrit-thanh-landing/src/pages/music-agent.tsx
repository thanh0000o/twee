import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { MusicAgentFlowDiagram } from '../components/music-agent-flow-diagram';
import './vacature-agent.css';
import '../styles/editorial.css';

const TITLE = 'Music Agent | Thành Lambeets';

export const MusicAgent: FC = () => {
  const palette = useSavedPalette();

  useEffect(() => {
    const previousTitle = document.title;
    const description = 'My music agent: a team of four AI agents that follows my artists, clubs, venues and concert halls and emails me one overview per scene every month. A personal project in testing.';
    const tags = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', TITLE],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', TITLE],
      ['meta[name="twitter:description"]', description],
    ].map(([selector, content]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });
    document.title = TITLE;
    return () => {
      document.title = previousTitle;
      tags.forEach(({ element, previousContent }) => {
        if (element && previousContent !== undefined) element.content = previousContent;
      });
    };
  }, []);

  return (
    <main className="ed ed-job-agent" data-palette={palette.name} lang="en">
      <header className="subpage-header ed-top">
        <WorkReturnNavigation filter={palette.filter} />
        <h1>{'{Music Agent}'}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Why I made it</h2>
          <p>
            My taste goes from jungle and garage to dub and classical. Dance music is fairly easy to follow through party sites, but keeping up with classical concerts meant checking concert halls, orchestras and pianists separately. I wanted to bring it all together without constantly jumping between websites.
          </p>
        </article>

        <section className="ed-col" aria-label="How I made it">
          <h3>How I made it</h3>
          <p>
            Using Claude, I split the search into four groups: bass for jungle, drum &amp; bass, UK hardcore and dub; garage; live concerts for trip-hop and nu-jazz; and classical, with a focus on piano concertos and favourite pianists. Each agent follows its own sources. I designed and tested the scheduled setup without writing code.
          </p>
        </section>

        <section className="ed-col" aria-label="What I used">
          <h3>What I used</h3>
          <p>
            My Spotify and YouTube playlists and Discogs collection guide the artist lists. The agents check venue agendas, Resident Advisor and festival line-ups. They also search directly for lesser-known dub soundsystems, which rarely appear on the bigger sites.
          </p>
        </section>

        <section className="ed-col" aria-label="What I receive">
          <h3>What I receive</h3>
          <p>
            It all comes together in Gmail: one monthly email per scene, with upcoming shows, festivals and artists to discover. The agents share memory to avoid repeats, so I can follow my different interests in one place.
          </p>
        </section>
      </div>
      <MusicAgentFlowDiagram />
    </main>
  );
};
