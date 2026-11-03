// Draws every fascia, button face, door and tray face into one texture atlas.
import {
  ATLAS_H_MM, ATLAS_PPM, ATLAS_W_MM, BUTTONS, DISPLAYS, DOORS, KNOBS, TRAY, UNITS,
  atlasOffset, type ButtonDef, type Rect, type UnitDef, type UnitId,
} from './layout';
import { INK, INK_DIM, icon, plastic, roundRect, seeded, text } from './draw';

const BRAND = 'THANH';

const brushed = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) => {
  const rand = seeded(seed);
  ctx.save();
  for (let i = 0; i < h * 3; i++) {
    const yy = y + rand() * h;
    ctx.globalAlpha = 0.025 + rand() * 0.035;
    ctx.fillStyle = rand() > 0.5 ? '#ffffff' : '#000000';
    ctx.fillRect(x, yy, w, 0.08 + rand() * 0.12);
  }
  ctx.restore();
};

const wordmark = (ctx: CanvasRenderingContext2D, x: number, y: number, size = 6.4, align: CanvasTextAlign = 'left') =>
  text(ctx, BRAND, x, y, { size, spacing: 0.2, weight: size * 0.06, color: '#ecebe4', align });

const displayWindow = (ctx: CanvasRenderingContext2D, r: Rect) => {
  ctx.save();
  roundRect(ctx, r.x - 1.4, r.y - 1.4, r.w + 2.8, r.h + 2.8, 1.6);
  ctx.fillStyle = '#121316';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 0.35;
  ctx.stroke();
  roundRect(ctx, r.x, r.y, r.w, r.h, 0.8);
  ctx.fillStyle = '#050607';
  ctx.fill();
  ctx.restore();
};

const cavity = (ctx: CanvasRenderingContext2D, r: Rect, radius = 1.4) => {
  ctx.save();
  roundRect(ctx, r.x, r.y, r.w, r.h, radius);
  const g = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
  g.addColorStop(0, '#060607');
  g.addColorStop(1, '#141518');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
};

const recess = (ctx: CanvasRenderingContext2D, r: Rect) => {
  ctx.save();
  roundRect(ctx, r.x, r.y, r.w, r.h, 1.4);
  ctx.fillStyle = '#1b1c1f';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 0.4;
  ctx.stroke();
  ctx.restore();
};

const labelLine = (ctx: CanvasRenderingContext2D, value: string, cx: number, y: number, half: number) => {
  const w = text(ctx, value, cx, y, { size: 1.8, align: 'center', color: INK_DIM });
  ctx.save();
  ctx.strokeStyle = INK_DIM;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 0.2;
  ctx.beginPath();
  ctx.moveTo(cx - half, y); ctx.lineTo(cx - w / 2 - 1.2, y);
  ctx.moveTo(cx + w / 2 + 1.2, y); ctx.lineTo(cx + half, y);
  ctx.stroke();
  ctx.restore();
};

export const drawButtonFace = (ctx: CanvasRenderingContext2D, btn: ButtonDef) => {
  const { x, y, w, h } = btn;
  const style = btn.style ?? 'normal';
  const top = style === 'red' ? '#5a2a2c' : style === 'dark' ? '#2d2e32' : style === 'key' ? '#3a3b40' : '#44454a';
  const bottom = style === 'red' ? '#3a1a1c' : style === 'dark' ? '#1f2023' : style === 'key' ? '#2a2b2f' : '#2b2c30';
  ctx.save();
  roundRect(ctx, x, y, w, h, 0.7);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.13)';
  ctx.lineWidth = 0.25;
  ctx.beginPath();
  ctx.moveTo(x + 0.6, y + 0.25);
  ctx.lineTo(x + w - 0.6, y + 0.25);
  ctx.stroke();
  ctx.restore();

  const cx = x + w / 2;
  const cy = y + h / 2;
  const ink = style === 'red' ? '#ff6b5e' : INK;
  if (btn.icon && btn.label) {
    icon(ctx, btn.icon, x + 5, cy, Math.min(h * 0.42, 3.2), ink);
    text(ctx, btn.label, cx + 2.5, cy - (btn.sub ? 1.4 : 0), { size: 1.9, align: 'center', color: ink, maxWidth: w - 10 });
    if (btn.sub) text(ctx, btn.sub, cx + 2.5, cy + 1.6, { size: 1.9, align: 'center', color: ink, maxWidth: w - 10 });
  } else if (btn.icon) {
    icon(ctx, btn.icon, cx, cy, Math.min(h * 0.45, 4), ink);
  } else if (btn.label) {
    const size = style === 'key' ? 2.6 : Math.min(2.3, h * 0.3);
    text(ctx, btn.label, cx, cy + 0.1, { size, align: 'center', color: ink, maxWidth: w - 2.4, spacing: 0.08 });
  }
};

