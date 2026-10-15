// Riwayat aktivitas + versi isi yang bisa dipulihkan (ketua & developer)
import { useEffect, useState } from 'react';
import { aksesPenuh, kategoriById } from '../cms/skema.js';
import { api } from './api.js';
import { waktuLengkap, waktuRelatif } from './alat.js';
import { Kartu, KepalaHalaman, Kosong, Memuat, Tombol, useCms } from './ui.jsx';

export const LABEL_AKSI = {
  setup: 'membuat akun pertama',
  masuk: 'masuk',
  'ubah-isi': 'mengubah',
  'tambah-pengguna': 'menambah pengguna',
  'ubah-pengguna': 'mengubah pengguna',
  'hapus-pengguna': 'menghapus pengguna',
  'ubah-akun': 'memperbarui akunnya',
  'unggah-media': 'mengunggah',
  'hapus-media': 'menghapus media',
  'pulihkan-versi': 'memulihkan versi isi',
  'pulihkan-cadangan': 'memulihkan cadangan',
  'minta-otp': 'meminta kode OTP lupa kata sandi',
  'reset-sandi': 'mengatur ulang kata sandi lewat OTP',
  'ubah-env': 'mengubah pengaturan lingkungan',
  'email-uji': 'mengirim email uji ke',
};

export default function Riwayat() {
  const { pengguna, setData, beriTahu } = useCms();
  const [data, setDataRiwayat] = useState(null);
  const [tab, setTab] = useState('aktivitas');
  const penuh = aksesPenuh(pengguna);

  const muat = () => api('/riwayat').then(setDataRiwayat).catch((e) => beriTahu(e.message, 'galat'));
  useEffect(() => { muat(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function pulihkan(v) {
    if (!window.confirm(`Pulihkan isi website ke keadaan ${waktuLengkap(v.waktu)}?\n\nKeadaan sekarang tetap disimpan sebagai versi, jadi bisa dikembalikan lagi.`)) return;
    try {
      const hasil = await api(`/riwayat/${v.id}/pulihkan`, { metode: 'POST' });
      setData(hasil);
      beriTahu('Isi website dipulihkan.');
      muat();
    } catch (e) { beriTahu(e.message, 'galat'); }
  }

  const tabKelas = (aktif) => `rounded-full px-4 py-2 text-[.88rem] font-semibold ${aktif ? 'bg-hitam text-gading' : 'text-batu-tua hover:bg-pasir'}`;

  return (
    <>
      <KepalaHalaman remah="Administrasi" judul="Riwayat" ket="Siapa mengubah apa dan kapan. Setiap penyimpanan juga membuat versi cadangan otomatis (60 versi terakhir)." />
      {penuh && (
        <div className="mb-6 flex gap-2" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'aktivitas'} className={tabKelas(tab === 'aktivitas')} onClick={() => setTab('aktivitas')}>Aktivitas</button>
          <button type="button" role="tab" aria-selected={tab === 'versi'} className={tabKelas(tab === 'versi')} onClick={() => setTab('versi')}>Versi isi</button>
        </div>
      )}
      {!data ? <Memuat /> : tab === 'aktivitas' ? (
        data.log.length ? (
          <Kartu className="!p-0 overflow-hidden">
            <ul className="divide-y divide-garis">
              {data.log.map((e, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i} className="grid grid-cols-1 gap-1 px-5 py-3.5 md:grid-cols-[1fr_auto] md:px-6">
                  <p className="text-[.92rem]">
                    <b className="font-semibold">{e.oleh}</b> {LABEL_AKSI[e.aksi] ?? e.aksi}
                    {e.kategori ? <> <a href={`/admin/isi/${e.kategori}`} className="font-semibold text-emas-teks">{kategoriById(e.kategori)?.judul ?? e.kategori}</a></> : e.ket ? <> <span className="text-batu-tua">{e.ket}</span></> : null}
                  </p>
                  <p className="text-[.8rem] text-batu" title={waktuLengkap(e.waktu)}>{waktuRelatif(e.waktu)}</p>
                </li>
              ))}
            </ul>
          </Kartu>
        ) : <Kosong ikon="jam" judul="Belum ada aktivitas" />
      ) : (
        data.versi.length ? (
          <Kartu className="!p-0 overflow-hidden">
            <ul className="divide-y divide-garis">
              {data.versi.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 md:px-6">
                  <div>
                    <p className="text-[.92rem] font-medium">{v.ket}</p>
                    <p className="text-[.8rem] text-batu">{waktuLengkap(v.waktu)}</p>
                  </div>
                  <Tombol varian="garis" kecil onClick={() => pulihkan(v)}>Pulihkan versi ini</Tombol>
                </li>
              ))}
            </ul>
          </Kartu>
        ) : <Kosong ikon="jam" judul="Belum ada versi tersimpan" teks="Versi dibuat otomatis setiap kali isi disimpan." />
      )}
    </>
  );
}
