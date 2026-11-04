import { useEffect, type FC } from 'react';
import { WorkReturnNavigation } from '../components/work-return-navigation';
import { SentenceDot } from '../components/sentence-dot';
import '../styles/editorial.css';
import { EditorialFigure } from '../components/editorial-figure';
import { useSavedPalette } from '../hooks/use-saved-palette';

const covers = [
  {
    file: 'flex-delivery-spaced-cover.svg',
    alt: 'English Flex Delivery portfolio cover in the website’s font with Eco Circular Everything, author, year, one small green dot and black Erasmus and Flex Delivery logos',
    caption: 'Portfolio cover',
  },
  {
    file: 'trendrapport-flex-delivery.webp',
    alt: 'Original 2021–2022 Flex Delivery trend report cover required for the document',
    caption: 'Original document cover',
  },
];

export const FlexDelivery: FC = () => {
  const palette = useSavedPalette();
  useEffect(() => {
    const previousTitle = document.title;
    const meta = [
      { selector: 'meta[name="description"]', content: "An English overview and conclusion of Gerrit Thành Lambeets's 2021–2022 trend report on Flex Delivery, circularity and food packaging." },
      { selector: 'meta[property="og:title"]', content: "Flex Delivery, trend report | Gerrit Thành Lambeets" },
      { selector: 'meta[property="og:description"]', content: 'A trend report on Flex Delivery, the circular economy and ideas to reduce food waste.' },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });

    document.title = "Flex Delivery, trend report | Gerrit Thành Lambeets";
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
        <h1>{`{flex delivery}`}</h1>
      </header>

      <div className="ed-cols">
        <article className="ed-col">
          <h2>Flex Delivery, Eco Circular Everything</h2>
          <p>
            I wrote this trend report in 2021–2022 for a Trendwatching course in Idea &amp; Innovation
            Management<SentenceDot /> It looks at how Flex Delivery, a local grocery and drinks delivery service,
            fits into the move towards a circular economy<SentenceDot /> Back then the company bought from producers
            and shops nearby and delivered with electric vehicles and cargo bikes<SentenceDot /> Drinks came in
            returnable glass bottles, groceries in reusable bags.
          </p>
        </article>
        <div className="ed-col">
          <p>
            The report is about the gap between that ambition and the plastic some products still came
            in, mostly the ones from a local SPAR shop<SentenceDot /> I did a SWOT analysis of the business and a DESTEP
            analysis of the world around it, and looked at five examples of circular design for ideas
            that could close the gap.
          </p>
          <p>
            The idea I proposed builds on Rui Xu's FreshTag, a label that changes colour to show how
            fresh the food really is, so you don't have to rely on the printed date alone<SentenceDot /> I also
            suggested printing with natural pigments and adding a QR code that shows where a product
            comes from<SentenceDot /> It stayed a proposal; Flex Delivery never launched it<SentenceDot /> The report also says
            packaging like this would need investment and food-safety approval first.
          </p>
        </div>
        <section className="ed-col works-project-conclusion" aria-labelledby="flex-conclusion">
          <h3 id="flex-conclusion">Conclusion, rewritten in English</h3>
          <p>
            I picked Flex Delivery because it chose a harder road than regular grocery delivery, with
            local producers and cleaner transport<SentenceDot /> But the plastic around some products, mostly the
            ones from SPAR, didn't match those ambitions<SentenceDot /> The SWOT and DESTEP analyses showed that this
            weak spot was also a chance.
          </p>
        </section>
        <div className="ed-col">
          <p>
            People want packaging they can reuse or compost, and they want to know more about their
            food<SentenceDot /> Flex Delivery could stand out by trying ideas like FreshTag<SentenceDot /> A label that changes
            colour could help people eat food while it's still good, so they don't throw it away just
            because of the date<SentenceDot /> Together with better packaging and clear sourcing, that could cut
            waste and maybe push bigger distributors to change too<SentenceDot /> It's still a concept that needs
            more work and approval, and it shows one way to make grocery delivery more circular.
          </p>
          <p className="ed-note works-project-cover-note">
            The report had to use the original cover. The portfolio cover below is a simpler redesign of it.
          </p>
        </div>
      </div>

      <section className="ed-gallery ed-gallery--covers" aria-label="Flex Delivery report covers">
        {covers.map((cover) => (
          <EditorialFigure key={cover.file} file={cover.file} alt={cover.alt} caption={cover.caption} eager />
        ))}
      </section>
    </main>
  );
};
