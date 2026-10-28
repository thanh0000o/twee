import { getGuestbookSmiley, splitGuestbookMessage } from '@workspace/api-zod/guestbook-smileys';

const graphemeSegmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const isUnicodeEmoji = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u;

export const guestbookSmileyUrl = (id: string) =>
  `${import.meta.env.BASE_URL}guestbook-smileys/${id}.png${id.startsWith('messenger-') ? '?v=clean-cut' : ''}`;

/** Render only known local images; all other content remains escaped text. */
export function GuestbookMessage({ message }: { message: string }) {
  return <>{splitGuestbookMessage(message).map((part, index) => {
    const smiley = part.startsWith(':gb-') && part.endsWith(':')
      ? getGuestbookSmiley(part.slice(4, -1))
      : undefined;
    return smiley
      ? <img key={index} className="gb-inline-smiley" src={guestbookSmileyUrl(smiley.id)}
          alt={`[${smiley.label}]`} title={smiley.label} width={26} height={26} />
      : <span key={index}>{Array.from(graphemeSegmenter.segment(part), ({ segment }, segmentIndex) =>
          isUnicodeEmoji.test(segment)
            ? <span key={segmentIndex} className="gb-inline-emoji">{segment}</span>
            : segment,
        )}</span>;
  })}</>;
}
