import type { FC } from 'react';

// The curved line as a glossy glass tube with a gold edge, like the arc on old
// Flash-era sites (the menu spheres sit on it like beads). Same coordinates as the
// ink line, so the intro still draws it from the bottom up.
const CURVE =
  'M229.7,486.5L232.69,444.56C236.78,383.46,252.89,322.96,281.14,268.55C302.31,227.81,330.41,190.42,364.59,159.68C375.98,149.42,388.02,139.89,400.67,131.24' +
  'C414.3,122,428.2,113.62,442.82,104.33C501.53,68.43,561.15,34.12,620.96,0L626,-9';

export const CurveTubeDefs: FC = () => (
  <>
    {/* Both ends fade out, the top one softly into the white page. */}
    <linearGradient id="tube-ends" x1="0" y1="-9" x2="0" y2="490" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset=".16" stopColor="#fff" stopOpacity=".55" />
      <stop offset=".3" stopColor="#fff" stopOpacity="1" />
      <stop offset=".93" stopColor="#fff" stopOpacity="1" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <mask id="tube-ends-mask" maskUnits="userSpaceOnUse" x="180" y="-20" width="480" height="520">
      <rect x="180" y="-20" width="480" height="520" fill="url(#tube-ends)" />
    </mask>
    {/* The gold edge is widest in the middle and thins out towards both ends. */}
    <linearGradient id="tube-gold-reach" x1="0" y1="20" x2="0" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset=".3" stopColor="#fff" stopOpacity="1" />
      <stop offset=".75" stopColor="#fff" stopOpacity="1" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <mask id="tube-gold-mask" maskUnits="userSpaceOnUse" x="180" y="-20" width="480" height="520">
      <rect x="180" y="-20" width="480" height="520" fill="url(#tube-gold-reach)" />
    </mask>
    <linearGradient id="tube-gold" x1="230" y1="0" x2="620" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#7a5418" />
      <stop offset=".35" stopColor="#d9b36a" />
      <stop offset=".6" stopColor="#f3dfae" />
      <stop offset="1" stopColor="#b98a3c" />
    </linearGradient>
    <filter id="tube-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3.4" />
    </filter>
    <filter id="tube-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="1.1" />
    </filter>
  </>
);

export const CurveTube: FC<{ opening: boolean }> = ({ opening }) => (
  <g mask={opening ? 'url(#ink-tube)' : undefined} pointerEvents="none" aria-hidden="true">
    <g className="home-curve-tube" mask="url(#tube-ends-mask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Drop shadow: the tube floats a little above the page and the panel. */}
      <path d={CURVE} transform="translate(6 7.5)" stroke="#04102e" strokeWidth="12" opacity=".38" filter="url(#tube-shadow)" />
      {/* Gold edge on the outer side of the bend */}
      <g mask="url(#tube-gold-mask)">
        <path d={CURVE} transform="translate(-4.6 -3.6)" stroke="#3b2608" strokeWidth="7.4" opacity=".7" />
        <path d={CURVE} transform="translate(-4.6 -3.6)" stroke="url(#tube-gold)" strokeWidth="6" />
        <path d={CURVE} transform="translate(-6 -4.7)" stroke="#fff6dc" strokeWidth="1.1" opacity=".8" />
      </g>
      {/* The blue glass body, lit from the top left */}
      <path d={CURVE} stroke="#050d36" strokeWidth="11" />
      <path d={CURVE} stroke="#14318f" strokeWidth="9.4" />
      <path d={CURVE} transform="translate(-.8 -.7)" stroke="#2457d6" strokeWidth="6.4" />
      <path d={CURVE} transform="translate(-1.7 -1.4)" stroke="#6ea4ff" strokeWidth="3.2" filter="url(#tube-glow)" />
      <path d={CURVE} transform="translate(-2.1 -1.8)" stroke="#ffffff" strokeWidth="1.1" opacity=".9" />
      {/* Light bouncing up into the underside of the glass */}
      <path d={CURVE} transform="translate(2.8 2.4)" stroke="#5f8cff" strokeWidth="1" opacity=".55" />
    </g>
  </g>
);
