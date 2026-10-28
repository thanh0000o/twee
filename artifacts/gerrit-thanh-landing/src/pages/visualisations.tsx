import { type FC, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { BlogReturnLink } from '../components/blog-return-link';
import { getSavedPaletteFilter } from '../palette';

import img1 from '@/assets/visualisations/01.jpg';
import img2 from '@/assets/visualisations/02.jpg';
import img3 from '@/assets/visualisations/03.jpg';
import img4 from '@/assets/visualisations/04.jpg';
import img5 from '@/assets/visualisations/05.jpg';
import img6 from '@/assets/visualisations/06.jpg';
import img7 from '@/assets/visualisations/07.jpg';
import img8 from '@/assets/visualisations/08.jpg';
import img9 from '@/assets/visualisations/09.jpg';
import img10 from '@/assets/visualisations/10.jpg';
import img11 from '@/assets/visualisations/11.jpg';
import img12 from '@/assets/visualisations/12.jpg';
import img13 from '@/assets/visualisations/13.jpg';
import img14 from '@/assets/visualisations/14.jpg';
import img15 from '@/assets/visualisations/15.jpg';
import img16 from '@/assets/visualisations/16.jpg';
import img17 from '@/assets/visualisations/17.jpg';
import img18 from '@/assets/visualisations/18.jpg';
import img19 from '@/assets/visualisations/19.jpg';
import img20 from '@/assets/visualisations/20.jpg';
import img21 from '@/assets/visualisations/21.jpg';
import img22 from '@/assets/visualisations/22.jpg';
import img23 from '@/assets/visualisations/23.jpg';
import img24 from '@/assets/visualisations/24.jpg';
import img25 from '@/assets/visualisations/25.jpg';
import img26 from '@/assets/visualisations/26.jpg';
import img27 from '@/assets/visualisations/27.jpg';
import img28 from '@/assets/visualisations/28.jpg';
import img29 from '@/assets/visualisations/29.jpg';
import img30 from '@/assets/visualisations/30.jpg';
import img31 from '@/assets/visualisations/31.jpg';
import img32 from '@/assets/visualisations/32.jpg';
import img33 from '@/assets/visualisations/33.jpg';
import img34 from '@/assets/visualisations/34.jpg';
import img35 from '@/assets/visualisations/35.jpg';
import img36 from '@/assets/visualisations/36.jpg';
import img37 from '@/assets/visualisations/37.webp';
import img38 from '@/assets/visualisations/38.webp';
import img39 from '@/assets/visualisations/39.webp';
import img40 from '@/assets/visualisations/40.webp';
import img41 from '@/assets/visualisations/41.webp';
import img42 from '@/assets/visualisations/42.webp';
import img43 from '@/assets/visualisations/43.webp';
import img44 from '@/assets/visualisations/44.webp';
import img45 from '@/assets/visualisations/45.webp';
import img46 from '@/assets/visualisations/46.webp';
import img47 from '@/assets/visualisations/47.webp';
import img48 from '@/assets/visualisations/48.webp';
import img49 from '@/assets/visualisations/49.webp';
import img50 from '@/assets/visualisations/50.webp';
import img51 from '@/assets/visualisations/51.webp';
import img52 from '@/assets/visualisations/52.webp';
import img53 from '@/assets/visualisations/53.webp';
import img54 from '@/assets/visualisations/54.webp';
import img55 from '@/assets/visualisations/55.webp';
import img56 from '@/assets/visualisations/56.webp';
import img57 from '@/assets/visualisations/57.webp';
import img58 from '@/assets/visualisations/58.webp';
import img59 from '@/assets/visualisations/59.webp';
import img60 from '@/assets/visualisations/60.webp';
import img61 from '@/assets/visualisations/61.webp';
import img62 from '@/assets/visualisations/62.webp';
import img63 from '@/assets/visualisations/63.webp';
import img64 from '@/assets/visualisations/64.webp';
import img65 from '@/assets/visualisations/65.webp';
import img66 from '@/assets/visualisations/66.webp';
import img67 from '@/assets/visualisations/67.webp';
import img68 from '@/assets/visualisations/68.webp';
import img69 from '@/assets/visualisations/69.webp';
import img70 from '@/assets/visualisations/70.webp';
import img71 from '@/assets/visualisations/71.webp';
import img72 from '@/assets/visualisations/72.webp';
import img73 from '@/assets/visualisations/73.webp';
import img74 from '@/assets/visualisations/74.webp';
import img75 from '@/assets/visualisations/75.webp';
import img76 from '@/assets/visualisations/76.webp';
import img77 from '@/assets/visualisations/77.webp';
import img78 from '@/assets/visualisations/78.webp';
import img79 from '@/assets/visualisations/79.webp';
import img80 from '@/assets/visualisations/80.webp';
import img81 from '@/assets/visualisations/81.webp';
import img82 from '@/assets/visualisations/82.webp';
import img83 from '@/assets/visualisations/83.webp';
import img84 from '@/assets/visualisations/84.webp';
import img85 from '@/assets/visualisations/85.webp';
import img86 from '@/assets/visualisations/86.webp';
import img87 from '@/assets/visualisations/87.webp';
import img88 from '@/assets/visualisations/88.webp';
import img89 from '@/assets/visualisations/89.webp';
import img90 from '@/assets/visualisations/90.webp';
import img91 from '@/assets/visualisations/91.webp';
import img92 from '@/assets/visualisations/92.webp';
import img93 from '@/assets/visualisations/93.webp';
import img94 from '@/assets/visualisations/94.webp';
import img95 from '@/assets/visualisations/95.webp';
import img96 from '@/assets/visualisations/96.webp';
import img97 from '@/assets/visualisations/97.webp';
import img98 from '@/assets/visualisations/98.webp';
import img99 from '@/assets/visualisations/99.webp';
import img100 from '@/assets/visualisations/100.webp';
import img101 from '@/assets/visualisations/101.webp';
import img102 from '@/assets/visualisations/102.webp';
import img103 from '@/assets/visualisations/103.webp';
import img104 from '@/assets/visualisations/104.webp';
import img105 from '@/assets/visualisations/105.webp';
import img106 from '@/assets/visualisations/106.webp';
import img107 from '@/assets/visualisations/107.webp';
import img108 from '@/assets/visualisations/108.webp';
import img109 from '@/assets/visualisations/109.webp';
import img110 from '@/assets/visualisations/110.webp';
import img111 from '@/assets/visualisations/111.webp';
import img112 from '@/assets/visualisations/112.webp';
import img113 from '@/assets/visualisations/113.webp';
import img114 from '@/assets/visualisations/114.webp';
import img115 from '@/assets/visualisations/115.webp';
import img116 from '@/assets/visualisations/116.webp';
import img117 from '@/assets/visualisations/117.webp';
import img118 from '@/assets/visualisations/118.webp';
import img119 from '@/assets/visualisations/119.webp';
import img120 from '@/assets/visualisations/120.webp';
import img121 from '@/assets/visualisations/121.webp';
import img122 from '@/assets/visualisations/122.webp';
import img123 from '@/assets/visualisations/123.webp';
import img124 from '@/assets/visualisations/124.webp';
import img125 from '@/assets/visualisations/125.webp';
import img126 from '@/assets/visualisations/126.webp';
import img127 from '@/assets/visualisations/127.webp';
import img128 from '@/assets/visualisations/128.webp';
import img129 from '@/assets/visualisations/129.webp';
import img130 from '@/assets/visualisations/130.webp';
import img131 from '@/assets/visualisations/131.webp';
import img132 from '@/assets/visualisations/132.webp';
import img133 from '@/assets/visualisations/133.webp';
import img134 from '@/assets/visualisations/134.webp';
import img135 from '@/assets/visualisations/135.webp';
import img136 from '@/assets/visualisations/136.webp';
import img137 from '@/assets/visualisations/137.webp';
import img138 from '@/assets/visualisations/138.webp';
import img139 from '@/assets/visualisations/139.webp';
import img140 from '@/assets/visualisations/140.webp';
import img141 from '@/assets/visualisations/141.webp';
import img142 from '@/assets/visualisations/142.webp';
import img143 from '@/assets/visualisations/143.webp';
import img144 from '@/assets/visualisations/144.webp';
import img145 from '@/assets/visualisations/145.webp';
import img146 from '@/assets/visualisations/146.webp';
import img147 from '@/assets/visualisations/147.webp';
import img148 from '@/assets/visualisations/148.webp';
import img149 from '@/assets/visualisations/149.webp';
import img150 from '@/assets/visualisations/150.webp';
import img151 from '@/assets/visualisations/151.webp';
import img152 from '@/assets/visualisations/152.webp';
import img153 from '@/assets/visualisations/153.webp';
import img154 from '@/assets/visualisations/154.webp';
import img155 from '@/assets/visualisations/155.webp';
import img156 from '@/assets/visualisations/156.webp';
import img157 from '@/assets/visualisations/157.webp';
import img158 from '@/assets/visualisations/158.webp';
import img159 from '@/assets/visualisations/159.webp';
import img160 from '@/assets/visualisations/160.webp';
import img161 from '@/assets/visualisations/161.webp';
import img162 from '@/assets/visualisations/162.webp';
import img163 from '@/assets/visualisations/163.webp';
import img164 from '@/assets/visualisations/164.webp';
import img165 from '@/assets/visualisations/165.webp';
import img166 from '@/assets/visualisations/166.webp';
import img167 from '@/assets/visualisations/167.webp';
import img168 from '@/assets/visualisations/168.webp';
import img169 from '@/assets/visualisations/169.webp';
import img170 from '@/assets/visualisations/170.webp';
import img171 from '@/assets/visualisations/171.webp';
import img172 from '@/assets/visualisations/172.webp';
import img173 from '@/assets/visualisations/173.webp';
import img174 from '@/assets/visualisations/174.webp';
import img175 from '@/assets/visualisations/175.webp';
import img176 from '@/assets/visualisations/176.webp';
import img177 from '@/assets/visualisations/177.webp';
import img178 from '@/assets/visualisations/178.webp';
import img179 from '@/assets/visualisations/179.webp';
import img180 from '@/assets/visualisations/180.webp';
import img181 from '@/assets/visualisations/181.webp';
import img182 from '@/assets/visualisations/182.webp';
import img183 from '@/assets/visualisations/183.webp';
import img184 from '@/assets/visualisations/184.webp';
import img185 from '@/assets/visualisations/185.webp';
import img186 from '@/assets/visualisations/186.webp';
import img187 from '@/assets/visualisations/187.webp';
import img188 from '@/assets/visualisations/188.webp';
import img189 from '@/assets/visualisations/189.webp';
import img190 from '@/assets/visualisations/190.webp';
import img191 from '@/assets/visualisations/191.webp';
import img192 from '@/assets/visualisations/192.webp';
import img193 from '@/assets/visualisations/193.webp';
import img194 from '@/assets/visualisations/194.webp';
import img195 from '@/assets/visualisations/195.webp';
import img196 from '@/assets/visualisations/196.webp';
import img197 from '@/assets/visualisations/197.webp';
import img198 from '@/assets/visualisations/198.webp';
import img199 from '@/assets/visualisations/199.webp';
import img200 from '@/assets/visualisations/200.webp';
import img201 from '@/assets/visualisations/201.webp';
import img202 from '@/assets/visualisations/202.webp';
import img203 from '@/assets/visualisations/203.webp';
import img204 from '@/assets/visualisations/204.webp';
import img205 from '@/assets/visualisations/205.webp';
import img206 from '@/assets/visualisations/206.webp';
import img207 from '@/assets/visualisations/207.webp';
import img208 from '@/assets/visualisations/208.webp';
import img209 from '@/assets/visualisations/209.webp';
import img210 from '@/assets/visualisations/210.webp';
import img211 from '@/assets/visualisations/211.webp';
import img212 from '@/assets/visualisations/212.webp';
import img213 from '@/assets/visualisations/213.webp';
import img214 from '@/assets/visualisations/214.webp';
import img215 from '@/assets/visualisations/215.webp';
import img216 from '@/assets/visualisations/216.webp';
import img217 from '@/assets/visualisations/217.webp';
import img218 from '@/assets/visualisations/218.webp';
import img219 from '@/assets/visualisations/219.webp';
import img220 from '@/assets/visualisations/220.webp';
import img221 from '@/assets/visualisations/221.webp';
import img222 from '@/assets/visualisations/222.webp';
import img223 from '@/assets/visualisations/223.webp';

const visualisationSources = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
  img31, img32, img33, img34, img35, img36, img37, img38, img39, img40,
  img41, img42, img43, img44, img45, img46, img47, img48, img49, img50,
  img51, img52, img53, img54, img55, img56, img57, img58, img59, img60,
  img61, img62, img63, img64, img65, img66, img67, img68, img69, img70,
  img71, img72, img73, img74, img75, img76, img77, img78, img79, img80,
  img81, img82, img83, img84, img85, img86, img87, img88, img89, img90,
  img91, img92, img93, img94, img95, img96, img97, img98, img99, img100,
  img101, img102, img103, img104, img105, img106, img107, img108, img109,
  img110, img111, img112, img113, img114, img115, img116, img117, img118,
  img119, img120, img121, img122, img123, img124, img125, img126, img127,
  img128, img129, img130, img131, img132, img133, img134, img135, img136,
  img137, img138, img139, img140, img141, img142, img143, img144, img145,
  img146, img147, img148, img149, img150, img151, img152, img153, img154,
  img155, img156, img157, img158, img159, img160, img161, img162, img163,
  img164, img165, img166, img167, img168, img169, img170, img171, img172,
  img173, img174, img175, img176, img177, img178, img179, img180, img181,
  img182, img183, img184, img185, img186, img187, img188, img189, img190,
  img191, img192, img193, img194, img195, img196, img197, img198, img199,
  img200, img201, img202, img203, img204, img205, img206, img207, img208,
  img209, img210, img211, img212, img213, img214, img215, img216, img217,
  img218, img219, img220, img221
];

