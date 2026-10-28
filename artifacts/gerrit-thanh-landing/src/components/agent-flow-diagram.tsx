import { useLayoutEffect, useRef, useState, type FC } from 'react';
import './agent-flow-diagram.css';

type Pt = { x: number; y: number };
type Box = { l: number; r: number; t: number; b: number; cx: number; cy: number; w: number; h: number };
type Line = { d: string; dashed?: boolean };

const AGENTS = [['A', 19], ['B', 17], ['C', 17], ['D', 20], ['E', 22], ['F', 19], ['G', 24]] as const;
const ids = [...AGENTS.map((_, i) => 'a' + i), 'mem', 'jobs', 'fin', 'mail'];
const P = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

export const AgentFlowDiagram: FC = () => {
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
      const m = bx.mem, f = bx.fin;
      if (!mobile) {
        const curve = (a: Pt, b: Pt): Line => {
          const dx = (b.x - a.x) / 2;
          return { d: `M${P(a)} C${P({ x: a.x + dx, y: a.y })} ${P({ x: b.x - dx, y: b.y })} ${P(b)}` };
        };
        AGENTS.forEach((_, i) => {
          const a = bx['a' + i];
          const targetY = m.t + m.h * (0.12 + 0.76 * i / (AGENTS.length - 1));
          out.push({ d: `M${P({ x: a.r + 2, y: a.cy })} L${P({ x: m.l - 3, y: targetY })}` });
        });
        out.push(curve({ x: m.r + 2, y: m.cy }, { x: f.l - 3, y: f.cy }));
        out.push({ d: `M${bx.jobs.cx} ${bx.jobs.b + 2} L${bx.jobs.cx} ${f.t - 3}` });
        out.push(curve({ x: f.r + 2, y: f.cy }, { x: bx.mail.l - 3, y: bx.mail.cy }));
        const by = Math.max(f.b, m.b) + 24;
        out.push({ dashed: true, d: `M${f.cx} ${f.b + 2} L${f.cx} ${by - 10} Q${f.cx} ${by} ${f.cx - 10} ${by} L${m.cx + 10} ${by} Q${m.cx} ${by} ${m.cx} ${by - 10} L${m.cx} ${m.b + 3}` });
        setFb({ x: (f.cx + m.cx) / 2, y: by, v: false });
      } else {
        AGENTS.forEach((_, i) => {
          const a = bx['a' + i];
          const gx = a.r + 8;
          const ex = m.l + m.w * (0.55 + 0.3 * i / (AGENTS.length - 1));
          const ty = m.t - 12;
          out.push({ d: `M${a.r + 2} ${a.cy} L${gx} ${a.cy} L${gx} ${ty} L${ex} ${ty} L${ex} ${m.t - 3}` });
        });
        const gx2 = m.r + 18;
        out.push({ d: `M${m.r + 2} ${m.cy} L${gx2} ${m.cy} L${gx2} ${f.cy} L${f.r + 3} ${f.cy}` });
        out.push({ d: `M${bx.jobs.cx} ${bx.jobs.b + 2} L${bx.jobs.cx} ${f.t - 3}` });
        out.push({ d: `M${f.cx} ${f.b + 2} L${f.cx} ${bx.mail.t - 3}` });
        const gx3 = Math.min(m.l, f.l) - 16;
        out.push({ dashed: true, d: `M${f.l - 2} ${f.cy} L${gx3} ${f.cy} L${gx3} ${m.cy} L${m.l - 3} ${m.cy}` });
        setFb({ x: gx3 - 12, y: (f.cy + m.cy) / 2, v: true });
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
    <section className="afd" aria-labelledby="afd-title" aria-describedby="afd-desc">
      <h2 className="afd-title" id="afd-title">How my job-search agent works</h2>

      <p className="afd-desc" id="afd-desc">
        A four-step workflow. Step 1, 07:00 to 07:25, check: checking agents A, B, C, D, E, F and G review
        19, 17, 17, 20, 22, 19 and 24 companies in parallel. Firecrawl reads pages that do not load.
        Their results go to step 2, shared memory, which stores
        check results, the company list and previously reported jobs. Step 3, 08:55, assess: the final agent receives
        input from memory and the job boards Indeed, Jobat, Welcome to the Jungle, Stepstone and Talent.io.
        It finds 2–3 new companies, scores jobs from 1 to 10, checks degree requirements and keeps jobs scoring
        at least 7 for the email. Step 4, email: one email in my inbox with scored job opportunities,
        expectations and learning opportunities, new companies, jobs excluded by degree requirements and
        a weekly summary on Fridays. A dashed arrow returns from the final agent to shared memory:
        remembers previously reported jobs.
      </p>

      <div className="afd-stage" ref={stage}>
        <div className="afd-col">
          <div className="afd-step"><b>1</b><span>07:00 to 07:25 · Check</span></div>
          {AGENTS.map(([n, c], i) => (
            <div className="afd-card afd-agent" key={n} ref={set('a' + i)}>
              <span>Checking agent {n}</span><span>{c} companies</span>
            </div>
          ))}
          <p className="afd-small">Own company group each, in parallel.</p>
          <div className="afd-card afd-jobs afd-small">
            Fallback: Firecrawl reads pages that do not load
          </div>
        </div>

        <div className="afd-col">
          <div className="afd-step"><b>2</b><span>Remember</span></div>
          <div className="afd-card" ref={set('mem')}>
            <h3>Shared memory</h3>
            <ul><li>Check results</li><li>Company list</li><li>Previously reported jobs</li></ul>
          </div>
        </div>

        <div className="afd-col">
          <div className="afd-card afd-jobs afd-small" ref={set('jobs')}>
            Job boards: Indeed, Jobat, Welcome to the Jungle, Stepstone, Talent.io
          </div>
          <div className="afd-step"><b>3</b><span>08:55 · Assess</span></div>
          <div className="afd-card afd-big" ref={set('fin')}>
            <h3>Final agent</h3>
            <ul className="afd-steps">
              <li>Finds 2–3 new companies</li>
              <li>Scores jobs from 1 to 10</li>
              <li>Checks degree requirements</li>
              <li>Keeps jobs scoring at least 7</li>
            </ul>
          </div>
        </div>

        <div className="afd-col">
          <div className="afd-step"><b>4</b><span>Email</span></div>
          <div className="afd-card" ref={set('mail')}>
            <h3>One email in my inbox</h3>
            <ul>
              <li>New jobs with scores</li><li>What is expected and what I can learn</li>
              <li>New companies</li><li>Excluded by degree requirements</li><li>Friday: weekly summary</li>
            </ul>
          </div>
        </div>

        <svg className="afd-lines" aria-hidden="true" focusable="false">
          <defs>
            <marker id="afd-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1.5 L8.5 5 L1 8.5" style={{ fill: 'none', stroke: 'var(--acc)', strokeWidth: 1.2 }} />
            </marker>
          </defs>
          {lines.map((l, i) => (
            <path key={i} d={l.d} className={l.dashed ? 'dash' : undefined} markerEnd="url(#afd-head)" />
          ))}
        </svg>
        {fb && <span className={`afd-fb${fb.v ? ' v' : ''}`} style={{ left: fb.x, top: fb.y }} aria-hidden="true">remembers previously reported jobs</span>}
      </div>

    </section>
  );
};
