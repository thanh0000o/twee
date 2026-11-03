import { type FC, type FormEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'wouter';
import { useSavedPalette } from '../hooks/use-saved-palette';
import { tracks } from '../music/tracks';
import { StereoController } from '../radio-stereo/controller';
import type { Source } from '../radio-stereo/layout';
import type { StereoScene } from '../radio-stereo/scene';
import '../styles/editorial.css';
import '../styles/radio.css';

const SOURCES: Source[] = ['phono', 'tuner', 'cd', 'tape'];

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const PASS_KEY = 'thanh-radio-pass';

const readPass = () => {
  try { return window.localStorage.getItem(PASS_KEY) ?? ''; } catch { return ''; }
};
const savePass = (pass: string) => {
  try { window.localStorage.setItem(PASS_KEY, pass); } catch { /* the pass then lasts for this visit only */ }
};

/** The radio stays behind a pin until launch. The pin is checked on the server. */
export const Radio: FC = () => {
  const palette = useSavedPalette();
  const [gate, setGate] = useState<'checking' | 'locked' | 'open'>('checking');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = 'radio — Thành Lambeets';
    return () => { document.title = previous; };
  }, []);

  useEffect(() => {
    const pass = readPass();
    if (!pass) { setGate('locked'); return; }
    fetch('/api/radio/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass }),
    })
      .then((r) => r.json() as Promise<{ ok?: boolean }>)
      .then((data) => setGate(data.ok ? 'open' : 'locked'))
      .catch(() => setGate('locked'));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!pin.trim() || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/radio/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = (await response.json()) as { ok?: boolean; pass?: string; error?: string };
      if (data.ok && data.pass) {
        savePass(data.pass);
        setGate('open');
        return;
      }
      setMessage(
        data.error === 'wait' ? 'Too many tries. Wait a minute and try again.'
          : data.error === 'not-set' ? 'The radio is not open to anyone yet.'
            : 'That pin is not right.',
      );
      setPin('');
    } catch {
      setMessage('The pin could not be checked. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  if (gate === 'open') return <RadioStereo />;

  return (
    <main className="ed radio-lock" data-palette={palette.name}>
      <header className="subpage-header ed-top">
        <nav className="blog-top-links" aria-label="Radio navigation">
          <Link href="/" className="subpage-return about-return" style={{ filter: palette.filter }} data-testid="link-return-home">
            {'{return home}'}
          </Link>
        </nav>
        <h1>{'{radio}'}</h1>
      </header>
      {gate === 'locked' && (
        <form className="radio-lock-form" onSubmit={submit}>
          <p>The radio is not on air yet.</p>
          <label className="radio-lock-field">
            <span className="radio-mute-text">pin</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              aria-describedby="radio-lock-message"
              autoFocus
            />
          </label>
          <button type="submit" disabled={busy}>{busy ? '{checking}' : '{enter}'}</button>
          <p id="radio-lock-message" className="radio-error" role="alert">{message}</p>
        </form>
      )}
    </main>
  );
};

const RadioStereo: FC = () => {
  const palette = useSavedPalette();
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<StereoScene | null>(null);
  const [controller] = useState(() => new StereoController(tracks));
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => () => controller.destroy(), [controller]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    import('../radio-stereo/scene')
      .then(({ createStereoScene }) => createStereoScene(stage, controller, {
        color: palette.highlight,
        reducedMotion,
        onHover: setHover,
      }))
      .then((scene) => {
        if (cancelled) { scene.dispose(); return; }
        sceneRef.current = scene;
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('failed'); });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // the scene is built once; colour changes go through setColor below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller]);

  useEffect(() => { sceneRef.current?.setColor(palette.highlight); }, [palette.highlight, status]);

  const track = controller.tracks[state.track];

  return (
    <main className="ed radio-page" data-palette={palette.name}>
      <div className="radio-stage" ref={stageRef}>
        {status === 'loading' && <p className="radio-stage-note">warming up the stereo…</p>}
        {status === 'failed' && (
          <p className="radio-stage-note">This browser could not show the 3D stereo. The controls still work.</p>
        )}
      </div>

      <header className="subpage-header ed-top radio-top">
        <nav className="blog-top-links" aria-label="Radio navigation">
          <Link href="/" className="subpage-return about-return" style={{ filter: palette.filter }} data-testid="link-return-home">
            {'{return home}'}
          </Link>
        </nav>
        <h1>{'{radio}'}</h1>
      </header>

      <section className="radio-panel" aria-label="Radio controls">
        <p className="radio-caption radio-mute-text">
          The stereo my dad gave me, rebuilt in 3D. Drag to look around, every button works.
        </p>

        <div className="radio-now" aria-live="polite">
          <span>{track.artist} — {track.title}</span>
          <span className="radio-mute-text">
            {state.source} · {clock(state.position)} / {clock(state.duration)}
            {!state.power && ' · standby'}
          </span>
        </div>

        <div className="radio-controls" role="group" aria-label="Playback">
          <button type="button" onClick={() => controller.dispatch({ type: 'prev' })}>{'{prev}'}</button>
          <button
            type="button"
            className="radio-play"
            onClick={() => controller.dispatch({ type: 'toggle' })}
            aria-pressed={state.playing}
          >
            {state.playing ? '{pause}' : '{play}'}
          </button>
          <button type="button" onClick={() => controller.dispatch({ type: 'next' })}>{'{next}'}</button>
        </div>

        <div className="radio-controls" role="group" aria-label="Source">
          {SOURCES.map((source) => (
            <button
              key={source}
              type="button"
              aria-pressed={state.source === source}
              onClick={() => controller.dispatch({ type: 'source', source })}
            >
              {`{${source}}`}
            </button>
          ))}
        </div>

        <label className="radio-volume">
          <span className="radio-label">volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.volume}
            onChange={(e) => controller.dispatch({ type: 'volume', value: Number(e.target.value) })}
          />
        </label>

        {state.error && <p className="radio-error" role="alert">{state.error}</p>}
      </section>

      <p className="radio-hover" aria-hidden="true">{hover ? `{${hover}}` : ''}</p>
    </main>
  );
};
