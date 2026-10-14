import { useEffect, useRef, useState } from 'react';

// Muncul perlahan saat digulir ke layar. Tanpa IntersectionObserver (atau setelah 2 detik)
// isi langsung tampil, jadi tidak ada yang tersembunyi.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setTampil(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTampil(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    io.observe(el);
    const t = setTimeout(() => setTampil(true), 2000);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${tampil ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]'}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
