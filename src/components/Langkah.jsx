import { useEffect, useRef, useState } from 'react';
import { langkah } from '../data/isi.js';
import Reveal from './Reveal.jsx';
import { Teks } from './Dasar.jsx';
import { aset } from '../aset.js';
import { teksPolos } from '../cms/judul.js';

// Timeline langkah bertumbuh: garis di kiri terisi emas mengikuti guliran (titiknya selalu di ±55% tinggi layar),
// bulatan bernomor menyala ketika titik itu melewatinya, kartu muncul dari kanan dengan foto berselang-seling.
export default function Langkah() {
  const relRef = useRef(null);
  const [aktif, setAktif] = useState(-1);

  useEffect(() => {
    const rel = relRef.current;
    if (!rel) return undefined;
    let raf = 0;
    const atur = () => {
      raf = 0;
      const garis = window.innerHeight * 0.55;
      const r = rel.getBoundingClientRect();
      const jarak = Math.min(r.height, Math.max(0, garis - r.top));
      rel.style.setProperty('--kemajuan', r.height ? (jarak / r.height).toFixed(4) : '0');
      rel.style.setProperty('--jarak', `${jarak.toFixed(1)}px`);
      let i = -1;
      rel.querySelectorAll('[data-simpul]').forEach((s) => {
        const b = s.getBoundingClientRect();
        if (b.top + b.height / 2 <= garis) i = Number(s.dataset.simpul);
      });
      setAktif(i);
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

  return (
    <section className="bagian" id="langkah">
      <div className="isi">
        <Reveal className="mb-12 grid max-w-[620px] gap-3 md:mb-16">
          <Teks as="h2" html={langkah.judul} className="judul" />
          <p className="text-batu-tua">{langkah.teks}</p>
        </Reveal>

        <div ref={relRef} className="relative pl-[52px] md:pl-[116px]" style={{ '--kemajuan': 0, '--jarak': '0px' }}>
          {/* rel timeline, isian emas, dan titik yang mengikuti guliran */}
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-4 top-0 w-[2px] bg-[linear-gradient(180deg,transparent,#E3D9C4_5%,#E3D9C4_92%,transparent)] md:left-[35px]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-4 top-0 w-[2px] origin-top bg-[linear-gradient(180deg,#E6CF95,#C8A25A_35%,#9A7633)] md:left-[35px]"
            style={{ transform: 'scaleY(var(--kemajuan))' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[17px] top-0 h-3 w-3 rounded-full bg-emas shadow-[0_0_0_6px_rgba(200,162,90,.22),0_0_22px_rgba(200,162,90,.75)] md:left-[36px]"
            style={{ transform: 'translate3d(-50%, calc(var(--jarak) - 50%), 0)', opacity: aktif < 0 ? 0 : 1, transition: 'opacity .4s' }}
          />

          <ol className="grid gap-8 md:gap-14">
            {langkah.daftar.map((l, i) => {
              const status = i < aktif ? 'lewat' : i === aktif ? 'aktif' : 'nanti';
              return (
                <li key={l.judul} className="relative">
                  <span
                    aria-hidden="true"
                    data-simpul={i}
                    className={`absolute -left-[52px] top-5 z-[1] grid h-[34px] w-[34px] place-items-center rounded-full border font-judul lining-nums text-[1.05rem] font-semibold leading-none transition-[background-color,border-color,color,box-shadow,scale] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:-left-[116px] md:top-8 md:h-[72px] md:w-[72px] md:text-[2.1rem] ${
                      status === 'nanti'
                        ? 'border-garis bg-gading text-emas-tua'
                        : status === 'aktif'
                          ? 'scale-110 border-emas bg-emas text-hitam shadow-[0_0_0_7px_rgba(200,162,90,.2),0_12px_30px_-10px_rgba(154,118,51,.7)]'
                          : 'border-emas bg-emas-muda text-hitam'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <Reveal gaya="kanan" className="rounded-kartu shadow-kartu">
                    <article className={`kartu klip-kartu grid overflow-hidden md:min-h-[320px] md:grid-cols-[1.05fr_1fr] ${status === 'aktif' ? 'md:border-emas/70' : ''}`}>
                      <div className={`flex flex-col justify-center gap-3 p-[clamp(1.5rem,3vw,2.6rem)] ${i % 2 ? 'md:order-last' : ''}`}>
                        <p className="label">Langkah {String(i + 1).padStart(2, '0')}</p>
                        <Teks as="h3" html={l.judul} className="font-judul text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-[1.2]" />
                        <p className="max-w-[44ch] text-batu-tua">{l.teks}</p>
                      </div>
                      <figure className="relative order-first min-h-[210px] overflow-hidden md:order-none md:min-h-[320px]">
                        <img src={aset(l.gambar)} alt={teksPolos(l.judul)} width="1200" height="900" loading="lazy" className="gambar-muncul absolute inset-0 h-full w-full object-cover" />
                      </figure>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
