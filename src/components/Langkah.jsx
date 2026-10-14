import { langkah } from '../data/isi.js';
import Reveal from './Reveal.jsx';
import { Teks } from './Dasar.jsx';

// Kartu bernomor yang bertumpuk saat digulir (position: sticky di layar lebar)
export default function Langkah() {
  return (
    <section className="bagian" id="langkah">
      <div className="isi">
        <Reveal className="mb-10 grid max-w-[620px] gap-3">
          <Teks as="h2" html={langkah.judul} className="judul" />
          <p className="text-batu-tua">{langkah.teks}</p>
        </Reveal>

        <div className="grid gap-4 md:gap-0">
          {langkah.daftar.map((l, i) => (
            <article
              key={l.judul}
              className="kartu grid gap-6 overflow-hidden shadow-kartu md:sticky md:mb-10 md:min-h-[480px] md:grid-cols-2 md:last:mb-0"
              style={{ top: `calc(84px + ${i} * 16px)` }}
            >
              <div className="flex flex-col justify-end gap-3 p-[clamp(1.6rem,3.4vw,3rem)]">
                <span className="mb-auto font-judul text-[clamp(4rem,8vw,6.5rem)] font-medium leading-none text-emas-muda" aria-hidden="true">{i + 1}</span>
                <Teks as="h3" html={l.judul} className="font-judul text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-[1.2]" />
                <p className="max-w-[44ch] text-batu-tua">{l.teks}</p>
              </div>
              <figure className="relative order-first min-h-[220px] md:order-none md:min-h-[260px]">
                <img src={l.gambar} alt="" width="1200" height="900" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
