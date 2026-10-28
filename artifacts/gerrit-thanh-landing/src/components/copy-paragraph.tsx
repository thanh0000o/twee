import type { ReactNode } from 'react';

export const CopyParagraph = ({ lines, children }: { lines: number; children: ReactNode }) => {
  const height = lines * 13 * 1.42;
  const middle = height / 2;

  return (
    <p className="relative m-0 whitespace-nowrap pl-[calc(16*var(--u))]">
      <svg
        aria-hidden="true"
        className="absolute left-0 top-0 h-full"
        style={{ width: 'calc(8 * var(--u))' }}
        viewBox={`0 0 8 ${height}`}
        fill="none"
      >
        <path
          d={`M7 3 Q3 3 3 7 V${middle - 4} Q3 ${middle} 1 ${middle} Q3 ${middle} 3 ${middle + 4} V${height - 7} Q3 ${height - 3} 7 ${height - 3}`}
          stroke="#b8cfde"
          strokeWidth=".65"
          strokeOpacity=".65"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </p>
  );
};
