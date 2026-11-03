// All sizes are in millimetres. The stack is a 1990-style midi hi-fi:
// turntable on top, then tuner, amplifier, equalizer, double tape deck and CD player.

export type Source = 'phono' | 'tuner' | 'cd' | 'tape' | 'aux';

export type Action =
  | { type: 'play'; source?: Source }
  | { type: 'pause' }
  | { type: 'toggle'; source?: Source }
  | { type: 'stop' }
  | { type: 'next'; source?: Source }
  | { type: 'prev'; source?: Source }
  | { type: 'source'; source: Source }
  | { type: 'track'; index: number; source?: Source }
  | { type: 'power' }
  | { type: 'mute' }
  | { type: 'loudness' }
  | { type: 'eqPreset'; preset: EqPresetName }
  | { type: 'eqStep'; dir: 1 | -1 }
  | { type: 'eqEffect' }
  | { type: 'repeat' }
  | { type: 'shuffle' }
  | { type: 'timeMode' }
  | { type: 'tray' }
  | { type: 'eject'; deck: 'A' | 'B' }
  | { type: 'rec' }
  | { type: 'speed' }
  | { type: 'cover' }
  | { type: 'volume'; value: number };

export const EQ_PRESETS = {
  FLAT: [0, 0, 0, 0, 0, 0, 0],
  ROCK: [4, 2, -1, -1, 1, 3, 4],
  POP: [-1, 1, 3, 4, 2, 0, -1],
  JAZZ: [3, 2, 0, 1, -1, 2, 3],
  DANCE: [6, 4, 0, -1, 1, 3, 2],
} as const;
export type EqPresetName = keyof typeof EQ_PRESETS;
export const EQ_ORDER = Object.keys(EQ_PRESETS) as EqPresetName[];
export const EQ_BANDS = [63, 160, 400, 1000, 2500, 6300, 15000];

export type UnitId = 'turntable' | 'tuner' | 'amp' | 'eq' | 'tape' | 'cd';

export type UnitDef = {
  id: UnitId;
  w: number;
  h: number;
  d: number;
  /** Height of the upper fascia; the lower strip is set back a little. */
  split: number;
};

/** Top to bottom, as on the shelf. */
export const UNITS: UnitDef[] = [
  { id: 'turntable', w: 362, h: 56, d: 340, split: 30 },
  { id: 'tuner', w: 355, h: 66, d: 300, split: 44 },
  { id: 'amp', w: 355, h: 96, d: 300, split: 62 },
  { id: 'eq', w: 355, h: 74, d: 300, split: 50 },
  { id: 'tape', w: 355, h: 112, d: 300, split: 82 },
  { id: 'cd', w: 355, h: 76, d: 300, split: 47 },
];

export const FEET = 6;

export type Rect = { x: number; y: number; w: number; h: number };

export type ButtonStyle = 'normal' | 'dark' | 'red' | 'eject' | 'key';
export type Icon = 'play' | 'pause' | 'stop' | 'next' | 'prev' | 'ff' | 'rew' | 'rec' | 'eject' | 'left' | 'right';

export type ButtonDef = Rect & {
  unit: UnitId;
  label?: string;
  sub?: string;
  icon?: Icon;
  style?: ButtonStyle;
  action: Action;
  /** Accessible name used for hover hints. */
  name: string;
};

export type DisplayId = 'tuner' | 'amp' | 'eq' | 'tapeA' | 'tapeB' | 'tapeMid' | 'cd';
export type DisplayDef = Rect & { unit: UnitId | 'extras'; id: DisplayId; ppm: number };

export type KnobDef = { unit: UnitId; id: 'volume' | 'balance'; x: number; y: number; r: number; depth: number };

const b = (
  unit: UnitId, x: number, y: number, w: number, h: number,
  name: string, action: Action, extra: Partial<ButtonDef> = {},
): ButtonDef => ({ unit, x, y, w, h, name, action, ...extra });

const presets = Array.from({ length: 10 }, (_, i) =>
  b('tuner', 58 + i * 19, 50, 17, 9, `preset ${i + 1}`, { type: 'track', index: i, source: 'tuner' }, { label: String((i + 1) % 10 === 0 ? 10 : i + 1) }));

const cdKeys = Array.from({ length: 10 }, (_, i) =>
  b('cd', 289 + (i % 5) * 12, 12 + Math.floor(i / 5) * 12, 10, 8.5, `track ${i + 1}`, { type: 'track', index: i, source: 'cd' }, { label: String(i + 1), style: 'key' }));

