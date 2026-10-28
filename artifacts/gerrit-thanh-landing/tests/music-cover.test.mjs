import assert from 'node:assert/strict';
import test from 'node:test';
import { correctMusicRecord, musicCover } from '../src/lib/music-cover.ts';

test('the supplied label artwork fills the exact missing pressing', () => {
  assert.equal(musicCover({
    url: 'https://www.discogs.com/release/1847578', image: '',
  }, '/'), '/music/salute-the-kings-victory.webp');
});

test('the cover respects the app base path', () => {
  assert.equal(musicCover({
    url: 'https://www.discogs.com/release/1847578', image: '',
  }, '/portfolio/'), '/portfolio/music/salute-the-kings-victory.webp');
});

test('other releases keep their original sharp covers', () => {
  assert.equal(musicCover({
    url: 'https://www.discogs.com/release/18475780', image: 'https://i.discogs.com/original.jpg',
  }, '/'), 'https://i.discogs.com/original.jpg');
});

test('unrelated coverless releases are not assigned this artwork', () => {
  assert.equal(musicCover({
    url: 'https://www.discogs.com/release/1', image: '',
  }, '/'), '');
});

test('the owner-confirmed copy displays Volume 3 with its supplied cover', () => {
  const input = {
    id: 2194317222, url: 'https://www.discogs.com/release/30210',
    title: 'The Future Sound Of Jazz 2', image: 'https://i.discogs.com/old.jpg',
    artist: 'Various', year: 1997, format: '2× CD',
    styles: ['Future Jazz'], labels: ['Instinct Records'],
  };
  const corrected = correctMusicRecord(input, '/');
  assert.deepEqual(corrected, {
    ...input, title: 'The Future Sound Of Jazz - Vol. 3',
    image: '/music/future-sound-of-jazz-vol-3.webp',
  });
  assert.equal(input.title, 'The Future Sound Of Jazz 2');
  assert.equal(musicCover(corrected, '/'), corrected.image);
});

test('the correction leaves Volume 4 and other copies unchanged', () => {
  for (const record of [
    { id: 2194317255, url: 'https://www.discogs.com/release/163382', title: 'The Future Sound Of Jazz - Vol. 4' },
    { id: 1, url: 'https://www.discogs.com/release/30210', title: 'The Future Sound Of Jazz 2' },
  ]) {
    assert.equal(correctMusicRecord(record, '/'), record);
  }
});
