import type { MusicCollection } from '@workspace/api-client-react';

/** Load every folder-0 page, without exceeding the API's concurrency limit. */
export async function loadCompleteMusicCollection(
  fetchPage: (page: number) => Promise<MusicCollection>,
): Promise<MusicCollection> {
  const first = await fetchPage(1);
  if (first.page !== 1 || !Number.isInteger(first.pages) || first.pages < 1) {
    throw new Error('The collection pagination could not be verified. Please try again.');
  }
  const pages = [first];
  for (let start = 2; start <= first.pages; start += 3) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(3, first.pages - start + 1) }, (_, i) => fetchPage(start + i)),
    );
    for (const [index, page] of batch.entries()) {
      if (page.page !== start + index || page.pages !== first.pages || page.total !== first.total) {
        throw new Error('The collection changed while loading. Please try again.');
      }
    }
    pages.push(...batch);
  }
  const records = pages.flatMap(page => page.records);
  if (records.length !== first.total || new Set(records.map(record => record.id)).size !== first.total) {
    throw new Error('The full collection could not be loaded. Please try again.');
  }
  return { ...first, records };
}
