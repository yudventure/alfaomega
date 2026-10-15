import { gereja, kunjungi } from '../data/isi.js';
import Ikon from './Ikon.jsx';
import Reveal from './Reveal.jsx';
import { Teks, Tombol } from './Dasar.jsx';
import { aset } from '../aset.js';
import { tautanArah } from '../peta.js';

export default function Kunjungi() {
  return (
    <section className="bagian" id="kunjungi">
      <div className="isi grid gap-5 md:grid-cols-2">
        <Reveal gaya="kiri" className="kartu grid content-center gap-5 p-[clamp(1.6rem,3vw,2.6rem)]">
          <Teks as="h2" html={kunjungi.judul} className="judul" />
          <p className="text-batu-tua">{kunjungi.teks}</p>
          <ul className="grid gap-4">
            {kunjungi.info.map((k) => (
              <li key={k.label} className="flex items-start gap-4 text-[.95rem] text-batu-tua">
                <Ikon nama={k.ikon} className="mt-[.1em] h-6 w-6 text-emas-tua" />
                <span>
                  <b className="block font-teks text-[.68rem] font-semibold uppercase leading-[1.6] tracking-[.24em] text-emas-teks">{k.label}</b>
                  {k.isi.map((baris, i) => <span key={baris}>{i > 0 && <br />}{baris}</span>)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Tombol varian="hitam" href={tautanArah({ gereja, kunjungi })} ikon="lokasi" target="_blank" rel="noopener">{kunjungi.tombolArah.label}</Tombol>
            <Tombol varian="garis-hitam" href={kunjungi.tombolPesan.href} ikon="pesan" target="_blank" rel="noopener">{kunjungi.tombolPesan.label}</Tombol>
          </div>
        </Reveal>

        <Reveal as="figure" gaya="kanan" tunda={120} className="kartu klip-kartu relative min-h-[320px] overflow-hidden">
          <img src={aset(kunjungi.gambar)} alt={kunjungi.keteranganGambar} width="1200" height="900" loading="lazy" className="gambar-muncul absolute inset-0 h-full w-full object-cover" />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-krem px-4 py-2 font-teks text-[.72rem] font-semibold uppercase leading-none tracking-[.2em] text-emas-teks">
            {kunjungi.keteranganGambar}
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
