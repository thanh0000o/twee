// The 3D stereo: geometry, lights, lens, interaction and the render loop.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  BUTTONS, DISPLAYS, DOORS, FEET, KNOBS, TRAY, UNITS, atlasUV,
  type Action, type ButtonDef, type Rect, type UnitDef, type UnitId,
} from './layout';
import { buildAtlas } from './atlas';
import { createDisplay, type Frame, type LiveDisplay } from './displays';
import type { StereoController } from './controller';
import { LensPass, lensToSource, sourceFov } from './post';
import { createSpeakers, SPEAKER } from './speakers';
import {
  contactShadowCanvas, discCanvas, knobCapCanvas, knurlCanvas, matCanvas, recordCanvas, screwCanvas, strobeCanvas,
} from './textures';

type Options = {
  color: string;
  reducedMotion: boolean;
  onHover?: (name: string | null) => void;
};

export type StereoScene = {
  setColor: (color: string) => void;
  dispose: () => void;
};

type Clickable = THREE.Object3D & {
  userData: {
    name: string;
    action?: Action;
    knob?: boolean;
    button?: ButtonDef;
    restZ?: number;
    pressT?: number;
  };
};

const deg = Math.PI / 180;
/** How much brighter than white the neon displays shine, so they glow through the lens. */
const NEON = 3.2;

const canvasTexture = (canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer) => {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return tex;
};

/** Rounded box whose front face shows one rectangle of the atlas. */
const faceBox = (
  w: number, h: number, d: number, uv: ReturnType<typeof atlasUV>,
  front: THREE.Material, side: THREE.Material, radius = 0.8,
) => {
  const r = Math.min(radius, w / 2 - 0.05, h / 2 - 0.05, d / 2 - 0.05);
  const geo: THREE.BufferGeometry = r > 0.1 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d);
  const pos = geo.getAttribute('position');
  const uvs = geo.getAttribute('uv') as THREE.BufferAttribute;
  const index = geo.getIndex();
  const group = geo.groups.find((g) => g.materialIndex === 4);
  if (group) {
    const done = new Set<number>();
    for (let i = group.start; i < group.start + group.count; i++) {
      const v = index ? index.getX(i) : i;
      if (done.has(v)) continue;
      done.add(v);
      const U = THREE.MathUtils.clamp(pos.getX(v) / w + 0.5, 0, 1);
      const V = THREE.MathUtils.clamp(pos.getY(v) / h + 0.5, 0, 1);
      uvs.setXY(v, uv.u0 + U * (uv.u1 - uv.u0), uv.v0 + V * (uv.v1 - uv.v0));
    }
    uvs.needsUpdate = true;
  }
  return new THREE.Mesh(geo, [side, side, side, side, front, side]);
};

/** Neon tubes never burn perfectly steady: mostly calm, now and then a short stutter. */
class Flicker {
  private until = 0;
  private next = 0;
  private level = 1;
  value(now: number, enabled: boolean) {
    if (!enabled) return 1;
    if (now > this.until && Math.random() < 0.0016) this.until = now + 120 + Math.random() * 420;
    if (now < this.until) {
      if (now > this.next) {
        this.level = Math.random() < 0.45 ? 0.18 + Math.random() * 0.3 : 0.75 + Math.random() * 0.3;
        this.next = now + 30 + Math.random() * 70;
      }
      return this.level;
    }
    return 0.97 + Math.random() * 0.05;
  }
}

