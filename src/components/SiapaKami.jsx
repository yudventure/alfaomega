import { gereja, siapaKami } from '../data/isi.js';
import Monogram from './Monogram.jsx';
import Reveal from './Reveal.jsx';
import { Tautan, Teks } from './Dasar.jsx';

// Halaman Siapa Kami: asal nama Alfa Omega (kartu ayat + teks + foto)
export default function SiapaKami() {
  return (
    <section className="bagian" id="tentang">
      <div className="isi grid gap-5 md:grid-cols-[1fr_1.9fr]">
        {/* kartu ayat (padanan kartu "angka" di referensi) */}
        <Reveal className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-kartu bg-[linear-gradient(145deg,#B7955A_0%,#8E6F38_55%,#6E5428_100%)] p-7 text-gading">
          <p className="label text-gading/85">Alfa &amp; Omega</p>
          <Monogram garis strokeWidth={10} className="absolute -right-[8%] -top-[6%] w-[58%] -rotate-12 text-gading/55" />
          <div className="relative mt-16 grid gap-2">
            <div className="font-judul text-[clamp(2.6rem,5vw,3.6rem)] font-semibold leading-none tracking-[.04em]" aria-label="Alfa dan Omega">
              Α <span className="mx-[.1em] text-emas-muda">·</span> Ω
            </div>
            <p className="max-w-[30ch] font-judul text-[1.15rem] italic font-medium leading-[1.4]">{gereja.ayat}</p>
            <p className="label text-[.68rem] tracking-[.28em] text-emas-muda">{gereja.ayatRujukan}</p>
          </div>
        </Reveal>

        <Reveal className="kartu grid overflow-hidden md:grid-cols-[1fr_.95fr]">
          <div className="grid content-center gap-4 p-[clamp(1.6rem,3vw,2.6rem)]">
            <Teks as="h2" html={siapaKami.judul} className="judul" />
            {siapaKami.paragraf.map((p) => <p key={p} className="max-w-[46ch] text-batu-tua">{p}</p>)}
            <Tautan href={siapaKami.tautan.href} className="mt-1 justify-self-start">{siapaKami.tautan.label}</Tautan>
          </div>
          <figure className="foto-setengah relative mx-4 mb-4 min-h-[240px] overflow-hidden md:my-4 md:ml-0 md:min-h-[300px]">
            <img src={siapaKami.gambar} alt="" width="1200" height="900" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
