// Penyunting satu kategori isi: formulir per bagian + bilah simpan
import { useEffect, useMemo, useState } from 'react';
import Ikon from '../components/Ikon.jsx';
import { ambil } from '../cms/gabung.js';
import { KELOMPOK, namaPeran } from '../cms/skema.js';
import { api } from './api.js';
import { waktuRelatif } from './alat.js';
import Formulir, { BidangIsi } from './Formulir.jsx';
import { Kartu, KepalaHalaman, Lencana, Pesan, Tombol, useCms } from './ui.jsx';

export default function Editor({ kat }) {
  const { isi, meta, setData, beriTahu, muatIsi } = useCms();
  const awal = useMemo(() => Object.fromEntries(kat.bagian.map((b) => [b.kunci, ambil(isi, b.kunci)])), [isi, kat]);
  const [draf, setDraf] = useState(awal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [bentrok, setBentrok] = useState('');
  useEffect(() => setDraf(awal), [awal]);

  const berubah = JSON.stringify(draf) !== JSON.stringify(awal);
  const m = meta[kat.id];

  // peringatan bila meninggalkan halaman dengan perubahan yang belum disimpan
  useEffect(() => {
    if (!berubah) return undefined;
    const sebelumTutup = (e) => { e.preventDefault(); e.returnValue = ''; };
    const klik = (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || e.defaultPrevented) return;
      if (!window.confirm('Ada perubahan yang belum disimpan. Tinggalkan halaman ini?')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', sebelumTutup);
    document.addEventListener('click', klik, true);
    return () => {
      window.removeEventListener('beforeunload', sebelumTutup);
      document.removeEventListener('click', klik, true);
    };
  }, [berubah]);

  async function simpan() {
    setMenyimpan(true);
    setBentrok('');
    try {
      const hasil = await api(`/isi/${kat.id}`, { metode: 'PUT', data: { nilai: draf, dasar: m?.diubah ?? null } });
      setData(hasil);
      beriTahu('Tersimpan. Perubahan sudah tampil di website.');
    } catch (e) {
      if (e.status === 409) setBentrok(e.message);
      else beriTahu(e.message, 'galat');
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <>
      <KepalaHalaman
        remah={KELOMPOK.find((k) => k.id === kat.kelompok)?.nama}
        judul={kat.judul}
        ket={kat.ket}
        aksi={(
          <a href={kat.situs} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[.85rem] font-semibold text-hitam no-underline shadow-[inset_0_0_0_1px_#E3D9C4] hover:bg-pasir/60">
            Lihat di website <Ikon nama="tautan-luar" className="h-4 w-4" />
          </a>
        )}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-[.82rem] text-batu-tua">
        <span>Dikelola oleh:</span>
        {(kat.khusus === 'developer' ? ['developer'] : ['ketua', ...kat.peran]).map((p) => <Lencana key={p}>{namaPeran(p)}</Lencana>)}
        <span className="ml-auto">{m ? `Terakhir diubah ${waktuRelatif(m.diubah)} oleh ${m.oleh}` : 'Belum pernah diubah: masih isi bawaan'}</span>
      </div>

      {bentrok && (
        <div className="mb-6">
          <Pesan nada="peringatan">
            {bentrok}{' '}
            <button type="button" className="font-semibold underline" onClick={async () => { await muatIsi(); setBentrok(''); }}>Muat versi terbaru</button>
          </Pesan>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {kat.bagian.map((b) => (
          <Kartu key={b.kunci} judul={kat.bagian.length > 1 ? b.judul : null}>
            {b.jenis === 'daftar'
              ? <BidangIsi f={{ ...b, label: b.judul }} nilai={draf[b.kunci]} ubah={(v) => setDraf((d) => ({ ...d, [b.kunci]: v }))} />
              : <Formulir bidang={b.bidang} nilai={draf[b.kunci]} ubah={(v) => setDraf((d) => ({ ...d, [b.kunci]: v }))} />}
          </Kartu>
        ))}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 z-20 border-t border-garis bg-krem/95 backdrop-blur transition-transform lg:left-[280px] ${berubah ? 'translate-y-0' : 'translate-y-full'}`} aria-hidden={!berubah}>
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-3.5 md:px-10">
          <p className="flex items-center gap-2 text-[.9rem] font-medium text-emas-teks">
            <span className="h-2 w-2 rounded-full bg-emas" aria-hidden="true" /> Ada perubahan yang belum disimpan
          </p>
          <div className="flex gap-2">
            <Tombol varian="hantu" onClick={() => setDraf(awal)} disabled={menyimpan} tabIndex={berubah ? 0 : -1}>Batalkan</Tombol>
            <Tombol varian="emas" onClick={simpan} memuat={menyimpan} tabIndex={berubah ? 0 : -1}>Simpan perubahan</Tombol>
          </div>
        </div>
      </div>
    </>
  );
}