export const createStereoScene = async (
  container: HTMLElement,
  controller: StereoController,
  options: Options,
): Promise<StereoScene> => {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!renderer.capabilities.isWebGL2) throw new Error('WebGL2 needed');
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'stereo-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const lens = new LensPass(finePointer ? 4 : 2);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.7;

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d4ca, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(-420, 1300, 900);
  key.target.position.set(0, 220, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -800, right: 800, top: 700, bottom: -700, near: 200, far: 3600 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.9;
  key.shadow.radius = 10;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xe4ecff, 0.55);
  fill.position.set(800, 300, 600);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(200, 700, -900);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- materials ---------- */
  const atlasCanvas = await buildAtlas();
  const atlas = canvasTexture(atlasCanvas, renderer);
  const faceMat = new THREE.MeshStandardMaterial({ map: atlas, roughness: 0.5, metalness: 0.1 });
  const plasticMat = new THREE.MeshStandardMaterial({ color: 0x2b2c30, roughness: 0.45, metalness: 0.12 });
  const caseMat = new THREE.MeshStandardMaterial({ color: 0x26272a, roughness: 0.38, metalness: 0.2 });
  const footMat = new THREE.MeshStandardMaterial({ color: 0x0f1012, roughness: 0.85 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xc4c7cc, roughness: 0.24, metalness: 1, envMapIntensity: 0.8 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x151618, roughness: 0.45, metalness: 0.3 });

  const disposables: { dispose: () => void }[] = [envTex, pmrem, atlas, faceMat, plasticMat, caseMat, footMat, silverMat, darkMat, lens, ground.geometry, ground.material];
  const bag = <T extends { dispose: () => void }>(item: T) => { disposables.push(item); return item; };

  const root = new THREE.Group();
  scene.add(root);
  const clickables: Clickable[] = [];
  const pressables: Clickable[] = [];
  const unitTop: Partial<Record<UnitId, number>> = {};
  const unitDef: Partial<Record<UnitId, UnitDef>> = {};

  const frontZ = (unit: UnitDef, y: number) => (y < unit.split ? unit.d / 2 + 4 : unit.d / 2 + 2);
  const place = (unit: UnitDef, r: Rect) => ({
    x: -unit.w / 2 + r.x + r.w / 2,
    y: unitTop[unit.id]! - (r.y + r.h / 2),
    z: frontZ(unit, r.y),
  });
  const addClickable = (obj: THREE.Object3D, name: string, action?: Action) => {
    const c = obj as Clickable;
    c.userData = { ...c.userData, name, action };
    clickables.push(c);
    return c;
  };

  const shadowTex = bag(canvasTexture(contactShadowCanvas(), renderer));
  const shadowMat = bag(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, color: 0x000000, opacity: 0.85 }));
  const contactShadow = (w: number, d: number) => {
    const m = new THREE.Mesh(bag(new THREE.PlaneGeometry(w * 1.6, d * 1.6).rotateX(-Math.PI / 2)), shadowMat);
    m.position.y = 0.4;
    m.renderOrder = -1;
    return m;
  };
  root.add(contactShadow(370, 350));

  /* ---------- the units ---------- */
  const screwTex = bag(canvasTexture(screwCanvas(), renderer));
  const screwMat = bag(new THREE.MeshStandardMaterial({ map: screwTex, roughness: 0.3, metalness: 0.9 }));
  const screwGeo = bag(new THREE.CylinderGeometry(2.6, 2.6, 1.2, 18).rotateZ(Math.PI / 2));
  const footGeo = bag(new THREE.CylinderGeometry(9, 10, FEET, 24));

  let y = 0;
  for (const unit of [...UNITS].reverse()) {
    const bottom = y + FEET;
    const top = bottom + unit.h;
    unitTop[unit.id] = top;
    unitDef[unit.id] = unit;

    const body = new THREE.Mesh(bag(new RoundedBoxGeometry(unit.w, unit.h, unit.d, 4, 3.2)), caseMat);
    body.position.set(0, bottom + unit.h / 2, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    for (const [fx, fz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx * (unit.w / 2 - 30), y + FEET / 2, fz * (unit.d / 2 - 32));
      root.add(foot);
    }
    // side screws, like on the real cabinets
    for (const sx of [-1, 1]) {
      for (const sy of [unit.h - 9, 9]) {
        const screw = new THREE.Mesh(screwGeo, screwMat);
        screw.position.set(sx * (unit.w / 2 + 0.4), bottom + sy, unit.d / 2 - 16);
        root.add(screw);
      }
    }

    const upper = faceBox(unit.w - 1, unit.split, 5, atlasUV(unit.id, { x: 0, y: 0, w: unit.w, h: unit.split }), faceMat, plasticMat, 1.6);
    upper.position.set(0, top - unit.split / 2, unit.d / 2 + 1.5);
    const lower = faceBox(unit.w - 6, unit.h - unit.split, 3, atlasUV(unit.id, { x: 3, y: unit.split, w: unit.w - 6, h: unit.h - unit.split }), faceMat, plasticMat, 1.2);
    lower.position.set(0, bottom + (unit.h - unit.split) / 2, unit.d / 2 + 0.5);
    for (const m of [upper, lower]) {
      bag(m.geometry);
      m.receiveShadow = true;
      root.add(m);
    }
    y = top;
  }
  const stackTop = y;

  /* ---------- buttons ---------- */
  for (const btn of BUTTONS) {
    const unit = unitDef[btn.unit]!;
    const mesh = faceBox(btn.w, btn.h, 3, atlasUV(btn.unit, btn), faceMat, plasticMat, 0.9);
    bag(mesh.geometry);
    const p = place(unit, btn);
    mesh.position.set(p.x, p.y, p.z + 1.2);
    root.add(mesh);
    const c = addClickable(mesh, btn.name, btn.action);
    c.userData.button = btn;
    c.userData.restZ = p.z + 1.2;
    pressables.push(c);
  }

  /* ---------- displays ---------- */
  const displays: { live: LiveDisplay; tex: THREE.CanvasTexture; mat: THREE.MeshBasicMaterial; flicker: Flicker }[] = [];
  const displayPlane = (live: LiveDisplay) => {
    const tex = canvasTexture(live.canvas, renderer);
    // mipmaps keep small, far-away displays from sparkling into white
    tex.anisotropy = 4;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    bag(tex);
    const mat = bag(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    mat.color.setScalar(NEON);
    const geo = bag(new THREE.PlaneGeometry(live.def.w, live.def.h));
    const mesh = new THREE.Mesh(geo, mat);
    displays.push({ live, tex, mat, flicker: new Flicker() });
    return mesh;
  };
  for (const def of DISPLAYS) {
    if (def.unit === 'extras') continue;
    const unit = unitDef[def.unit]!;
    const mesh = displayPlane(createDisplay(def));
    const p = place(unit, def);
    mesh.position.set(p.x, p.y, p.z + 0.05);
    root.add(mesh);
  }

  /* ---------- cassette doors ---------- */
  const doors: Record<'A' | 'B', THREE.Group> = { A: new THREE.Group(), B: new THREE.Group() };
  (['A', 'B'] as const).forEach((deck) => {
    const door = DOORS[deck];
    const unit = unitDef.tape!;
    const hinge = doors[deck];
    hinge.position.set(-unit.w / 2 + door.x + door.w / 2, unitTop.tape! - (door.y + door.h), frontZ(unit, door.y));
    const face = faceBox(door.w, door.h, 3, atlasUV('extras', { x: door.extras.x, y: door.extras.y, w: door.w, h: door.h }), faceMat, plasticMat, 1.2);
    bag(face.geometry);
    face.position.set(0, door.h / 2, 1.5);
    hinge.add(face);
    addClickable(face, `eject deck ${deck}`, { type: 'eject', deck });
    const def = DISPLAYS.find((d) => d.id === (deck === 'A' ? 'tapeA' : 'tapeB'))!;
    const win = displayPlane(createDisplay(def));
    win.position.set(-door.w / 2 + (def.x - door.extras.x) + def.w / 2, door.h - (def.y - door.extras.y + def.h / 2), 3.06);
    hinge.add(win);
    root.add(hinge);
  });

  /* ---------- CD tray ---------- */
  const trayGroup = new THREE.Group();
  {
    const unit = unitDef.cd!;
    const p = place(unit, TRAY);
    trayGroup.position.set(p.x, p.y, p.z - 60 + 1);
    const tray = faceBox(TRAY.w, TRAY.h, 120, atlasUV('extras', { x: TRAY.extras.x, y: TRAY.extras.y, w: TRAY.w, h: TRAY.h }), faceMat, plasticMat, 1);
    bag(tray.geometry);
    trayGroup.add(tray);
    addClickable(tray, 'open or close the disc tray', { type: 'tray' });
    const discTex = bag(canvasTexture(discCanvas(), renderer));
    const discMat = bag(new THREE.MeshStandardMaterial({ map: discTex, metalness: 0.85, roughness: 0.18, envMapIntensity: 0.9 }));
    const disc = new THREE.Mesh(bag(new THREE.CylinderGeometry(59, 59, 1.2, 96)), [plasticMat, discMat, plasticMat]);
    disc.position.set(0, TRAY.h / 2 + 0.7, 0);
    const hole = new THREE.Mesh(bag(new THREE.CylinderGeometry(7.5, 7.5, 1.5, 32)), darkMat);
    hole.position.copy(disc.position);
    hole.position.y += 0.1;
    trayGroup.add(disc, hole);
    root.add(trayGroup);
  }
  const trayClosedZ = trayGroup.position.z;

  /* ---------- knobs ---------- */
  const capTex = bag(canvasTexture(knobCapCanvas(), renderer));
  const knurlTex = bag(canvasTexture(knurlCanvas(), renderer));
  knurlTex.wrapS = THREE.RepeatWrapping;
  knurlTex.repeat.set(48, 1);
  const capMat = bag(new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.3, metalness: 0.6 }));
  const knurlMat = bag(new THREE.MeshStandardMaterial({ map: knurlTex, roughness: 0.45, metalness: 0.35 }));
  const knobs: Record<string, THREE.Group> = {};
  for (const k of KNOBS) {
    const unit = unitDef[k.unit]!;
    const group = new THREE.Group();
    group.position.set(-unit.w / 2 + k.x, unitTop[k.unit]! - k.y, frontZ(unit, k.y));
    const geo = bag(new THREE.CylinderGeometry(k.r * 0.96, k.r, k.depth, 96));
    geo.rotateX(Math.PI / 2);
    const mesh = new THREE.Mesh(geo, [knurlMat, capMat, plasticMat]);
    mesh.position.z = k.depth / 2;
    mesh.castShadow = true;
    group.add(mesh);
    const bevel = new THREE.Mesh(bag(new THREE.TorusGeometry(k.r * 0.95, Math.max(0.6, k.r * 0.035), 10, 96)), silverMat);
    bevel.position.z = k.depth;
    group.add(bevel);
    const skirt = new THREE.Mesh(bag(new THREE.CylinderGeometry(k.r * 1.12, k.r * 1.14, 1.4, 96).rotateX(Math.PI / 2)), darkMat);
    skirt.position.z = 0.7;
    group.add(skirt);
    root.add(group);
    knobs[k.id] = group;
    if (k.id === 'volume') {
      const c = addClickable(mesh, 'drag to turn the volume');
      c.userData.knob = true;
    }
  }

  /* ---------- LEDs ---------- */
  const ledGeo = bag(new THREE.SphereGeometry(1.25, 16, 10).scale(1, 1, 0.55));
  const leds: { mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>; get: () => [string, boolean] }[] = [];
  const addLed = (unitId: UnitId, x: number, yy: number, get: () => [string, boolean]) => {
    const unit = unitDef[unitId]!;
    const mat = bag(new THREE.MeshBasicMaterial({ color: 0x220000, toneMapped: false }));
    const mesh = new THREE.Mesh(ledGeo, mat);
    mesh.position.set(-unit.w / 2 + x, unitTop[unitId]! - yy, frontZ(unit, yy) + 0.2);
    root.add(mesh);
    leds.push({ mesh, get });
  };
  const OFF = '#3a1714';
  const st = () => controller.state;
  addLed('turntable', 224, 39.5, () => [st().power && !st().speed45 ? '#ffb24a' : OFF, st().power && !st().speed45]);
  addLed('turntable', 224, 45.5, () => [st().power && st().speed45 ? '#ffb24a' : OFF, st().power && st().speed45]);
  addLed('amp', 24, 41.5, () => [st().power ? '#6dff7a' : '#ff3b30', true]);
  addLed('eq', 24, 35.5, () => [st().power && st().eqOn ? '#ffb24a' : OFF, st().power && st().eqOn]);
  addLed('cd', 24, 73, () => [st().power ? '#6dff7a' : '#ff3b30', true]);
  addLed('tape', 294.5, 86.2, () => [st().power && st().rec ? '#ff3b30' : OFF, st().power && st().rec]);

  /* ---------- turntable top ---------- */
  const tt = unitDef.turntable!;
  const deckY = unitTop.turntable!;
  const platterCenter = new THREE.Vector3(-20, deckY, 6);
  const spin = new THREE.Group();
  spin.position.copy(platterCenter);
  root.add(spin);
  const strobeTex = bag(canvasTexture(strobeCanvas(), renderer));
  const rimMat = bag(new THREE.MeshStandardMaterial({ map: strobeTex, roughness: 0.25, metalness: 0.95 }));
  const rimMesh = new THREE.Mesh(bag(new THREE.CylinderGeometry(150, 150, 10, 160, 1)), [rimMat, silverMat, silverMat]);
  rimMesh.position.y = 7;
  rimMesh.castShadow = true;
  spin.add(rimMesh);
  const matTex = bag(canvasTexture(matCanvas(), renderer));
  const matMesh = new THREE.Mesh(bag(new THREE.CylinderGeometry(146, 146, 2, 160)), [darkMat, bag(new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.9 })), darkMat]);
  matMesh.position.y = 12.2;
  spin.add(matMesh);
  const first = controller.tracks[0];
  const recordTex = bag(canvasTexture(recordCanvas(first?.album ?? 'radio', first?.artist ?? 'thanh'), renderer));
  const recordMat = bag(new THREE.MeshPhysicalMaterial({ map: recordTex, roughness: 0.28, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
  const record = new THREE.Mesh(bag(new THREE.CylinderGeometry(151, 151, 1.6, 192)), [darkMat, recordMat, darkMat]);
  record.position.y = 14;
  record.castShadow = true;
  spin.add(record);
  const spindle = new THREE.Mesh(bag(new THREE.CylinderGeometry(3.4, 3.4, 12, 24)), silverMat);
  spindle.position.y = 17;
  spin.add(spindle);
  addClickable(record, 'play or stop the record', { type: 'toggle', source: 'phono' });
  addClickable(rimMesh, 'play or stop the record', { type: 'toggle', source: 'phono' });

  const puck = new THREE.Mesh(bag(new THREE.CylinderGeometry(14, 14.5, 9, 48)), darkMat);
  puck.position.set(-tt.w / 2 + 30, deckY + 4.5, -tt.d / 2 + 38);
  puck.castShadow = true;
  root.add(puck);

  // tonearm
  const pivot = new THREE.Vector3(152, deckY, -100);
  const base = new THREE.Mesh(bag(new THREE.CylinderGeometry(17, 19, 10, 48)), darkMat);
  base.position.set(pivot.x, deckY + 5, pivot.z);
  base.castShadow = true;
  const post = new THREE.Mesh(bag(new THREE.CylinderGeometry(5, 5, 20, 24)), silverMat);
  post.position.set(pivot.x, deckY + 18, pivot.z);
  const cue = new THREE.Mesh(bag(new THREE.BoxGeometry(4, 12, 4)), silverMat);
  cue.position.set(pivot.x + 26, deckY + 6, pivot.z + 22);
  const cueKnob = new THREE.Mesh(bag(new THREE.SphereGeometry(3.4, 16, 12)), darkMat);
  cueKnob.position.set(pivot.x + 26, deckY + 13, pivot.z + 22);
  root.add(base, post, cue, cueKnob);
  const arm = new THREE.Group();
  arm.position.set(pivot.x, deckY + 26, pivot.z);
  const ARM = 232;
  const tube = new THREE.Mesh(bag(new THREE.CylinderGeometry(3, 3, ARM, 20).rotateX(Math.PI / 2)), silverMat);
  tube.position.z = ARM / 2 - 10;
  tube.castShadow = true;
  const weight = new THREE.Mesh(bag(new THREE.CylinderGeometry(11, 11, 24, 40).rotateX(Math.PI / 2)), darkMat);
  weight.position.z = -30;
  weight.castShadow = true;
  const weightRing = new THREE.Mesh(bag(new THREE.TorusGeometry(11, 0.8, 8, 40)), silverMat);
  weightRing.position.z = -18;
  const shell = new THREE.Mesh(bag(new RoundedBoxGeometry(17, 5, 34, 2, 1.2)), darkMat);
  shell.position.set(-3, -2, ARM - 4);
  shell.rotation.y = -18 * deg;
  shell.castShadow = true;
  const cart = new THREE.Mesh(bag(new RoundedBoxGeometry(11, 9, 17, 2, 1)), bag(new THREE.MeshStandardMaterial({ color: 0xb08a3a, roughness: 0.3, metalness: 0.75 })));
  cart.position.set(-3, -8, ARM - 2);
  cart.rotation.y = -18 * deg;
  const lift = new THREE.Mesh(bag(new THREE.BoxGeometry(2, 2, 14)), silverMat);
  lift.position.set(6, 0, ARM + 6);
  lift.rotation.y = 30 * deg;
  arm.add(tube, weight, weightRing, shell, cart, lift);
  root.add(arm);
  addClickable(tube, 'play or stop the record', { type: 'toggle', source: 'phono' });
  const rest = new THREE.Mesh(bag(new THREE.BoxGeometry(8, 20, 8)), darkMat);
  rest.position.set(pivot.x + 1, deckY + 10, pivot.z + 150);
  root.add(rest);

  const armAngleFor = (radius: number) => {
    let best = 0;
    let bestErr = Infinity;
    for (let a = 0; a > -1.4; a -= 0.002) {
      const tx = pivot.x + Math.sin(a) * (ARM - 2);
      const tz = pivot.z + Math.cos(a) * (ARM - 2);
      const err = Math.abs(Math.hypot(tx - platterCenter.x, tz - platterCenter.z) - radius);
      if (err < bestErr) { bestErr = err; best = a; }
    }
    return best;
  };
  const armOuter = armAngleFor(144);
  const armInner = armAngleFor(64);

  // dust cover
  const coverPivot = new THREE.Group();
  coverPivot.position.set(0, deckY, -tt.d / 2 + 3);
  const coverMat = bag(new THREE.MeshPhysicalMaterial({
    color: 0x16181d, transparent: true, opacity: 0.34, roughness: 0.04, metalness: 0.1, clearcoat: 0.5,
    depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.5,
  }));
  const hidden = bag(new THREE.MeshBasicMaterial({ visible: false }));
  const cover = new THREE.Mesh(bag(new RoundedBoxGeometry(tt.w - 4, 44, tt.d - 4, 3, 3)), [coverMat, coverMat, coverMat, hidden, coverMat, coverMat]);
  cover.position.set(0, 22.4, (tt.d - 4) / 2);
  cover.renderOrder = 2;
  coverPivot.add(cover);
  for (const hx of [-110, 110]) {
    const hinge = new THREE.Mesh(bag(new RoundedBoxGeometry(22, 14, 10, 2, 1.5)), darkMat);
    hinge.position.set(hx, 6, -2);
    coverPivot.add(hinge);
  }
  root.add(coverPivot);
  addClickable(cover, 'open or close the lid', { type: 'cover' });

  /* ---------- speakers ---------- */
  const speakers = createSpeakers(renderer, bag);
  const spread = tt.w / 2 + 52 + SPEAKER.w / 2;
  for (const [sp, side] of [[speakers.left, -1], [speakers.right, 1]] as const) {
    sp.group.position.set(side * spread, 0, -18);
    sp.group.rotation.y = -side * 0.2;
    sp.group.add(contactShadow(SPEAKER.w, SPEAKER.d));
    root.add(sp.group);
    addClickable(sp.wooferHit, 'boost the bass', { type: 'loudness' });
  }
  const halfWidth = spread + SPEAKER.w / 2 + 30;

  /* ---------- camera and framing ---------- */
  const camera = new THREE.PerspectiveCamera(60, 1, 10, 40000);
  const stackHeight = stackTop + 46;
  const view = { yaw: -0.22, pitch: 0.2, targetYaw: -0.22, targetPitch: 0.2, sway: 0 };
  let cssW = 1;
  let cssH = 1;

  const frame = (lidOpen: number) => {
    const aspect = camera.aspect;
    const tanV = Math.tan((camera.fov * deg) / 2);
    const h = stackHeight + lidOpen * 200;
    const halfH = h * 0.5 + 60;
    const fitW = aspect >= 1.05 ? halfWidth : 215;
    const dist = Math.max(halfH / (tanV * 0.97), fitW / (tanV * aspect * 1.02)) + 300;
    const target = new THREE.Vector3(0, h * 0.5 - (aspect < 0.8 ? 150 : 0), 40);
    const yaw = view.yaw + view.sway;
    camera.position.set(
      target.x + Math.sin(yaw) * Math.cos(view.pitch) * dist,
      target.y + Math.sin(view.pitch) * dist,
      target.z + Math.cos(yaw) * Math.cos(view.pitch) * dist,
    );
    camera.lookAt(target);
  };

  const resize = () => {
    cssW = Math.max(1, container.clientWidth);
    cssH = Math.max(1, container.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(ratio);
    renderer.setSize(cssW, cssH, false);
    const pixels = cssW * cssH * ratio * ratio;
    const scale = Math.min(1.25, Math.sqrt(3.2e6 / pixels));
    lens.setSize(Math.round(cssW * ratio), Math.round(cssH * ratio), scale, ratio);
    camera.aspect = cssW / cssH;
    camera.fov = sourceFov(camera.aspect);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  /* ---------- interaction ---------- */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    lensToSource(x, y, rect.width / rect.height, ndc);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(clickables, false);
    return (hits[0]?.object as Clickable | undefined) ?? null;
  };

  let drag: { id: number; x: number; y: number; yaw: number; pitch: number; knob: boolean; vol: number; moved: number } | null = null;
  let lastInteract = performance.now();
  let hovered: Clickable | null = null;
  let pendingTap: Clickable | null = null;

  const onDown = (e: PointerEvent) => {
    lastInteract = performance.now();
    const hit = pick(e.clientX, e.clientY);
    drag = {
      id: e.pointerId, x: e.clientX, y: e.clientY, yaw: view.targetYaw, pitch: view.targetPitch,
      knob: Boolean(hit?.userData.knob), vol: controller.state.volume, moved: 0,
    };
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
      lastInteract = performance.now();
      if (drag.knob) {
        controller.dispatch({ type: 'volume', value: drag.vol + (dx - dy) * 0.004 });
      } else if (drag.moved > 4) {
        view.targetYaw = THREE.MathUtils.clamp(drag.yaw - dx * 0.005, -0.75, 0.75);
        view.targetPitch = THREE.MathUtils.clamp(drag.pitch + dy * 0.004, -0.05, 0.75);
      }
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const hit = pick(e.clientX, e.clientY);
    if (hit !== hovered) {
      hovered = hit;
      canvas.style.cursor = hit ? (hit.userData.knob ? 'ns-resize' : 'pointer') : 'grab';
      options.onHover?.(hit?.userData.name ?? null);
    }
  };
  // Actions run in the click event, so browsers treat them as a real tap (needed to start audio on phones).
  const onUp = (e: PointerEvent) => {
    if (!drag || drag.id !== e.pointerId) return;
    const wasClick = drag.moved < 6 && !drag.knob;
    drag = null;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    pendingTap = null;
    if (!wasClick) return;
    const hit = pick(e.clientX, e.clientY);
    if (!hit?.userData.action) return;
    if (hit.userData.button) hit.userData.pressT = 0;
    pendingTap = hit;
  };
  const onClick = () => {
    const hit = pendingTap;
    pendingTap = null;
    if (hit?.userData.action) controller.dispatch(hit.userData.action);
  };
  const onCancel = () => { drag = null; };
  const onLeave = () => {
    if (hovered) { hovered = null; options.onHover?.(null); }
  };
  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  /* ---------- loop ---------- */
  let color = options.color;
  let running = true;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let lastPaint = 0;
  const start = last;
  const anim = { cover: 0, tray: 0, doorA: 0, doorB: 0, spin: 0, arm: 0, armLift: 0, bass: 0, mid: 0 };
  const approach = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * Math.min(1, dt * rate);
  let bands: number[] = [0, 0, 0, 0, 0, 0, 0];
  const ledFlicker = new Flicker();
  const flickerOn = !options.reducedMotion;

  const tick = (now: number) => {
    raf = 0;
    if (!running || !visible) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const t = (now - start) / 1000;
    const s = controller.state;

    if (!options.reducedMotion && now - lastInteract > 6000 && !drag) view.sway = approach(view.sway, Math.sin(t * 0.16) * 0.08, 0.6, dt);
    else view.sway = approach(view.sway, 0, 3, dt);
    view.yaw = approach(view.yaw, view.targetYaw, 7, dt);
    view.pitch = approach(view.pitch, view.targetPitch, 7, dt);
    anim.cover = approach(anim.cover, s.coverOpen ? 1 : 0, 4, dt);
    frame(anim.cover);

    coverPivot.rotation.x = -anim.cover * 72 * deg;
    anim.tray = approach(anim.tray, s.trayOpen ? 1 : 0, 5, dt);
    trayGroup.position.z = trayClosedZ + anim.tray * 104;
    anim.doorA = approach(anim.doorA, s.doorA ? 1 : 0, 7, dt);
    anim.doorB = approach(anim.doorB, s.doorB ? 1 : 0, 7, dt);
    doors.A.rotation.x = anim.doorA * 0.42;
    doors.B.rotation.x = anim.doorB * 0.42;

    const phono = s.power && s.playing && s.source === 'phono';
    const rpm = s.speed45 ? 45 : 33.333;
    anim.spin = approach(anim.spin, phono ? (rpm / 60) * Math.PI * 2 : 0, phono ? 2.2 : 1.1, dt);
    spin.rotation.y -= anim.spin * dt;
    const progress = s.duration ? Math.min(1, controller.time / s.duration) : 0;
    const armTarget = phono ? armOuter + (armInner - armOuter) * progress : 0;
    anim.arm = approach(anim.arm, armTarget, 2.6, dt);
    const moving = Math.abs(anim.arm - armTarget) > 0.004;
    anim.armLift = approach(anim.armLift, moving || !phono ? 1 : 0, 6, dt);
    arm.rotation.y = anim.arm;
    arm.position.y = deckY + 26 + anim.armLift * 5 - (1 - anim.armLift) * 1.5;
    arm.rotation.x = -(1 - anim.armLift) * 0.035;

    // speakers breathe with the bass
    const sound = s.power && s.playing && !s.muted;
    anim.bass = approach(anim.bass, sound ? (bands[0] + bands[1]) / 2 : 0, 18, dt);
    anim.mid = approach(anim.mid, sound ? (bands[2] + bands[3]) / 2 : 0, 18, dt);
    for (const sp of [speakers.left, speakers.right]) {
      sp.woofer.position.z = anim.bass * anim.bass * 7 * (0.4 + s.volume);
      sp.mid.position.z = anim.mid * 2.5 * (0.4 + s.volume);
    }

    for (const b of pressables) {
      if (b.userData.pressT === undefined) continue;
      b.userData.pressT += dt;
      const p = b.userData.pressT;
      const depth = p < 0.08 ? p / 0.08 : Math.max(0, 1 - (p - 0.08) / 0.16);
      b.position.z = b.userData.restZ! - depth * 1.8;
      if (p > 0.3) { b.position.z = b.userData.restZ!; b.userData.pressT = undefined; }
    }

    knobs.volume.rotation.z = -(-135 + 270 * s.volume) * deg;

    const ledLevel = ledFlicker.value(now, flickerOn);
    for (const led of leds) {
      const [hex, lit] = led.get();
      led.mesh.material.color.set(hex);
      if (lit) led.mesh.material.color.multiplyScalar(3.2 * ledLevel);
    }
    for (const d of displays) {
      const tape = d.live.def.id === 'tapeA' || d.live.def.id === 'tapeB';
      d.mat.color.setScalar(tape ? 1.15 : NEON * d.flicker.value(now, flickerOn && s.power));
    }

    if (now - lastPaint > 33) {
      lastPaint = now;
      bands = controller.readBands();
      const frameData: Frame = {
        state: s,
        track: controller.tracks[s.track],
        trackCount: controller.tracks.length,
        bands,
        levels: controller.readLevels(),
        t,
        time: controller.time,
        color,
      };
      for (const d of displays) if (d.live.paint(frameData)) d.tex.needsUpdate = true;
    }

    lens.render(renderer, scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!raf && running && visible) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && document.visibilityState === 'visible';
    wake();
  });
  io.observe(container);
  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  wake();

  return {
    setColor: (next) => { color = next; },
    dispose: () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      for (const item of disposables) item.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
};
