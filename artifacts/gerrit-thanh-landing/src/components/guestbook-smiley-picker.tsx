import { useEffect, useRef } from 'react';
import {
  GUESTBOOK_SMILEYS, KAOMOJI, MAX_GUESTBOOK_SMILEYS, smileyToken,
} from '@workspace/api-zod/guestbook-smileys';
import { guestbookSmileyUrl } from './guestbook-message';

// Only the gloss and retro character sets are offered, in colour order: reds,
// orange, yellow, green, blue, purple, then white and grey. The other sets are
// left out of the picker, but old messages that use them still render.
const COLOUR_ORDER = [
  'gloss-angry', 'retro-mushroom', 'retro-apple', 'retro-shin-chan', 'retro-alarm-clock',
  'retro-tulip', 'gloss-sleepy', 'retro-peanut', 'retro-cheese', 'retro-clown-caterpillar',
  'retro-house', 'retro-christmas-tree', 'gloss-hopeful', 'retro-computer', 'retro-fishbowl',
  'retro-cloud', 'gloss-blue', 'retro-space-caterpillar', 'gloss-dreamy', 'retro-snowman',
  'retro-star', 'retro-tooth', 'gloss-surprised', 'retro-candle',
];
const smileysById = new Map(GUESTBOOK_SMILEYS.map((smiley) => [smiley.id, smiley]));
const PICKER_SMILEYS = COLOUR_ORDER.flatMap((id) => {
  const smiley = smileysById.get(id);
  return smiley ? [smiley] : [];
});

// Text faces: the classic ones first, then kaomoji.
const TEXT_SMILEYS = [':-)', ';-)', ':-D', ':-P', ':-(', '<3', ...KAOMOJI];

/** Fit as many whole buttons as the row allows, starting at `start`, and return the next start. */
function showPage(strip: HTMLElement, start: number): number {
  const items = Array.from(strip.children) as HTMLElement[];
  const frame = strip.parentElement;
  if (!frame || items.length === 0) return 0;
  const gap = 3;
  let width = 0;
  let end = start;
  while (end < items.length) {
    const next = width + (end > start ? gap : 0) + items[end].offsetWidth;
    if (next > frame.clientWidth && end > start) break;
    width = next;
    end += 1;
  }
  strip.style.width = `${width}px`;
  strip.scrollLeft = items[start].offsetLeft - items[0].offsetLeft;
  return end >= items.length ? 0 : end;
}

type Props = {
  disabled: boolean;
  count: number;
  onInsert: (value: string) => void;
};

export function GuestbookSmileyPicker({ disabled, count, onInsert }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const unavailable = disabled || count >= MAX_GUESTBOOK_SMILEYS;
  const textStripRef = useRef<HTMLDivElement>(null);
  const textStart = useRef(0);
  const textNext = useRef(0);

  useEffect(() => {
    const strip = textStripRef.current;
    const frame = strip?.parentElement;
    if (!strip || !frame) return;
    const fit = () => { textNext.current = showPage(strip, textStart.current); };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const showNextText = () => {
    const strip = textStripRef.current;
    if (!strip) return;
    textStart.current = textNext.current;
    textNext.current = showPage(strip, textStart.current);
  };

  // Size the strip to a whole number of smileys, so none is cut off at the edge.
  useEffect(() => {
    const frame = windowRef.current;
    const strip = stripRef.current;
    if (!frame || !strip) return;
    const fit = () => {
      const item = strip.querySelector<HTMLElement>('.gb-quick-emoji');
      const step = item ? item.offsetWidth + 4 : 34;
      const visible = Math.max(1, Math.floor((frame.clientWidth + 4) / step));
      strip.style.width = `${visible * step - 4}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Show the next row of smileys; after the last one, start again from the first.
  const showNext = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
    if (atEnd) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    const item = strip.querySelector<HTMLElement>('.gb-quick-emoji');
    const step = item ? item.offsetWidth + 4 : 34;
    const page = Math.max(step, Math.round((strip.clientWidth + 4) / step) * step);
    strip.scrollTo({ left: strip.scrollLeft + page, behavior: 'smooth' });
  };

  return <div className="gb-smileys">
    <div className="gb-picker-toolbar">
      <div ref={windowRef} className="gb-quick-window">
      <div ref={stripRef} className="gb-quick-strip" aria-label="Choose a smiley">
        {PICKER_SMILEYS.map((smiley) =>
          <button key={smiley.id} className="gb-quick-emoji" type="button" title={smiley.label}
            aria-label={`Insert ${smiley.label}`} disabled={unavailable}
            onClick={() => onInsert(smileyToken(smiley.id))}>
            <img src={guestbookSmileyUrl(smiley.id)} alt="" width={26} height={26} />
          </button>,
        )}
      </div>
      </div>
      <button className="gb-smiley-next" type="button" aria-label="Show more smileys"
        title="more smileys" onClick={showNext}>
        <svg aria-hidden="true" width="5" height="8" viewBox="0 0 5 8">
          <path d="M0 0 5 4 0 8Z" fill="currentColor" />
        </svg>
      </button>
      <span className="gb-smiley-count" aria-live="polite"
        aria-label={`${count} of ${MAX_GUESTBOOK_SMILEYS} smileys used`}
        title={`Maximum ${MAX_GUESTBOOK_SMILEYS} smileys per message`}>
        {count}/{MAX_GUESTBOOK_SMILEYS} used
      </span>
    </div>
    <div className="gb-ascii-bar" aria-label="Text smileys">
      <span>text:</span>
      <div className="gb-text-window">
        <div ref={textStripRef} className="gb-text-strip">
          {TEXT_SMILEYS.map((smiley) =>
            <button key={smiley} type="button" disabled={unavailable}
              onClick={() => onInsert(smiley)}>{smiley}</button>,
          )}
        </div>
      </div>
      <button className="gb-smiley-next" type="button" aria-label="Show more text smileys"
        title="more text smileys" onClick={showNextText}>
        <svg aria-hidden="true" width="5" height="8" viewBox="0 0 5 8">
          <path d="M0 0 5 4 0 8Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>;
}
