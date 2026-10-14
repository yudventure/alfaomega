// Halaman masuk dan setup akun developer pertama
import { useState } from 'react';
import Monogram from '../components/Monogram.jsx';
import { api } from './api.js';
import { Bidang, Pesan, Tombol, kelasInput } from './ui.jsx';

export default function Masuk({ perluSetup, berakhir, onMasuk }) {
  const [isian, setIsian] = useState({ nama: '', email: '', sandi: '', ulang: '', kode: '' });
  const [galat, setGalat] = useState(berakhir ? 'Sesi Anda berakhir. Silakan masuk kembali.' : '');
  const [memuat, setMemuat] = useState(false);
  const ubah = (k) => (e) => setIsian((s) => ({ ...s, [k]: e.target.value }));

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    if (perluSetup && isian.sandi !== isian.ulang) { setGalat('Ulangi kata sandi belum sama.'); return; }
    setMemuat(true);
    try {
      const res = perluSetup
        ? await api('/setup', { metode: 'POST', data: { nama: isian.nama, email: isian.email, sandi: isian.sandi, kode: isian.kode } })
        : await api('/masuk', { metode: 'POST', data: { email: isian.email, sandi: isian.sandi } });
      await onMasuk(res.pengguna);
    } catch (err) {
      setGalat(err.message);
      setMemuat(false);
    }
  }

  return (
    <div className="grid grid-cols-1 min-h-screen bg-gading lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-hitam p-12 text-gading lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(200,162,90,.3),transparent_55%)]" aria-hidden="true" />
        <Monogram garis strokeWidth={4} className="absolute -bottom-[12%] -right-[10%] w-[78%] text-emas/20" />
        <img src="/logo/logo-header-gelap.svg" alt="Gereja Alfa Omega" className="relative h-10 w-auto self-start" />
        <div className="relative grid grid-cols-1 max-w-[30rem] gap-4">
          <p className="label text-emas">Panel Pengelola Website</p>
          <p className="font-judul text-[3rem] font-semibold leading-[1.05]">Melayani lewat <em className="text-emas-muda">kabar baik</em> setiap minggu.</p>
          <p className="text-gading/75">Jadwal, khotbah, foto, dan profil gereja diperbarui oleh tiap bidang pelayanan sesuai perannya.</p>
        </div>
        <p className="relative text-[.8rem] text-batu">Yang Awal dan Yang Akhir · Wahyu 22:13</p>
      </aside>

      <main className="grid grid-cols-1 place-items-center px-5 py-12">
        <form onSubmit={kirim} className="grid grid-cols-1 w-full max-w-[420px] gap-5" noValidate>
          <img src="/logo/logo-header-terang.svg" alt="Gereja Alfa Omega" className="mb-2 h-10 w-auto justify-self-start lg:hidden" />
          <div className="grid grid-cols-1 gap-2">
            <h1 className="font-judul text-[2.4rem] font-semibold leading-tight">{perluSetup ? 'Setup awal CMS' : 'Masuk ke CMS'}</h1>
            <p className="text-batu-tua">
              {perluSetup
                ? 'Belum ada akun. Buat akun developer pertama; akun lain bisa ditambahkan setelahnya dari menu Pengguna & Peran.'
                : 'Gunakan email dan kata sandi yang diberikan oleh ketua atau developer.'}
            </p>
          </div>

          {galat && <Pesan nada="galat">{galat}</Pesan>}

          {perluSetup && (
            <Bidang label="Kode setup" bantuan="Lihat variabel CMS_KODE_SETUP di pengaturan hosting, atau berkas kode-setup.txt di folder data / log server.">
              {(id) => <input id={id} className={`${kelasInput} font-mono uppercase tracking-[.2em]`} value={isian.kode} onChange={ubah('kode')} autoComplete="off" required />}
            </Bidang>
          )}
          {perluSetup && (
            <Bidang label="Nama lengkap">
              {(id) => <input id={id} className={kelasInput} value={isian.nama} onChange={ubah('nama')} autoComplete="name" required />}
            </Bidang>
          )}
          <Bidang label="Email">
            {(id) => <input id={id} type="email" className={kelasInput} value={isian.email} onChange={ubah('email')} autoComplete="username" required />}
          </Bidang>
          <Bidang label="Kata sandi" bantuan={perluSetup ? 'Minimal 8 karakter.' : null}>
            {(id) => <input id={id} type="password" className={kelasInput} value={isian.sandi} onChange={ubah('sandi')} autoComplete={perluSetup ? 'new-password' : 'current-password'} required />}
          </Bidang>
          {perluSetup && (
            <Bidang label="Ulangi kata sandi">
              {(id) => <input id={id} type="password" className={kelasInput} value={isian.ulang} onChange={ubah('ulang')} autoComplete="new-password" required />}
            </Bidang>
          )}

          <Tombol type="submit" varian="utama" memuat={memuat} className="mt-1 w-full py-3">
            {perluSetup ? 'Buat akun & masuk' : 'Masuk'}
          </Tombol>
          <a href="/" className="justify-self-center text-[.85rem] text-batu-tua underline-offset-4 hover:underline">← Kembali ke website</a>
        </form>
      </main>
    </div>
  );
}
