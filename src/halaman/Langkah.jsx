import { halamanLangkah, kunjungi } from '../data/isi.js';
import { LANGKAH, jalurLangkah } from '../cms/halaman.js';
import { teksPolos } from '../cms/judul.js';
import KepalaHalaman from '../components/KepalaHalaman.jsx';
import Reveal from '../components/Reveal.jsx';
import Ikon from '../components/Ikon.jsx';
import Lambang from '../components/Lambang.jsx';
import Jadwal from '../components/Jadwal.jsx';
import Kunjungi from '../components/Kunjungi.jsx';
import { Teks, Tombol } from '../components/Dasar.jsx';

// Bagian beranda yang ikut ditampilkan di halaman langkah tertentu
const SISIPAN = {
  beribadah: { setelahTahapan: Jadwal, setelahTanya: Kunjungi },
};

const nomor = (i) => String(i + 1).padStart(2, '0');
const kutipan = (p) => /^[“"]/.test(p.trim());
const luar = (href) => /^(https?:|mailto:|tel:)/i.test(href);

// Tombol ajakan: link '#'/kosong memakai tombol "Kirim Pesan" di Kunjungi Kami, atau bagian Kunjungi Kami.
function tautanAjakan(href) {
  const sah = (h) => h && h.trim() && h.trim() !== '#';
  if (sah(href)) return href;
  if (sah(kunjungi.tombolPesan?.href)) return kunjungi.tombolPesan.href;
  return '/#kunjungi';
}

// Halaman detail satu langkah bertumbuh: /langkah/<slug>
export default function HalamanLangkah({ slug }) {
  const d = halamanLangkah[slug];
  const ke = LANGKAH.indexOf(slug);
  const sebelum = LANGKAH[ke - 1];
  const sesudah = LANGKAH[ke + 1];
  const { setelahTahapan: SetelahTahapan, setelahTanya: SetelahTanya } = SISIPAN[slug] ?? {};
  const ajak = tautanAjakan(d.tombol?.href);

  return (
    <>
      <KepalaHalaman
        remah={`Langkah ${nomor(ke)}`}
        jejak={[{ label: 'Langkah Bertumbuh', href: '/#langkah' }]}
        judul={d.judul}
        teks={d.teks}
        gambar={d.gambar}
      >
        <ol className="flex flex-wrap items-center gap-y-2" aria-label="Lima langkah bertumbuh">
          {LANGKAH.map((s, i) => (
            <li key={s} className="flex items-center">
              {i > 0 && <span className={`mx-1.5 h-px w-4 sm:w-7 ${i <= ke ? 'bg-emas' : 'bg-gading/30'}`} aria-hidden="true" />}
              <a
                href={jalurLangkah(s)}
                aria-current={s === slug ? 'step' : undefined}
                aria-label={`Langkah ${i + 1}: ${teksPolos(halamanLangkah[s]?.judul ?? '')}`}
                className={`grid h-9 w-9 place-items-center rounded-full border font-judul text-[1.05rem] font-semibold lining-nums no-underline transition-colors duration-300 ${
                  s === slug
                    ? 'border-emas bg-emas text-hitam shadow-[0_0_0_5px_rgba(200,156,74,.25)]'
                    : i < ke
                      ? 'border-emas/70 bg-emas/15 text-emas-muda hover:bg-emas hover:text-hitam'
                      : 'border-gading/35 text-gading/75 hover:border-emas hover:text-white'
                }`}
              >
                {i + 1}
              </a>
            </li>
          ))}
        </ol>
      </KepalaHalaman>

      <main id="utama">
        {/* pengantar */}
        {d.pengantarJudul && (
          <section className="bagian" id="pengantar">
            <div className="isi grid gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-16">
              <Reveal className="grid content-start gap-3">
                <p className="label">Langkah {nomor(ke)}</p>
                <Teks as="h2" html={d.pengantarJudul} className="judul" />
              </Reveal>
              <Reveal gaya="kanan" tunda={120} className="grid content-start gap-5">
                {(d.pengantar ?? []).map((p) => (kutipan(p)
                  ? <blockquote key={p} className="border-l-2 border-emas pl-5 font-judul text-[1.4rem] font-medium italic leading-[1.45] text-hitam">{p}</blockquote>
                  : <p key={p} className="text-[1.06rem] text-batu-tua">{p}</p>))}
              </Reveal>
            </div>
          </section>
        )}

        {/* kartu poin */}
        {d.poinJudul && d.poin?.length > 0 && (
          <section className="bagian" id="poin">
            <div className="isi">
              <Reveal className="mb-10 max-w-[620px]"><Teks as="h2" html={d.poinJudul} className="judul" /></Reveal>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
                {d.poin.map((n, i) => (
                  <Reveal key={n.judul + i} tunda={(i % 4) * 90} className="kartu grid content-start gap-3 p-6">
                    {n.ikon && (
                      <span className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-hitam text-emas">
                        <Ikon nama={n.ikon} className="h-6 w-6" />
                      </span>
                    )}
                    <h3 className="font-judul text-[1.5rem] font-semibold leading-[1.15]">{n.judul}</h3>
                    <p className="text-[.95rem] text-batu-tua">{n.teks}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* tahapan: penanda bernomor yang tersambung garis (vertikal di ponsel, mendatar di layar lebar) */}
        {d.tahapanJudul && d.tahapan?.length > 0 && (
          <section className="bagian" id="tahapan">
            <div className="isi">
              <Reveal gaya="skala" className="relative overflow-hidden rounded-kartu bg-hitam p-[clamp(1.8rem,4vw,3.2rem)] text-gading">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(200,156,74,.22),transparent_55%)]" aria-hidden="true" />
                <Lambang garis className="pointer-events-none absolute -right-[8%] -top-[40%] w-[min(45%,380px)] text-emas/20" />
                <Teks as="h2" html={d.tahapanJudul} className="judul relative mb-10 [&_em]:text-emas-muda" />
                <ol className="relative grid gap-8 md:grid-flow-col md:auto-cols-fr md:gap-6">
                  {d.tahapan.map((t, i) => (
                    <li key={t.judul + i} className="relative grid content-start gap-2 pl-16 md:pl-0 md:pt-16">
                      {i < d.tahapan.length - 1 && (
                        <span className="absolute -bottom-8 left-[21px] top-11 w-px bg-emas/40 md:-right-6 md:bottom-auto md:left-11 md:top-[21px] md:h-px md:w-auto" aria-hidden="true" />
                      )}
                      <span className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full bg-emas font-judul text-[1.3rem] font-semibold lining-nums text-hitam" aria-hidden="true">{i + 1}</span>
                      <h3 className="font-logo text-[.95rem] font-extrabold uppercase tracking-[.06em] text-white">{t.judul}</h3>
                      <p className="text-[.95rem] text-gading/75">{t.teks}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
        )}

        {SetelahTahapan && <SetelahTahapan />}

        {/* tanya jawab */}
        {d.tanyaJudul && d.tanya?.length > 0 && (
          <section className="bagian" id="tanya">
            <div className="isi grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-16">
              <Reveal className="grid content-start gap-3">
                <p className="label">Tanya jawab</p>
                <h2 className="judul">{d.tanyaJudul}</h2>
                <p className="text-batu-tua">Pertanyaan Anda belum terjawab? <a href={tautanAjakan('')} className="font-semibold text-emas-teks" {...(luar(tautanAjakan('')) ? { target: '_blank', rel: 'noopener' } : {})}>Hubungi kami</a>.</p>
              </Reveal>
              <div className="grid content-start gap-3">
                {d.tanya.map((t, i) => (
                  <Reveal key={t.tanya + i} as="details" tunda={i * 70} className="kartu group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-judul text-[1.3rem] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                      {t.tanya}
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-garis text-emas-tua transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </summary>
                    <p className="-mt-1 px-6 pb-6 text-batu-tua">{t.jawab}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {SetelahTanya && <SetelahTanya />}

        {/* ajakan */}
        {d.ajakanJudul && (
          <section className="bagian" id="ajakan">
            <div className="isi">
              <Reveal gaya="skala" className="relative grid items-end gap-8 overflow-hidden rounded-kartu bg-hitam p-[clamp(1.8rem,4vw,3.2rem)] text-gading md:grid-cols-[1.4fr_1fr]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(200,156,74,.22),transparent_55%)]" aria-hidden="true" />
                <Lambang garis className="pointer-events-none absolute -bottom-[34%] right-[4%] w-[min(40%,340px)] text-emas/25" />
                <div className="relative grid gap-4">
                  <Teks as="h2" html={d.ajakanJudul} className="judul [&_em]:text-emas-muda" />
                  {d.ajakanTeks && <p className="max-w-[48ch] text-gading/85">{d.ajakanTeks}</p>}
                </div>
                <div className="relative flex flex-wrap gap-3 md:justify-end">
                  {d.tombol?.label && (
                    <Tombol varian="emas" href={ajak} ikon="pesan" {...(luar(ajak) ? { target: '_blank', rel: 'noopener' } : {})}>{d.tombol.label}</Tombol>
                  )}
                  <Tombol varian="garis" href="/#jadwal" ikon="jam">Jadwal Ibadah</Tombol>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* langkah sebelum / sesudah */}
        <nav aria-label="Langkah lainnya" className="bagian">
          <div className="isi grid gap-4 sm:grid-cols-2">
            <KartuArah arah="sebelum" slug={sebelum} ke={ke - 1} />
            <KartuArah arah="sesudah" slug={sesudah} ke={ke + 1} />
          </div>
        </nav>
      </main>
    </>
  );
}

function KartuArah({ arah, slug, ke }) {
  const sesudah = arah === 'sesudah';
  const href = slug ? jalurLangkah(slug) : '/#langkah';
  const label = slug ? `${sesudah ? 'Langkah berikutnya' : 'Langkah sebelumnya'} · ${nomor(ke)}` : 'Langkah Bertumbuh';
  const judul = slug ? halamanLangkah[slug]?.judul ?? '' : sesudah ? 'Kembali ke <em>semua langkah</em>' : 'Lihat <em>semua langkah</em>';
  return (
    <Reveal gaya={sesudah ? 'kanan' : 'kiri'} className={sesudah ? 'sm:col-start-2' : ''}>
      <a
        href={href}
        className={`kartu group flex h-full items-center gap-5 p-6 no-underline transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-emas ${sesudah ? 'flex-row-reverse text-right' : ''}`}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hitam text-emas transition-colors group-hover:bg-emas group-hover:text-hitam">
          <Ikon nama="panah-kanan" className={`h-5 w-5 ${sesudah ? '' : 'rotate-180'}`} />
        </span>
        <span className="grid gap-1">
          <span className="label">{label}</span>
          <Teks as="span" html={judul} className="font-judul text-[1.55rem] font-semibold leading-[1.15] text-hitam [&_em]:text-emas-tua" />
        </span>
      </a>
    </Reveal>
  );
}
