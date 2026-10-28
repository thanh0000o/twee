export function wrapCarouselIndex(index: number, count: number) {
  if (count < 1) throw new RangeError('A carousel needs at least one item.');
  return ((index % count) + count) % count;
}

/** Choose the nearest equivalent slide in the three repeated sets. */
export function closestCarouselCopy(index: number, current: number, count: number) {
  const logical = wrapCarouselIndex(index, count);
  return [logical, logical + count, logical + count * 2].reduce(
    (best, candidate) => Math.abs(candidate - current) < Math.abs(best - current) ? candidate : best,
  );
}
