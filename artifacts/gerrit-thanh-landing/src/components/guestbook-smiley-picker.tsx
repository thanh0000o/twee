import { useRef, useState } from 'react';
import {
  EXTRA_TEXT_SMILEYS, GUESTBOOK_SMILEYS, MAX_GUESTBOOK_SMILEYS,
  QUICK_SMILEYS, smileyToken,
} from '@workspace/api-zod/guestbook-smileys';
import { guestbookSmileyUrl } from './guestbook-message';

const QUICK_IMAGE_SMILEYS = GUESTBOOK_SMILEYS.filter(({ id }) =>
  ['gloss-hopeful', 'xp-happy', 'retro-star', 'pixel-smile', 'jelly-kiss', 'retro-cloud'].includes(id),
);

type Props = {
  disabled: boolean;
  count: number;
  onInsert: (value: string) => void;
};

export function GuestbookSmileyPicker({ disabled, count, onInsert }: Props) {
  const [open, setOpen] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);
  const unavailable = disabled || count >= MAX_GUESTBOOK_SMILEYS;

  return <div className="gb-smileys">
    <div className="gb-picker-toolbar">
      {QUICK_IMAGE_SMILEYS.map((smiley) =>
        <button key={smiley.id} className="gb-quick-emoji" type="button" title={smiley.label}
          aria-label={`Insert ${smiley.label}`} disabled={unavailable}
          onClick={() => onInsert(smileyToken(smiley.id))}>
          <img src={guestbookSmileyUrl(smiley.id)} alt="" width={26} height={26} />
        </button>,
      )}
      <button ref={moreRef} className="gb-smiley-toggle" type="button"
        aria-label={open ? 'Hide emojis and smileys' : 'Open emoji and smiley picker'}
        aria-expanded={open} aria-controls="guestbook-smiley-picker"
        onClick={() => setOpen(!open)}>{open ? 'less' : 'more'}</button>
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
    <div id="guestbook-smiley-picker" className="gb-smiley-picker"
      role="region" aria-label="Emoji and smiley picker" hidden={!open}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          setOpen(false);
          moreRef.current?.focus();
        }
      }}>
      <div className="gb-smiley-grid" aria-label="Choose a smiley">
        {GUESTBOOK_SMILEYS.map((smiley) =>
            <button key={smiley.id} type="button" title={smiley.label}
              aria-label={`Insert ${smiley.label}`} disabled={unavailable}
              onClick={() => onInsert(smileyToken(smiley.id))}>
              <img src={guestbookSmileyUrl(smiley.id)} alt="" width={24} height={24} loading="lazy" />
            </button>,
        )}
        {EXTRA_TEXT_SMILEYS.map((smiley) => <button key={smiley} type="button"
          disabled={unavailable} onClick={() => onInsert(smiley)}>{smiley}</button>)}
      </div>
      <p>{disabled ? 'enter your name to use smileys.' : 'three smileys max — leave room for words.'}</p>
    </div>
  </div>;
}