const eqPresetButtons = EQ_ORDER.map((preset, i) =>
  b('eq', 46 + i * 26, 57, 24, 10, `equalizer ${preset.toLowerCase()}`, { type: 'eqPreset', preset }, { label: preset }));

const sourceButtons = (['phono', 'tuner', 'cd', 'tape', 'aux'] as Source[]).map((source, i) =>
  b('amp', 46 + i * 27, 71, 25, 12, `${source} input`, { type: 'source', source }, { label: source.toUpperCase() }));

export const BUTTONS: ButtonDef[] = [
  // turntable
  b('turntable', 236, 37, 26, 11, 'speed 33 or 45', { type: 'speed' }, { label: 'SPEED' }),
  b('turntable', 270, 37, 40, 11, 'start or stop the record', { type: 'toggle', source: 'phono' }, { label: 'START·STOP' }),

  // tuner
  b('tuner', 170, 11, 30, 9, 'band', { type: 'source', source: 'tuner' }, { label: 'BAND' }),
  b('tuner', 170, 27, 15, 9, 'tune down', { type: 'prev', source: 'tuner' }, { icon: 'left' }),
  b('tuner', 185, 27, 15, 9, 'tune up', { type: 'next', source: 'tuner' }, { icon: 'right' }),
  b('tuner', 214, 11, 28, 9, 'memory', { type: 'next', source: 'tuner' }, { label: 'MEMORY' }),
  b('tuner', 214, 27, 28, 9, 'auto scan', { type: 'next', source: 'tuner' }, { label: 'SCAN' }),
  ...presets,

  // amplifier
  b('amp', 12, 24, 24, 10, 'power', { type: 'power' }, { label: 'POWER', style: 'dark' }),
  ...sourceButtons,
  b('amp', 190, 71, 30, 12, 'loudness', { type: 'loudness' }, { label: 'LOUDNESS' }),
  b('amp', 224, 71, 24, 12, 'mute', { type: 'mute' }, { label: 'MUTE' }),

  // equalizer
  b('eq', 12, 23, 24, 9, 'equalizer on or off', { type: 'eqEffect' }, { label: 'EFFECT', style: 'dark' }),
  b('eq', 248, 26, 22, 13, 'previous equalizer curve', { type: 'eqStep', dir: -1 }, { icon: 'left' }),
  b('eq', 272, 26, 22, 13, 'next equalizer curve', { type: 'eqStep', dir: 1 }, { icon: 'right' }),
  ...eqPresetButtons,

  // tape: deck A
  b('tape', 10, 91, 18, 9, 'eject deck A', { type: 'eject', deck: 'A' }, { icon: 'eject', style: 'eject' }),
  b('tape', 36, 89, 17, 12, 'rewind deck A', { type: 'prev', source: 'tape' }, { icon: 'rew' }),
  b('tape', 54, 89, 17, 12, 'stop deck A', { type: 'pause' }, { icon: 'stop' }),
  b('tape', 72, 89, 17, 12, 'play deck A', { type: 'play', source: 'tape' }, { icon: 'play' }),
  b('tape', 90, 89, 17, 12, 'fast forward deck A', { type: 'next', source: 'tape' }, { icon: 'ff' }),
  // tape: deck B
  b('tape', 196, 89, 17, 12, 'rewind deck B', { type: 'prev', source: 'tape' }, { icon: 'rew' }),
  b('tape', 214, 89, 17, 12, 'stop deck B', { type: 'pause' }, { icon: 'stop' }),
  b('tape', 232, 89, 17, 12, 'play deck B', { type: 'play', source: 'tape' }, { icon: 'play' }),
  b('tape', 250, 89, 17, 12, 'fast forward deck B', { type: 'next', source: 'tape' }, { icon: 'ff' }),
  b('tape', 268, 89, 17, 12, 'pause deck B', { type: 'pause' }, { icon: 'pause' }),
  b('tape', 286, 89, 17, 12, 'record', { type: 'rec' }, { icon: 'rec', style: 'red' }),
  b('tape', 327, 91, 18, 9, 'eject deck B', { type: 'eject', deck: 'B' }, { icon: 'eject', style: 'eject' }),
  b('tape', 148, 60, 28, 8, 'normal speed dubbing', { type: 'play', source: 'tape' }, { label: 'NORMAL' }),
  b('tape', 178, 60, 28, 8, 'high speed dubbing', { type: 'next', source: 'tape' }, { label: 'HIGH' }),

  // CD
  ...cdKeys,
  b('cd', 12, 56, 24, 10, 'cd standby', { type: 'stop' }, { label: 'POWER', style: 'dark' }),
  b('cd', 52, 57, 24, 9, 'repeat', { type: 'repeat' }, { label: 'REPEAT' }),
  b('cd', 78, 57, 24, 9, 'shuffle', { type: 'shuffle' }, { label: 'SHUFFLE' }),
  b('cd', 104, 57, 24, 9, 'time display', { type: 'timeMode' }, { label: 'TIME' }),
  b('cd', 146, 56, 28, 11, 'open or close the disc tray', { type: 'tray' }, { label: 'OPEN', sub: 'CLOSE', icon: 'eject' }),
  b('cd', 184, 54, 26, 14, 'play cd', { type: 'play', source: 'cd' }, { icon: 'play' }),
  b('cd', 212, 54, 21, 14, 'pause', { type: 'pause' }, { icon: 'pause' }),
  b('cd', 235, 54, 21, 14, 'stop', { type: 'stop' }, { icon: 'stop' }),
  b('cd', 262, 54, 21, 14, 'previous track', { type: 'prev', source: 'cd' }, { icon: 'prev' }),
  b('cd', 285, 54, 21, 14, 'next track', { type: 'next', source: 'cd' }, { icon: 'next' }),
];

