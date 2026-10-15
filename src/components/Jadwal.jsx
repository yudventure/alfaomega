import { jadwal } from '../data/isi.js';
import Ikon from './Ikon.jsx';
import Reveal from './Reveal.jsx';
import { Kepala, Tautan } from './Dasar.jsx';

export default function Jadwal() {
  return (
    <section className="bagian" id="jadwal">
      <div className="isi">
        <Reveal>
          <Kepala judul={jadwal.judul} teks={jadwal.teks} aksi={<Tautan href="#kunjungi">Petunjuk arah</Tautan>} />
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
          {jadwal.daftar.map((j, i) => (
            <Reveal key={j.nama} tunda={i * 90} className="kartu grid content-start gap-2 p-6">
              <Ikon nama={j.ikon} className="mb-2 h-11 w-11 text-emas-tua" />
              <h3 className="font-logo text-[.95rem] font-extrabold uppercase tracking-[.07em]">{j.nama}</h3>
              <p className="flex items-center gap-2 text-[.95rem] text-batu-tua">
                <Ikon nama="jam" className="h-[1.2em] w-[1.2em] text-emas-tua" />{j.waktu}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
