import { useLayoutEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import './agent-flow-diagram.css';
import './music-agent-flow-diagram.css';

type Pt = { x: number; y: number };
type Box = { l: number; r: number; t: number; b: number; cx: number; cy: number; w: number; h: number };
type Line = { d: string; dashed?: boolean };

const P = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
const ids = ['src', 'ag', 'a0', 'a1', 'a2', 'a3', 'mem', 'mail'] as const;

const AGENTS = [
  ['Bass agent', '11:00', '#a06be0', '#e2cdff', '#4b1f86'],
  ['Garage agent', '15:00', '#1fa59b', '#b5f2ea', '#0b5f59'],
  ['Concert agent', '19:00', '#ef7d22', '#ffd2a8', '#9a420a'],
  ['Classical agent', '23:00', '#d9a526', '#fff0a5', '#8a5c0a'],
] as const;

const MAILS = [
  ['Your month in jungle and bass', '#3d1a6b'],
  ['Your month in garage', '#0d5a56'],
  ['Your month in concerts', '#f1e9dc'],
  ['Your month in classical', '#e9d9a8'],
] as const;

export const MusicAgentFlowDiagram: FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [fb, setFb] = useState<(Pt & { v: boolean }) | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const set = (k: string) => (el: HTMLElement | null) => { refs.current[k] = el; };

  useLayoutEffect(() => {
    const st = stage.current;
    if (!st) return;
    const compute = () => {
      const s = st.getBoundingClientRect();
      const bx: Record<string, Box> = {};
      for (const k of ids) {
        const el = refs.current[k];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const l = r.left - s.left, t = r.top - s.top;
        bx[k] = { l, t, r: l + r.width, b: t + r.height, cx: l + r.width / 2, cy: t + r.height / 2, w: r.width, h: r.height };
      }
      const mobile = window.matchMedia('(max-width: 860px)').matches;
      const out: Line[] = [];
      const m = bx.mem, ag = bx.ag;
      if (!mobile) {
        const curve = (a: Pt, b: Pt): Line => {
          const dx = (b.x - a.x) / 2;
          return { d: `M${P(a)} C${P({ x: a.x + dx, y: a.y })} ${P({ x: b.x - dx, y: b.y })} ${P(b)}` };
        };
        out.push(curve({ x: bx.src.r + 2, y: bx.src.cy }, { x: ag.l - 3, y: ag.cy }));
        [0, 1, 2, 3].forEach((i) => {
          const a = bx['a' + i];
          out.push(curve({ x: a.r + 2, y: a.cy }, { x: m.l - 3, y: m.t + m.h * (0.2 + 0.2 * i) }));
        });
        out.push(curve({ x: m.r + 2, y: m.cy }, { x: bx.mail.l - 3, y: bx.mail.cy }));
        const lx = ag.l + ag.w * 0.9;
        const by = Math.max(m.b, ag.b) + 30;
        out.push({ dashed: true, d: `M${m.cx} ${m.b + 2} L${m.cx} ${by - 10} Q${m.cx} ${by} ${m.cx - 10} ${by} L${lx + 10} ${by} Q${lx} ${by} ${lx} ${by - 10} L${lx} ${ag.b + 3}` });
        setFb({ x: (m.cx + lx) / 2, y: by, v: false });
      } else {
        out.push({ d: `M${bx.src.cx} ${bx.src.b + 2} L${bx.src.cx} ${ag.t - 3}` });
        out.push({ d: `M${ag.cx} ${ag.b + 2} L${ag.cx} ${m.t - 3}` });
        out.push({ d: `M${m.cx} ${m.b + 2} L${m.cx} ${bx.mail.t - 3}` });
        const gx = Math.min(m.l, ag.l) - 16;
        out.push({ dashed: true, d: `M${m.l - 2} ${m.cy} L${gx} ${m.cy} L${gx} ${ag.cy} L${ag.l - 3} ${ag.cy}` });
        setFb({ x: gx - 12, y: (m.cy + ag.cy) / 2, v: true });
      }
      setLines(out);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(st);
    window.addEventListener('resize', compute);
    document.fonts?.ready.then(compute);
    return () => { ro.disconnect(); window.removeEventListener('resize', compute); };
  }, []);

  return (
    <section className="afd afd-music" aria-labelledby="afm-title" aria-describedby="afm-desc">
      <h2 className="afd-title" id="afm-title">How my music agent works</h2>
      <p className="afd-desc" id="afm-desc">
        A four-stage workflow. Stage 1, sources: my Discogs collection, Spotify and YouTube playlists, club and
        venue agendas, and Resident Advisor, reggae-agenda.nl and festival line-ups. Stage 2, on the 1st of the month:
        a bass agent at 11:00, a garage agent at 15:00, a concert agent at 19:00 and a classical agent at
        23:00. Stage 3, shared memory of events, artists and classical pieces already reported; a dashed line returns
        to the agents so nothing repeats. Stage 4, four emails, one per scene.
      </p>

      <div className="afd-stage" ref={stage}>
        <div className="afd-col">
          <div className="afd-step"><b>1</b><span>Sources</span></div>
          <div className="afd-card afd-jobs" ref={set('src')}>
            <ul className="afm-plain">
              <li>My Discogs collection</li>
              <li>My Spotify &amp; YouTube playlists</li>
              <li>Club &amp; venue agendas</li>
              <li>Resident Advisor, reggae-agenda.nl, festival line-ups</li>
            </ul>
          </div>
        </div>

        <div className="afd-col">
          <div className="afd-step"><b>2</b><span>1st of the month · Search</span></div>
          <div className="afm-group" ref={set('ag')}>
            {AGENTS.map(([n, time, c, l, sh], i) => (
              <div className="afd-card afd-agent" key={n} ref={set('a' + i)} style={{ '--scene-light': l, '--scene-color': c, '--scene-shade': sh } as CSSProperties}>
                <span>{n}</span><span>{time}</span>
              </div>
            ))}
          </div>
          <p className="afd-small afm-cap">Own scene each, four hours apart.</p>
        </div>

        <div className="afd-col">
          <div className="afd-step"><b>3</b><span>Remember</span></div>
          <div className="afd-card" ref={set('mem')}>
            <h3>Shared memory</h3>
            <ul><li>Events already reported</li><li>Artists already suggested</li><li>Classical pieces already shared</li></ul>
          </div>
        </div>

        <div className="afd-col">
          <div className="afd-step"><b>4</b><span>Email</span></div>
          <div ref={set('mail')} className="afm-mails">
            {MAILS.map(([t, c]) => (
              <div className="afd-card afm-mail" key={t} style={{ '--bar': c } as CSSProperties}>{t}</div>
            ))}
            <div className="afd-card">
              <h3>Each email contains</h3>
              <ul>
                <li>This month, week by week</li><li>Newly announced</li><li>Festivals</li>
                <li>4 discoveries, old and new generation</li><li>My artists in the coming year</li>
              </ul>
            </div>
          </div>
        </div>

        <svg className="afd-lines" aria-hidden="true" focusable="false">
          <defs>
            <marker id="afm-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1.5 L8.5 5 L1 8.5" style={{ fill: 'none', stroke: 'var(--acc)', strokeWidth: 1.2 }} />
            </marker>
          </defs>
          {lines.map((l, i) => (
            <path key={i} d={l.d} className={l.dashed ? 'dash' : undefined} markerEnd="url(#afm-head)" />
          ))}
        </svg>
        {fb && <span className={`afd-fb${fb.v ? ' v' : ''}`} style={{ left: fb.x, top: fb.y }} aria-hidden="true">no repeats</span>}
      </div>
    </section>
  );
};
