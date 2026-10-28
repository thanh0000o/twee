import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import {
  GUESTBOOK_SMILEYS, QUICK_SMILEYS, EXTRA_TEXT_SMILEYS,
  countGuestbookSmileys, getGuestbookSmileyError, smileyToken,
} from '../../lib/api-zod/src/guestbook-smileys.ts';

test('all supplied collections and extras have local icons', () => {
  for (const smiley of GUESTBOOK_SMILEYS) {
    assert.ok(existsSync(`artifacts/gerrit-thanh-landing/public/guestbook-smileys/${smiley.id}.png`), smiley.id);
  }
});

test('image smileys are interleaved across the collections', () => {
  const firstRound = GUESTBOOK_SMILEYS.slice(0, 7).map(({ group }) => group);
  assert.equal(new Set(firstRound).size, 7);
});

test('every offered image is accepted and counts toward the existing limit', () => {
  for (const smiley of GUESTBOOK_SMILEYS) {
    const token = smileyToken(smiley.id);
    assert.equal(countGuestbookSmileys(token), 1, smiley.id);
    assert.equal(getGuestbookSmileyError(`hello ${token}`), null, smiley.id);
    assert.match(getGuestbookSmileyError(Array(4).fill(token).join(' '))!, /no more than 3/, smiley.id);
  }
});

test('counts every offered text face and adjacent faces', () => {
  for (const smiley of [...QUICK_SMILEYS, ...EXTRA_TEXT_SMILEYS]) {
    assert.equal(countGuestbookSmileys(smiley), 1, smiley);
  }
  assert.equal(countGuestbookSmileys(':-):-):-):-)'), 4);
  assert.equal(countGuestbookSmileys(':D:D:D:D'), 4);
  assert.equal(countGuestbookSmileys('XDXDXDXD'), 4);
  assert.equal(countGuestbookSmileys('https://example.org/my-work'), 0);
});

test('three is a combined limit for images, text faces and Unicode', () => {
  const token = smileyToken('gloss-angry');
  assert.equal(getGuestbookSmileyError(`${token} nice work :-) ❤️`), null);
  assert.match(getGuestbookSmileyError(`${token} nice work :-) ❤️ 😃`)!, /no more than 3/);
  assert.match(getGuestbookSmileyError('😀😂✨❤️')!, /no more than 3/);
  assert.equal(countGuestbookSmileys('👨‍👩‍👧‍👦 🇧🇪 👍🏽'), 3);
  assert.match(getGuestbookSmileyError('😀😀😀😀')!, /no more than 3/);
});

test('untrusted or unknown image tokens cannot be posted', () => {
  assert.match(getGuestbookSmileyError(':gb-no-such-smiley:')!, /not in/);
  assert.match(getGuestbookSmileyError(':gb-../../file:')!, /not in/);
  assert.equal(getGuestbookSmileyError('plain words <script>alert(1)</script>'), null);
});
