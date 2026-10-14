import { persembahan } from '../data/konten.js';
import Reveal from './Reveal.jsx';
import { Teks, Tombol } from './Dasar.jsx';

export default function Persembahan() {
  return (
    <section className="bagian" id="persembahan">
      <div className="isi">
        <Reveal className="relative grid items-center gap-8 overflow-hidden rounded-kartu bg-hitam p-[clamp(1.8rem,4vw,3.2rem)] text-gading md:grid-cols-[1.4fr_1fr]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(200,162,90,.22),transparent_55%)]" aria-hidden="true" />
          <div className="relative grid gap-4">
            <p className="label text-emas">Persembahan</p>
            <Teks as="h2" html={persembahan.judul} className="judul [&_em]:text-emas-muda" />
            <p className="max-w-[52ch] font-judul text-[1.2rem] italic font-medium leading-[1.45] text-emas-muda">{persembahan.ayat}</p>
            <p className="label text-[.68rem] tracking-[.28em] text-batu">{persembahan.rujukan}</p>
          </div>
          <div className="relative grid justify-items-start gap-4">
            <Tombol varian="emas" href={persembahan.tombol.href} ikon="persembahan">{persembahan.tombol.label}</Tombol>
            <p className="max-w-[36ch] text-[.9rem] text-batu">{persembahan.catatan}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
