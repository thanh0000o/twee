import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { AgentFlowDiagram } from '../components/agent-flow-diagram';
import './vacature-agent.css';
import '../styles/editorial.css';

export const VacatureAgent: FC = () => {
  const palette = useSavedPalette();

  useEffect(() => {
    const previousTitle = document.title;
    const description = 'My job-search agent: a team of AI agents that finds, assesses and emails job opportunities every weekday. In daily use since 21 October 2026.';
    const tags = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', 'My Job-Search Agent | Thành Lambeets'],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', 'My Job-Search Agent | Thành Lambeets'],
      ['meta[name="twitter:description"]', description],
    ].map(([selector, content]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });
    document.title = 'My Job-Search Agent | Thành Lambeets';
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
        <h1>{'{Job-Search Agent}'}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>My Job-Search Agent</h2>
          <p>
            To help me find my first job, I designed a team of AI agents that searches
            for opportunities, assesses them and emails me every weekday. My aim is to
            spend less time checking individual careers pages and discover companies
            I would not have found myself.
          </p>
          <section aria-label="Key details">
            <h3>Role &amp; tools</h3>
            <p>
              Design, direction, testing and refinement, without writing code myself.
              I use Claude, scheduled tasks, shared memory, a Gmail connection and
              Firecrawl to read career pages that a normal fetch cannot load.
              In daily use since 21 October 2026.
            </p>
          </section>
        </article>

        <section className="ed-col" aria-label="How it works">
          <h3>How it works</h3>
          <p>
            Seven checking agents each review their own group of companies between
            07:00 and 07:25. They save their findings in shared memory. At 08:55,
            a final agent combines the results, searches job boards and sends me one email.
            On Fridays at about 10:00 I also get a weekly summary email with an overview of the week.
          </p>
          <section aria-label="Selection">
            <h3>What I receive</h3>
            <p>
              The daily setup now follows around 140 companies and looks for 2 to 3 new ones.
              Only jobs scoring at least 7/10 reach my inbox, with a degree check,
              expectations and learning opportunities. A required master's degree rules
              a job out; uncertainty about the degree requirement costs one point.
              The Friday email adds courses and a week overview with numbers, a chart per day and my top three jobs.
            </p>
          </section>
        </section>

        <section className="ed-col" aria-label="Test results">
          <h3>The first test</h3>
          <p>
            One agent could not process the full list, so I split the work.
            The first grouped test checked 102 companies; 60 could not be read
            automatically. It did produce real job leads, and the test email arrived
            correctly in Gmail. This does not yet prove reliable daily results.
            Since then I added three more agents and a fallback reader for pages that do not load.
          </p>
          <section aria-label="Boundaries">
            <h3>Deliberate boundaries</h3>
            <p>
              The agent never applies, never contacts companies and only emails me.
              Cover letters and CV advice remain my responsibility. LinkedIn and VDAB
              are excluded and the system does not run on weekends. I used to follow a
              separate list of 52 companies by hand. I have removed that list: every
              company now goes through the daily check. If a page still cannot be read,
              the agent says so instead of guessing.
            </p>
          </section>
        </section>

        <section className="ed-col" aria-label="Lessons and next steps">
          <h3>What I learned</h3>
          <p>
            An agent saying it is finished does not mean the work is complete.
            I check the outcome, not just the answer. Splitting the work, saving
            intermediate results and testing every connection proved more useful than
            asking one agent to do everything. Each agent starts fresh every day
            and needs precise instructions.
            Some career pages load their vacancies with JavaScript or block automatic
            visits, which made about a third of them unreadable at first. Adding a
            second reading method fixed part of that, and the agents now report what they could not read.
          </p>
          <section aria-label="Next steps">
            <h3>What comes next</h3>
            <p>
              After one or two weeks, I want to review how many jobs arrive and how
              well they actually fit, and look at how many pages remain unreadable.
              Then I want to add a feedback step where I mark which jobs I applied to,
              so the scoring can learn from it.
            </p>
          </section>
        </section>
      </div>
      <AgentFlowDiagram />
    </main>
  );
};