const knobScale = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r0: number, r1: number, ticks: number) => {
  ctx.save();
  ctx.strokeStyle = INK_DIM;
  ctx.lineWidth = 0.3;
  for (let i = 0; i <= ticks; i++) {
    const a = (-135 + (270 * i) / ticks) * (Math.PI / 180);
    const long = i % 5 === 0;
    const rr = long ? r1 : r0 + (r1 - r0) * 0.55;
    ctx.globalAlpha = long ? 0.9 : 0.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0);
    ctx.lineTo(cx + Math.sin(a) * rr, cy - Math.cos(a) * rr);
    ctx.stroke();
  }
  ctx.restore();
};

const drawUnit = (ctx: CanvasRenderingContext2D, unit: UnitDef) => {
  const { w, h, split } = unit;
  // upper fascia
  plastic(ctx, 0, 0, w, split, '#333438', '#28292c');
  brushed(ctx, 0, 0, w, split, unit.h * 31);
  // lower strip
  plastic(ctx, 0, split, w, h - split, '#2a2b2e', '#202124');
  brushed(ctx, 0, split, w, h - split, unit.h * 17);
  plastic(ctx, 0, split, w, 1.4, '#3c3d41', '#2a2b2e');

  switch (unit.id) {
    case 'turntable': {
      wordmark(ctx, 14, 13);
      text(ctx, 'BELT DRIVE · FULL AUTOMATIC', w - 14, 13, { size: 2.2, align: 'right', color: INK_DIM });
      text(ctx, 'TT-33', 14, 44, { size: 3.4, italic: true, color: INK });
      text(ctx, 'AUTOMATIC STEREO TURNTABLE', 30, 44.2, { size: 2.1, color: INK_DIM });
      text(ctx, '33', 220, 39.5, { size: 1.9, align: 'right', color: INK_DIM });
      text(ctx, '45', 220, 45.5, { size: 1.9, align: 'right', color: INK_DIM });
      break;
    }
    case 'tuner': {
      wordmark(ctx, 12, 10);
      roundRect(ctx, 12, 24, 24, 11, 1);
      ctx.fillStyle = '#2a0d10';
      ctx.fill();
      text(ctx, 'REMOTE SENSOR', 24, 38.6, { size: 1.6, align: 'center', color: INK_DIM });
      text(ctx, 'TUNING', 185, 24.6, { size: 1.8, align: 'center', color: INK_DIM });
      text(ctx, 'DIGITAL SYNTHESIZER', w - 12, 12, { size: 2.2, align: 'right' });
      text(ctx, 'FM STEREO · MW', w - 12, 17, { size: 1.9, align: 'right', color: INK_DIM });
      text(ctx, '10 STATION PRESET', w - 12, 32, { size: 1.9, align: 'right', color: INK_DIM });
      text(ctx, 'PRESET STATIONS', 13, 54.5, { size: 2, color: INK_DIM });
      text(ctx, 'TN-90  FM/MW TIMER TUNER', w - 12, 61.5, { size: 2, align: 'right', color: INK_DIM });
      break;
    }
    case 'amp': {
      wordmark(ctx, 12, 10);
      text(ctx, 'ON / STANDBY', 24, 37.5, { size: 1.6, align: 'center', color: INK_DIM });
      text(ctx, 'FUNCTION · LEVEL', 126, 53, { size: 1.8, align: 'center', color: INK_DIM });
      text(ctx, 'TA-90', 246, 34, { size: 4.2, italic: true, align: 'center', color: '#bdbcb5' });
      text(ctx, 'INTEGRATED AMPLIFIER', 246, 41, { size: 1.8, align: 'center', color: INK_DIM });
      const vol = KNOBS.find((k) => k.id === 'volume')!;
      knobScale(ctx, vol.x, vol.y, vol.r + 2.5, vol.r + 5.5, 30);
      text(ctx, 'VOLUME', vol.x, 4.5, { size: 2, align: 'center' });
      text(ctx, 'MIN', vol.x - 23, 56, { size: 1.8, align: 'center', color: INK_DIM });
      text(ctx, 'MAX', vol.x + 23, 56, { size: 1.8, align: 'center', color: INK_DIM });
      // headphone jack
      text(ctx, 'PHONES', 22, 70.5, { size: 1.7, align: 'center', color: INK_DIM });
      ctx.save();
      const jack = ctx.createRadialGradient(22, 79, 1, 22, 79, 4);
      jack.addColorStop(0, '#000');
      jack.addColorStop(0.45, '#000');
      jack.addColorStop(0.5, '#6b6c70');
      jack.addColorStop(1, '#2b2c2f');
      ctx.fillStyle = jack;
      ctx.beginPath(); ctx.arc(22, 79, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      const bal = KNOBS.find((k) => k.id === 'balance')!;
      knobScale(ctx, bal.x, bal.y, bal.r + 1.4, bal.r + 3, 10);
      text(ctx, 'BALANCE', bal.x, 67.2, { size: 1.7, align: 'center', color: INK_DIM });
      text(ctx, 'L', bal.x - 11, 86, { size: 1.8, align: 'center', color: INK_DIM });
      text(ctx, 'R', bal.x + 11, 86, { size: 1.8, align: 'center', color: INK_DIM });
      text(ctx, 'STEREO AMPLIFIER  TA-90', w - 12, 92.5, { size: 2, align: 'right', color: INK_DIM });
      break;
    }
    case 'eq': {
      wordmark(ctx, 12, 10);
      text(ctx, '7 BAND GRAPHIC EQUALIZER', 271, 11, { size: 2.2, align: 'center' });
      text(ctx, 'SPECTRUM ANALYZER', 271, 16, { size: 1.8, align: 'center', color: INK_DIM });
      recess(ctx, { x: 245, y: 23.5, w: 52, h: 18.5 });
      text(ctx, 'CURVE', 271, 21.5, { size: 1.7, align: 'center', color: INK_DIM });
      text(ctx, 'EQ-7', 326, 32, { size: 5.2, italic: true, align: 'center', color: '#bdbcb5' });
      text(ctx, 'CURVE', 13, 62, { size: 1.9, color: INK_DIM });
      text(ctx, 'MEMORY', 13, 65.5, { size: 1.9, color: INK_DIM });
      text(ctx, 'GRAPHIC EQUALIZER  EQ-7', w - 12, 70, { size: 2, align: 'right', color: INK_DIM });
      break;
    }
    case 'tape': {
      for (const door of [DOORS.A, DOORS.B]) {
        cavity(ctx, door, 1.6);
        ctx.save();
        ctx.fillStyle = '#2b2c30';
        ctx.fillRect(door.x + door.w / 2 - 8, door.y + door.h - 22, 16, 9);
        ctx.fillStyle = '#9fa0a4';
        ctx.beginPath(); ctx.arc(door.x + door.w / 2 + 20, door.y + door.h - 16, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      wordmark(ctx, 177.5, 11.5, 5.4, 'center');
      text(ctx, 'DOUBLE CASSETTE DECK', 177.5, 19.5, { size: 1.8, align: 'center', color: INK_DIM });
      labelLine(ctx, 'SYNCHRO DUBBING', 177.5, 56.3, 29);
      text(ctx, 'DOLBY B NR · AUTO REVERSE', 177.5, 74, { size: 1.7, align: 'center', color: INK_DIM });
      text(ctx, 'TC-90', 151.5, 91.5, { size: 3.2, italic: true, align: 'center', color: '#bdbcb5' });
      text(ctx, 'STEREO CASSETTE DECK', 151.5, 97.5, { size: 1.7, align: 'center', color: INK_DIM });
      text(ctx, 'DECK A', 71, 106.5, { size: 1.8, align: 'center', color: INK_DIM });
      text(ctx, 'DECK B · REC / PLAY', 249.5, 106.5, { size: 1.8, align: 'center', color: INK_DIM });
      break;
    }
    case 'cd': {
      wordmark(ctx, 12, 10);
      cavity(ctx, TRAY, 0.8);
      recess(ctx, { x: 286, y: 9.5, w: 64, h: 26 });
      labelLine(ctx, 'PLAY MODE', 90, 52.6, 38);
      text(ctx, 'ON / STANDBY', 24, 69.5, { size: 1.6, align: 'center', color: INK_DIM });
      text(ctx, 'CD-90  COMPACT DISC PLAYER', w - 12, 72, { size: 2, align: 'right', color: INK_DIM });
      break;
    }
    default: break;
  }

  for (const display of DISPLAYS) if (display.unit === unit.id) displayWindow(ctx, display);
  for (const btn of BUTTONS) if (btn.unit === unit.id) drawButtonFace(ctx, btn);
};

const drawExtras = (ctx: CanvasRenderingContext2D) => {
  for (const [deck, door] of Object.entries(DOORS)) {
    const ox = door.extras.x;
    ctx.save();
    ctx.translate(ox, 0);
    plastic(ctx, 0, 0, door.w, door.h, '#323337', '#26272a');
    brushed(ctx, 0, 0, door.w, door.h, deck === 'A' ? 91 : 73);
    roundRect(ctx, 0.3, 0.3, door.w - 0.6, door.h - 0.6, 1.4);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.4;
    ctx.stroke();
    ctx.restore();
    const win = DISPLAYS.find((d) => d.id === (deck === 'A' ? 'tapeA' : 'tapeB'))!;
    displayWindow(ctx, win);
    ctx.save();
    ctx.translate(ox, 0);
    text(ctx, deck, deck === 'A' ? 12 : door.w - 12, 62, { size: 8, align: deck === 'A' ? 'left' : 'right', weight: 0.3 });
    text(ctx, deck === 'A' ? 'PLAYBACK' : 'RECORD / PLAY', deck === 'A' ? 20 : door.w - 20, 64, { size: 2.1, align: deck === 'A' ? 'left' : 'right' });
    text(ctx, 'AUTO REVERSE', door.w / 2, 56, { size: 2.2, align: 'center', color: INK_DIM });
    text(ctx, 'NORMAL · CrO2 · METAL', deck === 'A' ? door.w - 10 : 10, 66.5, { size: 1.6, align: deck === 'A' ? 'right' : 'left', color: INK_DIM });
    ctx.restore();
  }
  ctx.save();
  ctx.translate(TRAY.extras.x, TRAY.extras.y);
  plastic(ctx, 0, 0, TRAY.w, TRAY.h, '#2f3034', '#25262a');
  text(ctx, 'DIGITAL AUDIO · 1 BIT DAC', TRAY.w / 2, TRAY.h / 2, { size: 2.1, align: 'center', italic: true, color: INK_DIM });
  ctx.restore();
};

/** Builds the full atlas. Waits for the site's Eurostile font so the labels match the rest of the site. */
export const buildAtlas = async () => {
  try {
    await Promise.race([
      document.fonts.load(`20px Eurostile`),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch {
    // fall back to the next font in the stack
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(ATLAS_W_MM * ATLAS_PPM);
  canvas.height = Math.ceil(ATLAS_H_MM * ATLAS_PPM);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(canvas.width / ATLAS_W_MM, canvas.height / ATLAS_H_MM);
  ctx.fillStyle = '#26272a';
  ctx.fillRect(0, 0, ATLAS_W_MM, ATLAS_H_MM);
  for (const unit of UNITS) {
    ctx.save();
    ctx.translate(0, atlasOffset[unit.id as UnitId]);
    ctx.beginPath();
    ctx.rect(0, 0, unit.w, unit.h);
    ctx.clip();
    drawUnit(ctx, unit);
    ctx.restore();
  }
  ctx.save();
  ctx.translate(0, atlasOffset.extras);
  drawExtras(ctx);
  ctx.restore();
  return canvas;
};

export { INK };
