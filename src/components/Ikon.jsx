import { IKON } from './ikon-paths.js';

// Ikon garis 24×24 dari kit brand (brand/web/ikon). Warna mengikuti `currentColor`.
export default function Ikon({ nama, className = 'w-6 h-6', ...rest }) {
  const path = IKON[nama];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: path }}
      {...rest}
    />
  );
}
