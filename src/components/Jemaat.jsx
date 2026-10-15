import { jemaat } from '../data/isi.js';
import Monogram from './Monogram.jsx';
import Reveal from './Reveal.jsx';
import { Teks } from './Dasar.jsx';
import { aset } from '../aset.js';

const judulTile = 'font-logo text-[1.1rem] font-bold tracking-[.04em]';

// Grid bento "Kehidupan Jemaat"
export default function Jemaat() {
  return (
    <section className="bagian" id="jemaat">
      <div className="isi">
        <Reveal className="mb-10"><Teks as="h2" html={jemaat.judul} className="judul" /></Reveal>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {/* Sekolah Minggu */}
          <Reveal as="article" className="relative grid min-h-[240px] content-start justify-items-center gap-2 overflow-hidden rounded-kartu bg-pasir p-7 pb-[7.5rem] text-center">
            <h3 className={`relative z-10 ${judulTile}`}>{jemaat.sekolahMinggu.judul}</h3>
            <p className="relative z-10 max-w-[34ch] text-[.95rem] text-batu-tua">{jemaat.sekolahMinggu.teks}</p>
            <Monogram garis strokeWidth={12} className="absolute -bottom-[48%] -left-[12%] z-0 w-[58%] rotate-[14deg] text-krem" />
          </Reveal>

          {/* Pemuda */}
          <Reveal as="article" className="relative grid min-h-[240px] content-start justify-items-center gap-2 overflow-hidden rounded-kartu bg-pasir p-7 pt-24 text-center">
            <span className="absolute -top-[70px] left-1/2 -ml-[85px] h-[170px] w-[170px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#F0DCA8,#A9843F_55%,#6E5428)] opacity-90 blur-[10px]" aria-hidden="true" />
            <h3 className={`relative ${judulTile}`}>{jemaat.pemuda.judul}</h3>
            <p className="relative max-w-[34ch] text-[.95rem] text-batu-tua">{jemaat.pemuda.teks}</p>
          </Reveal>

          {/* Komsel + Doa (tile tinggi gelap) */}
          <Reveal
            as="article"
            className="flex min-h-[420px] flex-col justify-between gap-6 overflow-hidden rounded-kartu bg-hitam bg-cover bg-center p-9 text-gading sm:col-span-2 md:col-span-1 md:col-start-3 md:row-start-1 md:row-span-2"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(18,18,18,.82) 0%, rgba(18,18,18,.15) 42%, rgba(18,18,18,.15) 58%, rgba(18,18,18,.85) 100%), url(${aset(jemaat.gambarTinggi)})` }}
          >
            <div className="grid gap-2">
              <h3 className={judulTile}>{jemaat.komsel.judul}</h3>
              <p className="max-w-[34ch] text-[.95rem] text-gading/80">{jemaat.komsel.teks}</p>
            </div>
            <div className="grid gap-2">
              <h3 className={judulTile}>{jemaat.doa.judul}</h3>
              <p className="max-w-[34ch] text-[.95rem] text-gading/80">{jemaat.doa.teks}</p>
            </div>
          </Reveal>

          {/* Pelayanan & Misi (tile lebar) */}
          <Reveal
            as="article"
            className="grid min-h-[340px] content-center justify-items-center gap-2 overflow-hidden rounded-kartu bg-hitam bg-cover bg-center p-7 text-center text-gading sm:col-span-2"
            style={{ backgroundImage: `radial-gradient(ellipse at center, rgba(18,18,18,.78) 0%, rgba(18,18,18,.5) 75%), url(${aset(jemaat.gambarLebar)})` }}
          >
            <h3 className="font-logo text-[1.5rem] font-bold tracking-[.04em]">{jemaat.misi.judul}</h3>
            <p className="max-w-[42ch] text-[.95rem] text-gading/85">{jemaat.misi.teks}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
