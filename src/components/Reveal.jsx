import { useEffect, useRef, useState } from 'react';

// Muncul halus saat digulir ke layar (gaya animasi ada di index.css: .muncul).
// gaya: naik | kiri | kanan | skala   ·   tunda: jeda dalam ms untuk efek berurutan (mis. i * 90)
// Di ponsel, kiri/kanan otomatis menjadi naik. Pengguna dengan "kurangi gerakan" hanya melihat pudar singkat.
export default function Reveal({ as: Tag = 'div', className = '', gaya = 'naik', tunda = 0, style, children, ...rest }) {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setTampil(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTampil(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    io.observe(el);
    const cetak = () => setTampil(true);
    window.addEventListener('beforeprint', cetak);
    return () => { io.disconnect(); window.removeEventListener('beforeprint', cetak); };
  }, []);

  return (
    <Tag
      ref={ref}
      data-muncul={gaya}
      data-tampil={tampil ? '' : undefined}
      style={tunda ? { ...style, '--tunda': `${tunda}ms` } : style}
      className={`muncul ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
