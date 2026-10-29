import type { FC } from 'react';
import { Link } from 'wouter';
import { sortedPosts } from '../content/blog-posts';

/*
 * Old-school "Frutiger Aero" layer for the landing page, after a 2001 Japanese clinic site:
 * frosted mist in the panel, a glass orb hanging on the arc, a glossy rail for the menu
 * spheres, hairlines that run past the corners and a small "what's new" block underneath.
 * Everything is drawn in the same 1109.84 × 630.53 coordinate space as the page.
 */

export const AeroDefs: FC = () => (
  <>
    {/* Soft clouds, like frost on a window. */}
    <filter id="aero-frost" filterUnits="userSpaceOnUse" x="40" y="60" width="830" height="540">
      <feTurbulence type="fractalNoise" baseFrequency=".011 .019" numOctaves="4" seed="11" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.1 0 0 0 -.78" />
      <feGaussianBlur stdDeviation="1.2" />
    </filter>
    {/* Long vertical streaks: a misty birch forest seen through the glass. */}
    <filter id="aero-trees" filterUnits="userSpaceOnUse" x="230" y="130" width="595" height="316">
      <feTurbulence type="fractalNoise" baseFrequency=".045 .0012" numOctaves="2" seed="4" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3.2 0 0 0 -1.55" />
      <feGaussianBlur stdDeviation="1.1 7" />
    </filter>
    <linearGradient id="aero-frost-fade" x1="232" y1="0" x2="823" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity=".25" />
      <stop offset=".45" stopColor="#fff" stopOpacity=".55" />
      <stop offset="1" stopColor="#fff" stopOpacity="1" />
    </linearGradient>
    <mask id="aero-frost-mask" maskUnits="userSpaceOnUse" x="232" y="131" width="591" height="314">
      <rect x="232" y="131" width="591" height="314" fill="url(#aero-frost-fade)" />
    </mask>
    {/* Mist that spills out under the frame and fades into the white page. */}
    <radialGradient id="aero-spill-fade" gradientUnits="userSpaceOnUse" cx="250" cy="452" r="230"
      gradientTransform="translate(250 452) scale(1.25 .5) translate(-250 -452)">
      <stop offset="0" stopColor="#fff" stopOpacity="1" />
      <stop offset=".55" stopColor="#fff" stopOpacity=".45" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
    <mask id="aero-spill-mask" maskUnits="userSpaceOnUse" x="0" y="300" width="700" height="330">
      <rect x="0" y="300" width="700" height="330" fill="url(#aero-spill-fade)" />
    </mask>
    <radialGradient id="aero-spill-tint" gradientUnits="userSpaceOnUse" cx="250" cy="452" r="230"
      gradientTransform="translate(250 452) scale(1.25 .5) translate(-250 -452)">
      <stop offset="0" stopColor="#5d9fe0" stopOpacity=".55" />
      <stop offset=".6" stopColor="#a9d4f5" stopOpacity=".25" />
      <stop offset="1" stopColor="#d9efff" stopOpacity="0" />
    </radialGradient>

    {/* Light swooshes that fade in and out along their length. */}
    <linearGradient id="aero-swoosh" x1="260" y1="0" x2="823" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset=".35" stopColor="#fff" stopOpacity=".85" />
      <stop offset=".75" stopColor="#e6fbff" stopOpacity=".6" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <filter id="aero-glow" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="3.2" /></filter>

    {/* Glass bubbles. */}
    <radialGradient id="aero-bubble" cx=".5" cy=".5" r=".5">
      <stop offset="0" stopColor="#fff" stopOpacity=".02" />
      <stop offset=".72" stopColor="#dff6ff" stopOpacity=".1" />
      <stop offset=".93" stopColor="#ffffff" stopOpacity=".55" />
      <stop offset="1" stopColor="#ffffff" stopOpacity=".1" />
    </radialGradient>

    {/* The large glass orb. */}
    <radialGradient id="aero-orb-body" cx=".38" cy=".3" r=".78">
      <stop offset="0" stopColor="#f2fdff" />
      <stop offset=".22" stopColor="#9fdcf7" />
      <stop offset=".55" stopColor="#3b8fd6" />
      <stop offset=".85" stopColor="#0d4aa3" />
      <stop offset="1" stopColor="#062f78" />
    </radialGradient>
    <radialGradient id="aero-orb-glow" cx=".5" cy=".9" r=".55">
      <stop offset="0" stopColor="#c9fbff" stopOpacity=".95" />
      <stop offset=".6" stopColor="#7fe0ff" stopOpacity=".3" />
      <stop offset="1" stopColor="#7fe0ff" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="aero-orb-shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity=".95" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <clipPath id="aero-orb-clip"><circle cx="512" cy="92" r="31" /></clipPath>
    <filter id="aero-orb-shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4 2" /></filter>

    {/* Glossy rail for the menu spheres, fading to gold at the ends. */}
    <linearGradient id="aero-rail" x1="0" y1="112" x2="0" y2="466" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#b3925a" stopOpacity="0" />
      <stop offset=".08" stopColor="#b3925a" stopOpacity=".9" />
      <stop offset=".2" stopColor="#1d4fae" />
      <stop offset=".8" stopColor="#1d4fae" />
      <stop offset=".92" stopColor="#b3925a" stopOpacity=".9" />
      <stop offset="1" stopColor="#b3925a" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="aero-rail-shine" x1="0" y1="112" x2="0" y2="466" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset=".2" stopColor="#fff" stopOpacity=".85" />
      <stop offset=".8" stopColor="#fff" stopOpacity=".85" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  </>
);

