import { khotbah } from '../data/isi.js';
import Ikon from './Ikon.jsx';
import Reveal from './Reveal.jsx';
import { Kepala, Tautan } from './Dasar.jsx';

export default function Khotbah() {
  return (
    <section className="bagian" id="khotbah">
      <div className="isi">
        <Reveal>
          <Kepala
            judul={khotbah.judul}
            teks={khotbah.teks}
            aksi={<Tautan href={khotbah.tautanSemua.href} ikon="tautan-luar" target="_blank" rel="noopener">{khotbah.tautanSemua.label}</Tautan>}
          />
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
          {khotbah.daftar.map((k) => (
            <Reveal as="article" key={k.judul} className="kartu overflow-hidden">
              <a href={k.href} className="group relative block aspect-video overflow-hidden text-gading" aria-label={`Tonton: ${k.judul}`} target="_blank" rel="noopener">
                <img src={k.gambar} alt="" width="1280" height="720" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0)_35%,rgba(18,18,18,.78)_100%)]" aria-hidden="true" />
                <span className="absolute bottom-5 left-5 right-[4.5rem] grid gap-1.5 font-logo text-[1.35rem] font-bold leading-[1.1] tracking-[.02em] [text-shadow:0_2px_14px_rgba(0,0,0,.5)]">
                  <small className="font-teks text-[.65rem] font-semibold uppercase tracking-[.3em] text-emas">{k.seri}</small>
                  {k.judul}
                </span>
                <span className="absolute bottom-4 right-4 grid h-[46px] w-[46px] place-items-center rounded-full bg-emas text-hitam" aria-hidden="true">
                  <Ikon nama="live" className="h-[22px] w-[22px]" />
                </span>
              </a>
              <div className="grid gap-1 px-[1.4rem] pb-[1.4rem] pt-5">
                <h3 className="font-judul text-[1.35rem] font-semibold leading-[1.2]">{k.judul}</h3>
                <p className="text-[.9rem] text-batu-tua">{k.pembicara} · {k.nas}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
