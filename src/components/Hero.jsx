import { hero } from '../data/isi.js';
import Nav from './Nav.jsx';
import { Teks, Tombol } from './Dasar.jsx';

export default function Hero() {
  return (
    <div className="pt-[14px]">
      <header
        id="awal"
        className="relative isolate mx-auto flex min-h-[min(88vh,820px)] max-w-[1440px] flex-col justify-end overflow-hidden rounded-besar text-gading shadow-kartu sm:min-h-[min(88vh,820px)] max-sm:min-h-[92vh]"
      >
        <picture className="absolute inset-0 -z-10 bg-hitam">
          <source media="(max-width: 700px)" srcSet={hero.gambarPonsel} />
          <img src={hero.gambar} alt="" className="h-full w-full object-cover" width="2400" height="1350" fetchPriority="high" />
        </picture>
        <div className="hero-lapisan absolute inset-0 -z-10" aria-hidden="true" />

        <Nav />

        <div className="relative grid items-end gap-x-16 gap-y-10 px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(2rem,4vw,3.5rem)] pt-36 md:grid-cols-[1.3fr_1fr] md:pt-[clamp(7rem,16vw,11rem)]">
          <div className="grid gap-4">
            <p className="label text-emas-muda">{hero.label}</p>
            <Teks
              as="h1"
              html={hero.judul}
              className="font-judul text-[clamp(2.4rem,5.2vw,4.4rem)] font-semibold leading-[1.05] text-white [&_em]:text-emas-muda"
            />
          </div>
          <div className="grid max-w-[460px] gap-[1.4rem] md:justify-self-end">
            <p className="text-gading/90">{hero.teks}</p>
            <div className="flex flex-wrap gap-3">
              <Tombol varian="gading" href={hero.tombolUtama.href} ikon={hero.tombolUtama.ikon}>{hero.tombolUtama.label}</Tombol>
              <Tombol varian="garis" href={hero.tombolKedua.href} ikon={hero.tombolKedua.ikon}>{hero.tombolKedua.label}</Tombol>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
