// Akun sendiri: nama dan kata sandi
import { useState } from 'react';
import { namaPeran } from '../cms/skema.js';
import { api } from './api.js';
import { Bidang, Kartu, KepalaHalaman, Lencana, Pesan, Tombol, kelasInput, useCms } from './ui.jsx';

export default function Akun() {
  const { pengguna, setPengguna, beriTahu } = useCms();
  const [nama, setNama] = useState(pengguna.nama);
  const [sandi, setSandi] = useState({ lama: '', baru: '', ulang: '' });
  const [galat, setGalat] = useState('');
  const [memuat, setMemuat] = useState('');

  async function simpanNama(e) {
    e.preventDefault();
    setMemuat('nama');
    try {
      const r = await api('/akun', { metode: 'PUT', data: { nama } });
      setPengguna(r.pengguna);
      beriTahu('Nama diperbarui.');
    } catch (err) { beriTahu(err.message, 'galat'); }
    setMemuat('');
  }

  async function gantiSandi(e) {
    e.preventDefault();
    setGalat('');
    if (sandi.baru !== sandi.ulang) { setGalat('Ulangi kata sandi baru belum sama.'); return; }
    setMemuat('sandi');
    try {
      const r = await api('/akun', { metode: 'PUT', data: { sandiLama: sandi.lama, sandiBaru: sandi.baru } });
      setPengguna(r.pengguna);
      setSandi({ lama: '', baru: '', ulang: '' });
      beriTahu('Kata sandi diganti. Perangkat lain yang masih masuk akan keluar otomatis.');
    } catch (err) { setGalat(err.message); }
    setMemuat('');
  }

  return (
    <>
      <KepalaHalaman remah="Akun" judul="Akun Saya" ket={pengguna.email} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Kartu judul="Profil">
          <form onSubmit={simpanNama} className="grid grid-cols-1 gap-4">
            <Bidang label="Nama lengkap">{(id) => <input id={id} className={kelasInput} value={nama} onChange={(e) => setNama(e.target.value)} />}</Bidang>
            <div className="grid grid-cols-1 gap-1.5">
              <span className="text-[.85rem] font-semibold text-arang">Peran</span>
              <div className="flex flex-wrap gap-1.5">{pengguna.peran.map((p) => <Lencana key={p} nada="emas">{namaPeran(p)}</Lencana>)}</div>
              <p className="text-[.8rem] text-batu">Peran diatur oleh ketua atau developer.</p>
            </div>
            <Tombol type="submit" varian="utama" memuat={memuat === 'nama'} className="justify-self-start">Simpan nama</Tombol>
          </form>
        </Kartu>
        <Kartu judul="Ganti kata sandi">
          <form onSubmit={gantiSandi} className="grid grid-cols-1 gap-4">
            {galat && <Pesan nada="galat">{galat}</Pesan>}
            <Bidang label="Kata sandi sekarang">{(id) => <input id={id} type="password" className={kelasInput} value={sandi.lama} onChange={(e) => setSandi({ ...sandi, lama: e.target.value })} autoComplete="current-password" required />}</Bidang>
            <Bidang label="Kata sandi baru" bantuan="Minimal 8 karakter.">{(id) => <input id={id} type="password" className={kelasInput} value={sandi.baru} onChange={(e) => setSandi({ ...sandi, baru: e.target.value })} autoComplete="new-password" required />}</Bidang>
            <Bidang label="Ulangi kata sandi baru">{(id) => <input id={id} type="password" className={kelasInput} value={sandi.ulang} onChange={(e) => setSandi({ ...sandi, ulang: e.target.value })} autoComplete="new-password" required />}</Bidang>
            <Tombol type="submit" varian="utama" memuat={memuat === 'sandi'} className="justify-self-start">Ganti kata sandi</Tombol>
          </form>
        </Kartu>
      </div>
    </>
  );
}
