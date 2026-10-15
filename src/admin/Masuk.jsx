// Halaman masuk, setup akun developer pertama, dan lupa kata sandi (kode OTP lewat email)
import { useEffect, useState } from 'react';
import Lambang from '../components/Lambang.jsx';
import { api } from './api.js';
import { Bidang, Pesan, Tombol, kelasInput } from './ui.jsx';
import { aset } from '../aset.js';

const JUDUL = {
  setup: ['Setup awal CMS', 'Belum ada akun. Buat akun developer pertama; akun lain bisa ditambahkan setelahnya dari menu Pengguna & Peran.'],
  masuk: ['Masuk ke CMS', 'Gunakan email dan kata sandi yang diberikan oleh ketua atau developer.'],
  lupa: ['Lupa kata sandi', 'Masukkan email akun Anda. Kami akan mengirim kode OTP 6 angka untuk membuat kata sandi baru.'],
  reset: ['Buat kata sandi baru', 'Masukkan kode OTP dari email lalu buat kata sandi baru.'],
};

export default function Masuk({ perluSetup, berakhir, onMasuk }) {
  const [mode, setMode] = useState(perluSetup ? 'setup' : 'masuk');
  const [isian, setIsian] = useState({ nama: '', email: '', sandi: '', ulang: '', kode: '', otp: '' });
  const [galat, setGalat] = useState(berakhir ? 'Sesi Anda berakhir. Silakan masuk kembali.' : '');
  const [info, setInfo] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [otpTersedia, setOtpTersedia] = useState(null);
  const ubah = (k) => (e) => setIsian((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    if (mode === 'lupa' && otpTersedia === null) api('/lupa-sandi').then((r) => setOtpTersedia(r.tersedia)).catch(() => setOtpTersedia(false));
  }, [mode, otpTersedia]);

  const pindah = (m) => { setMode(m); setGalat(''); setInfo(''); };

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    if ((mode === 'setup' || mode === 'reset') && isian.sandi !== isian.ulang) { setGalat('Ulangi kata sandi belum sama.'); return; }
    setMemuat(true);
    try {
      if (mode === 'lupa') {
        const r = await api('/lupa-sandi', { metode: 'POST', data: { email: isian.email } });
        setInfo(r.pesan);
        setMode('reset');
        setMemuat(false);
        return;
      }
      const res = mode === 'setup'
        ? await api('/setup', { metode: 'POST', data: { nama: isian.nama, email: isian.email, sandi: isian.sandi, kode: isian.kode } })
        : mode === 'reset'
          ? await api('/reset-sandi', { metode: 'POST', data: { email: isian.email, kode: isian.otp, sandiBaru: isian.sandi } })
          : await api('/masuk', { metode: 'POST', data: { email: isian.email, sandi: isian.sandi } });
      await onMasuk(res.pengguna);
    } catch (err) {
      setGalat(err.message);
      setMemuat(false);
    }
  }

  const [judul, ket] = JUDUL[mode];
  const sandiBaru = mode === 'setup' || mode === 'reset';

  return (
    <div className="grid grid-cols-1 min-h-screen bg-gading lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-hitam p-12 text-gading lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(200,156,74,.3),transparent_55%)]" aria-hidden="true" />
        <Lambang garis className="absolute -bottom-[14%] -right-[12%] w-[78%] text-emas/25" />
        <img src={aset('/logo/logo-header-gelap.svg')} alt="GBI Kapernaum Sorong" className="relative h-11 w-auto self-start" />
        <div className="relative grid grid-cols-1 max-w-[30rem] gap-4">
          <p className="label text-emas">Panel Pengelola Website</p>
          <p className="font-judul text-[3rem] font-semibold leading-[1.05]">Melayani lewat <em className="text-emas-muda">kabar baik</em> setiap minggu.</p>
          <p className="text-gading/75">Jadwal, khotbah, foto, dan profil gereja diperbarui oleh tiap bidang pelayanan sesuai perannya.</p>
        </div>
        <p className="relative text-[.8rem] text-batu">GBI Kapernaum Sorong · Gereja Bethel Indonesia</p>
      </aside>

      <main className="grid grid-cols-1 place-items-center px-5 py-12">
        <form onSubmit={kirim} className="grid grid-cols-1 w-full max-w-[420px] gap-5" noValidate>
          <img src={aset('/logo/logo-header-terang.svg')} alt="GBI Kapernaum Sorong" className="mb-2 h-11 w-auto justify-self-start lg:hidden" />
          <div className="grid grid-cols-1 gap-2">
            <h1 className="font-judul text-[2.4rem] font-semibold leading-tight">{judul}</h1>
            <p className="text-batu-tua">{ket}</p>
          </div>

          {galat && <Pesan nada="galat">{galat}</Pesan>}
          {info && <Pesan>{info}</Pesan>}
          {mode === 'lupa' && otpTersedia === false && (
            <Pesan nada="peringatan">Pengiriman email belum diatur di server. Minta ketua atau developer mengatur ulang kata sandi Anda dari menu Pengguna & Peran.</Pesan>
          )}

          {mode === 'setup' && (
            <>
              <Bidang label="Kode setup" bantuan="Lihat variabel CMS_KODE_SETUP di pengaturan hosting (.env), atau berkas kode-setup.txt di folder data / log server.">
                {(id) => <input id={id} className={`${kelasInput} font-mono uppercase tracking-[.2em]`} value={isian.kode} onChange={ubah('kode')} autoComplete="off" required />}
              </Bidang>
              <Bidang label="Nama lengkap">
                {(id) => <input id={id} className={kelasInput} value={isian.nama} onChange={ubah('nama')} autoComplete="name" required />}
              </Bidang>
            </>
          )}

          <Bidang label="Email">
            {(id) => <input id={id} type="email" className={kelasInput} value={isian.email} onChange={ubah('email')} autoComplete="username" readOnly={mode === 'reset'} required />}
          </Bidang>

          {mode === 'reset' && (
            <Bidang label="Kode OTP" bantuan="6 angka dari email. Belum masuk? Periksa folder spam atau minta kode baru.">
              {(id) => (
                <input
                  id={id} className={`${kelasInput} text-center font-mono text-[1.4rem] tracking-[.5em]`} value={isian.otp}
                  onChange={(e) => setIsian((s) => ({ ...s, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  inputMode="numeric" autoComplete="one-time-code" maxLength={6} required
                />
              )}
            </Bidang>
          )}

          {mode !== 'lupa' && (
            <Bidang label={mode === 'reset' ? 'Kata sandi baru' : 'Kata sandi'} bantuan={sandiBaru ? 'Minimal 8 karakter.' : null}>
              {(id) => <input id={id} type="password" className={kelasInput} value={isian.sandi} onChange={ubah('sandi')} autoComplete={sandiBaru ? 'new-password' : 'current-password'} required />}
            </Bidang>
          )}
          {sandiBaru && (
            <Bidang label={mode === 'reset' ? 'Ulangi kata sandi baru' : 'Ulangi kata sandi'}>
              {(id) => <input id={id} type="password" className={kelasInput} value={isian.ulang} onChange={ubah('ulang')} autoComplete="new-password" required />}
            </Bidang>
          )}

          <Tombol type="submit" varian="utama" memuat={memuat} disabled={mode === 'lupa' && otpTersedia === false} className="mt-1 w-full py-3">
            {{ setup: 'Buat akun & masuk', masuk: 'Masuk', lupa: 'Kirim kode OTP', reset: 'Simpan kata sandi & masuk' }[mode]}
          </Tombol>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[.85rem]">
            {mode === 'masuk' && <button type="button" className="font-semibold text-emas-teks underline-offset-4 hover:underline" onClick={() => pindah('lupa')}>Lupa kata sandi?</button>}
            {(mode === 'lupa' || mode === 'reset') && <button type="button" className="font-semibold text-emas-teks underline-offset-4 hover:underline" onClick={() => pindah('masuk')}>← Kembali ke halaman masuk</button>}
            {mode === 'reset' && <button type="button" className="text-batu-tua underline-offset-4 hover:underline" onClick={() => pindah('lupa')}>Minta kode baru</button>}
            {(mode === 'masuk' || mode === 'setup') && <a href="/" className="text-batu-tua underline-offset-4 hover:underline">← Kembali ke website</a>}
          </div>
        </form>
      </main>
    </div>
  );
}
