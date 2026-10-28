import assert from 'node:assert/strict';
import test from 'node:test';
import { loadCompleteMusicCollection } from '../src/lib/load-music-collection.ts';

const page = (number, ids, total = 3, pages = 3) => ({
  page: number, pages, total, collectionUrl: 'https://www.discogs.com/',
  records: ids.map(id => ({ id })),
});

test('remaining pages load concurrently and preserve page order', { timeout: 1000 }, async () => {
  let releaseSecond;
  const second = new Promise(resolve => { releaseSecond = resolve; });
  const result = await loadCompleteMusicCollection(async number => {
    if (number === 1) return page(1, [1]);
    if (number === 2) return second;
    releaseSecond(page(2, [2]));
    return page(3, [3]);
  });
  assert.deepEqual(result.records.map(record => record.id), [1, 2, 3]);
});

test('concurrency stays bounded for larger collections', async () => {
  let active = 0;
  let maximum = 0;
  const result = await loadCompleteMusicCollection(async number => {
    active++;
    maximum = Math.max(maximum, active);
    await new Promise(resolve => setImmediate(resolve));
    active--;
    return page(number, [number], 10, 10);
  });
  assert.equal(result.records.length, 10);
  assert.equal(maximum, 3);
});

test('an empty collection loads successfully', async () => {
  const result = await loadCompleteMusicCollection(async () => page(1, [], 0, 1));
  assert.equal(result.records.length, 0);
});

test('a missing record never produces a partial successful collection', async () => {
  await assert.rejects(loadCompleteMusicCollection(async number => page(number, number === 3 ? [] : [number])), /full collection/);
});

test('duplicate instances never count as a complete collection', async () => {
  await assert.rejects(loadCompleteMusicCollection(async number => page(number, [1])), /full collection/);
});

test('a changed Discogs total is reported instead of hiding records', async () => {
  await assert.rejects(loadCompleteMusicCollection(async number => page(number, [number], number === 3 ? 4 : 3)), /changed/);
});

test('a repeated or incorrect page is rejected', async () => {
  await assert.rejects(loadCompleteMusicCollection(async number => page(number === 3 ? 2 : number, [number])), /changed/);
});

test('a failed page rejects the whole refresh', async () => {
  await assert.rejects(loadCompleteMusicCollection(async number => {
    if (number === 3) throw new Error('Discogs unavailable');
    return page(number, [number]);
  }), /Discogs unavailable/);
});
