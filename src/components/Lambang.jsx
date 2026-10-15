import { LAMBANG } from './lambang-path.js';

// Lambang singa GBI Kapernaum Sorong (warna mengikuti `currentColor`).
// bagian: 'lengkap' (cincin + singa) | 'singa' (singa saja).
// garis = garis luar saja untuk ornamen; tebal garis dalam piksel layar (tidak ikut membesar).
// piringan = warna piringan di belakang (mis. '#121212'), seperti logo asli berbentuk lencana.
export default function Lambang({ className = '', bagian = 'lengkap', garis = false, strokeWidth = 1.5, piringan, ...rest }) {
  const rp = LAMBANG.r_piringan;
  const kotak = piringan ? `${50 - rp} ${50 - rp} ${2 * rp} ${2 * rp}` : `0 0 ${LAMBANG.w} ${LAMBANG.h}`;
  return (
    <svg viewBox={kotak} className={className} aria-hidden="true" {...rest}>
      {piringan && <circle cx="50" cy="50" r={rp} fill={piringan} />}
      <path
        d={bagian === 'singa' ? LAMBANG.singa : LAMBANG.d}
        fillRule="evenodd"
        fill={garis ? 'none' : 'currentColor'}
        stroke={garis ? 'currentColor' : 'none'}
        strokeWidth={garis ? strokeWidth : 0}
        vectorEffect={garis ? 'non-scaling-stroke' : undefined}
      />
    </svg>
  );
}
