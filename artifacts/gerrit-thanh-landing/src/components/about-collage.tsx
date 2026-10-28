import type { FC } from 'react';
import '../styles/about-collage.css';

const base = import.meta.env.BASE_URL;
const SRC = `${base}resume/portrait-collage-colour.webp`;

// [destX, destY, width, height, srcX, srcY]: same scale, shifted copies of real pixels.
type S = [number, number, number, number, number, number];

const slices: S[] = [
  [40, 96, 170, 64, 70, 80], // hair, nudged left
  [262, 176, 34, 96, 262, 138], // forehead slice dropped
  [122, 266, 380, 64, 100, 266], // eye band, shifted right, both eyes intact
  [150, 342, 110, 62, 126, 350], // left cheek block
  [316, 352, 44, 120, 316, 322], // nose slice dropped
  [392, 336, 88, 110, 398, 304], // right cheek and ear edge
  [214, 432, 180, 48, 200, 420], // mouth, shifted
  [176, 534, 200, 44, 196, 514], // chin and beard
];

export const AboutCollage: FC = () => (
  <div className="about-collage" role="img" aria-label="Colour portrait of Thành, split into shifted fragments with both eyes clearly visible.">
    <svg viewBox="0 0 580 613" aria-hidden="true">
      <image href={SRC} width="580" height="613" />
      {slices.map(([x, y, w, h, sx, sy], i) => (
        <svg key={i} x={x} y={y} width={w} height={h} viewBox={`${sx} ${sy} ${w} ${h}`} preserveAspectRatio="none">
          <image href={SRC} width="580" height="613" />
        </svg>
      ))}
    </svg>
  </div>
);
