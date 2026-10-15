import { ajakan } from '../data/isi.js';
import Lambang from './Lambang.jsx';
import Reveal from './Reveal.jsx';
import { Teks, Tombol } from './Dasar.jsx';

// Penutup halaman: ajakan datang beribadah
export default function Ajakan() {
  return (
    <section className="bagian" id="ajakan">
      <div className="isi">
        <Reveal gaya="skala" className="relative grid items-end gap-8 overflow-hidden rounded-kartu bg-hitam p-[clamp(1.8rem,4vw,3.2rem)] text-gading md:grid-cols-[1.4fr_1fr]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(200,156,74,.22),transparent_55%)]" aria-hidden="true" />
          <Lambang garis className="pointer-events-none absolute -bottom-[34%] right-[4%] w-[min(40%,340px)] text-emas/25" />
          <div className="relative grid gap-4">
            <Teks as="h2" html={ajakan.judul} className="judul [&_em]:text-emas-muda" />
            <p className="max-w-[48ch] text-gading/85">{ajakan.teks}</p>
          </div>
          <div className="relative flex flex-wrap gap-3 md:justify-end">
            <Tombol varian="emas" href={ajakan.tombolUtama.href} ikon="jam">{ajakan.tombolUtama.label}</Tombol>
            <Tombol varian="garis" href={ajakan.tombolKedua.href} ikon="lokasi">{ajakan.tombolKedua.label}</Tombol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
