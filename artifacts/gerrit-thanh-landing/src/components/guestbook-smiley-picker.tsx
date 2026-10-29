import { useEffect, useRef } from 'react';
import {
  GUESTBOOK_SMILEYS, MAX_GUESTBOOK_SMILEYS,
  QUICK_SMILEYS, smileyToken,
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

type Props = {
  disabled: boolean;
  count: number;
  onInsert: (value: string) => void;
};

export function GuestbookSmileyPicker({ disabled, count, onInsert }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const unavailable = disabled || count >= MAX_GUESTBOOK_SMILEYS;

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
    <div className="gb-ascii-bar" aria-label="Quick text smileys">
      <span>text:</span>
      {QUICK_SMILEYS.map((smiley) =>
        <button key={smiley} type="button" disabled={unavailable}
          onClick={() => onInsert(smiley)}>{smiley}</button>,
      )}
    </div>
  </div>;
}
