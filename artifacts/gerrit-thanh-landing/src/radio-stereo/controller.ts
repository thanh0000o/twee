// State and sound for the stereo. The 3D scene and the HTML controls both talk to this.
import { EQ_BANDS, EQ_ORDER, EQ_PRESETS, type Action, type EqPresetName, type Source } from './layout';

export type Track = { title: string; artist: string; album: string; src: string };

export type StereoState = {
  power: boolean;
  playing: boolean;
  source: Source;
  track: number;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  loudness: boolean;
  eqPreset: EqPresetName;
  eqOn: boolean;
  repeat: boolean;
  shuffle: boolean;
  timeMode: 'elapsed' | 'remain';
  coverOpen: boolean;
  trayOpen: boolean;
  doorA: boolean;
  doorB: boolean;
  rec: boolean;
  speed45: boolean;
  error: string;
};

const BAND_EDGES = EQ_BANDS.map((f) => [f / 1.41, f * 1.41]);

export class StereoController {
  readonly tracks: Track[];
  state: StereoState;
  private listeners = new Set<() => void>();
  private audio: HTMLAudioElement;
  private ctx?: AudioContext;
  private filters: BiquadFilterNode[] = [];
  private loud?: BiquadFilterNode;
  private gain?: GainNode;
  private analyser?: AnalyserNode;
  private splitL?: AnalyserNode;
  private splitR?: AnalyserNode;
  private freq = new Uint8Array(0);
  private wave = new Float32Array(0);
  private bands = new Array(7).fill(0);
  private levels: [number, number] = [0, 0];
  private lastNotify = 0;

  constructor(tracks: Track[]) {
    this.tracks = tracks;
    this.state = {
      power: true, playing: false, source: 'phono', track: 0, position: 0, duration: 0,
      volume: 0.7, muted: false, loudness: false, eqPreset: 'FLAT', eqOn: true,
      repeat: false, shuffle: false, timeMode: 'elapsed', coverOpen: false, trayOpen: false,
      doorA: false, doorB: false, rec: false, speed45: false, error: '',
    };
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.crossOrigin = 'anonymous';
    this.audio.src = tracks[0]?.src ?? '';
    this.audio.volume = this.state.volume;
    this.audio.addEventListener('timeupdate', () => this.patch({ position: this.audio.currentTime }, true));
    this.audio.addEventListener('durationchange', () => this.patch({ duration: this.audio.duration || 0 }));
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('pause', () => { if (this.state.playing && !this.audio.ended) this.patch({ playing: false }); });
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  };

  getSnapshot = () => this.state;

  private patch(next: Partial<StereoState>, throttle = false) {
    this.state = { ...this.state, ...next };
    const now = performance.now();
    if (throttle && now - this.lastNotify < 250) return;
    this.lastNotify = now;
    this.listeners.forEach((fn) => fn());
  }

  /** Builds the Web Audio graph on the first click, as browsers require. */
  private ensureGraph() {
    if (this.ctx || typeof window === 'undefined') return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    try {
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(this.audio);
      this.filters = EQ_BANDS.map((frequency) => {
        const f = ctx.createBiquadFilter();
        f.type = 'peaking';
        f.frequency.value = frequency;
        f.Q.value = 1.1;
        return f;
      });
      this.loud = ctx.createBiquadFilter();
      this.loud.type = 'lowshelf';
      this.loud.frequency.value = 120;
      this.gain = ctx.createGain();
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.72;
      const splitter = ctx.createChannelSplitter(2);
      this.splitL = ctx.createAnalyser();
      this.splitR = ctx.createAnalyser();
      this.splitL.fftSize = 512;
      this.splitR.fftSize = 512;
      let node: AudioNode = source;
      for (const f of this.filters) { node.connect(f); node = f; }
      node.connect(this.loud);
      this.loud.connect(this.gain);
      this.gain.connect(this.analyser);
      this.analyser.connect(ctx.destination);
      this.gain.connect(splitter);
      splitter.connect(this.splitL, 0);
      splitter.connect(this.splitR, 1);
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      this.wave = new Float32Array(this.splitL.fftSize);
      this.ctx = ctx;
      this.audio.volume = 1;
      this.applySound();
    } catch {
      this.ctx = undefined;
    }
  }

