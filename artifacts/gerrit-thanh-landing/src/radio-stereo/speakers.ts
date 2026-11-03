// Two 3-way speakers: woofer, midrange, dome tweeter and a bass reflex port.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { INK, INK_DIM, seeded, text } from './draw';

export const SPEAKER = { w: 262, h: 520, d: 290, feet: 10 };

type Bag = <T extends { dispose: () => void }>(item: T) => T;

export type Speaker = {
  group: THREE.Group;
  woofer: THREE.Group;
  mid: THREE.Group;
  wooferHit: THREE.Object3D;
};

const lathe = (points: [number, number][], segments = 72) =>
  new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments).rotateX(Math.PI / 2);

const canvas = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  return c;
};

const tex = (c: HTMLCanvasElement, renderer: THREE.WebGLRenderer) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
};

/** Black ash vinyl, like 90s speaker cabinets. */
const ashCanvas = () => canvas(512, 512, (ctx) => {
  ctx.fillStyle = '#1c1c1e';
  ctx.fillRect(0, 0, 512, 512);
  const rand = seeded(42);
  for (let i = 0; i < 420; i++) {
    const y = rand() * 512;
    ctx.strokeStyle = rand() > 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 0.5 + rand() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 3 + (rand() - 0.5) * 2);
    ctx.stroke();
  }
});

const coneCanvas = () => canvas(512, 512, (ctx) => {
  ctx.fillStyle = '#26272a';
  ctx.fillRect(0, 0, 512, 512);
  const rand = seeded(7);
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(rand() * 512, rand() * 512, 1 + rand() * 2, 1 + rand() * 6);
  }
});

const PPM = 3;
const baffleCanvas = (w: number, h: number) => canvas(Math.round(w * PPM), Math.round(h * PPM), (ctx) => {
  ctx.scale(PPM, PPM);
  ctx.fillStyle = '#1a1b1d';
  ctx.fillRect(0, 0, w, h);
  const rand = seeded(19);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.2)';
    ctx.fillRect(rand() * w, rand() * h, 0.3, 0.3);
  }
  // origin at the centre, y up like the 3D layout
  const at = (x: number, y: number) => [w / 2 + x, h / 2 - y] as const;
  const ring = (y: number, r: number) => {
    const [cx, cy] = at(0, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  };
  ring(205, 34);
  ring(112, 64);
  ring(-58, 120);
  const [lx, ly] = at(-60, -237);
  text(ctx, 'BASS REFLEX', lx, ly, { size: 2.6, align: 'center', color: INK_DIM });
  const [tx, ty] = at(56, -224);
  text(ctx, '3 WAY SPEAKER SYSTEM', tx, ty, { size: 2.6, align: 'center', color: INK });
  text(ctx, 'SB-90  ·  120 W  ·  6 Ω', tx, ty + 5, { size: 2.3, align: 'center', color: INK_DIM });
  const [hx, hy] = at(0, 246);
  text(ctx, 'HI-FI', hx, hy, { size: 2.4, align: 'center', color: INK_DIM, spacing: 0.4 });
});

const badgeCanvas = () => canvas(420, 96, (ctx) => {
  const g = ctx.createLinearGradient(0, 0, 0, 96);
  g.addColorStop(0, '#e9eaec');
  g.addColorStop(0.5, '#a8abb1');
  g.addColorStop(1, '#d7d9dd');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 420, 96);
  const rand = seeded(3);
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, rand() * 96, 420, 0.6);
  }
  ctx.save();
  ctx.scale(6, 6);
  text(ctx, 'THANH', 35, 8, { size: 9, align: 'center', color: '#141517', spacing: 0.24, weight: 0.4 });
  ctx.restore();
});

