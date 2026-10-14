// Sistem & cadangan (khusus developer)
import { useEffect, useRef, useState } from 'react';
import { api, unduh } from './api.js';
import { ukuranBerkas } from './alat.js';
import { Kartu, KepalaHalaman, Lencana, Memuat, Pesan, Tombol, useCms } from './ui.jsx';

export default function Sistem() {
  const { setData, beriTahu } = useCms();
  const [info, setInfo] = useState(null);
  const [memulihkan, setMemulihkan] = useState(false);
  const berkas = useRef(null);

  useEffect(() => { api('/sistem').then(setInfo).catch((e) => beriTahu(e.message, 'galat')); }, [beriTahu]);

  async function pulihkan(file) {
    if (!file) return;
    try {
      const cadangan = JSON.parse(await file.text());
      if (!window.confirm('Pulihkan semua isi website dari berkas cadangan ini? Keadaan sekarang tetap disimpan sebagai versi di menu Riwayat.')) return;
      setMemulihkan(true);
      const hasil = await api('/cadangan', { metode: 'POST', data: cadangan });
      setData(hasil);
      beriTahu('Isi website dipulihkan dari cadangan.');
    } catch (e) {
      beriTahu(e instanceof SyntaxError ? 'Berkas bukan JSON yang valid.' : e.message, 'galat');
    } finally {
      setMemulihkan(false);
      if (berkas.current) berkas.current.value = '';
    }
  }

  if (!info) return <Memuat />;
  const env = (nama, ket) => (
    <li className="flex flex-wrap items-center justify-between gap-2 py-2.5">
      <span><code className="rounded bg-pasir px-1.5 py-0.5 text-[.8rem]">{nama}</code> <span className="text-[.85rem] text-batu-tua">{ket}</span></span>
      {info.env[nama] ? <Lencana nada="hijau">diatur</Lencana> : <Lencana nada="netral">belum diatur</Lencana>}
    </li>
  );

  return (
    <>
      <KepalaHalaman remah="Pengembang" judul="Sistem & Cadangan" ket="Lokasi data, variabel lingkungan, dan cadangan isi website." />
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[['Pengguna', info.pengguna], ['Gambar', info.media], ['Versi tersimpan', info.versi], ['Ukuran data', ukuranBerkas(info.ukuranData)]].map(([l, n]) => (
            <div key={l} className="rounded-2xl border border-garis bg-krem px-5 py-4">
              <p className="font-judul text-[2rem] font-semibold leading-none">{n}</p>
              <p className="mt-1.5 text-[.85rem] text-batu-tua">{l}</p>
            </div>
          ))}
        </div>

        <Kartu judul="Lokasi data" ket="Isi, pengguna, log, versi, dan foto unggahan disimpan sebagai berkas di folder ini.">
          <p className="break-all rounded-xl bg-hitam px-4 py-3 font-mono text-[.85rem] text-emas-muda">{info.dataDir}</p>
          <div className="mt-4">
            <Pesan nada={info.env.DATA_DIR ? 'info' : 'peringatan'}>
              {info.env.DATA_DIR
                ? 'DATA_DIR diatur lewat variabel lingkungan.'
                : 'DATA_DIR belum diatur, jadi data memakai folder bawaan di direktori home server. Pastikan folder ini tidak ikut terhapus saat deploy ulang; bila ragu, atur DATA_DIR ke folder di luar folder aplikasi dan unduh cadangan secara berkala.'}
            </Pesan>
          </div>
          <ul className="mt-4 divide-y divide-garis">
            {env('DATA_DIR', 'folder penyimpanan data CMS')}
            {env('SESSION_SECRET', 'kunci sesi masuk (bila kosong dibuat otomatis di folder data)')}
            {env('CMS_KODE_SETUP', 'kode untuk membuat akun pertama')}
          </ul>
          <p className="mt-3 text-[.8rem] text-batu">Node.js {info.node}</p>
        </Kartu>

        <Kartu judul="Cadangan isi website" ket="Unduh cadangan secara berkala, terutama sebelum mengubah banyak hal. Cadangan berisi teks dan daftar media; berkas foto ada di folder media.">
          <div className="flex flex-wrap gap-3">
            <Tombol varian="utama" ikon="unduh" onClick={() => unduh('/cadangan', `cadangan-alfaomega-${new Date().toISOString().slice(0, 10)}.json`).catch((e) => beriTahu(e.message, 'galat'))}>Unduh cadangan</Tombol>
            <Tombol varian="garis" memuat={memulihkan} onClick={() => berkas.current?.click()}>Pulihkan dari berkas…</Tombol>
            <input ref={berkas} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => pulihkan(e.target.files?.[0])} />
          </div>
        </Kartu>
      </div>
    </>
  );
}
