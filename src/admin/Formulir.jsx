// Formulir otomatis dari skema bidang (src/cms/skema.js)
import { useEffect, useRef, useState } from 'react';
import Ikon from '../components/Ikon.jsx';
import { IKON } from '../components/ikon-paths.js';
import { idYouTube } from '../cms/youtube.js';
import { keHtml, keMarkup } from '../cms/judul.js';
import { api } from './api.js';
import { siapkanGambar } from './alat.js';
import PilihMedia from './PilihMedia.jsx';
import { Bidang, Tombol, kelasInput, useCms } from './ui.jsx';
import { aset } from '../aset.js';
import { formatSingkat, tanggalSah, urai } from '../kalender.js';

const TAUTAN_INTERNAL = ['/', '/siapa-kami', '/#sambutan', '/#langkah', '/#jadwal', '/#kalender', '/#khotbah', '/#jemaat', '/#persembahan', '/#kunjungi'];
const tautanSah = (s) => !s || /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#|wa\.me|www\.)/i.test(s.trim());

export const nilaiKosong = (f) => (f.jenis === 'objek' ? objekKosong(f.bidang) : f.jenis === 'daftar' || f.jenis === 'daftar-teks' ? [] : '');
export const objekKosong = (bidang) => Object.fromEntries(bidang.map((f) => [f.kunci, nilaiKosong(f)]));

export default function Formulir({ bidang, nilai, ubah }) {
  const v = nilai ?? {};
  return (
    <div className="grid grid-cols-1 gap-5">
      {bidang.map((f) => (
        <BidangIsi key={f.kunci} f={f} nilai={v[f.kunci]} ubah={(baru) => ubah({ ...v, [f.kunci]: baru })} />
      ))}
    </div>
  );
}

export function BidangIsi({ f, nilai, ubah }) {
  switch (f.jenis) {
    case 'teks': return <BidangTeks f={f} nilai={nilai} ubah={ubah} />;
    case 'paragraf': return <BidangParagraf f={f} nilai={nilai} ubah={ubah} />;
    case 'judul': return <BidangJudul f={f} nilai={nilai} ubah={ubah} />;
    case 'tautan': return <BidangTautan f={f} nilai={nilai} ubah={ubah} />;
    case 'gambar': return <BidangGambar f={f} nilai={nilai} ubah={ubah} />;
    case 'video': return <BidangVideo f={f} nilai={nilai} ubah={ubah} />;
    case 'ikon': return <BidangIkon f={f} nilai={nilai} ubah={ubah} />;
    case 'tanggal': return <BidangTanggal f={f} nilai={nilai} ubah={ubah} />;
    case 'pilihan': return <BidangPilihan f={f} nilai={nilai} ubah={ubah} />;
    case 'objek': return <BidangObjek f={f} nilai={nilai} ubah={ubah} />;
    case 'daftar': return <BidangDaftar f={f} nilai={nilai} ubah={ubah} />;
    case 'daftar-teks': return <BidangDaftarTeks f={f} nilai={nilai} ubah={ubah} />;
    default: return null;
  }
}

function BidangTeks({ f, nilai, ubah }) {
  return (
    <Bidang label={f.label} bantuan={f.bantuan}>
      {(id) => <input id={id} className={kelasInput} value={nilai ?? ''} maxLength={200} onChange={(e) => ubah(e.target.value)} />}
    </Bidang>
  );
}

function BidangTanggal({ f, nilai, ubah }) {
  return (
    <Bidang label={f.label} bantuan={f.bantuan}>
      {(id) => <input id={id} type="date" className={kelasInput} value={nilai ?? ''} min="2000-01-01" max="2100-12-31" onChange={(e) => ubah(e.target.value)} />}
    </Bidang>
  );
}

function BidangPilihan({ f, nilai, ubah }) {
  return (
    <Bidang label={f.label} bantuan={f.bantuan}>
      {(id) => (
        <select id={id} className={kelasInput} value={nilai ?? ''} onChange={(e) => ubah(e.target.value)}>
          <option value="">— Pilih —</option>
          {f.pilihan.map((o) => <option key={o.nilai} value={o.nilai}>{o.label}</option>)}
        </select>
      )}
    </Bidang>
  );
}

function BidangParagraf({ f, nilai, ubah }) {
  const baris = Math.min(10, Math.max(3, Math.ceil(String(nilai ?? '').length / 70)));
  return (
    <Bidang label={f.label} bantuan={f.bantuan}>
      {(id) => <textarea id={id} className={`${kelasInput} resize-y`} rows={baris} value={nilai ?? ''} maxLength={2000} onChange={(e) => ubah(e.target.value)} />}
    </Bidang>
  );
}

