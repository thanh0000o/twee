// Live displays: tuner, amplifier meters, equalizer, tape windows and CD readout.
import { EQ_PRESETS, type DisplayDef } from './layout';
import type { StereoState, Track } from './controller';
import { FONT, roundRect, seg7Text, text } from './draw';

export type Frame = {
  state: StereoState;
  track: Track;
  trackCount: number;
  bands: number[];
  levels: [number, number];
  /** seconds since start, for blinking and scrolling */
  t: number;
  /** smooth playback time in seconds */
  time: number;
  color: string;
};

const RED = '#ff4b3e';
const AMBER = '#ffb24a';
const FREQS = [87.5, 88.9, 91.2, 93.6, 95.1, 97.4, 99.0, 101.3, 104.8, 107.2];

const pad = (n: number, len = 2, fill = '0') => String(Math.max(0, Math.floor(n))).padStart(len, fill);
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${pad(seconds % 60)}`;

type Painter = (ctx: CanvasRenderingContext2D, f: Frame, w: number, h: number, peaks: number[]) => void;

/** Mixes a hex colour towards white: the hot core of a neon tube. */
const lighten = (hex: string, amount: number) => {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
};

const glowText = (
  ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, color: string,
  lit: boolean, align: CanvasTextAlign = 'left',
) => {
  ctx.save();
  ctx.globalAlpha = lit ? 1 : 0.09;
  if (lit) { ctx.shadowColor = color; ctx.shadowBlur = 9; }
  text(ctx, value, x, y, { size, color, align, spacing: 0.1 });
  if (lit) {
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.55;
    text(ctx, value, x, y, { size, color: lighten(color, 0.65), align, spacing: 0.1 });
  }
  ctx.restore();
};

/** Seven-segment digits with a neon glow and a pale core. */
const neonDigits = (
  ctx: CanvasRenderingContext2D, value: string, x: number, y: number, w: number, h: number,
  color: string, gap: number, ghost: number, on: boolean,
) => {
  ctx.save();
  if (on) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
  seg7Text(ctx, value, x, y, w, h, color, gap, ghost);
  ctx.restore();
  if (!on) return;
  ctx.save();
  ctx.globalAlpha = 0.5;
  seg7Text(ctx, value, x, y, w, h, lighten(color, 0.7), gap, 0);
  ctx.restore();
};

/** A lit bar segment: coloured glow with a lighter centre. */
const neonBar = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = lighten(color, 0.7);
  ctx.fillRect(x + w * 0.15, y + h * 0.2, w * 0.7, h * 0.6);
  ctx.restore();
};

const tuner: Painter = (ctx, f, w) => {
  const { state, color, t } = f;
  const on = state.power;
  const active = on && state.source === 'tuner';
  const freq = FREQS[state.track % FREQS.length];
  const ghost = on ? 0.07 : 0.03;
  const c = on ? color : '#1d2a2a';
  glowText(ctx, 'FM', 5, 7, 3.2, c, on);
  glowText(ctx, 'MW', 5, 12, 2.4, c, false);
  glowText(ctx, 'STEREO', 16, 4.5, 2, c, active && state.playing);
  glowText(ctx, 'TUNED', 30, 4.5, 2, c, active);
  const digits = freq.toFixed(2).padStart(6, ' ');
  neonDigits(ctx, digits.replace('.', ''), 16, 7, 9, 14, c, 1.6, ghost, on);
  // decimal point between the third and fourth digit
  if (on) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(16 + 3 * 10.6 - 0.6, 20.4, 0.7, 0, Math.PI * 2); ctx.fill();
  }
  glowText(ctx, 'MHz', 70.5, 18.5, 2.6, c, on);
  glowText(ctx, 'PRESET', 82, 4.5, 2, c, on);
  neonDigits(ctx, pad(state.track + 1), 84, 7, 5.5, 9.5, c, 1.1, ghost, on);
  // signal strength
  for (let i = 0; i < 5; i++) {
    const lit = active && (i < 4 || Math.sin(t * 3) > 0);
    ctx.globalAlpha = lit ? 1 : on ? 0.08 : 0.03;
    ctx.fillStyle = c;
    ctx.fillRect(84 + i * 3, 21 - i * 0.8, 2, 1.6 + i * 0.8);
  }
  ctx.globalAlpha = 1;
  // scrolling station text
  if (on) {
    const msg = active
      ? `RADIO THANH  ·  ${f.track.artist.toUpperCase()} - ${f.track.title.toUpperCase()}  ·  `
      : `PRESET ${state.track + 1}  ·  ${freq.toFixed(2)} MHz  ·  RADIO THANH  ·  `;
    ctx.save();
    ctx.beginPath();
    ctx.rect(4, 23, w - 8, 5);
    ctx.clip();
    ctx.font = `2.6px ${FONT}`;
    const width = ctx.measureText(msg).width;
    const offset = active ? (t * 9) % width : 0;
    ctx.fillStyle = color;
    ctx.globalAlpha = active ? 1 : 0.55;
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.fillText(msg + msg, 5 - offset, 25.7);
    ctx.restore();
  }
};

const SOURCES = ['phono', 'tuner', 'cd', 'tape', 'aux'] as const;

const amp: Painter = (ctx, f, w, _h, peaks) => {
  const { state, color, levels } = f;
  const on = state.power;
  const c = on ? color : '#1d2a2a';
  const span = (w - 20) / SOURCES.length;
  SOURCES.forEach((src, i) => {
    const cx = 10 + span * (i + 0.5);
    const lit = on && state.source === src;
    glowText(ctx, src.toUpperCase(), cx, 5, 2.4, lit ? '#ffffff' : c, on, 'center');
    ctx.save();
    ctx.globalAlpha = lit ? 1 : on ? 0.12 : 0.04;
    ctx.fillStyle = RED;
    if (lit) { ctx.shadowColor = RED; ctx.shadowBlur = 6; }
    roundRect(ctx, cx - 5, 8.2, 10, 1.5, 0.6);
    ctx.fill();
    ctx.restore();
  });
  // stereo level meter
  const segs = 22;
  const x0 = 14;
  const segW = (w - x0 - 8) / segs;
  (['L', 'R'] as const).forEach((ch, row) => {
    const y = 14 + row * 7.2;
    glowText(ctx, ch, 6, y + 2.2, 2.6, c, on);
    const level = on ? levels[row] : 0;
    const lit = Math.round(level * segs);
    peaks[row] = Math.max(lit, (peaks[row] ?? 0) - 0.12);
    for (let i = 0; i < segs; i++) {
      const hot = i >= segs - 5;
      const isPeak = on && Math.round(peaks[row]) === i + 1 && i > 0;
      const isLit = on && (i < lit || isPeak);
      if (isLit) neonBar(ctx, x0 + i * segW, y, segW - 1, 4.4, hot ? RED : color);
      else {
        ctx.save();
        ctx.fillStyle = hot ? RED : color;
        ctx.globalAlpha = on ? 0.08 : 0.03;
        ctx.fillRect(x0 + i * segW, y, segW - 1, 4.4);
        ctx.restore();
      }
    }
  });
  const marks: [string, number][] = [['-30', 0], ['-20', 7], ['-10', 12], ['-5', 15], ['0', 17], ['+3', 20]];
  for (const [label, seg] of marks) glowText(ctx, label, x0 + seg * segW + segW / 2, 31, 1.8, c, on, 'center');
  glowText(ctx, 'LOUDNESS', 6, 35.4, 1.9, AMBER, on && state.loudness);
  glowText(ctx, 'MUTE', 26, 35.4, 1.9, RED, on && state.muted && Math.sin(f.t * 6) > -0.3);
  glowText(ctx, `VOL ${pad(Math.round(state.volume * 40))}`, w - 6, 35.4, 1.9, c, on, 'right');
};

const eq: Painter = (ctx, f, w, _h, peaks) => {
  const { state, color, bands } = f;
  const on = state.power;
  const c = on ? color : '#1d2a2a';
  const name = state.eqOn ? state.eqPreset : 'OFF';
  glowText(ctx, 'CURVE', 3, 4, 1.8, c, on);
  glowText(ctx, name, 3, 8.4, 2.8, on ? '#ffffff' : c, on);
  glowText(ctx, '+10', 20, 6, 1.7, c, on, 'right');
  glowText(ctx, '0', 20, 16.5, 1.7, c, on, 'right');
  glowText(ctx, '-10', 20, 27, 1.7, c, on, 'right');
  const labels = ['63', '160', '400', '1k', '2.5k', '6.3k', '15k'];
  const x0 = 24;
  const colW = (w - x0 - 4) / 7;
  const rows = 12;
  const segH = 24 / rows;
  const gains = state.eqOn ? EQ_PRESETS[state.eqPreset] : EQ_PRESETS.FLAT;
  for (let i = 0; i < 7; i++) {
    const x = x0 + i * colW;
    const value = on ? bands[i] : 0;
    const lit = Math.round(value * rows);
    peaks[i] = Math.max(lit, (peaks[i] ?? 0) - 0.08);
    for (let r = 0; r < rows; r++) {
      const y = 28 - (r + 1) * segH;
      const peak = on && Math.round(peaks[i]) === r + 1 && r > 0;
      const isLit = on && (r < lit || peak);
      if (isLit) neonBar(ctx, x + 1, y + 0.25, colW - 3, segH - 0.5, r >= rows - 2 ? AMBER : color);
      else {
        ctx.save();
        ctx.fillStyle = r >= rows - 2 ? AMBER : color;
        ctx.globalAlpha = on ? 0.07 : 0.03;
        ctx.fillRect(x + 1, y + 0.25, colW - 3, segH - 0.5);
        ctx.restore();
      }
    }
    glowText(ctx, labels[i], x + colW / 2 - 0.5, 31.6, 1.8, c, on, 'center');
  }
  // the curve itself, drawn as a thin dotted line
  if (on) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 0.35;
    ctx.setLineDash([0.6, 0.6]);
    ctx.beginPath();
    gains.forEach((g, i) => {
      const x = x0 + i * colW + colW / 2 - 0.5;
      const y = 16 - (g / 10) * 11;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  }
};

const cassette = (deck: 'A' | 'B'): Painter => (ctx, f, w, h) => {
  const { state, time } = f;
  const progress = f.state.duration ? Math.min(1, time / f.state.duration) : 0;
  const running = state.power && state.playing && state.source === 'tape' && (deck === 'A' || state.rec);
  ctx.fillStyle = '#0c0d0f';
  ctx.fillRect(0, 0, w, h);
  // cassette shell
  ctx.save();
  roundRect(ctx, 2, 2, w - 4, h + 4, 2);
  ctx.fillStyle = deck === 'A' ? '#c9c4b6' : '#30353d';
  ctx.fill();
  // label
  roundRect(ctx, 6, 3, w - 12, 9.5, 0.8);
  ctx.fillStyle = deck === 'A' ? '#f2ede0' : '#e9e4d6';
  ctx.fill();
  ctx.fillStyle = deck === 'A' ? f.color : '#ff6a5c';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(6, 3, w - 12, 1.4);
  ctx.globalAlpha = 1;
  ctx.restore();
  if (deck === 'A') {
    text(ctx, `${f.track.album.toUpperCase()}`, 9, 7.6, { size: 2.6, color: '#222', spacing: 0.08 });
    text(ctx, `SIDE A · ${f.track.artist.toUpperCase()}`, w - 9, 10.3, { size: 1.7, color: '#555', align: 'right' });
    text(ctx, 'C60', w - 9, 6.6, { size: 2.2, color: '#222', align: 'right' });
  } else {
    text(ctx, 'mixtape for the radio', 9, 8, { size: 3, color: '#2a3a7a', italic: true, spacing: 0.02 });
    text(ctx, 'C90', w - 9, 6.6, { size: 2.2, color: '#222', align: 'right' });
  }
  // window with the tape packs and hubs
  ctx.save();
  roundRect(ctx, 20, 16, w - 40, 15, 3);
  ctx.fillStyle = '#16171a';
  ctx.fill();
  ctx.clip();
  const cy = 23.5;
  const hubs = [w * 0.33, w * 0.67];
  const p = deck === 'A' ? progress : (state.rec ? progress : 0.5);
  const packs = [6 + 10 * (1 - p), 6 + 10 * p];
  hubs.forEach((cx, i) => {
    ctx.fillStyle = '#3a2618';
    ctx.beginPath(); ctx.arc(cx, cy, packs[i], 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,180,0.12)';
    ctx.lineWidth = 0.2;
    for (let r = 6; r < packs[i]; r += 1.2) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
  });
  ctx.restore();
  // hubs on top of the window
  hubs.forEach((cx, i) => {
    const angle = running ? -f.t * (i === 0 ? 2.4 : 3.2) : 0;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = '#f4f1ea';
    ctx.beginPath(); ctx.arc(0, 0, 4.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#16171a';
    ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f4f1ea';
    for (let k = 0; k < 6; k++) {
      ctx.rotate(Math.PI / 3);
      ctx.fillRect(-0.45, 1.6, 0.9, 1.3);
    }
    ctx.restore();
  });
  // smoked door glass
  const glass = ctx.createLinearGradient(0, 0, w, h);
  glass.addColorStop(0, 'rgba(10,12,16,0.45)');
  glass.addColorStop(0.45, 'rgba(10,12,16,0.25)');
  glass.addColorStop(0.5, 'rgba(255,255,255,0.08)');
  glass.addColorStop(0.56, 'rgba(10,12,16,0.3)');
  glass.addColorStop(1, 'rgba(10,12,16,0.5)');
  ctx.fillStyle = glass;
  ctx.fillRect(0, 0, w, h);
  if (!state.power) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, w, h);
  }
};

const tapeMid: Painter = (ctx, f) => {
  const { state, color, t, time } = f;
  const on = state.power;
  const c = on ? color : '#1d2a2a';
  const running = on && state.playing && state.source === 'tape';
  glowText(ctx, 'A DECK', 3, 3.5, 1.9, c, on);
  glowText(ctx, 'B DECK', 33, 3.5, 1.9, c, on);
  glowText(ctx, '▶', 15, 3.5, 2.2, AMBER, running);
  glowText(ctx, '▶', 45, 3.5, 2.2, AMBER, running && state.rec);
  glowText(ctx, '● REC', 58.5, 8, 1.9, RED, on && state.rec && Math.sin(t * 5) > -0.2, 'right');
  glowText(ctx, 'COUNTER', 3, 8, 1.7, c, on);
  neonDigits(ctx, pad(Math.floor(time * 1.6) % 1000, 3), 16, 10, 6, 10, c, 1.4, on ? 0.07 : 0.03, on);
  glowText(ctx, 'DOLBY', 58.5, 15, 1.8, c, on, 'right');
  glowText(ctx, 'NR', 58.5, 18.5, 1.8, c, on, 'right');
};

const cd: Painter = (ctx, f, w) => {
  const { state, color, t, trackCount, time } = f;
  const on = state.power;
  const c = on ? color : '#1d2a2a';
  const active = on && state.source === 'cd';
  const ghost = on ? 0.07 : 0.03;
  glowText(ctx, 'TRACK', 4, 3.5, 1.8, c, on);
  glowText(ctx, 'MIN', 31, 3.5, 1.8, c, on);
  glowText(ctx, 'SEC', 50, 3.5, 1.8, c, on);
  ctx.save();
  if (on && state.trayOpen) {
    neonDigits(ctx, ' OPEn', 4, 6, 7, 13, c, 1.5, ghost, on);
  } else {
    neonDigits(ctx, active ? pad(state.track + 1) : pad(trackCount), 4, 6, 7, 13, c, 1.5, ghost, on);
    const shown = state.timeMode === 'remain' && state.duration ? Math.max(0, state.duration - time) : time;
    const value = active ? clock(shown).padStart(5, ' ') : on ? '--:--' : '     ';
    neonDigits(ctx, value.replace(':', ''), 25, 6, 7, 13, c, 1.5, ghost, on);
    if (on) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(41.7, 9.8, 0.75, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(41.1, 15.4, 0.75, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
  // track calendar
  for (let i = 0; i < 10; i++) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const current = active && i === state.track;
    const lit = on && (i < trackCount) && (!current || Math.sin(t * 6) > -0.4);
    glowText(ctx, String(i + 1), 74 + col * 6, 6 + row * 6, 2.4, current ? '#ffffff' : c, lit, 'center');
  }
  const y = 26.5;
  glowText(ctx, '▶', 4, y, 2.4, c, active && state.playing);
  glowText(ctx, 'II', 9, y, 2.4, c, active && !state.playing && state.position > 0);
  glowText(ctx, 'REPEAT', 16, y, 1.9, c, on && state.repeat);
  glowText(ctx, 'SHUFFLE', 30, y, 1.9, c, on && state.shuffle);
  glowText(ctx, 'REMAIN', 46, y, 1.9, c, on && state.timeMode === 'remain');
  glowText(ctx, 'DISC', w - 4, y, 1.9, c, on && !state.trayOpen, 'right');
};

const PAINTERS: Record<string, Painter> = {
  tuner, amp, eq, cd, tapeMid, tapeA: cassette('A'), tapeB: cassette('B'),
};

export type LiveDisplay = {
  def: DisplayDef;
  canvas: HTMLCanvasElement;
  /** Returns true when the canvas changed. */
  paint: (f: Frame, force?: boolean) => boolean;
};

const signature = (id: string, f: Frame) => {
  const s = f.state;
  const base = `${s.power}|${f.color}`;
  switch (id) {
    case 'tuner': return s.power && s.source === 'tuner' ? null : `${base}|${s.source}|${s.track}|${s.playing}`;
    case 'cd': return s.power && (s.source === 'cd' || s.repeat || s.trayOpen) ? `${base}|${s.track}|${Math.floor(f.time)}|${s.playing}|${s.repeat}|${s.shuffle}|${s.timeMode}|${s.trayOpen}|${s.source}|${Math.floor(f.t * 2)}` : `${base}|${s.source}|${s.repeat}|${s.shuffle}|${s.timeMode}|${s.trayOpen}`;
    case 'tapeMid': return `${base}|${Math.floor(f.time * 1.6)}|${s.playing}|${s.source}|${s.rec}|${s.rec ? Math.floor(f.t * 3) : 0}`;
    case 'tapeA': case 'tapeB':
      return s.power && s.playing && s.source === 'tape' ? null : `${base}|${s.track}|${s.rec}|${Math.round(f.time)}|${f.track.album}`;
    default: return null; // amp and eq follow the music every frame
  }
};

export const createDisplay = (def: DisplayDef): LiveDisplay => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(def.w * def.ppm);
  canvas.height = Math.round(def.h * def.ppm);
  const ctx = canvas.getContext('2d')!;
  const painter = PAINTERS[def.id];
  const peaks: number[] = [];
  const crt = def.id !== 'tapeA' && def.id !== 'tapeB';
  let last: string | null | undefined;
  return {
    def,
    canvas,
    paint: (frame, force = false) => {
      const sig = signature(def.id, frame);
      if (!force && sig !== null && sig === last) return false;
      last = sig;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#040506';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(def.ppm, 0, 0, def.ppm, 0, 0);
      painter(ctx, frame, def.w, def.h, peaks);
      if (crt) {
        // old monitor scan lines and a bit of curved glass
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
        const step = Math.max(3, Math.round(def.ppm * 0.62));
        const line = Math.max(1, Math.round(step * 0.38));
        for (let yy = 0; yy < canvas.height; yy += step) ctx.fillRect(0, yy, canvas.width, line);
        const vignette = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.62,
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const sheen = ctx.createLinearGradient(0, 0, 0, canvas.height);
        sheen.addColorStop(0, 'rgba(255,255,255,0.07)');
        sheen.addColorStop(0.42, 'rgba(255,255,255,0.0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return true;
    },
  };
};
