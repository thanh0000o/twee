import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesFavouritesPin } from '../src/lib/favourites-pin.ts';

test('the chosen PIN reveals the presentation cover', async () => {
  assert.equal(await matchesFavouritesPin('1104'), true);
});

test('incorrect or malformed PINs do not reveal the cover', async () => {
  for (const pin of ['0000', '1105', '', '104', '11040', 'abcd', ' 1104']) {
    assert.equal(await matchesFavouritesPin(pin), false);
  }
});