function BidangJudul({ f, nilai, ubah }) {
  const markup = keMarkup(nilai ?? '');
  return (
    <Bidang label={f.label} bantuan="Apit kata dengan *bintang* agar berwarna emas. Tekan Enter untuk pindah baris.">
      {(id) => (
        <div className="grid grid-cols-1 gap-2">
          <textarea id={id} className={`${kelasInput} resize-y font-medium`} rows={Math.min(4, markup.split('\n').length + 1)} value={markup} maxLength={300} onChange={(e) => ubah(keHtml(e.target.value))} />
          {markup.trim() && (
            <div className="rounded-xl bg-pasir/50 px-4 py-3" aria-label="Pratinjau judul">
              <span className="mb-1 block text-[.68rem] font-semibold uppercase tracking-[.2em] text-batu">Pratinjau</span>
              {/* keHtml meng-escape semua teks; hanya <em> dan <br/> yang tersisa */}
              <span className="block font-judul text-[1.6rem] font-semibold leading-[1.15] [&_em]:font-medium [&_em]:italic [&_em]:text-emas-tua" dangerouslySetInnerHTML={{ __html: keHtml(markup) }} />
            </div>
          )}
        </div>
      )}
    </Bidang>
  );
}

function BidangTautan({ f, nilai, ubah }) {
  const sah = tautanSah(nilai ?? '');
  return (
    <Bidang
      label={f.label}
      bantuan={f.bantuan ?? 'Link luar diawali https://. Bagian website: /#jadwal, /siapa-kami. WhatsApp: https://wa.me/628…'}
      galat={sah ? null : 'Format tautan tidak dikenali dan akan dikosongkan saat disimpan.'}
    >
      {(id) => (
        <>
          <input id={id} className={kelasInput} value={nilai ?? ''} list="tautan-internal" placeholder="https://… atau /#jadwal" onChange={(e) => ubah(e.target.value)} />
          <datalist id="tautan-internal">{TAUTAN_INTERNAL.map((t) => <option key={t} value={t} />)}</datalist>
        </>
      )}
    </Bidang>
  );
}

function BidangVideo({ f, nilai, ubah }) {
  const id = idYouTube(nilai ?? '');
  return (
    <Bidang label={f.label} bantuan={f.bantuan} galat={nilai && !id ? 'Link YouTube tidak dikenali.' : null}>
      {(idInput) => (
        <div className="grid grid-cols-1 gap-3">
          <input id={idInput} className={kelasInput} value={nilai ?? ''} placeholder="https://youtu.be/…" onChange={(e) => ubah(e.target.value)} />
          {id && (
            <div className="flex items-center gap-3 rounded-xl bg-pasir/50 p-2.5 pr-4">
              <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" className="h-14 w-24 rounded-lg bg-hitam object-cover" />
              <p className="text-[.85rem] text-batu-tua">Video terdeteksi <span className="font-mono text-[.8rem] text-hitam">{id}</span>.{' '}
                <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener" className="font-semibold text-emas-teks underline">Buka di YouTube</a></p>
            </div>
          )}
        </div>
      )}
    </Bidang>
  );
}

const RASIO = { '1.91:1': 'aspect-[1200/630]', '16:9': 'aspect-video', '4:3': 'aspect-[4/3]', '2:3': 'aspect-[2/3]', '4:5': 'aspect-[4/5]', '1:1': 'aspect-square' };

