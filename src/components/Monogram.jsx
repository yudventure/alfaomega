import { MONOGRAM } from './monogram-path.js';

// Monogram Alfa-Omega. `garis` = versi garis luar saja (untuk ornamen).
export default function Monogram({ className = '', garis = false, strokeWidth = 10, ...rest }) {
  return (
    <svg viewBox={`0 0 ${MONOGRAM.w} ${MONOGRAM.h}`} className={className} aria-hidden="true" {...rest}>
      <path
        d={MONOGRAM.d}
        fillRule="evenodd"
        fill={garis ? 'none' : 'currentColor'}
        stroke={garis ? 'currentColor' : 'none'}
        strokeWidth={garis ? strokeWidth : 0}
      />
    </svg>
  );
}
