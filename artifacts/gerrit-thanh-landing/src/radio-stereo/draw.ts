// Small canvas helpers shared by the fascia atlas and the live displays.
// Everything is drawn in millimetres; callers scale the context first.

export const FONT = "'Eurostile', 'Helvetica Neue', Arial, sans-serif";
export const INK = '#d9d8d2';
export const INK_DIM = '#9a9a96';

export const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
};

type TextOpts = {
  size?: number;
  align?: CanvasTextAlign;
  color?: string;
  spacing?: number;
  maxWidth?: number;
  italic?: boolean;
  weight?: number;
  baseline?: CanvasTextBaseline;
};

/** Text with manual letter spacing, so it works in every browser. */
export const text = (ctx: CanvasRenderingContext2D, value: string, x: number, y: number, opts: TextOpts = {}) => {
  const { size = 2.4, align = 'left', color = INK, spacing = 0.12, maxWidth, italic = false, weight = 0, baseline = 'middle' } = opts;
  ctx.save();
  ctx.font = `${italic ? 'italic ' : ''}${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textBaseline = baseline;
  const chars = [...value];
  const gap = spacing * size;
  let width = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) + gap * (chars.length - 1);
  let scale = 1;
  if (maxWidth && width > maxWidth) {
    scale = maxWidth / width;
    width = maxWidth;
  }
  let cx = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  ctx.translate(cx, y);
  ctx.scale(scale, 1);
  cx = 0;
  if (weight > 0) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.lineJoin = 'round';
  }
  for (const ch of chars) {
    if (weight > 0) ctx.strokeText(ch, cx, 0);
    ctx.fillText(ch, cx, 0);
    cx += ctx.measureText(ch).width + gap;
  }
  ctx.restore();
  return width;
};

export const icon = (ctx: CanvasRenderingContext2D, kind: string, cx: number, cy: number, s: number, color = INK) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.14;
  const tri = (x: number, dir: 1 | -1, size = s) => {
    ctx.beginPath();
    ctx.moveTo(x - (dir * size) / 2, cy - size / 2);
    ctx.lineTo(x + (dir * size) / 2, cy);
    ctx.lineTo(x - (dir * size) / 2, cy + size / 2);
    ctx.closePath();
    ctx.fill();
  };
  switch (kind) {
    case 'play': tri(cx, 1); break;
    case 'right': tri(cx, 1, s * 0.8); break;
    case 'left': tri(cx, -1, s * 0.8); break;
    case 'stop': ctx.fillRect(cx - s * 0.4, cy - s * 0.4, s * 0.8, s * 0.8); break;
    case 'pause':
      ctx.fillRect(cx - s * 0.42, cy - s * 0.45, s * 0.28, s * 0.9);
      ctx.fillRect(cx + s * 0.14, cy - s * 0.45, s * 0.28, s * 0.9);
      break;
    case 'ff': tri(cx - s * 0.3, 1, s * 0.75); tri(cx + s * 0.3, 1, s * 0.75); break;
    case 'rew': tri(cx - s * 0.3, -1, s * 0.75); tri(cx + s * 0.3, -1, s * 0.75); break;
    case 'next':
      tri(cx - s * 0.35, 1, s * 0.7); tri(cx + s * 0.2, 1, s * 0.7);
      ctx.fillRect(cx + s * 0.55, cy - s * 0.35, s * 0.14, s * 0.7);
      break;
    case 'prev':
      ctx.fillRect(cx - s * 0.69, cy - s * 0.35, s * 0.14, s * 0.7);
      tri(cx - s * 0.2, -1, s * 0.7); tri(cx + s * 0.35, -1, s * 0.7);
      break;
    case 'rec':
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.38, 0, Math.PI * 2); ctx.fill();
      break;
    case 'eject':
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.45, cy + s * 0.05);
      ctx.lineTo(cx, cy - s * 0.45);
      ctx.lineTo(cx + s * 0.45, cy + s * 0.05);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(cx - s * 0.45, cy + s * 0.2, s * 0.9, s * 0.18);
      break;
    default: break;
  }
  ctx.restore();
};

/* ---------- seven segment digits ---------- */

const SEGMENTS: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg',
  '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '', O: 'abcdef', A: 'abcefg', b: 'cdefg', C: 'adef',
  d: 'bcdeg', E: 'adefg', F: 'aefg', H: 'bcefg', L: 'def', n: 'ceg', o: 'cdeg', P: 'abefg', r: 'eg',
  t: 'defg', U: 'bcdef', S: 'acdfg', y: 'bcdfg',
};

const segPolys = (w: number, h: number, t: number) => {
  const half = h / 2;
  const hz = (y: number) => [[t / 2, y], [t, y - t / 2], [w - t, y - t / 2], [w - t / 2, y], [w - t, y + t / 2], [t, y + t / 2]];
  const vt = (x: number, y0: number, y1: number) => [[x, y0 + t / 2], [x + t / 2, y0 + t], [x + t / 2, y1 - t], [x, y1 - t / 2], [x - t / 2, y1 - t], [x - t / 2, y0 + t]];
  return {
    a: hz(t / 2), g: hz(half), d: hz(h - t / 2),
    f: vt(t / 2, 0, half), b: vt(w - t / 2, 0, half),
    e: vt(t / 2, half, h), c: vt(w - t / 2, half, h),
  } as Record<string, number[][]>;
};

/** Draws one 7-segment character with a skew. Unlit segments are drawn faintly, like a real VFD. */
export const seg7 = (
  ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, w: number, h: number,
  color: string, ghost = 0.07,
) => {
  const on = SEGMENTS[ch] ?? '';
  const polys = segPolys(w, h, Math.max(w, h) * 0.13);
  ctx.save();
  ctx.translate(x, y);
  ctx.transform(1, 0, -0.1, 1, h * 0.1, 0);
  for (const [name, pts] of Object.entries(polys)) {
    const lit = on.includes(name);
    if (!lit && ghost <= 0) continue;
    ctx.globalAlpha = lit ? 1 : ghost;
    ctx.fillStyle = color;
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

export const seg7Text = (
  ctx: CanvasRenderingContext2D, value: string, x: number, y: number, w: number, h: number,
  color: string, gap = 1.2, ghost = 0.07,
) => {
  let cx = x;
  for (const ch of value) {
    if (ch === ':' || ch === '.') {
      ctx.save();
      ctx.fillStyle = color;
      const r = w * 0.11;
      if (ch === ':') {
        ctx.beginPath(); ctx.arc(cx + r, y + h * 0.3, r, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.6, y + h * 0.72, r, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(cx + r * 0.4, y + h - r, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      cx += r * 2 + gap;
      continue;
    }
    seg7(ctx, ch, cx, y, w, h, color, ghost);
    cx += w + gap;
  }
  return cx;
};

/** A soft vertical brushed-plastic fill. */
export const plastic = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, top: string, bottom: string) => {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
};

/** Deterministic noise so the texture looks the same on every visit. */
export const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