  private applySound() {
    const { volume, muted, power, loudness, eqOn, eqPreset } = this.state;
    const level = power && !muted ? volume * volume : 0;
    if (this.gain && this.ctx) {
      this.gain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.03);
      const gains = eqOn ? EQ_PRESETS[eqPreset] : EQ_PRESETS.FLAT;
      this.filters.forEach((f, i) => f.gain.setTargetAtTime(gains[i], this.ctx!.currentTime, 0.05));
      this.loud?.gain.setTargetAtTime(loudness ? 7 : 0, this.ctx.currentTime, 0.05);
    } else {
      this.audio.volume = level;
    }
  }

  private async play() {
    if (!this.state.power) this.patch({ power: true });
    this.ensureGraph();
    if (this.ctx?.state === 'suspended') await this.ctx.resume().catch(() => undefined);
    try {
      await this.audio.play();
      this.patch({ playing: true, error: '', trayOpen: this.state.source === 'cd' ? false : this.state.trayOpen });
    } catch {
      this.patch({ playing: false, error: 'this track could not be played.' });
    }
  }

  private pause() {
    this.audio.pause();
    this.patch({ playing: false });
  }

  private load(index: number, keepPlaying: boolean) {
    const count = this.tracks.length;
    const next = ((index % count) + count) % count;
    this.audio.src = this.tracks[next].src;
    this.audio.currentTime = 0;
    this.patch({ track: next, position: 0, duration: 0 });
    if (keepPlaying) void this.play();
  }

  private step(dir: 1 | -1) {
    const { shuffle, track, position } = this.state;
    if (dir === -1 && position > 4) {
      this.audio.currentTime = 0;
      return;
    }
    let next = track + dir;
    if (shuffle && this.tracks.length > 1) {
      do next = Math.floor(Math.random() * this.tracks.length); while (next === track);
    }
    this.load(next, this.state.playing);
  }

  private onEnded() {
    const { track, repeat, shuffle } = this.state;
    if (shuffle || repeat || track < this.tracks.length - 1) {
      this.patch({ playing: true });
      this.step(1);
    } else {
      this.patch({ playing: false });
      this.load(0, false);
    }
  }

  private useSource(source?: Source) {
    if (source && source !== this.state.source) this.patch({ source });
  }

  dispatch = (action: Action) => {
    const s = this.state;
    switch (action.type) {
      case 'play':
        this.useSource(action.source);
        if (action.source === 'tape') this.patch({ doorA: false });
        void this.play();
        break;
      case 'toggle':
        if (s.playing && (!action.source || action.source === s.source)) this.pause();
        else { this.useSource(action.source); void this.play(); }
        break;
      case 'pause': this.pause(); break;
      case 'stop':
        this.pause();
        this.audio.currentTime = 0;
        this.patch({ position: 0 });
        break;
      case 'next': this.useSource(action.source); this.step(1); break;
      case 'prev': this.useSource(action.source); this.step(-1); break;
      case 'source':
        this.useSource(action.source);
        if (!s.power) this.patch({ power: true });
        break;
      case 'track':
        this.useSource(action.source);
        if (action.index === s.track) void this.play();
        else this.load(action.index, true);
        break;
      case 'power':
        if (s.power) this.pause();
        this.patch({ power: !s.power });
        break;
      case 'mute': this.patch({ muted: !s.muted }); break;
      case 'loudness': this.patch({ loudness: !s.loudness }); break;
      case 'eqPreset': this.patch({ eqPreset: action.preset, eqOn: true }); break;
      case 'eqStep': {
        const i = EQ_ORDER.indexOf(s.eqPreset);
        this.patch({ eqPreset: EQ_ORDER[(i + action.dir + EQ_ORDER.length) % EQ_ORDER.length], eqOn: true });
        break;
      }
      case 'eqEffect': this.patch({ eqOn: !s.eqOn }); break;
      case 'repeat': this.patch({ repeat: !s.repeat }); break;
      case 'shuffle': this.patch({ shuffle: !s.shuffle }); break;
      case 'timeMode': this.patch({ timeMode: s.timeMode === 'elapsed' ? 'remain' : 'elapsed' }); break;
      case 'tray':
        if (!s.trayOpen && s.playing && s.source === 'cd') this.pause();
        this.patch({ trayOpen: !s.trayOpen });
        break;
      case 'eject':
        if (action.deck === 'A' && s.playing && s.source === 'tape') this.pause();
        this.patch(action.deck === 'A' ? { doorA: !s.doorA } : { doorB: !s.doorB });
        break;
      case 'rec': this.patch({ rec: !s.rec }); break;
      case 'speed': this.patch({ speed45: !s.speed45 }); break;
      case 'cover': this.patch({ coverOpen: !s.coverOpen }); break;
      case 'volume': this.patch({ volume: Math.min(1, Math.max(0, action.value)) }); break;
      default: break;
    }
    this.applySound();
  };

  /** Seven equalizer bands, 0 to 1, from the live sound. */
  readBands() {
    if (!this.analyser || !this.ctx || !this.state.playing) {
      for (let i = 0; i < 7; i++) this.bands[i] *= 0.9;
      return this.bands;
    }
    this.analyser.getByteFrequencyData(this.freq);
    const hzPerBin = this.ctx.sampleRate / this.analyser.fftSize;
    BAND_EDGES.forEach(([lo, hi], i) => {
      const a = Math.max(1, Math.floor(lo / hzPerBin));
      const b = Math.min(this.freq.length - 1, Math.ceil(hi / hzPerBin));
      let sum = 0;
      for (let k = a; k <= b; k++) sum += this.freq[k];
      const avg = sum / Math.max(1, b - a + 1) / 255;
      // lift the treble a little so the bars look even
      const tilt = 1 + i * 0.09;
      this.bands[i] = Math.min(1, Math.pow(avg * tilt, 1.4) * 1.25);
    });
    return this.bands;
  }

  /** Left and right level, 0 to 1. */
  readLevels() {
    if (!this.splitL || !this.splitR || !this.state.playing) {
      this.levels[0] *= 0.85;
      this.levels[1] *= 0.85;
      return this.levels;
    }
    const rms = (node: AnalyserNode) => {
      node.getFloatTimeDomainData(this.wave);
      let sum = 0;
      for (let i = 0; i < this.wave.length; i++) sum += this.wave[i] * this.wave[i];
      const db = 20 * Math.log10(Math.sqrt(sum / this.wave.length) + 1e-6);
      return Math.min(1, Math.max(0, (db + 42) / 42));
    };
    this.levels[0] = rms(this.splitL);
    this.levels[1] = rms(this.splitR);
    return this.levels;
  }

  /** True when the Web Audio graph runs, so the meters show real sound. */
  get live() { return Boolean(this.ctx); }

  seek(seconds: number) {
    if (Number.isFinite(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, seconds));
      this.patch({ position: this.audio.currentTime });
    }
  }

  /** Smooth time for animation, between timeupdate events. */
  get time() { return this.audio.currentTime; }

  destroy() {
    this.audio.pause();
    this.audio.src = '';
    void this.ctx?.close().catch(() => undefined);
    this.listeners.clear();
  }
}