function BidangGambar({ f, nilai, ubah }) {
  const { beriTahu } = useCms();
  const [pilih, setPilih] = useState(false);
  const [unggah, setUnggah] = useState(false);
  const berkas = useRef(null);

  async function unggahBerkas(file) {
    if (!file) return;
    setUnggah(true);
    try {
      const { data, lebar, tinggi } = await siapkanGambar(file);
      const item = await api('/media', { metode: 'POST', data: { nama: file.name, data, lebar, tinggi } });
      ubah(item.berkas);
      beriTahu('Foto diunggah. Jangan lupa klik Simpan.');
    } catch (e) {
      beriTahu(e.message, 'galat');
    } finally {
      setUnggah(false);
      if (berkas.current) berkas.current.value = '';
    }
  }

  return (
    <Bidang label={f.label} bantuan={f.bantuan ?? (f.rasio ? `Rasio ${f.rasio}.` : null)}>
      {(id) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:items-start">
          <div className={`${RASIO[f.rasio] ?? 'aspect-video'} max-h-[260px] overflow-hidden rounded-xl border border-garis bg-pasir/60`}>
            {nilai ? <img src={aset(nilai)} alt="" className="h-full w-full object-cover" /> : (
              <div className="grid grid-cols-1 h-full place-items-center text-[.8rem] text-batu"><Ikon nama="galeri" className="h-7 w-7 text-batu/70" /></div>
            )}
          </div>
          <div className="grid grid-cols-1 content-start gap-2.5">
            <div className="flex flex-wrap gap-2">
              <Tombol varian="utama" kecil ikon="unduh" memuat={unggah} onClick={() => berkas.current?.click()}>{unggah ? 'Mengunggah…' : 'Unggah foto'}</Tombol>
              <Tombol varian="garis" kecil ikon="galeri" onClick={() => setPilih(true)}>Pustaka media</Tombol>
              {nilai && <Tombol varian="hantu" kecil onClick={() => ubah('')}>Kosongkan</Tombol>}
            </div>
            <input ref={berkas} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => unggahBerkas(e.target.files?.[0])} />
            <input id={id} className={`${kelasInput} font-mono text-[.8rem]`} value={nilai ?? ''} placeholder="/media/… atau https://…" onChange={(e) => ubah(e.target.value)} aria-label={`Alamat ${f.label}`} />
          </div>
          {pilih && <PilihMedia onPilih={(alamat) => { ubah(alamat); setPilih(false); }} onTutup={() => setPilih(false)} />}
        </div>
      )}
    </Bidang>
  );
}