export const createSpeakers = (renderer: THREE.WebGLRenderer, bag: Bag) => {
  const { w, h, d, feet } = SPEAKER;
  const ash = bag(tex(ashCanvas(), renderer));
  const cabinetMat = bag(new THREE.MeshStandardMaterial({ map: ash, roughness: 0.66, metalness: 0.05, envMapIntensity: 0.7 }));
  const baffleTex = bag(tex(baffleCanvas(w - 10, h - 10), renderer));
  const baffleMat = bag(new THREE.MeshStandardMaterial({ map: baffleTex, roughness: 0.75, metalness: 0.05 }));
  const sideMat = bag(new THREE.MeshStandardMaterial({ color: 0x1a1b1d, roughness: 0.7 }));
  const frameMat = bag(new THREE.MeshStandardMaterial({ color: 0x1b1c20, roughness: 0.38, metalness: 0.55, side: THREE.DoubleSide }));
  const rubberMat = bag(new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.85, side: THREE.DoubleSide }));
  const coneTex = bag(tex(coneCanvas(), renderer));
  const coneMat = bag(new THREE.MeshStandardMaterial({ map: coneTex, roughness: 0.92, side: THREE.DoubleSide }));
  const capMat = bag(new THREE.MeshStandardMaterial({ color: 0x7d8189, roughness: 0.32, metalness: 0.9, envMapIntensity: 0.6, side: THREE.DoubleSide }));
  const domeMat = bag(new THREE.MeshStandardMaterial({ color: 0x2b2c30, roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide }));
  const screwMat = bag(new THREE.MeshStandardMaterial({ color: 0x9fa3aa, roughness: 0.3, metalness: 1 }));
  const portMat = bag(new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9, side: THREE.DoubleSide }));
  const footMat = bag(new THREE.MeshStandardMaterial({ color: 0x0e0e10, roughness: 0.6, metalness: 0.4 }));
  const badgeTex = bag(tex(badgeCanvas(), renderer));
  const badgeMat = bag(new THREE.MeshStandardMaterial({ map: badgeTex, roughness: 0.3, metalness: 0.85 }));

  const cabinetGeo = bag(new RoundedBoxGeometry(w, h, d, 4, 7));
  const screwGeo = bag(new THREE.CylinderGeometry(2.1, 2.1, 1.6, 12).rotateX(Math.PI / 2));
  const footGeo = bag(new THREE.CylinderGeometry(13, 9, feet, 24));

  /** A cone driver. Returns the moving part separately so it can pump with the music. */
  const driver = (r: number, depth: number, screws: number) => {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(bag(lathe([[r * 1.16, 0], [r * 1.16, 3.5], [r * 1.1, 4.5], [r * 0.97, 4.5], [r * 0.97, 1]])), frameMat);
    const surroundPts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * Math.PI;
      surroundPts.push([r * 0.875 + Math.cos(a) * r * 0.095, 4 + Math.sin(a) * r * 0.08]);
    }
    const surround = new THREE.Mesh(bag(lathe(surroundPts)), rubberMat);
    const moving = new THREE.Group();
    const cone = new THREE.Mesh(bag(lathe([[r * 0.78, 4], [r * 0.6, 4 - depth * 0.42], [r * 0.4, 4 - depth * 0.75], [r * 0.24, 4 - depth]])), coneMat);
    const capPts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * (Math.PI / 2);
      capPts.push([Math.cos(a) * r * 0.25 + 0.001, 4 - depth + Math.sin(a) * r * 0.13]);
    }
    const cap = new THREE.Mesh(bag(lathe(capPts.reverse())), capMat);
    moving.add(cone, cap);
    g.add(frame, surround, moving);
    for (let i = 0; i < screws; i++) {
      const a = Math.PI / 4 + (i / screws) * Math.PI * 2;
      const s = new THREE.Mesh(screwGeo, screwMat);
      s.position.set(Math.cos(a) * r * 1.07, Math.sin(a) * r * 1.07, 4.2);
      g.add(s);
    }
    for (const m of [frame, surround, cone, cap]) m.castShadow = false;
    return { g, moving, hit: cone };
  };

  // baffle with real holes, so the cones can sit deep inside the cabinet
  const bw = w - 10;
  const bh = h - 10;
  const shape = new THREE.Shape();
  {
    const r = 3;
    shape.moveTo(-bw / 2 + r, -bh / 2);
    shape.lineTo(bw / 2 - r, -bh / 2);
    shape.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + r);
    shape.lineTo(bw / 2, bh / 2 - r);
    shape.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - r, bh / 2);
    shape.lineTo(-bw / 2 + r, bh / 2);
    shape.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - r);
    shape.lineTo(-bw / 2, -bh / 2 + r);
    shape.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + r, -bh / 2);
    for (const [hx, hy, hr] of [[0, -58, 100], [0, 112, 53], [-60, -205, 25]]) {
      const hole = new THREE.Path();
      hole.absarc(hx, hy, hr, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
  }
  const baffleGeo2 = bag(new THREE.ExtrudeGeometry(shape, { depth: 6, bevelEnabled: false, curveSegments: 64 }));
  baffleTex.repeat.set(1 / bw, 1 / bh);
  baffleTex.offset.set(0.5, 0.5);
  const hidden = bag(new THREE.MeshBasicMaterial({ visible: false }));
  const insideMat = bag(new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 1, side: THREE.BackSide }));
  const insideGeo = bag(new THREE.BoxGeometry(w - 14, h - 14, d - 14));

  const build = (side: -1 | 1): Speaker => {
    const group = new THREE.Group();
    const cabinet = new THREE.Mesh(cabinetGeo, [cabinetMat, cabinetMat, cabinetMat, cabinetMat, hidden, cabinetMat]);
    cabinet.position.y = feet + h / 2;
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    group.add(cabinet);
    const inside = new THREE.Mesh(insideGeo, insideMat);
    inside.position.y = feet + h / 2;
    group.add(inside);
    const front = d / 2 + 2;
    const baffle = new THREE.Mesh(baffleGeo2, [baffleMat, sideMat]);
    baffle.position.set(0, feet + h / 2, d / 2 - 4);
    baffle.receiveShadow = true;
    baffle.castShadow = true;
    group.add(baffle);

    const place = (obj: THREE.Object3D, y: number, x = 0) => {
      obj.position.set(x, feet + h / 2 + y, front);
      group.add(obj);
    };

    const woofer = driver(102, 34, 6);
    place(woofer.g, -58);
    const mid = driver(54, 20, 4);
    place(mid.g, 112);

    // tweeter: square plate, ring and a soft dome
    const tweeter = new THREE.Group();
    const plate = new THREE.Mesh(bag(new RoundedBoxGeometry(62, 62, 5, 2, 2)), frameMat);
    plate.position.z = 2.5;
    const ring = new THREE.Mesh(bag(new THREE.TorusGeometry(19, 2.2, 12, 48)), capMat);
    ring.position.z = 5.4;
    const domePts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2);
      domePts.push([Math.cos(a) * 15 + 0.001, 4 + Math.sin(a) * 9]);
    }
    const dome = new THREE.Mesh(bag(lathe(domePts.reverse(), 48)), domeMat);
    tweeter.add(plate, ring, dome);
    for (const [sx, sy] of [[-24, -24], [24, -24], [-24, 24], [24, 24]]) {
      const s = new THREE.Mesh(screwGeo, screwMat);
      s.position.set(sx, sy, 5.4);
      tweeter.add(s);
    }
    place(tweeter, 205);

    // bass reflex port
    const port = new THREE.Group();
    const tube = new THREE.Mesh(bag(new THREE.CylinderGeometry(25, 25, 60, 40, 1, true).rotateX(Math.PI / 2)), portMat);
    tube.position.z = -28;
    const flare = new THREE.Mesh(bag(new THREE.TorusGeometry(27, 3.4, 12, 48)), frameMat);
    flare.position.z = 2;
    const back = new THREE.Mesh(bag(new THREE.CircleGeometry(25, 32)), portMat);
    back.position.z = -50;
    port.add(tube, flare, back);
    place(port, -205, -60);

    const badge = new THREE.Mesh(bag(new THREE.BoxGeometry(70, 16, 2.4)), [frameMat, frameMat, frameMat, frameMat, badgeMat, frameMat]);
    place(badge, -205, 56);
    badge.position.z = front + 1;

    for (const [fx, fz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx * (w / 2 - 26), feet / 2, fz * (d / 2 - 28));
      group.add(foot);
    }
    void side;
    return { group, woofer: woofer.moving, mid: mid.moving, wooferHit: woofer.hit };
  };

  return { left: build(-1), right: build(1) };
};
