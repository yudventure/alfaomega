import { useEffect, useRef } from 'react';

// Menulis jarak gulir (px) ke variabel CSS --gulir pada elemen, untuk efek paralaks ringan.
// Hanya dihitung saat elemen masih terlihat; dimatikan bila pengguna memilih "kurangi gerakan".
export function useParalaks() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const atur = () => {
      raf = 0;
      const bawah = el.offsetTop + el.offsetHeight;
      if (window.scrollY > bawah + 200) return;
      el.style.setProperty('--gulir', Math.min(window.scrollY, bawah).toFixed(1));
    };
    const jadwalkan = () => { if (!raf) raf = requestAnimationFrame(atur); };
    atur();
    window.addEventListener('scroll', jadwalkan, { passive: true });
    window.addEventListener('resize', jadwalkan);
    return () => {
      window.removeEventListener('scroll', jadwalkan);
      window.removeEventListener('resize', jadwalkan);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
