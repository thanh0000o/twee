import type { FC } from 'react';

// Theme aero: a moving Wii-menu / Frutiger Aero sky, drawn in the panel's own coordinates
// (x 232-823, y 131-445). Everything moves with CSS so it stays light on the page.

const BUBBLES = [
  { x: 300, r: 9, d: 15, delay: -2 }, { x: 345, r: 5, d: 11, delay: -7 }, { x: 390, r: 13, d: 19, delay: -12 },
  { x: 440, r: 6, d: 13, delay: -4 }, { x: 500, r: 10, d: 17, delay: -9 }, { x: 560, r: 4, d: 10, delay: -1 },
  { x: 610, r: 15, d: 22, delay: -15 }, { x: 660, r: 7, d: 14, delay: -6 }, { x: 705, r: 11, d: 18, delay: -11 },
  { x: 750, r: 5, d: 12, delay: -3 }, { x: 790, r: 8, d: 16, delay: -8 }, { x: 470, r: 3.5, d: 9, delay: -5 },
  { x: 580, r: 6, d: 13, delay: -10 }, { x: 680, r: 3, d: 9, delay: -2.5 },
];

const SPARKLES = [
  { x: 720, y: 175, s: 7, delay: 0 }, { x: 640, y: 330, s: 9, delay: -1.6 },
  { x: 785, y: 300, s: 5, delay: -3.1 }, { x: 520, y: 205, s: 4.5, delay: -2.2 },
  { x: 760, y: 410, s: 4, delay: -0.8 },
];

const ribbon = (y: number, amp: number) =>
  `M150,${y} C300,${y - amp} 420,${y + amp} 560,${y} S780,${y - amp} 920,${y + amp * 0.4} L920,${y + 26} C780,${y - amp + 26} 700,${y + amp + 26} 560,${y + 26} S300,${y - amp + 26} 150,${y + 26} Z`;

export const AeroDefs: FC = () => (
  <>
    <linearGradient id="aero-sky" x1="232" y1="131" x2="823" y2="445" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset=".45" stopColor="#eef8fd" />
      <stop offset=".8" stopColor="#c9ebfa" />
      <stop offset="1" stopColor="#9fd9f5" />
    </linearGradient>
    <radialGradient id="aero-glow" cx="700" cy="170" r="260" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="aero-ribbon-a" x1="150" y1="0" x2="920" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#34beed" stopOpacity="0" />
      <stop offset=".35" stopColor="#34beed" stopOpacity=".55" />
      <stop offset=".7" stopColor="#7fd6f7" stopOpacity=".4" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="aero-ribbon-b" x1="150" y1="0" x2="920" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
      <stop offset=".4" stopColor="#ffffff" stopOpacity=".9" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="aero-bubble" cx=".35" cy=".3" r=".75">
      <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
      <stop offset=".25" stopColor="#ffffff" stopOpacity=".25" />
      <stop offset=".75" stopColor="#bfeafb" stopOpacity=".15" />
      <stop offset=".93" stopColor="#5fcaf2" stopOpacity=".55" />
      <stop offset="1" stopColor="#ffffff" stopOpacity=".9" />
    </radialGradient>
    <linearGradient id="aero-sweep" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
      <stop offset=".5" stopColor="#ffffff" stopOpacity=".75" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <pattern id="aero-dots" width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="4.5" cy="4.5" r="1.7" fill="#ffffff" />
    </pattern>
    <linearGradient id="aero-dots-fade" x1="232" y1="0" x2="823" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset=".45" stopColor="#fff" stopOpacity=".2" />
      <stop offset="1" stopColor="#fff" stopOpacity="1" />
    </linearGradient>
    <mask id="aero-dots-mask" maskUnits="userSpaceOnUse" x="232" y="131" width="591" height="314">
      <path d="M232,330 C380,250 520,330 823,220 L823,360 C560,440 400,350 232,420 Z" fill="url(#aero-dots-fade)" />
    </mask>
    <filter id="aero-soft" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="5" /></filter>
  </>
);

export const AeroPanel: FC = () => (
  <g className="aero-panel" aria-hidden="true">
    <rect x="232" y="131" width="591" height="314" fill="url(#aero-sky)" />
    <rect x="232" y="131" width="591" height="314" fill="url(#aero-glow)" className="aero-breathe" />

    {/* the Wii swoosh: soft blue waves that keep flowing */}
    <g className="aero-wave aero-wave-1"><path d={ribbon(350, 38)} fill="url(#aero-ribbon-a)" filter="url(#aero-soft)" /></g>
    <g className="aero-wave aero-wave-2"><path d={ribbon(385, 30)} fill="url(#aero-ribbon-a)" opacity=".7" /></g>
    <g className="aero-wave aero-wave-3"><path d={ribbon(318, 44)} fill="url(#aero-ribbon-b)" opacity=".85" /></g>
    <g className="aero-wave aero-wave-4"><path d={ribbon(405, 24)} fill="url(#aero-ribbon-b)" opacity=".7" /></g>

    {/* halftone dots that drift along the wave */}
    <g mask="url(#aero-dots-mask)">
      <rect className="aero-dots" x="200" y="131" width="680" height="314" fill="url(#aero-dots)" opacity=".85" />
    </g>

    {/* glass bubbles rising */}
    {BUBBLES.map((b, i) => (
      <g key={i} className="aero-bubble" style={{ animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }}>
        <circle cx={b.x} cy={465} r={b.r} fill="url(#aero-bubble)" stroke="#ffffff" strokeOpacity=".8" strokeWidth=".6" />
      </g>
    ))}

    {/* twinkles */}
    {SPARKLES.map((s, i) => (
      <g key={i} className="aero-twinkle" style={{ animationDelay: `${s.delay}s`, transformOrigin: `${s.x}px ${s.y}px` }}>
        <path d={`M${s.x},${s.y - s.s * 2} L${s.x + s.s * .22},${s.y - s.s * .22} L${s.x + s.s * 2},${s.y} L${s.x + s.s * .22},${s.y + s.s * .22} L${s.x},${s.y + s.s * 2} L${s.x - s.s * .22},${s.y + s.s * .22} L${s.x - s.s * 2},${s.y} L${s.x - s.s * .22},${s.y - s.s * .22} Z`} fill="#ffffff" />
        <circle cx={s.x} cy={s.y} r={s.s * .9} fill="#ffffff" opacity=".6" filter="url(#aero-soft)" />
      </g>
    ))}

    {/* a slow band of light that sweeps across */}
    <g className="aero-sweep"><rect x="232" y="100" width="120" height="380" fill="url(#aero-sweep)" transform="skewX(-18)" /></g>
  </g>
);
