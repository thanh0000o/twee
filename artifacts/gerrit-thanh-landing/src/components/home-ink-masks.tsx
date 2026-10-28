import type { FC } from "react";

// Reveal masks that follow the real ink centerlines. They only gate black outlines
// and their engraved highlights, never the white panel fill or the gradient.
const ARC =
  "M229.7,486.5L232.69,444.56c4.09-61.1,20.2-121.6,48.45-176.01,21.17-40.74,49.27-78.13,83.45-108.87,11.39-10.26,23.43-19.79,36.08-28.44" +
  "C414.3,122,428.2,113.62,442.82,104.33C501.53,68.43,561.15,34.12,620.96,0L626,-9";
// Match the outer left frame's full route, so overlapping ink and highlights
// cannot race ahead along a shorter outline during the same timed reveal.
const FRAME = "M451.59,131.38H80.58V444.56H451.59";
const HEADER = "M81.82,113.46H823.85";
const BRACKET = "M822.6,150.71H795.1V421.79H822.6";

const Ink: FC<{ id: string; cls: string; d: string; w: number }> = ({ id, cls, d, w }) => (
  <mask id={id} maskUnits="userSpaceOnUse" x="40" y="-20" width="840" height="540">
    <path className={cls} d={d} pathLength={1} strokeDasharray="1" fill="none" stroke="#fff" strokeWidth={w} strokeLinecap="butt" strokeLinejoin="round" />
  </mask>
);

export const InkDefs: FC = () => (
  <>
    <Ink id="ink-arc" cls="home-ink-arc" d={ARC} w={10} />
    <mask id="ink-body" maskUnits="userSpaceOnUse" x="40" y="-20" width="840" height="540">
      <path className="home-ink-arc" d={ARC} pathLength={1} strokeDasharray="1" fill="none" stroke="#fff" strokeWidth={10} />
      <path className="home-ink-frame" d={FRAME} pathLength={1} strokeDasharray="1" fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
    </mask>
    <Ink id="ink-header" cls="home-ink-header" d={HEADER} w={8} />
    <Ink id="ink-bracket" cls="home-ink-bracket" d={BRACKET} w={8} />
  </>
);
