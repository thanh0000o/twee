// Canvas textures for the turntable, CD and knobs.
import { text } from './draw';

export const ACCENT_RED = '#ff1f2d';

export const makeCanvas = (size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void, height = size) => {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = height;
  draw(c.getContext('2d')!, size);
  return c;
};

export const recordCanvas = (album: string, artist: string) => makeCanvas(1024, (ctx, s) => {
  const c = s / 2;
  ctx.fillStyle = '#0b0b0c';
  ctx.fillRect(0, 0, s, s);
  for (let r = c * 0.36; r < c * 0.985; r += 1.6) {
    const gap = (r > c * 0.94 && r < c * 0.95) || (r > c * 0.38 && r < c * 0.41);
    ctx.strokeStyle = gap ? '#050506' : (Math.floor(r) % 3 === 0 ? '#1a1a1c' : '#111113');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.stroke();
  }
  // track gaps
  for (const f of [0.86, 0.77, 0.69, 0.6, 0.52, 0.45]) {
    ctx.strokeStyle = '#040405';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(c, c, c * f, 0, Math.PI * 2); ctx.stroke();
  }
  // label
  const lr = c * 0.33;
  ctx.fillStyle = '#efe9dc';
  ctx.beginPath(); ctx.arc(c, c, lr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = ACCENT_RED;
  ctx.beginPath(); ctx.arc(c, c, lr, Math.PI * 1.08, Math.PI * 1.92); ctx.closePath(); ctx.fill();
  ctx.save();
  ctx.translate(c, c);
  ctx.scale(s / 300, s / 300);
  text(ctx, 'THANH', 0, -31, { size: 9, align: 'center', color: '#ffffff', spacing: 0.25, weight: 0.4 });
  text(ctx, album.toUpperCase(), 0, -10, { size: 6.4, align: 'center', color: '#1d1d1d', spacing: 0.12 });
  text(ctx, artist.toUpperCase(), 0, 0, { size: 5, align: 'center', color: '#555', spacing: 0.15 });
  text(ctx, 'SIDE A', -32, 22, { size: 4, align: 'center', color: '#555' });
  text(ctx, '33⅓', 32, 22, { size: 4.6, align: 'center', color: '#555' });
  text(ctx, 'STEREO', 0, 36, { size: 3.6, align: 'center', color: '#777', spacing: 0.3 });
  ctx.restore();
  ctx.fillStyle = '#c8c4b8';
  ctx.beginPath(); ctx.arc(c, c, 5, 0, Math.PI * 2); ctx.fill();
});

export const matCanvas = () => makeCanvas(512, (ctx, s) => {
  const c = s / 2;
  ctx.fillStyle = '#1c1c1e';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 16; i++) {
    const r = c * (0.12 + i * 0.055);
    ctx.strokeStyle = i % 2 ? '#262628' : '#141416';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.stroke();
  }
});

export const discCanvas = () => makeCanvas(512, (ctx, s) => {
  const c = s / 2;
  ctx.fillStyle = '#9da2aa';
  ctx.fillRect(0, 0, s, s);
  const hues = ['#c6ccd6', '#d7b9e6', '#a9d4f0', '#c8f0c4', '#f3e3a8', '#f0b9c8', '#c6ccd6'];
  const conic = (ctx as CanvasRenderingContext2D & { createConicGradient?: (a: number, x: number, y: number) => CanvasGradient }).createConicGradient;
  if (conic) {
    const g = conic.call(ctx, 0, c, c);
    hues.forEach((h, i) => g.addColorStop(i / (hues.length - 1), h));
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.arc(c, c, c * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(c, c, c * 0.97, 0, Math.PI * 2); ctx.stroke();
  ctx.save();
  ctx.translate(c, c * 0.62);
  ctx.scale(s / 300, s / 300);
  text(ctx, 'THE LOST TAPES', 0, 0, { size: 7, align: 'center', color: '#2b2e35', spacing: 0.14 });
  ctx.restore();
});

export const knobCapCanvas = () => makeCanvas(512, (ctx, s) => {
  const c = s / 2;
  const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 10, c, c, c);
  g.addColorStop(0, '#3a3b40');
  g.addColorStop(1, '#17181b');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  for (let r = 4; r < c; r += 3) {
    ctx.strokeStyle = r % 2 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.stroke();
  }
  // pointer: drawn towards the top of the texture
  ctx.strokeStyle = '#e8e7e1';
  ctx.lineWidth = s * 0.025;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(c, c * 0.42); ctx.lineTo(c, c * 0.12); ctx.stroke();
  ctx.fillStyle = ACCENT_RED;
  ctx.beginPath(); ctx.arc(c, c * 0.06 + s * 0.02, s * 0.016, 0, Math.PI * 2); ctx.fill();
});

export const knurlCanvas = () => makeCanvas(64, (ctx) => {
  ctx.fillStyle = '#1e1f22';
  ctx.fillRect(0, 0, 64, 8);
  for (let x = 0; x < 64; x += 8) {
    ctx.fillStyle = '#2c2d31';
    ctx.fillRect(x, 0, 3, 8);
  }
}, 8);


/** Silver platter rim with the classic strobe dots for 33 and 45 rpm. */
export const strobeCanvas = () => makeCanvas(2048, (ctx) => {
  const g = ctx.createLinearGradient(0, 0, 0, 48);
  g.addColorStop(0, '#f2f3f5');
  g.addColorStop(0.5, '#a9adb4');
  g.addColorStop(1, '#e3e5e8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2048, 48);
  ctx.fillStyle = '#2a2c30';
  for (let i = 0; i < 180; i++) ctx.fillRect((i / 180) * 2048, 8, 5, 9);
  for (let i = 0; i < 133; i++) ctx.fillRect((i / 133) * 2048, 28, 7, 9);
}, 48);

/** Soft contact shadow, a blurred rounded rectangle. */
export const contactShadowCanvas = () => makeCanvas(256, (ctx) => {
  ctx.clearRect(0, 0, 256, 256);
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 36;
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(48, 48, 160, 160);
});

/** Small cross-head screw. */
export const screwCanvas = () => makeCanvas(64, (ctx) => {
  const g = ctx.createRadialGradient(24, 22, 2, 32, 32, 32);
  g.addColorStop(0, '#f1f2f4');
  g.addColorStop(1, '#6d7078');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = '#26282c';
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(14, 32); ctx.lineTo(50, 32); ctx.moveTo(32, 14); ctx.lineTo(32, 50); ctx.stroke();
});

