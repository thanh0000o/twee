/** Shared guestbook display tokens and posting limits; no image HTML is stored. */
export const MAX_GUESTBOOK_SMILEYS = 3;
export const QUICK_SMILEYS = [':-)', ';-)', ':-D', ':-P', ':-(', ':-/', ':-O', '^_^', '<3'];
export const KAOMOJI = [
  '(^_^)', '(T_T)', '(o_o)', '(*_*)', '(>_<)', '(-_-)', '(^o^)', '\\(^-^)/', '(._.)', '~(^-^)~',
  '(^_~)', '(=^.^=)', '(^_^)v', '(>w<)', '(o^^o)', '(*^-^*)', 'd(^_^)b', '(;_;)', '(x_x)', '(=_=)',
  '(^3^)', 'm(_ _)m', '<(^_^)>', '(・ω・)', '(•_•)', 'ʕ•ᴥ•ʔ', '(ง •_•)ง', '(╯°□°)╯︵ ┻━┻',
  '┬─┬ノ(º_ºノ)', '¯\\_(ツ)_/¯', '(づ｡◕‿‿◕｡)づ', '( ˘▽˘)っ♨', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(っ˘ω˘ς )', '(=^･ω･^=)',
];
// Longest first, so a kaomoji is counted once even when it contains a shorter one.
const kaomojiByLength = [...KAOMOJI].sort((a, b) => b.length - a.length);
export const EXTRA_TEXT_SMILEYS = [':)', ';)', ':D', ':P', ':3', '8-)', 'B-)', ':-*', ":'(", 'o_O', 'O_o', '-_-', 'T_T', '>_<', 'XD'];

const collections = [
  ['gloss', 'glossy moods', ['angry', 'hopeful', 'blue', 'sleepy', 'dreamy', 'surprised']],
  ['messenger', 'messenger', ['red', 'sunset', 'peach', 'rose', 'gold', 'lemon', 'lime', 'green', 'leaf', 'aqua', 'blue', 'ocean', 'lilac', 'lavender', 'berry', 'ice', 'blush', 'silver', 'slate', 'black']],
  ['jelly', 'jelly faces', ['laugh', 'kiss', 'neutral', 'sad']],
  ['pixel', 'pixel faces', ['smile', 'unamused', 'tongue', 'blush', 'stunned', 'angry', 'pleased', 'horns', 'pirate', 'ears', 'thinking', 'grin', 'toothy', 'green-grin', 'lime-grin', 'skeptical', 'confused', 'sad', 'cursing', 'frown', 'facepalm', 'love', 'no', 'yes', 'whistle', 'laugh', 'angel', 'sick']],
  ['xp', 'XP avatars', ['hello', 'smirk', 'happy', 'grin', 'sad', 'cheeky', 'bright', 'relaxed', 'laugh', 'sunny', 'frown', 'dizzy', 'worried']],
  ['tango', '2007 classics', ['smile', 'wink', 'surprise', 'sad', 'cool']],
  ['toy', 'toy characters', ['baseball', 'ufo', 'capsule', 'bee', 'cap', 'burger', 'balloons', 'butterfly', 'hood', 'star-gold', 'star-pink', 'notes']],
  ['retro', 'retro characters', ['clown-caterpillar', 'space-caterpillar', 'computer', 'alarm-clock', 'peanut', 'star', 'house', 'candle', 'cloud', 'christmas-tree', 'snowman', 'tooth', 'tulip', 'fishbowl', 'mushroom', 'cheese', 'shin-chan', 'apple']],
] as const;

export const SMILEY_COLLECTIONS = collections.map(([id, label]) => ({ id, label }));
const smileysByCollection = collections.map(([group, , names]) =>
  names.map((name) => ({
    id: `${group}-${name}`,
    group,
    label: `${group === 'xp' ? 'XP' : group} ${name.replaceAll('-', ' ')}`,
  })),
);
export const GUESTBOOK_SMILEYS = Array.from(
  { length: Math.max(...smileysByCollection.map((group) => group.length)) },
  (_, index) => smileysByCollection.flatMap((group) => group[index] ? [group[index]] : []),
).flat();
const smileysById = new Map(GUESTBOOK_SMILEYS.map((smiley) => [smiley.id, smiley]));
export const getGuestbookSmiley = (id: string) => smileysById.get(id);
export const smileyToken = (id: string) => `:gb-${id}:`;
export const splitGuestbookMessage = (message: string) => message.split(/(:gb-[a-z0-9-]+:)/g);

// Count text faces too, including adjacent faces, without treating https:// as one.
const textFaces = /(?:[:;]-?[)(DPpOo/\\|*3]|:'-?\(|[8B]-\)|\^_\^|<3|[oO]_[oO]|-_-|T_T|>_<|[xX]D)/gu;
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

export function countGuestbookSmileys(message: string): number {
  const imageTokens = [...message.matchAll(/:gb-[a-z0-9-]+:/g)].length;
  let text = message.replace(/:gb-[a-z0-9-]+:/g, ' ');
  let kaomojiCount = 0;
  for (const face of kaomojiByLength) {
    const parts = text.split(face);
    kaomojiCount += parts.length - 1;
    text = parts.join(' ');
  }
  const asciiCount = [...text.replace(/\bhttps?:\/\/\S+/giu, ' ').matchAll(textFaces)].length;
  const unicodeCount = [...segmenter.segment(text)].filter(({ segment }) =>
    /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u.test(segment),
  ).length;
  return imageTokens + kaomojiCount + asciiCount + unicodeCount;
}

export function getGuestbookSmileyError(message: string): string | null {
  for (const match of message.matchAll(/:gb-([^:\s]*):/g)) {
    if (!smileysById.has(match[1])) return 'That smiley is not in the guestbook collection.';
  }
  return countGuestbookSmileys(message) > MAX_GUESTBOOK_SMILEYS
    ? `Please use no more than ${MAX_GUESTBOOK_SMILEYS} smileys per message.`
    : null;
}
