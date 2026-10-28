import { type CSSProperties, type FC } from 'react';
import collage from '../assets/about-urban/architectural-remix-hires.jpg';
import { WorkImagePreview } from './work-image-preview';
import '../styles/about-slices.css';

const ALT = 'Architectural remix: a sunlit glass-and-garden courtyard, grey layered architecture crossed by a luminous yellow axis, and a faceted glass tower.';

/** One panoramic composite, cut into fourteen vertical slices that rejoin left to right; each carries a small vertical offset. */
const SLICES = [
  { top: '#e6e6e4', bottom: '#dcdcda', y: '50%' },
  { top: '#dcdcda', bottom: '#e6e6e4', y: '46%' },
  { top: '#e6e6e4', bottom: '#cfcfcd', y: '54%' },
  { top: '#d4d4d2', bottom: '#e6e6e4', y: '48%' },
  { top: '#e6e6e4', bottom: '#d4d4d2', y: '56%' },
  { top: '#cfcfcd', bottom: '#e6e6e4', y: '44%' },
  { top: '#eef24a', bottom: '#eef24a', y: '52%' },
  { top: '#d4d4d2', bottom: '#cfcfcd', y: '47%' },
  { top: '#e6e6e4', bottom: '#d0d0ce', y: '55%' },
  { top: '#bdbdbb', bottom: '#e6e6e4', y: '45%' },
  { top: '#e6e6e4', bottom: '#bdbdbb', y: '53%' },
  { top: '#d0d0ce', bottom: '#e6e6e4', y: '49%' },
  { top: '#e6e6e4', bottom: '#d4d4d2', y: '57%' },
  { top: '#dcdcda', bottom: '#e6e6e4', y: '48%' },
];

export const AboutSlices: FC = () => (
  <figure
    className="about-slices"
    aria-label="An architectural collage cut into fourteen pleated slices"
    style={{ '--about-photo-count': SLICES.length } as CSSProperties}
  >
    <span className="about-slices-row" aria-hidden="true">
      {SLICES.map(({ top }, i) => <i key={`top-${i}`} className="about-slices-strip" style={{ background: top }} />)}
    </span>
    <span className="about-slices-row about-slices-photo ed-stage">
      {SLICES.map(({ y }, i) => (
        <span key={`slice-${i}`} className="about-slices-panel">
          <WorkImagePreview src={collage} alt={ALT} label={`Enlarge photograph: ${ALT} (section ${i + 1} of ${SLICES.length})`}>
            <span
              className="about-slices-image"
              role="img"
              aria-label={`${ALT} Section ${i + 1} of ${SLICES.length}.`}
              style={{ '--i': i, '--y': y, backgroundImage: `url(${collage})` } as CSSProperties}
            />
          </WorkImagePreview>
        </span>
      ))}
    </span>
    <span className="about-slices-row" aria-hidden="true">
      {SLICES.map(({ bottom }, i) => <i key={`bottom-${i}`} className="about-slices-strip" style={{ background: bottom }} />)}
    </span>
  </figure>
);