/** Frost, forest streaks, light swooshes and a few bubbles, all inside the blue panel. */
export const AeroPanel: FC = () => (
  <g className="home-aero-late" clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true">
    <g mask="url(#aero-frost-mask)" style={{ mixBlendMode: 'screen' }}>
      <rect x="232" y="131" width="591" height="314" filter="url(#aero-trees)" opacity=".16" />
      <rect className="home-aero-mist" x="200" y="120" width="660" height="340" filter="url(#aero-frost)" opacity=".55" />
    </g>
    <g fill="none" strokeLinecap="round">
      <path d="M262 444C380 372 560 318 823 262" stroke="url(#aero-swoosh)" strokeWidth="7" opacity=".3" filter="url(#aero-glow)" />
      <path d="M262 444C380 372 560 318 823 262" stroke="url(#aero-swoosh)" strokeWidth=".9" opacity=".75" />
      <path d="M300 452C430 400 600 372 823 340" stroke="url(#aero-swoosh)" strokeWidth=".6" opacity=".5" />
    </g>
    <g className="home-aero-bubbles">
      {[[702, 205, 9], [742, 298, 5], [664, 382, 12], [758, 382, 6], [612, 425, 4.5], [748, 178, 3.5], [585, 352, 3]].map(([cx, cy, r], i) => (
        <g key={i} className="home-aero-bubble" style={{ animationDelay: `${i * -1.3}s` }}>
          <circle cx={cx} cy={cy} r={r} fill="url(#aero-bubble)" stroke="#fff" strokeOpacity=".35" strokeWidth=".4" />
          <ellipse cx={cx - r * .35} cy={cy - r * .45} rx={r * .38} ry={r * .2} fill="#fff" opacity=".8"
            transform={`rotate(-28 ${cx - r * .35} ${cy - r * .45})`} />
        </g>
      ))}
    </g>
  </g>
);

/** Misty colour that spills out of the frame under its bottom-left corner. */
export const AeroSpill: FC = () => (
  <g className="home-aero-late" pointerEvents="none" aria-hidden="true">
    <g mask="url(#aero-spill-mask)">
      <rect x="0" y="300" width="700" height="330" fill="url(#aero-spill-tint)" />
      <rect x="0" y="300" width="700" height="330" filter="url(#aero-frost)" opacity=".9" />
    </g>
  </g>
);

/** Hairlines that run past the corners of the frame, like crop marks. */
export const AeroHairlines: FC = () => (
  <g className="home-aero-late" fill="none" stroke="var(--color-border)" strokeWidth=".45" strokeOpacity=".55" pointerEvents="none" aria-hidden="true">
    <path d="M58 131.38H80.58M822.6 131.38H846M58 444.56H80.58M822.6 444.56H846" />
    <path d="M80.58 106V131.38M80.58 444.56V470M822.6 106V131.38M822.6 444.56V470" />
  </g>
);

/** The glass orb that hangs from the arc, with a small wave inside. */
export const AeroOrb: FC = () => (
  <g className="home-aero-orb" pointerEvents="none" aria-hidden="true">
    <ellipse cx="516" cy="126" rx="24" ry="3.2" fill="#06152e" opacity=".32" filter="url(#aero-orb-shadow)" />
    <circle cx="512" cy="92" r="31" fill="url(#aero-orb-body)" />
    <g clipPath="url(#aero-orb-clip)">
      <circle cx="512" cy="92" r="31" fill="url(#aero-orb-glow)" />
      <path d="M478 99c5.5-5 11-5 16.5 0s11 5 16.5 0 11-5 16.5 0 11 5 16.5 0" fill="none" stroke="#0a2c6e" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
      <path d="M478 103c5.5-5 11-5 16.5 0s11 5 16.5 0 11-5 16.5 0 11 5 16.5 0" fill="none" stroke="#dffaff" strokeWidth=".8" strokeLinecap="round" opacity=".55" />
      <ellipse cx="505" cy="72" rx="21" ry="11.5" fill="url(#aero-orb-shine)" opacity=".85" />
    </g>
    <circle cx="512" cy="92" r="31" fill="none" stroke="#03204f" strokeOpacity=".45" strokeWidth=".6" />
    <circle cx="528" cy="108" r="2" fill="#fff" opacity=".7" />
  </g>
);

/** Replaces the thin bracket next to the menu with a glossy rail. */
export const AeroRail: FC = () => (
  <g className="home-aero-late" pointerEvents="none" aria-hidden="true">
    <line x1="795.1" y1="112" x2="795.1" y2="466" stroke="#06152e" strokeOpacity=".25" strokeWidth="3.4" filter="url(#aero-glow)" />
    <line x1="795.1" y1="112" x2="795.1" y2="466" stroke="url(#aero-rail)" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="794.5" y1="112" x2="794.5" y2="466" stroke="url(#aero-rail-shine)" strokeWidth=".7" />
  </g>
);

const shortDate = (dateTime: string) => {
  const [year, month, day] = dateTime.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

/** "What's new" with the latest blog posts, and a copyright line, like a 2001 homepage. */
export const AeroNews: FC = () => {
  const latest = sortedPosts().slice(0, 2);
  return (
    <div className="home-aero-news home-aero-late">
      <p className="home-aero-news-title">what&apos;s new</p>
      <ul>
        {latest.map((post) => (
          <li key={post.slug}>
            <Link href="/blog-links">{post.title}</Link>
            <span> ({shortDate(post.dateTime)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AeroCopyright: FC = () => (
  <p className="home-aero-copyright home-aero-late">copyright © {new Date().getFullYear()} thành lambeets, all rights reserved.</p>
);