const FIXED_PREFIX_COUNT = 30;
const OPENING_IMAGES = [img222, img223];

function seededShuffle(items: readonly string[], seed: number): string[] {
  const shuffled = [...items];
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

const allVisualisations = [
  ...OPENING_IMAGES,
  ...visualisationSources.slice(0, FIXED_PREFIX_COUNT),
  ...seededShuffle(visualisationSources.slice(FIXED_PREFIX_COUNT), 0x51a7e),
];

const CHUNK_SIZE = 10;
const chunks: string[][] = [];
for (let i = 0; i < allVisualisations.length; i += CHUNK_SIZE) {
  chunks.push(allVisualisations.slice(i, i + CHUNK_SIZE));
}

const SCATTER = [
  { x: -18, y: -22, r: -0.7 },
  { x: 12, y: 16, r: 0.4 },
  { x: -8, y: -6, r: -0.25 },
  { x: 20, y: -18, r: 0.6 },
  { x: -14, y: 24, r: -0.45 },
  { x: 16, y: -8, r: 0.35 },
  { x: -22, y: 10, r: -0.6 },
  { x: 7, y: -25, r: 0.3 },
  { x: -5, y: 20, r: -0.2 },
  { x: 21, y: 5, r: 0.5 },
];

const LANDSCAPE_INDICES = new Set([8, 14, 16, 17, 19, 23, 24, 26, 27, 29, 30, 32, 54, 88, 103, 104, 105, 122, 123, 128, 131, 135, 139, 141, 143, 144, 148, 150, 152, 154, 155, 156, 157, 158, 159, 161, 162, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 196, 197, 199, 204, 206, 207, 208, 209, 213, 214, 215, 216, 217, 218, 219, 221]);
const LANDSCAPE_IMAGES = new Set(
  [img222, ...[...LANDSCAPE_INDICES].map((index) => visualisationSources[index - 1])],
);

export const Visualisations: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'visualisations — thanh lambeets';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <main className="viz-page visualisations-page relative !p-0">
      <nav className="subpage-return-links subpage-return-links--fixed" aria-label="Return navigation">
        <Link href="/" className="viz-return subpage-return" style={{ filter: getSavedPaletteFilter() }}>
          <span>{`{return home}`}</span>
        </Link>
        <BlogReturnLink />
      </nav>
      <h1 className="viz-page-title">{`{visualisations}`}</h1>
      
      <div className="viz-gallery">
        {chunks.map((chunk, chunkIndex) => (
          <section className="viz-grid-section" key={chunkIndex}>
            {chunk.map((src, itemIndex) => {
              const absoluteIndex = chunkIndex * CHUNK_SIZE + itemIndex;
              const scatter = SCATTER[(itemIndex + chunkIndex * 3) % SCATTER.length];
              return (
                <div className="viz-scatter-cell" key={src}>
                  <button
                    type="button"
                    className={`viz-item-container ${LANDSCAPE_IMAGES.has(src) ? 'is-landscape' : ''}`}
                    onClick={() => setActiveIndex(absoluteIndex)}
                    aria-label={`Open visualisation ${absoluteIndex + 1}`}
                    style={{
                      '--scatter-x': `${scatter.x}px`,
                      '--scatter-y': `${scatter.y}px`,
                      '--scatter-r': `${scatter.r}deg`,
                    } as React.CSSProperties}
                  >
                    <div className="viz-plate" aria-hidden="true" />
                    <img
                      src={src}
                      alt={`Visualisation ${absoluteIndex + 1}`}
                      className="viz-img"
                      loading={absoluteIndex > 9 ? 'lazy' : 'eager'}
                    />
                  </button>
                </div>
              );
            })}
          </section>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="viz-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualisation ${activeIndex + 1} of ${allVisualisations.length}`}
          onClick={() => setActiveIndex(null)}
        >
          <div className="viz-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <img
              src={allVisualisations[activeIndex]}
              alt={`Visualisation ${activeIndex + 1}`}
              className="viz-lightbox-image"
            />
            <button
              type="button"
              className="viz-lightbox-close"
              autoFocus
              onClick={() => setActiveIndex(null)}
            >
              {`{close}`}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
