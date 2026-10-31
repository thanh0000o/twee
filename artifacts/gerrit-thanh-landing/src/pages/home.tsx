import { type FC, useEffect, useState } from 'react';
import { Link } from 'wouter';
import asset9 from '@assets/Asset_9_1788291702405.png';
import ovalSignal from '../assets/oval-signal-transparent.png';
import { DepthDotPattern } from '../components/depth-dot-pattern';
import { InkDefs } from '../components/home-ink-masks';
import { BubbleReveal, EntryDefs } from '../components/home-entry-masks';
import { CopyParagraph } from '../components/copy-paragraph';
import { VisitorCount } from '../components/visitor-count';
import { PALETTES, getSavedPaletteIndex, savePaletteIndex, getPaletteLinkColor } from '../palette';
import '../styles/home-motion.css';

// Only a fresh load on the landing page can start the intro.
const enteredOnHome = window.location.pathname.replace(/\/+$/, '') === import.meta.env.BASE_URL.replace(/\/+$/, '');
let hasOpenedHome = !enteredOnHome;

// Test switches: ?scan=off and ?lowres=off turn the old-screen effects off for comparison.
const testParams = new URLSearchParams(window.location.search);
const showScanlines = testParams.get('scan') !== 'off';
const showLowRes = testParams.get('lowres') !== 'off';

