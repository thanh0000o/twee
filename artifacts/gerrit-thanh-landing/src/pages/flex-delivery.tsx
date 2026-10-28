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
      { selector: 'meta[name="description"]', content: 'An English overview and conclusion of Gerrit Thành Lambeets’s 2021–2022 trend report on Flex Delivery, circularity and food packaging.' },
      { selector: 'meta[property="og:title"]', content: 'Flex Delivery — Trend Report | Gerrit Thành Lambeets' },
      { selector: 'meta[property="og:description"]', content: 'A trend report on Flex Delivery, the circular economy and ideas to reduce food waste.' },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.content;
      if (element) element.content = content;
      return { element, previousContent };
    });

    document.title = 'Flex Delivery — Trend Report | Gerrit Thành Lambeets';
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
          <h2>Flex Delivery — Eco Circular Everything</h2>
          <p>
            I wrote this 2021–2022 trend report for a Trendwatching course in Idea &amp; Innovation Management<SentenceDot />
            It examines how Flex Delivery’s local grocery and drink delivery model fits into the shift
            towards a circular economy<SentenceDot /> At the time, the company worked with nearby producers and shops,
            delivered by electric vehicles and cargo bikes, and used returnable glass bottles and reusable
            bags to limit waste.
          </p>
        </article>
        <div className="ed-col">
          <p>
            The report focuses on the gap between that ambition and the plastic packaging still used for
            some products, especially items sourced through a local SPAR shop<SentenceDot /> I explored the business
            through a SWOT analysis, examined demographic, economic, social, technological, ecological and
            political factors through a DESTEP analysis, and looked at five examples of circular design for
            ideas that could help close that gap.
          </p>
          <p>
            My proposed direction draws on Rui Xu’s FreshTag: a colour-changing indicator that could
            communicate a food product’s actual freshness rather than relying only on a printed expiry
            date<SentenceDot /> The concept also considers natural-pigment printing and a QR code showing where a product
            comes from<SentenceDot /> This was a proposal, not a product Flex Delivery had launched<SentenceDot /> The report notes
            that developing and using such packaging would require investment and food-safety approval.
          </p>
        </div>
        <section className="ed-col works-project-conclusion" aria-labelledby="flex-conclusion">
          <h3 id="flex-conclusion">Conclusion — rewritten in English</h3>
          <p>
            I chose Flex Delivery because it had taken a more demanding path than conventional grocery
            delivery: working with local producers, using lower-energy transport and trying to reduce
            waste<SentenceDot /> Yet its sustainability ambitions were not fully reflected in the plastic packaging
            of some products, particularly those supplied through its SPAR partner<SentenceDot /> The SWOT and DESTEP
            analyses suggest that this challenge is also an opportunity.
          </p>
        </section>
        <div className="ed-col">
          <p>
            As consumers look for reusable or biodegradable packaging and clearer information about
            their food, Flex Delivery could distinguish itself by exploring ideas such as FreshTag<SentenceDot />
            Colour-changing freshness indicators might help people use food while it is still good,
            instead of discarding it solely because of a printed date<SentenceDot /> Combined with more responsible
            packaging and transparent sourcing, this approach could reduce waste and encourage larger
            distributors to rethink their practices<SentenceDot /> It remains a concept needing further development
            and approval, but points towards a more circular way to deliver everyday groceries.
          </p>
          <p className="ed-note works-project-cover-note">
            The original document cover was required for the report; the portfolio cover below is a simpler redesign.
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
