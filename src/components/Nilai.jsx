import { nilai } from '../data/konten.js';
import Ikon from './Ikon.jsx';
import Reveal from './Reveal.jsx';
import { Kepala } from './Dasar.jsx';

export default function Nilai() {
  if (!nilai.daftar.length) return null;
  return (
    <section className="bagian" id="nilai">
      <div className="isi">
        <Reveal><Kepala judul={nilai.judul} teks={nilai.teks} /></Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
          {nilai.daftar.map((n, i) => (
            <Reveal key={n.judul} className="kartu grid content-start gap-3 p-6">
              <div className="mb-2 flex items-start justify-between">
                <Ikon nama={n.ikon} className="h-11 w-11 text-emas-tua" />
                <span className="font-logo text-[.85rem] font-semibold tracking-[.1em] text-batu">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-judul text-[1.55rem] font-semibold leading-[1.15]">{n.judul}</h3>
              <p className="text-[.95rem] text-batu-tua">{n.teks}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
