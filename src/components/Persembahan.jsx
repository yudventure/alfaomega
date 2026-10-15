import { useState } from 'react';
import { persembahan } from '../data/isi.js';
import Reveal from './Reveal.jsx';
import { Teks, Tombol } from './Dasar.jsx';
import { aset } from '../aset.js';

function SalinNomor({ nomor }) {
  const [disalin, setDisalin] = useState(false);
  return (
    <button
      type="button"
      className="shrink-0 rounded-full border border-white/20 px-3.5 py-1.5 text-[.75rem] font-semibold uppercase tracking-[.08em] text-gading hover:bg-white/10"
      onClick={() => navigator.clipboard?.writeText(nomor.replace(/\s/g, '')).then(() => { setDisalin(true); setTimeout(() => setDisalin(false), 2000); })}
    >
      {disalin ? 'Disalin' : 'Salin'}
    </button>
  );
}

export default function Persembahan() {
  const rekening = (persembahan.rekening ?? []).filter((r) => r.nomor);
  return (
    <section className="bagian" id="persembahan">
      <div className="isi">
        <Reveal gaya="skala" className="relative grid items-center gap-8 overflow-hidden rounded-kartu bg-hitam p-[clamp(1.8rem,4vw,3.2rem)] text-gading md:grid-cols-[1.4fr_1fr]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(200,162,90,.22),transparent_55%)]" aria-hidden="true" />
          <div className="relative grid gap-4">
            <p className="label text-emas">Persembahan</p>
            <Teks as="h2" html={persembahan.judul} className="judul [&_em]:text-emas-muda" />
            <p className="max-w-[52ch] font-judul text-[1.2rem] italic font-medium leading-[1.45] text-emas-muda">{persembahan.ayat}</p>
            <p className="label text-[.68rem] tracking-[.28em] text-batu">{persembahan.rujukan}</p>
          </div>
          <div className="relative grid justify-items-start gap-4">
            {persembahan.tombol?.label && <Tombol varian="emas" href={persembahan.tombol.href} ikon="persembahan">{persembahan.tombol.label}</Tombol>}
            <p className="max-w-[36ch] text-[.9rem] text-batu">{persembahan.catatan}</p>
            {rekening.map((r) => (
              <div key={r.bank + r.nomor} className="flex w-full max-w-[420px] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="label text-[.65rem] text-emas">{r.bank}</p>
                  <p className="font-logo text-[1.15rem] font-semibold tracking-[.06em] text-white">{r.nomor}</p>
                  {r.atasNama && <p className="text-[.8rem] text-batu">a.n. {r.atasNama}</p>}
                </div>
                <SalinNomor nomor={r.nomor} />
              </div>
            ))}
            {persembahan.qris && (
              <figure className="flex w-full max-w-[420px] items-center gap-4 rounded-2xl bg-white p-3 text-hitam">
                <img src={aset(persembahan.qris)} alt="QRIS persembahan Gereja Alfa Omega" className="h-28 w-28 shrink-0 object-contain" loading="lazy" />
                <figcaption className="text-[.85rem] leading-snug">Pindai QRIS dengan aplikasi bank atau dompet digital Anda.</figcaption>
              </figure>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
