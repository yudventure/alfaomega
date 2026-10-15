import { pengurus } from '../data/isi.js';
import Lambang from './Lambang.jsx';
import Reveal from './Reveal.jsx';
import { Kepala } from './Dasar.jsx';
import { aset } from '../aset.js';

export default function Pengurus() {
  if (!pengurus.daftar.length) return null;
  return (
    <section className="bagian" id="pengurus">
      <div className="isi">
        <Reveal><Kepala judul={pengurus.judul} teks={pengurus.teks} /></Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
          {pengurus.daftar.map((p, i) => (
            <Reveal as="article" key={p.nama + p.jabatan} tunda={(i % 4) * 100} className="kartu klip-kartu overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden bg-hitam">
                {p.foto ? (
                  <img src={aset(p.foto)} alt={p.nama} width="800" height="1000" loading="lazy" className="gambar-muncul absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_35%,rgba(200,156,74,.28),transparent_65%)]">
                    <Lambang className="w-[44%] text-emas/70" />
                  </div>
                )}
              </div>
              <div className="grid gap-1.5 px-[1.4rem] pb-[1.4rem] pt-5">
                <h3 className="font-judul text-[1.45rem] font-semibold leading-[1.15]">{p.nama}</h3>
                <p className="label text-[.68rem] tracking-[.24em]">{p.jabatan}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