export const Home: FC = () => {
  const [opening, setOpening] = useState(() => !hasOpenedHome && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    hasOpenedHome = true;
    if (!opening) return;
    // The final label glow ends at 2.9s. Remove all intro styles afterwards
    // so hover, theme changes and ordinary browsing cannot restart them.
    const timer = window.setTimeout(() => setOpening(false), 3000);
    return () => window.clearTimeout(timer);
  }, [opening]);
  const [paletteIndex, setPaletteIndex] = useState(getSavedPaletteIndex);
  const activePaletteIndex = PALETTES[paletteIndex] ? paletteIndex : 0;
  const palette = PALETTES[activePaletteIndex];
  const nextPalette = PALETTES[(activePaletteIndex + 1) % PALETTES.length];
  const centerAccent = activePaletteIndex === 0 ? undefined : getPaletteLinkColor(palette.name);
  const cyclePalette = () => {
    const nextIndex = (activePaletteIndex + 1) % PALETTES.length;
    setPaletteIndex(nextIndex);
    savePaletteIndex(nextIndex);
  };
  return (
    <div className="home-page min-h-screen w-full flex items-center justify-center overflow-hidden bg-white" data-palette={palette.name} data-opening={opening}>
      <div 
        className="home-canvas w-full max-w-[1109.84px] bg-[#ffffff] relative"
        style={{ 
          containerType: 'inline-size', 
          aspectRatio: '1109.84 / 630.53',
          boxShadow: 'none'
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            '--u': 'calc(100cqi / 1109.84)',
            fontFamily: 'var(--font-body)',
            transform: 'translate(9.3%, 3%)',
            filter: palette.filter,
          } as React.CSSProperties}
        >
          {/* Main SVG Background Outlines & Shapes */}
          <svg width="100%" height="100%" viewBox="0 0 1109.84 630.53" className="absolute top-0 left-0 pointer-events-none z-0">
            <defs>
              <linearGradient id="flash-panel-blue" x1="232.67" y1="287.95" x2="822.6" y2="287.95" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#031b49" />
                <stop offset=".34" stopColor="#073c91" />
                <stop offset=".58" stopColor="#176ec0" />
                <stop offset=".82" stopColor="#42a8dc" />
                <stop offset="1" stopColor="#d9f3ff" />
              </linearGradient>
              <linearGradient id="flash-panel-gloss" x1="0" y1="131.35" x2="0" y2="444.55" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".28" />
                <stop offset=".16" stopColor="#ffffff" stopOpacity=".08" />
                <stop offset=".34" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="curve-ink-fade" x1="0" y1="0" x2="0" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--color-border)" stopOpacity="0" />
                <stop offset=".15" stopColor="var(--color-border)" stopOpacity=".12" />
                <stop offset=".4" stopColor="var(--color-border)" stopOpacity=".55" />
                <stop offset=".7" stopColor="var(--color-border)" stopOpacity=".9" />
                <stop offset="1" stopColor="var(--color-border)" stopOpacity="1" />
              </linearGradient>
              <pattern id="halftone-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="1.35" fill="#397eba" />
              </pattern>
              <DepthDotPattern />
              {/* Fine horizontal scanlines, like an old screen or a grabbed video frame. */}
              <pattern id="home-scanlines" width="4" height="2.4" patternUnits="userSpaceOnUse">
                <rect width="4" height="1.1" fill="#ffffff" opacity=".13" />
                <rect y="1.2" width="4" height=".8" fill="#000a2a" opacity=".1" />
              </pattern>
              {/* Lower resolution: sample the panel in small blocks and reduce the number of colours. */}
              <filter id="home-lowres" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="212" y="111" width="631" height="354" colorInterpolationFilters="sRGB">
                <feFlood x="213" y="112" width="1" height="1" floodColor="#000" result="dot" />
                <feComposite in="dot" in2="dot" operator="over" x="212" y="111" width="1.9" height="1.9" result="cell" />
                <feTile in="cell" result="grid" />
                <feComposite in="SourceGraphic" in2="grid" operator="in" result="sampled" />
                <feMorphology in="sampled" operator="dilate" radius=".95" result="blocks" />
                <feComponentTransfer in="blocks">
                  <feFuncR type="discrete" tableValues="0 0.043 0.087 0.130 0.174 0.217 0.261 0.304 0.348 0.391 0.435 0.478 0.522 0.565 0.609 0.652 0.696 0.739 0.783 0.826 0.870 0.913 0.957 1" />
                  <feFuncG type="discrete" tableValues="0 0.043 0.087 0.130 0.174 0.217 0.261 0.304 0.348 0.391 0.435 0.478 0.522 0.565 0.609 0.652 0.696 0.739 0.783 0.826 0.870 0.913 0.957 1" />
                  <feFuncB type="discrete" tableValues="0 0.043 0.087 0.130 0.174 0.217 0.261 0.304 0.348 0.391 0.435 0.478 0.522 0.565 0.609 0.652 0.696 0.739 0.783 0.826 0.870 0.913 0.957 1" />
                </feComponentTransfer>
              </filter>
              <linearGradient id="home-scan-band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <stop offset=".5" stopColor="#e8f6ff" stopOpacity=".09" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              {opening && <EntryDefs />}
              {opening && <InkDefs />}
              <linearGradient id="halftone-fade" x1="82" y1="0" x2="338" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#000000" stopOpacity="0" />
                <stop offset=".28" stopColor="#ffffff" stopOpacity=".12" />
                <stop offset=".62" stopColor="#ffffff" stopOpacity=".52" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
              <mask id="halftone-mask">
                <rect x="80" y="131.38" width="322" height="313.18" fill="url(#halftone-fade)" />
              </mask>
              <linearGradient id="oval-signal-fade-x" x1="230" y1="0" x2="822" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset=".35" stopColor="#fff" stopOpacity="1" />
                <stop offset=".62" stopColor="#fff" stopOpacity="1" />
                <stop offset=".8" stopColor="#fff" stopOpacity=".24" />
                <stop offset=".92" stopColor="#fff" stopOpacity=".08" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="oval-signal-fade-y" x1="0" y1="190" x2="0" y2="444" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset=".2" stopColor="#fff" stopOpacity="1" />
                <stop offset=".78" stopColor="#fff" stopOpacity=".9" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id="oval-signal-mask" maskUnits="userSpaceOnUse" x="230" y="190" width="592" height="254">
                <rect x="230" y="190" width="592" height="254" fill="url(#oval-signal-fade-x)" />
              </mask>
              <mask id="oval-signal-vertical-mask" maskUnits="userSpaceOnUse" x="230" y="190" width="592" height="254">
                <rect x="230" y="190" width="592" height="254" fill="url(#oval-signal-fade-y)" />
              </mask>
              <filter id="oval-blur-core" x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation="9 3.5" />
              </filter>
              <filter id="oval-motion-trail" x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="22 1.2" />
              </filter>
              <filter id="oval-soft-edge" x="-5%" y="-20%" width="110%" height="140%">
                <feGaussianBlur stdDeviation="1.1 .5" />
              </filter>
              <radialGradient id="panel-orb-light" gradientUnits="userSpaceOnUse" cx="690" cy="200" r="330" gradientTransform="translate(690 200) scale(1 .62) translate(-690 -200)">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".46" />
                <stop offset=".5" stopColor="#dff6ff" stopOpacity=".14" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="panel-floor-shade" x1="0" y1="330" x2="0" y2="444.55" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#031b49" stopOpacity="0" />
                <stop offset="1" stopColor="#031b49" stopOpacity=".39" />
              </linearGradient>
              <linearGradient id="panel-curve-shade" x1="232" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#020f2c" stopOpacity=".5" />
                <stop offset="1" stopColor="#020f2c" stopOpacity="0" />
              </linearGradient>
              <filter id="panel-cast-shadow" x="-12%" y="-18%" width="132%" height="155%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceAlpha" stdDeviation="16 11" result="wideBlur" />
                <feOffset in="wideBlur" dx="0" dy="17" result="wideOffset" />
                <feFlood floodColor="#06152e" floodOpacity=".56" result="wideColor" />
                <feComposite in="wideColor" in2="wideOffset" operator="in" result="wideShadow" />
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="contactBlur" />
                <feOffset in="contactBlur" dx="0" dy="5" result="contactOffset" />
                <feFlood floodColor="#020a1b" floodOpacity=".4" result="contactColor" />
                <feComposite in="contactColor" in2="contactOffset" operator="in" result="contactShadow" />
                <feMerge>
                  <feMergeNode in="wideShadow" />
                  <feMergeNode in="contactShadow" />
                </feMerge>
              </filter>
              <filter id="oval-depth-shadow" x="-10%" y="-30%" width="120%" height="170%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5 3" result="b" />
                <feOffset in="b" dx="0" dy="6" result="o" />
                <feFlood floodColor="#031b49" floodOpacity="1" />
                <feComposite in2="o" operator="in" />
              </filter>
              <filter id="oval-rim-light" x="-10%" y="-30%" width="120%" height="170%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.6 1" result="b" />
                <feOffset in="b" dx="-1.5" dy="-2.5" result="o" />
                <feFlood floodColor="#ffffff" floodOpacity="1" />
                <feComposite in2="o" operator="in" />
              </filter>
              <linearGradient id="bevel-light-fade" x1="0" y1="131" x2="0" y2="445" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <stop offset=".15" stopColor="#e9faff" stopOpacity=".22" />
                <stop offset=".35" stopColor="#d8f6ff" stopOpacity=".68" />
                <stop offset=".55" stopColor="#c5f0fc" stopOpacity=".65" />
                <stop offset=".75" stopColor="#afe9f8" stopOpacity=".4" />
                <stop offset=".9" stopColor="#9fe4f7" stopOpacity=".12" />
                <stop offset="1" stopColor="#9fe4f7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="bevel-top-lip" x1="0" y1="131.4" x2="0" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".42" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <filter id="bevel-blur-wide" x="-40%" y="-20%" width="180%" height="140%"><feGaussianBlur stdDeviation="16" /></filter>
              <filter id="bevel-blur-mid" x="-40%" y="-15%" width="180%" height="130%"><feGaussianBlur stdDeviation="9" /></filter>
              <filter id="oval-relief-spec" x="-5%" y="-15%" width="110%" height="130%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.6 1.8" result="bump" />
                <feSpecularLighting in="bump" surfaceScale="9" specularConstant="1" specularExponent="30" lightingColor="#f2ffff" result="spec">
                  <feDistantLight azimuth="225" elevation="34" />
                </feSpecularLighting>
                <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
                <feGaussianBlur in="SourceAlpha" stdDeviation="8 4" result="lens" />
                <feFlood floodColor="#bdf0ff" floodOpacity=".55" />
                <feComposite in2="lens" operator="in" result="lensGlow" />
                <feComposite in="lensGlow" in2="SourceAlpha" operator="in" result="lensIn" />
                <feMerge><feMergeNode in="lensIn" /><feMergeNode in="specIn" /></feMerge>
              </filter>
              <filter id="oval-relief-shade" x="-5%" y="-15%" width="110%" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.2 1.6" result="b" />
                <feOffset in="b" dx="-4" dy="-3.5" result="o" />
                <feComposite in="SourceAlpha" in2="o" operator="out" result="edge" />
                <feGaussianBlur in="edge" stdDeviation="1.4" result="edgeSoft" />
                <feFlood floodColor="#031b49" floodOpacity="1" />
                <feComposite in2="edgeSoft" operator="in" />
              </filter>
              <filter id="oval-cast-shadow" x="-10%" y="-30%" width="120%" height="170%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6 3.5" result="b" />
                <feOffset in="b" dx="10" dy="9" result="o" />
                <feFlood floodColor="#020f2c" floodOpacity="1" />
                <feComposite in2="o" operator="in" />
              </filter>
              <clipPath id="white-side-clip">
                <path d="M232.69,444.56H80.58V131.38h320.17c-26.34,17.95-78.2,58.81-118.34,134.81-38.71,73.28-47.38,143-49.72,178.36Z" />
              </clipPath>
              <clipPath id="blue-panel-clip">
                <path d="M822.6,444.55H232.67c3.09-40.8,15.1-133.63,74.69-219.93,32.11-46.51,67.41-75.73,93.15-93.27h422.1v313.21Z" />
              </clipPath>
            </defs>

            {/* Soft cast shadow lifts the curved glass panel from the white page. */}
            <path
              className="home-panel-shadow"
              d="M822.6,444.55H232.67c3.09-40.8,15.1-133.63,74.69-219.93,32.11-46.51,67.41-75.73,93.15-93.27h422.1v313.21Z"
              fill="#06152e"
              filter="url(#panel-cast-shadow)"
              pointerEvents="none"
              aria-hidden="true"
            />
            {/* Dreamweaver/Flash-era panel depth, clipped by the exact Illustrator curve */}
            <g className="home-panel-reveal" clipPath="url(#blue-panel-clip)" mask={opening ? "url(#entry-wipe)" : undefined}>
            <g className="home-gradient-arrival" filter={showLowRes ? 'url(#home-lowres)' : undefined}>
            <path d="M822.6,444.55H232.67c3.09-40.8,15.1-133.63,74.69-219.93,32.11-46.51,67.41-75.73,93.15-93.27h422.1v313.21Z" fill="url(#flash-panel-blue)" stroke="#182c48" strokeWidth=".75" />
            <path d="M822.6,444.55H232.67c3.09-40.8,15.1-133.63,74.69-219.93,32.11-46.51,67.41-75.73,93.15-93.27h422.1v313.21Z" fill="url(#flash-panel-gloss)" />
            {/* Spatial shading: soft top-right light, grounded floor shade, inner shade along the curve */}
            <g clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true">
              <rect className="home-ambient-light" x="212" y="111" width="631" height="354" fill="url(#panel-orb-light)" />
              <rect x="232" y="330" width="591" height="115" fill="url(#panel-floor-shade)" />
              <rect x="232" y="131" width="190" height="314" fill="url(#panel-curve-shade)" />
            </g>
            {/* Mirrored oval signal: fuller on the light right side, tapering into the dark left. */}
            <g clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true" opacity=".54" style={{ mixBlendMode: 'multiply' }}>
              <g mask="url(#oval-signal-mask)">
                <g mask="url(#oval-signal-vertical-mask)">
                  {/* Keep masks in scene coordinates; mirror only the PNG and its trails. */}
                  <g className="home-oval-drift">
                    <BubbleReveal opening={opening}>
                  <g transform="translate(972 0) scale(-1 1)">
                    <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" opacity=".4" filter="url(#oval-depth-shadow)" />
                    <image href={ovalSignal} x="138" y="188" width="744" height="256.7" preserveAspectRatio="none" opacity=".22" filter="url(#oval-motion-trail)" />
                    <image href={ovalSignal} x="154" y="193" width="744" height="256.7" preserveAspectRatio="none" opacity=".16" filter="url(#oval-motion-trail)" />
                    <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" opacity=".5" filter="url(#oval-blur-core)" />
                    <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" opacity=".32" filter="url(#oval-soft-edge)" />
                  </g>
                    </BubbleReveal>
                  </g>
                </g>
              </g>
            </g>

            {/* Soft rim light on the oval shapes */}
            <g clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true" opacity=".45" style={{ mixBlendMode: 'screen' }}>
              <g mask="url(#oval-signal-mask)">
                <g mask="url(#oval-signal-vertical-mask)">
                  <g className="home-oval-drift">
                    <BubbleReveal opening={opening}>
                  <g transform="translate(972 0) scale(-1 1)">
                    <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" opacity=".48" filter="url(#oval-rim-light)" />
                  </g>
                    </BubbleReveal>
                  </g>
                </g>
              </g>
            </g>

            {/* Continuous glass roll-off: one broad reflection, without narrow parallel rim bands. */}
            <g clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true" fill="none" strokeLinecap="round">
              <path d="M232.67,444.55c3.09-40.8,15.1-133.63,74.69-219.93,32.11-46.51,67.41-75.73,93.15-93.27" transform="translate(20 1)" stroke="#020f2c" strokeWidth="48" opacity=".19" filter="url(#bevel-blur-wide)" />
              <g style={{ mixBlendMode: 'screen' }}>
                <path d="M232.67,444.55c3.09-40.8,15.1-133.63,74.69-219.93,32.11-46.51,67.41-75.73,93.15-93.27" transform="translate(6 0)" stroke="url(#bevel-light-fade)" strokeWidth="32" opacity=".68" filter="url(#bevel-blur-mid)" />
                <rect x="232" y="131.4" width="591" height="8.6" fill="url(#bevel-top-lip)" filter="url(#bevel-blur-mid)" />
              </g>
            </g>

            {/* Unified relief: the actual oval alpha lit by one top-right light (cast shadow, shaded flank, specular + lens glow) */}
            <g clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true">
              <g mask="url(#oval-signal-mask)">
                <g mask="url(#oval-signal-vertical-mask)">
                  <g className="home-oval-drift">
                    <BubbleReveal opening={opening}>
                  <g transform="translate(972 0) scale(-1 1)">
                    <g opacity=".3" style={{ mixBlendMode: 'multiply' }}>
                      <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" filter="url(#oval-cast-shadow)" />
                    </g>
                    <g opacity=".47" style={{ mixBlendMode: 'multiply' }}>
                      <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" filter="url(#oval-relief-shade)" />
                    </g>
                    <g className="home-oval-reflection" opacity=".7" style={{ mixBlendMode: 'screen' }}>
                      <image href={ovalSignal} x="114" y="188" width="744" height="256.7" preserveAspectRatio="none" filter="url(#oval-relief-spec)" />
                    </g>
                  </g>
                    </BubbleReveal>
                  </g>
                </g>
              </g>
            </g>
            </g>

            </g>

            {showScanlines && (
              <g className="home-scan" clipPath="url(#blue-panel-clip)" pointerEvents="none" aria-hidden="true">
                {/* The lines crawl down one step at a time and a soft bright band rolls over the screen. */}
                <rect className="home-scan-lines" x="232" y="126" width="591" height="324" fill="url(#home-scanlines)" />
                <rect className="home-scan-band" x="232" y="60" width="591" height="46" fill="url(#home-scan-band)" />
              </g>
            )}

            {/* Inner box shape base */}
            <path className="home-side-fill" d="M232.69,444.56H80.58V131.38h320.17c-26.34,17.95-78.2,58.81-118.34,134.81-38.71,73.28-47.38,143-49.72,178.36Z" fill="#ffffff" /> 

            {/* White Engraved Highlights (Shifted 1px down and right) */}
            <g transform="translate(1, 1)" fill="rgba(255,255,255,0.9)">
              <path d="M232.69,444.56c-.07-.03-152.23.16-152.17,0-.09-.11-.07-313.26-.14-313.38.02-.11,320.29.12,320.37.04,0,0,.52,0,.52,0,0,0-.43.29-.43.29-12.65,8.63-24.69,18.14-36.08,28.38-33.5,30.03-61.05,66.52-82.19,106.17-29.02,55.08-45.71,116.43-49.89,178.49h0ZM232.69,444.56c4.09-61.1,20.2-121.6,48.45-176.01,21.17-40.74,49.27-78.13,83.45-108.87,11.39-10.26,23.43-19.79,36.08-28.44l.09.29s-320.17.04-320.17.04c.36-1.34.03,313.31.07,312.98-.38-.18,152.11.06,152.04,0h0Z" stroke="none" mask={opening ? "url(#ink-body)" : undefined} />
              <line x1="81.82" y1="113.46" x2="823.85" y2="113.46" stroke="rgba(255,255,255,0.9)" strokeWidth="1" mask={opening ? "url(#ink-header)" : undefined} />
              <path d="M231.86,481.02c-2.02-116.53,41.51-236.04,127.36-316.45,25.01-23.78,54.23-42.37,83.6-60.24,58.71-35.9,118.33-70.31,178.14-104.34-47.85,27.23-95.51,54.8-142.75,83.06-35.11,21.59-71.52,41.64-103.34,68.05-26.53,21.91-49.62,47.88-69.01,76.27-50.4,74.02-75.45,164.33-74,253.64h0Z" stroke="none" mask={opening ? "url(#ink-arc)" : undefined} />
              <polyline points="822.6 150.71 795.1 150.71 795.1 421.79 822.6 421.79" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" mask={opening ? "url(#ink-bracket)" : undefined} />
            </g>

            {/* Box outlines & curves (Black) */}
            <path className="home-frame-foundation" d="M232.69,444.56c-.07-.03-152.23.16-152.17,0-.09-.11-.07-313.26-.14-313.38.02-.11,320.29.12,320.37.04,0,0,.52,0,.52,0,0,0-.43.29-.43.29-12.65,8.63-24.69,18.14-36.08,28.38-33.5,30.03-61.05,66.52-82.19,106.17-29.02,55.08-45.71,116.43-49.89,178.49h0ZM232.69,444.56c4.09-61.1,20.2-121.6,48.45-176.01,21.17-40.74,49.27-78.13,83.45-108.87,11.39-10.26,23.43-19.79,36.08-28.44l.09.29s-320.17.04-320.17.04c.36-1.34.03,313.31.07,312.98-.38-.18,152.11.06,152.04,0h0Z" fill="var(--color-border)" mask={opening ? "url(#ink-body)" : undefined} />
            <line x1="81.82" y1="113.46" x2="823.85" y2="113.46" stroke="var(--color-border)" strokeWidth="0.8" mask={opening ? "url(#ink-header)" : undefined} />
            <path className="home-curve-reveal" mask={opening ? "url(#ink-arc)" : undefined} d="M400.75 131.38C414.3 122 428.2 113.62 442.82 104.33C501.53 68.43 561.15 34.12 620.96 0" fill="none" stroke="url(#curve-ink-fade)" strokeWidth="1" />
            <path d="M232.69 444.56L229.7 486.5" mask={opening ? "url(#ink-arc)" : undefined} fill="none" stroke="var(--color-border)" strokeWidth=".7" />
            <polyline points="822.6 150.71 795.1 150.71 795.1 421.79 822.6 421.79" fill="none" stroke="#647785" strokeWidth=".65" mask={opening ? "url(#ink-bracket)" : undefined} />
            {/* Draw the outer frame last so its left and bottom rules stay continuous over the white panel. */}
            <g fill="none" stroke="var(--color-border)" strokeWidth=".8" strokeOpacity=".85" pointerEvents="none" aria-hidden="true">
              <path className="home-frame-reveal" pathLength="1" d="M451.59 131.38H80.58V444.56H451.59" />
              <path className="home-frame-reveal home-frame-return" pathLength="1" d="M451.59 131.38H822.6V444.56H451.59" />
            </g>
            {/* Embedded Dots with subtle glassy/vector highlights */}
             <ellipse className="home-marker-reveal home-marker-red" cx="334.81" cy="189.38" rx="7.16" ry="8.37" fill="var(--color-accent-red)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
            <ellipse className="home-marker-reveal home-marker-ink" cx="287.23" cy="258.36" rx="7.16" ry="8.37" fill="var(--color-border)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
          </svg>

          {/* Text Layer */}
          <div className="home-copy-reveal absolute inset-0 pointer-events-none z-[3]">
            {/* Headers - Preserved top labels */}
            <div className="absolute whitespace-nowrap flash-text" style={{ left: 'calc(103.94 * var(--u))', top: 'calc(107.54 * var(--u))', transform: 'scaleX(1.2) translateY(-75%)', transformOrigin: 'left top', color: 'var(--color-border)', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'calc(13 * var(--u))', letterSpacing: 'calc(.25 * var(--u))' }}>{`{thành lambeets}`}</div>
            <div className="absolute whitespace-nowrap flash-text" style={{ left: 'calc(470 * var(--u))', top: 'calc(107.54 * var(--u))', width: 'calc(325 * var(--u))', textAlign: 'right', transform: 'scaleX(1.2) translateY(-75%)', transformOrigin: 'right top', color: 'var(--color-border)', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'calc(13 * var(--u))', letterSpacing: 'calc(.25 * var(--u))' }}>{`{my little corner of the internet}`}</div>
            
            {/* Central Typography Composition */}
            <div className="center-copy absolute flex flex-col" style={{ left: 'calc(340 * var(--u))', top: 'calc(150 * var(--u))', color: '#f5fbff', fontSize: 'calc(13 * var(--u))', letterSpacing: 'calc(.25 * var(--u))', lineHeight: 1.42, transform: 'scaleX(1.2)', transformOrigin: 'left top', ...(centerAccent ? { '--color-accent-red': centerAccent } : {}) } as React.CSSProperties}>
              
              {/* Header block */}
              <div className="flex items-end gap-[calc(14*var(--u))] mb-[calc(16*var(--u))] relative whitespace-nowrap">
                <div className="welcome-motion" style={{ color: 'var(--color-accent-red)', fontSize: 'calc(29 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', transform: 'scaleX(1.53)', transformOrigin: 'left bottom', lineHeight: 0.9 }}>
                  <span className="welcome-trail" aria-hidden="true">welcome.</span>
                  <span className="welcome-face">welcome.</span>
                </div>
                <div className="w-[calc(120*var(--u))] h-[1px] bg-gradient-to-r from-[#f5fbff]/30 to-transparent mb-[calc(3*var(--u))]"></div>
              </div>

              {/* Body block */}
              <div className="home-copy-body flex flex-col gap-[calc(12*var(--u))] ml-[calc(12*var(--u))]">
                <CopyParagraph lines={2}>
                  this is where i keep my ideas and<br/>
                  the things i make while figuring them out.
                </CopyParagraph>
                <CopyParagraph lines={3}>
                  i&apos;m thành. i like <span style={{ color: 'var(--color-accent-red)' }}>building things</span>, on<br/>
                  screen and off, and seeing what happens<br/>
                  when art and technology meet.
                </CopyParagraph>
                <p className="m-0 mt-[calc(4*var(--u))] pl-[calc(16*var(--u))] opacity-90">
                  explore gently
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Navigation (<a> tags + icons) */}
          <div className="home-nav-reveal absolute inset-0 z-[4] pointer-events-none" style={{ '--home-nav-accent': centerAccent ?? 'var(--color-accent-red)' } as React.CSSProperties}>
            {/* ABOUT ME */}
            <Link href="/about" className="group home-nav-link home-nav-link-about pointer-events-auto" aria-label="About me">
              <div className="home-nav-label absolute whitespace-nowrap transition-none cursor-pointer" 
                   style={{ left: 'calc(620 * var(--u))', top: 'calc(153.66 * var(--u))', width: 'calc(160 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{about me}'}</span>
              </div>
               <span className="home-nav-sphere home-nav-sphere-blue absolute cursor-pointer" style={{ left: 'calc(787.8 * var(--u))', top: 'calc(143.2 * var(--u))' }} aria-hidden="true" />
            </Link>

            {/* WORKS */}
            <Link href="/works" className="group home-nav-link home-nav-link-works pointer-events-auto" aria-label="Works">
              <div className="home-nav-label absolute whitespace-nowrap transition-none cursor-pointer"
                    style={{ left: 'calc(620 * var(--u))', top: 'calc(243.99 * var(--u))', width: 'calc(160 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{works}'}</span>
              </div>
               <span className="home-nav-sphere home-nav-sphere-amber absolute cursor-pointer" style={{ left: 'calc(787.8 * var(--u))', top: 'calc(233.53 * var(--u))' }} aria-hidden="true" />
            </Link>

            {/* ARTWORK */}
            <Link href="/artwork" className="group home-nav-link home-nav-link-artwork pointer-events-auto" aria-label="Artwork">
              <div className="home-nav-label absolute whitespace-nowrap transition-none cursor-pointer" 
                   style={{ left: 'calc(620 * var(--u))', top: 'calc(334.32 * var(--u))', width: 'calc(160 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{artwork}'}</span>
              </div>
               <span className="home-nav-sphere home-nav-sphere-green absolute cursor-pointer" style={{ left: 'calc(787.8 * var(--u))', top: 'calc(323.87 * var(--u))' }} aria-hidden="true" />
            </Link>

            {/* VISUALISATIONS */}
            <Link href="/visualisations" className="group home-nav-link home-nav-link-visualisations pointer-events-auto" aria-label="Visualisations">
              <div className="home-nav-label absolute whitespace-nowrap transition-none cursor-pointer" 
                   style={{ left: 'calc(570 * var(--u))', top: 'calc(424.65 * var(--u))', width: 'calc(210 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{visualisations}'}</span>
              </div>
               <span className="home-nav-sphere home-nav-sphere-red absolute cursor-pointer" style={{ left: 'calc(787.8 * var(--u))', top: 'calc(414.2 * var(--u))' }} aria-hidden="true" />
            </Link>

            {/* BLOG */}
            <Link href="/blog-links" className="group home-nav-link home-nav-link-blog-links pointer-events-auto" aria-label="Blog">
              <div className="absolute whitespace-nowrap transition-none cursor-pointer"
                   style={{ left: 'calc(91.24 * var(--u))', top: 'calc(364.65 * var(--u))', width: 'calc(140 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{blog}'}</span>
              </div>
              <img src={asset9} className="nav-orb absolute cursor-pointer transition-none group-hover:brightness-125"
                   style={{
                     left: 'calc(239.19 * var(--u))', top: 'calc(354.20 * var(--u))',
                     width: 'calc(13.2 * var(--u))', height: 'calc(15.36 * var(--u))',
                     filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.7)) drop-shadow(1px 2px 2px rgba(0,0,0,0.5))'
                   }} alt="" />
            </Link>

            {/* MUSIC */}
            <Link href="/music" className="group home-nav-link home-nav-link-music pointer-events-auto" aria-label="Music">
              <div className="absolute whitespace-nowrap transition-none cursor-pointer"
                   style={{ left: 'calc(84.70 * var(--u))', top: 'calc(394.65 * var(--u))', width: 'calc(140 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{music}'}</span>
              </div>
              <img src={asset9} className="nav-orb absolute cursor-pointer transition-none group-hover:brightness-125"
                   style={{
                     left: 'calc(232.65 * var(--u))', top: 'calc(384.20 * var(--u))',
                     width: 'calc(13.2 * var(--u))', height: 'calc(15.36 * var(--u))',
                     filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.7)) drop-shadow(1px 2px 2px rgba(0,0,0,0.5))'
                   }} alt="" />
            </Link>

            {/* RADIO */}
            <Link href="/radio" className="group home-nav-link home-nav-link-radio pointer-events-auto" aria-label="Radio">
              <div className="absolute whitespace-nowrap transition-none cursor-pointer" 
                   style={{ left: 'calc(80.21 * var(--u))', top: 'calc(424.65 * var(--u))', width: 'calc(140 * var(--u))', textAlign: 'right', transform: 'translateY(-75%) scaleX(1.55)', transformOrigin: 'right top', color: 'var(--color-border)', fontSize: 'calc(10.5 * var(--u))', letterSpacing: 'calc(.7 * var(--u))', fontFamily: 'var(--font-micro)' }}>
                <span className="home-nav-title">{'{radio}'}</span>
              </div>
              <img src={asset9} className="nav-orb absolute cursor-pointer transition-none group-hover:brightness-125"
                   style={{ 
                     left: 'calc(228.16 * var(--u))', top: 'calc(414.20 * var(--u))',
                     width: 'calc(13.2 * var(--u))', height: 'calc(15.36 * var(--u))',
                     filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.7)) drop-shadow(1px 2px 2px rgba(0,0,0,0.5))'
                   }} alt="" />
            </Link>
          </div>

        </div>
        <div className="home-controls">
          <button
            type="button"
            className="home-control-button home-palette-toggle"
            style={{ '--palette-highlight': palette.highlight } as React.CSSProperties}
            aria-label={`Current colors: ${palette.name}. Switch to ${nextPalette.name}.`}
            onClick={cyclePalette}
          >
            <span className="home-palette-preview" aria-hidden="true">
              {PALETTES.map((theme) => (
                <span
                  key={theme.name}
                  className="home-nav-sphere home-nav-sphere-blue home-control-sphere"
                  data-active={theme.name === palette.name}
                  style={{ filter: theme.filter }}
                />
              ))}
            </span>
            <span className="home-palette-label" aria-live="polite">{`{change colors: ${palette.name}}`}</span>
          </button>
          <VisitorCount />
        </div>
      </div>
    </div>
  );
};