function BidangIkon({ f, nilai, ubah }) {
  return (
    <div className="grid grid-cols-1 gap-1.5">
      <span className="text-[.85rem] font-semibold text-arang" id={`ikon-${f.kunci}`}>{f.label}</span>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby={`ikon-${f.kunci}`}>
        {Object.keys(IKON).filter((n) => !['menu', 'tutup', 'panah-kanan', 'panah-bawah', 'cari'].includes(n)).map((n) => (
          <button
            key={n} type="button" role="radio" aria-checked={nilai === n} title={n} aria-label={n} onClick={() => ubah(n)}
            className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors ${nilai === n ? 'border-emas bg-emas/15 text-emas-teks' : 'border-garis bg-white text-batu-tua hover:border-emas/60'}`}
          >
            <Ikon nama={n} className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function BidangObjek({ f, nilai, ubah }) {
  return (
    <fieldset className="grid grid-cols-1 gap-4 rounded-xl border border-garis bg-white/60 p-4">
      <legend className="px-1.5 text-[.85rem] font-semibold text-arang">{f.label}</legend>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {f.bidang.map((b) => (
          <div key={b.kunci} className={['ikon', 'gambar', 'paragraf', 'daftar', 'daftar-teks', 'judul'].includes(b.jenis) ? 'md:col-span-2' : ''}>
            <BidangIsi f={b} nilai={(nilai ?? {})[b.kunci]} ubah={(baru) => ubah({ ...(nilai ?? {}), [b.kunci]: baru })} />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function BidangDaftar({ f, nilai, ubah }) {
  const daftar = Array.isArray(nilai) ? nilai : [];
  // butir yang baru ditambahkan langsung terbuka & bidang pertamanya difokuskan (daftar panjang tertutup semua)
  const [baru, setBaru] = useState(-1);
  const wadahRef = useRef(null);
  useEffect(() => {
    if (baru < 0) return;
    const el = wadahRef.current?.querySelector(`[data-butir="${baru}"]`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el?.querySelector('input, textarea, select')?.focus({ preventScroll: true });
  }, [baru]);
  const ganti = (i, baru) => ubah(daftar.map((x, j) => (j === i ? baru : x)));
  const geser = (i, arah) => {
    const j = i + arah;
    if (j < 0 || j >= daftar.length) return;
    const salin = [...daftar];
    [salin[i], salin[j]] = [salin[j], salin[i]];
    ubah(salin);
  };
  // butir bertanggal (agenda, hari libur) diringkas dengan tanggalnya, mis. "19 Okt 2026 · Seminar Keluarga"
  const bidangTanggal = f.butir.find((b) => b.jenis === 'tanggal');
  const ringkas = (butir) => {
    const teks = f.butir.filter((b) => b.jenis !== 'tanggal' && b.jenis !== 'pilihan')
      .map((b) => butir?.[b.kunci]).find((x) => typeof x === 'string' && x.trim());
    const isi = teks ? keMarkup(teks).replace(/\*/g, '').replace(/\n/g, ' ') : '(belum diisi)';
    const tgl = bidangTanggal && butir?.[bidangTanggal.kunci];
    return tanggalSah(tgl) ? `${formatSingkat(tgl)} · ${isi}` : isi;
  };
  const urutkan = () => ubah([...daftar].sort((a, b) => (urai(a?.[bidangTanggal.kunci]) ?? Infinity) - (urai(b?.[bidangTanggal.kunci]) ?? Infinity)));

  return (
    <div ref={wadahRef} className="grid grid-cols-1 gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[.85rem] font-semibold text-arang">{f.label}</span>
        <span className="text-[.78rem] text-batu">{daftar.length} / {f.maks}</span>
      </div>
      {daftar.map((butir, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <details key={i} data-butir={i} open={daftar.length <= 4 || i === baru || undefined} className="group min-w-0 rounded-xl border border-garis bg-white/70 open:bg-white">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="grid grid-cols-1 h-7 w-7 shrink-0 place-items-center rounded-full bg-pasir text-[.75rem] font-bold text-batu-tua">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate text-[.92rem] font-medium">{f.labelButir}: {ringkas(butir)}</span>
            <span className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
              <button type="button" className="grid grid-cols-1 h-8 w-8 place-items-center rounded-full text-batu-tua hover:bg-pasir disabled:opacity-30" disabled={i === 0} onClick={() => geser(i, -1)} aria-label={`Naikkan ${f.labelButir} ${i + 1}`}>
                <Ikon nama="panah-bawah" className="h-4 w-4 rotate-180" />
              </button>
              <button type="button" className="grid grid-cols-1 h-8 w-8 place-items-center rounded-full text-batu-tua hover:bg-pasir disabled:opacity-30" disabled={i === daftar.length - 1} onClick={() => geser(i, 1)} aria-label={`Turunkan ${f.labelButir} ${i + 1}`}>
                <Ikon nama="panah-bawah" className="h-4 w-4" />
              </button>
              <button
                type="button" className="grid grid-cols-1 h-8 w-8 place-items-center rounded-full text-anggur hover:bg-anggur/10" aria-label={`Hapus ${f.labelButir} ${i + 1}`}
                onClick={() => { if (window.confirm(`Hapus ${f.labelButir.toLowerCase()} "${ringkas(butir)}"?`)) ubah(daftar.filter((_, j) => j !== i)); }}
              >
                <Ikon nama="tutup" className="h-4 w-4" />
              </button>
            </span>
            <Ikon nama="panah-bawah" className="h-4 w-4 shrink-0 text-batu transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-garis px-4 pb-4 pt-4">
            <Formulir bidang={f.butir} nilai={butir} ubah={(baru) => ganti(i, baru)} />
          </div>
        </details>
      ))}
      <div className="flex flex-wrap gap-2">
        {daftar.length < f.maks && (
          <Tombol varian="garis" kecil onClick={() => { ubah([...daftar, objekKosong(f.butir)]); setBaru(daftar.length); }}>
            <span aria-hidden="true" className="text-[1.1em] leading-none">+</span> Tambah {f.labelButir.toLowerCase()}
          </Tombol>
        )}
        {bidangTanggal && daftar.length > 1 && (
          <Tombol varian="garis" kecil onClick={urutkan}>Urutkan menurut tanggal</Tombol>
        )}
      </div>
    </div>
  );
}

function BidangDaftarTeks({ f, nilai, ubah }) {
  const daftar = Array.isArray(nilai) ? nilai : [];
  return (
    <div className="grid grid-cols-1 gap-2.5">
      <span className="text-[.85rem] font-semibold text-arang">{f.label}</span>
      {daftar.map((t, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-start gap-2">
          <textarea
            className={`${kelasInput} resize-y`} rows={Math.min(6, Math.max(1, Math.ceil(t.length / 80)))} value={t}
            aria-label={`${f.labelButir} ${i + 1}`} onChange={(e) => ubah(daftar.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button type="button" className="mt-1.5 grid grid-cols-1 h-9 w-9 shrink-0 place-items-center rounded-full text-anggur hover:bg-anggur/10" aria-label={`Hapus ${f.labelButir} ${i + 1}`} onClick={() => ubah(daftar.filter((_, j) => j !== i))}>
            <Ikon nama="tutup" className="h-4 w-4" />
          </button>
        </div>
      ))}
      {daftar.length < f.maks && (
        <Tombol varian="garis" kecil className="justify-self-start" onClick={() => ubah([...daftar, ''])}><span aria-hidden="true" className="text-[1.1em] leading-none">+</span> Tambah {f.labelButir.toLowerCase()}</Tombol>
      )}
    </div>
  );
}
