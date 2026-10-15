import { useEffect, useMemo, useRef, useState } from 'react';
import { jadwal, kalender } from '../data/isi.js';
import Ikon from './Ikon.jsx';
import Lambang from './Lambang.jsx';
import Reveal from './Reveal.jsx';
import { Kepala } from './Dasar.jsx';
import {
  BULAN, BULAN_SINGKAT, HARI, HARI_SINGKAT, JENIS_HARI_BESAR, agendaBerikutnya, dariIndeks, formatPanjang, formatRentang,
  hariIni, indeksBulan, isiBulan, isiTanggal, keTeks, labelKotak, rentangTahun, selBulan, siapkan,
} from '../kalender.js';

// Warna tiap jenis hari besar: kotak tanggal, label, dan contoh di keterangan
const WARNA = {
  gerejawi: { sel: 'bg-emas-muda/50 text-emas-teks', teks: 'text-emas-teks', label: 'bg-emas-muda/55 text-emas-teks' },
  nasional: { sel: 'bg-[#F5DCD6] text-[#9E3326]', teks: 'text-[#9E3326]', label: 'bg-[#F5DCD6] text-[#9E3326]' },
  cuti: { sel: 'bg-[#FAE6D2] text-[#97511A]', teks: 'text-[#97511A]', label: 'bg-[#FAE6D2] text-[#97511A]' },
  daerah: { sel: 'bg-[#EAE2F2] text-[#61457F]', teks: 'text-[#61457F]', label: 'bg-[#EAE2F2] text-[#61457F]' },
};
const namaJenis = (j) => JENIS_HARI_BESAR.find((x) => x.nilai === j)?.label ?? '';
const tombolBulat = 'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-garis bg-white text-hitam transition-colors duration-200 hover:border-emas hover:bg-emas/10 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-garis disabled:hover:bg-white';