export const DISPLAYS: DisplayDef[] = [
  { unit: 'tuner', id: 'tuner', x: 52, y: 8, w: 108, h: 29, ppm: 8 },
  { unit: 'amp', id: 'amp', x: 46, y: 10, w: 160, h: 38, ppm: 6 },
  { unit: 'eq', id: 'eq', x: 46, y: 8, w: 150, h: 36, ppm: 6 },
  { unit: 'tape', id: 'tapeMid', x: 146, y: 27, w: 62, h: 22, ppm: 8 },
  { unit: 'cd', id: 'cd', x: 176, y: 9, w: 104, h: 31, ppm: 8 },
  // cassette windows live on the doors (drawn in the extras strip)
  { unit: 'extras', id: 'tapeA', x: 12, y: 10, w: 104, h: 40, ppm: 6 },
  { unit: 'extras', id: 'tapeB', x: 142, y: 10, w: 104, h: 40, ppm: 6 },
];

export const KNOBS: KnobDef[] = [
  { unit: 'amp', id: 'volume', x: 300, y: 33, r: 23, depth: 17 },
  { unit: 'amp', id: 'balance', x: 300, y: 79, r: 7.5, depth: 8 },
];

/** Cassette doors and the CD tray move, so their faces are drawn apart from the fascia. */
export const DOORS = {
  A: { unit: 'tape' as const, x: 10, y: 7, w: 128, h: 72, extras: { x: 0, y: 0 } },
  B: { unit: 'tape' as const, x: 217, y: 7, w: 128, h: 72, extras: { x: 130, y: 0 } },
};
export const TRAY = { unit: 'cd' as const, x: 12, y: 21, w: 150, h: 16, extras: { x: 0, y: 74 } };

/* ---------- texture atlas ---------- */

export const ATLAS_PPM = 5;
export const ATLAS_W_MM = 362;
const GAP = 2;

export const atlasOffset: Record<UnitId | 'extras', number> = (() => {
  const offsets = {} as Record<UnitId | 'extras', number>;
  let y = 0;
  for (const unit of UNITS) {
    offsets[unit.id] = y;
    y += unit.h + GAP;
  }
  offsets.extras = y;
  return offsets;
})();

export const ATLAS_H_MM = atlasOffset.extras + 92;

/** Texture coordinates of a rectangle given in a unit's own millimetres. */
export const atlasUV = (unit: UnitId | 'extras', r: Rect) => {
  const top = atlasOffset[unit] + r.y;
  return {
    u0: r.x / ATLAS_W_MM,
    u1: (r.x + r.w) / ATLAS_W_MM,
    v0: 1 - (top + r.h) / ATLAS_H_MM,
    v1: 1 - top / ATLAS_H_MM,
  };
};

export const unitById = (id: UnitId) => UNITS.find((u) => u.id === id)!;
