// Sparse, deliberately spaced accents keep the original grid calm.
// Fixed positions prevent the texture changing when the theme changes.
const foregroundDots = new Set([
  1 * 16 + 10, 2 * 16 + 3, 3 * 16 + 9, 4 * 16 + 14,
  5 * 16 + 7, 6 * 16 + 3, 8 * 16 + 1, 9 * 16 + 11,
  11 * 16 + 15, 12 * 16 + 5, 14 * 16 + 13, 15 * 16 + 8,
]);
const middleDots = new Set([
  0 * 16 + 5, 2 * 16 + 14, 4 * 16 + 1, 6 * 16 + 11,
  7 * 16 + 6, 9 * 16 + 4, 10 * 16 + 8, 12 * 16 + 10,
  13 * 16 + 1, 15 * 16 + 3,
]);

export const DepthDotPattern = () => (
  <pattern id="left-depth-dots" width="128" height="128" patternUnits="userSpaceOnUse">
    {Array.from({ length: 256 }, (_, index) => {
      const foreground = foregroundDots.has(index);
      const middle = middleDots.has(index);
      return (
        <circle
          key={index}
          cx={2.5 + (index % 16) * 8}
          cy={2.5 + Math.floor(index / 16) * 8}
          r={foreground ? 1.95 : middle ? 1.55 : 1.35}
          fill={foreground ? '#155d9f' : middle ? '#2873b4' : '#397eba'}
          opacity={foreground ? 1 : middle ? 0.88 : 0.75}
        />
      );
    })}
  </pattern>
);