// Kalender kegiatan setahun: kalender bulanan di kiri, rincian tanggal & bulan di kanan (seperti kalender kerja pemda).
// Agenda & hari besar dari CMS (isi.kalender); ibadah mingguan dibaca dari Jadwal Ibadah.
export default function KalenderKegiatan() {
  const data = useMemo(() => siapkan(kalender, jadwal), []);
  const [hari] = useState(() => hariIni());
  const rentang = useMemo(() => rentangTahun(data, hari), [data, hari]);
  const [pilih, setPilih] = useState(hari);
  const fokusRef = useRef(false);
  const gridRef = useRef(null);

  const bulan = indeksBulan(pilih);
  const { th, bl } = dariIndeks(bulan);
  const awal = rentang.awal * 12;
  const akhir = rentang.akhir * 12 + 11;
  const sel = useMemo(() => selBulan(th, bl), [th, bl]);
  const ringkas = useMemo(() => isiBulan(data, th, bl), [data, th, bl]);
  const terpilih = useMemo(() => isiTanggal(data, pilih), [data, pilih]);

  // tanda di kotak tanggal: jenis hari besar & ada agenda
  const tanda = useMemo(() => {
    const peta = {};
    for (const s of sel) {
      if (!s) continue;
      const isi = isiTanggal(data, s);
      peta[s] = { jenis: isi.hariBesar[0]?.jenis, agenda: isi.agenda.length + isi.bulanan.length, nama: isi.hariBesar.map((h) => h.nama) };
    }
    return peta;
  }, [data, sel]);
  const adaDiBulan = useMemo(
    () => BULAN.map((_, i) => isiBulan(data, th, i).butir.length > 0),
    [data, th],
  );

  // Pindah bulan: pilih hari ini bila ada di bulan itu, kalau tidak tanggal agenda pertama, kalau tidak tanggal 1
  const keBulan = (i) => {
    if (i < awal || i > akhir) return;
    const { th: t, bl: b } = dariIndeks(i);
    if (indeksBulan(hari) === i) return setPilih(hari);
    setPilih(isiBulan(data, t, b).butir[0]?.tanggal ?? selBulan(t, b).find(Boolean));
  };

  const geserHari = (n) => {
    const d = new Date(`${pilih}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    const baru = d.toISOString().slice(0, 10);
    const i = indeksBulan(baru);
    if (i < awal || i > akhir) return;
    fokusRef.current = true;
    setPilih(baru);
  };
  const tombolKeyboard = (e) => {
    const langkah = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (langkah) { e.preventDefault(); geserHari(langkah); }
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      fokusRef.current = true;
      keBulan(bulan + (e.key === 'PageUp' ? -1 : 1));
    }
  };
  useEffect(() => {
    if (!fokusRef.current) return;
    fokusRef.current = false;
    gridRef.current?.querySelector(`[data-tanggal="${pilih}"]`)?.focus();
  }, [pilih]);

  const daftarAgenda = [
    ...terpilih.agenda.map((a) => ({
      kunci: `a-${a.judul}-${a.mulai}`, jam: a.jam, judul: a.judul, lokasi: a.lokasi, ket: a.ket,
      keterangan: a.lama > 1 ? `${formatRentang(a.mulai, a.selesai)} · hari ke-${a.ke} dari ${a.lama}` : 'Agenda khusus',
    })),
    ...terpilih.bulanan.map((r) => ({
      kunci: `b-${r.judul}`, jam: r.jam, judul: r.judul, lokasi: r.lokasi,
      keterangan: `Agenda rutin setiap ${HARI[Number(r.hari)]} ${r.pekan === 'akhir' ? 'terakhir' : ['pertama', 'kedua', 'ketiga', 'keempat'][Number(r.pekan) - 1]} tiap bulan`,
    })),
    ...terpilih.mingguan.map((r) => ({ kunci: `m-${r.judul}`, jam: r.jam, judul: r.judul, rutin: true, keterangan: `Ibadah rutin setiap ${HARI[r.hari]}` })),
  ];
  const berikut = daftarAgenda.length ? null : agendaBerikutnya(data, pilih);
  const jenisAda = JENIS_HARI_BESAR.filter((j) => data.hariBesar.some((h) => h.jenis === j.nilai));

  // "Minggu 09.00 & 09.40 · Jumat 18.00 · Sabtu 17.00 WIT"
  const teksRutin = useMemo(() => {
    const perHari = new Map();
    for (const r of data.mingguan) perHari.set(r.hari, [...(perHari.get(r.hari) ?? []), r.jam.replace(/\s*WIT$/i, '')]);
    const isi = [...perHari].sort(([a], [b]) => a - b).map(([h, jam]) => `${HARI[h]} ${jam.filter(Boolean).join(' & ')}`.trim());
    return isi.length ? `${isi.join(' · ')} WIT` : '';
  }, [data]);

  return (
    <section className="bagian" id="kalender">
      <div className="isi">
        <Reveal>
          <Kepala judul={kalender.judul} teks={kalender.teks} />
        </Reveal>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-6">
          {/* ---------- kalender ---------- */}
          <Reveal gaya="kiri" className="self-stretch">
            <div className="kartu p-[clamp(1.1rem,2.4vw,1.9rem)] lg:sticky lg:top-[108px]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-judul text-[clamp(1.75rem,3vw,2.3rem)] font-semibold leading-none" aria-live="polite">
                    {BULAN[bl]} <span className="text-emas-teks lining-nums">{th}</span>
                  </h3>
                  <p className="mt-2 flex items-center gap-1.5 text-[.85rem] text-batu-tua">
                    <Ikon nama="jam" className="h-4 w-4 text-emas-tua" />Waktu Indonesia Timur (WIT)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className={tombolBulat} onClick={() => keBulan(bulan - 1)} disabled={bulan <= awal} aria-label="Bulan sebelumnya">
                    <Ikon nama="panah-kanan" className="h-5 w-5 rotate-180" />
                  </button>
                  <button type="button" className={tombolBulat} onClick={() => keBulan(bulan + 1)} disabled={bulan >= akhir} aria-label="Bulan berikutnya">
                    <Ikon nama="panah-kanan" className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* lompat ke bulan lain dalam setahun */}
              <div role="group" aria-label={`Bulan di tahun ${th}`} className="mt-5 grid grid-cols-6 gap-1.5 sm:grid-cols-12 lg:grid-cols-6 xl:grid-cols-12">
                {BULAN_SINGKAT.map((b, i) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => keBulan(th * 12 + i)}
                    aria-pressed={i === bl}
                    aria-label={`${BULAN[i]} ${th}${adaDiBulan[i] ? ', ada agenda' : ''}`}
                    className={`relative rounded-full py-2 font-teks text-[.7rem] font-bold uppercase leading-none tracking-[.08em] transition-colors duration-200 ${
                      i === bl ? 'bg-hitam text-emas-muda' : 'bg-pasir/60 text-batu-tua hover:bg-pasir hover:text-hitam'
                    }`}
                  >
                    {b}
                    {adaDiBulan[i] && <span aria-hidden="true" className={`absolute bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${i === bl ? 'bg-emas-muda' : 'bg-emas'}`} />}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1 text-center sm:gap-1.5" aria-hidden="true">
                {HARI_SINGKAT.map((h, i) => (
                  <span key={h} className={`pb-1 font-teks text-[.68rem] font-bold uppercase tracking-[.14em] ${i === 0 ? 'text-emas-teks' : 'text-batu'}`}>{h}</span>
                ))}
              </div>
              <div ref={gridRef} role="group" aria-label={`Tanggal ${BULAN[bl]} ${th}`} onKeyDown={tombolKeyboard} className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {sel.map((s, i) => {
                  if (!s) return <span key={`k${i}`} aria-hidden="true" />;
                  const t = tanda[s];
                  const minggu = i % 7 === 0;
                  const dipilih = s === pilih;
                  const kini = s === hari;
                  const warna = dipilih
                    ? 'bg-hitam text-emas-muda shadow-[0_10px_24px_-12px_rgba(18,18,18,.8)]'
                    : t.jenis ? `${WARNA[t.jenis].sel} hover:brightness-[.97]` : `${minggu ? 'text-emas-teks' : 'text-arang'} hover:bg-pasir/80`;
                  const cincin = kini ? (dipilih ? 'shadow-[inset_0_0_0_2px_#C89C4A]' : 'shadow-[inset_0_0_0_1.5px_#121212]') : '';
                  const label = [formatPanjang(s), kini && 'hari ini', ...t.nama, t.agenda && `${t.agenda} agenda`].filter(Boolean).join(', ');
                  return (
                    <button
                      key={s}
                      type="button"
                      data-tanggal={s}
                      tabIndex={dipilih ? 0 : -1}
                      aria-pressed={dipilih}
                      aria-current={kini ? 'date' : undefined}
                      aria-label={label}
                      onClick={() => setPilih(s)}
                      className={`relative grid aspect-square place-items-center rounded-[12px] font-teks text-[.95rem] font-semibold lining-nums tabular-nums transition-[background-color,color,box-shadow] duration-200 sm:aspect-[6/5] ${warna} ${cincin}`}
                    >
                      {Number(s.slice(8))}
                      {t.agenda > 0 && (
                        <span aria-hidden="true" className={`absolute bottom-[14%] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full ${dipilih ? 'bg-emas-muda' : 'bg-emas-tua'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 border-t border-garis pt-5 text-[.8rem] text-batu-tua" aria-label="Keterangan warna">
                {jenisAda.map((j) => (
                  <li key={j.nilai} className="flex items-center gap-2">
                    <span aria-hidden="true" className={`h-3.5 w-3.5 rounded-[4px] ${WARNA[j.nilai].sel}`} />{j.label}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <span aria-hidden="true" className="grid h-3.5 w-3.5 place-items-center rounded-[4px] bg-white shadow-[inset_0_0_0_1px_#E3D9C4]"><span className="h-[5px] w-[5px] rounded-full bg-emas-tua" /></span>Ada agenda
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[4px] shadow-[inset_0_0_0_1.5px_#121212]" />Hari ini
                </li>
              </ul>
            </div>
          </Reveal>

          {/* ---------- rincian ---------- */}
          <div className="grid min-w-0 content-start gap-4">
            <Reveal gaya="kanan">
              <div className="relative isolate overflow-hidden rounded-kartu bg-hitam p-[clamp(1.4rem,2.6vw,2rem)] text-gading">
                <Lambang garis className="pointer-events-none absolute -right-12 -top-10 -z-10 w-56 text-emas/[.16]" />
                <p className="label text-emas-muda">Ibadah &amp; kegiatan</p>
                <p className="mt-3 flex items-end gap-3">
                  <span className="font-judul text-[clamp(3.6rem,7vw,4.8rem)] font-semibold leading-[.8] text-white lining-nums">{ringkas.rutin + ringkas.khusus}</span>
                  <span className="pb-1 text-[.95rem] leading-snug text-gading/75">ibadah &amp; kegiatan<br />{BULAN[bl]} {th}</span>
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 text-[.8rem]">
                  <li className="rounded-full border border-emas/35 bg-emas/10 px-3 py-1.5 text-emas-muda">{ringkas.rutin} ibadah rutin</li>
                  <li className="rounded-full border border-emas/35 bg-emas/10 px-3 py-1.5 text-emas-muda">{ringkas.khusus} agenda khusus</li>
                  {ringkas.hariBesar > 0 && <li className="rounded-full border border-gading/20 px-3 py-1.5 text-gading/80">{ringkas.hariBesar} hari raya &amp; libur</li>}
                </ul>
                {teksRutin && <p className="mt-4 text-[.85rem] leading-relaxed text-gading/60">Ibadah rutin setiap pekan: {teksRutin}.</p>}
              </div>
            </Reveal>

            <Reveal gaya="kanan" tunda={90}>
              <div className="kartu p-[clamp(1.25rem,2.4vw,1.75rem)]" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="label">{pilih === hari ? 'Hari ini' : 'Tanggal dipilih'}</p>
                  {pilih !== hari && (
                    <button type="button" onClick={() => setPilih(hari)} className="inline-flex items-center gap-1.5 rounded-full border border-garis px-3 py-1.5 font-teks text-[.68rem] font-bold uppercase leading-none tracking-[.14em] text-emas-teks transition-colors hover:border-emas hover:bg-emas/10">
                      <Ikon nama="panah-kanan" className="h-3.5 w-3.5 rotate-180" />Kembali ke hari ini
                    </button>
                  )}
                </div>
                <h3 className="mt-2 font-judul text-[clamp(1.55rem,2.6vw,2rem)] font-semibold leading-tight lining-nums">{formatPanjang(pilih)}</h3>
                {terpilih.hariBesar.length > 0 && (
                  <ul className="mt-3 grid gap-2">
                    {terpilih.hariBesar.map((h) => (
                      <li key={h.nama} className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className={`rounded-full px-2.5 py-1 font-teks text-[.64rem] font-bold uppercase leading-none tracking-[.14em] ${WARNA[h.jenis].label}`}>{namaJenis(h.jenis)}</span>
                        <span className="text-[.95rem] font-semibold">{h.nama}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="label mb-3 mt-6">Agenda</p>
                {daftarAgenda.length ? (
                  <ul className="grid gap-2.5">
                    {daftarAgenda.map((a) => (
                      <li key={a.kunci} className={`grid gap-x-4 gap-y-1.5 rounded-2xl border p-4 sm:grid-cols-[auto_1fr] ${a.rutin ? 'border-garis/80 bg-gading/60' : 'border-garis bg-white/80'}`}>
                        <span className={`self-start justify-self-start whitespace-nowrap rounded-full px-3 py-1.5 font-teks text-[.76rem] font-bold leading-none lining-nums sm:row-span-4 ${a.rutin ? 'bg-pasir text-batu-tua' : 'bg-hitam text-emas-muda'}`}>
                          {a.jam || 'Sepanjang hari'}
                        </span>
                        <p className="font-semibold leading-snug text-hitam">{a.judul}</p>
                        <p className="text-[.85rem] text-batu-tua">{a.keterangan}</p>
                        {a.lokasi && (
                          <p className="flex items-start gap-1.5 text-[.85rem] text-batu-tua">
                            <Ikon nama="lokasi" className="mt-px h-4 w-4 text-emas-tua" />{a.lokasi}
                          </p>
                        )}
                        {a.ket && <p className="text-[.88rem] leading-relaxed text-arang/85">{a.ket}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-dashed border-garis px-4 py-5 text-[.92rem] text-batu-tua">
                    <p>Tidak ada ibadah atau agenda pada tanggal ini.</p>
                    {berikut && (
                      <button type="button" onClick={() => setPilih(berikut.tanggal)} className="tautan mt-3 text-left">
                        Berikutnya: {labelKotak(berikut.tanggal).angka} {BULAN_SINGKAT[Number(berikut.tanggal.slice(5, 7)) - 1]} · {berikut.judul}
                        <Ikon nama="panah-kanan" className="h-[1.1em] w-[1.1em]" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal gaya="kanan" tunda={180}>
              <div className="kartu p-[clamp(1.25rem,2.4vw,1.75rem)]">
                <p className="label mb-3">Sepanjang {BULAN[bl]} {th}</p>
                {ringkas.butir.length ? (
                  <ul className="-mx-2 grid">
                    {ringkas.butir.map((b) => {
                      const [mulai, selesai] = [keTeks(b.m), keTeks(b.s)];
                      const k = labelKotak(mulai, selesai);
                      const aktif = pilih >= mulai && pilih <= selesai;
                      const agenda = b.jenis === 'agenda' || b.jenis === 'bulanan';
                      return (
                        <li key={`${b.jenis}-${b.judul}-${b.tanggal}`}>
                          <button
                            type="button"
                            onClick={() => setPilih(b.tanggal)}
                            aria-current={aktif ? 'true' : undefined}
                            className={`flex w-full items-center gap-4 rounded-xl px-2 py-2.5 text-left transition-colors duration-200 ${aktif ? 'bg-pasir/80' : 'hover:bg-pasir/50'}`}
                          >
                            <span className={`grid w-[76px] shrink-0 justify-items-center gap-1 rounded-xl px-1 py-2 ${agenda ? 'bg-hitam text-gading' : WARNA[b.jenis].label}`}>
                              <span className="font-judul text-[1.3rem] font-semibold leading-none lining-nums">{k.angka}</span>
                              <span className={`font-teks text-[.6rem] font-bold uppercase leading-none tracking-[.16em] ${agenda ? 'text-emas-muda' : ''}`}>{k.bulan}</span>
                            </span>
                            <span className="grid min-w-0 gap-1">
                              <span className="font-semibold leading-snug text-hitam">{b.judul}</span>
                              <span className={`font-teks text-[.64rem] font-bold uppercase tracking-[.14em] ${agenda ? 'text-batu' : WARNA[b.jenis].teks}`}>
                                {b.jenis === 'agenda' ? (b.jam ? `Agenda · ${b.jam}` : 'Agenda') : b.jenis === 'bulanan' ? `Agenda bulanan${b.jam ? ` · ${b.jam}` : ''}` : namaJenis(b.jenis)}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[.92rem] text-batu-tua">Belum ada agenda khusus di bulan ini.</p>
                )}
              </div>
            </Reveal>

            {kalender.catatan && <p className="px-1 text-[.82rem] leading-relaxed text-batu">{kalender.catatan}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
