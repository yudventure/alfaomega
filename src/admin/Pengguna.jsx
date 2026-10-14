// Kelola pengguna CMS dan perannya (ketua & developer)
import { useEffect, useState } from 'react';
import { PERAN, KATEGORI, namaPeran, punyaPeran, bolehKategori } from '../cms/skema.js';
import { api } from './api.js';
import { inisial, waktuRelatif } from './alat.js';
import { Bidang, Kartu, KepalaHalaman, Lencana, Memuat, Modal, Pesan, Tombol, kelasInput, useCms } from './ui.jsx';

function FormPengguna({ awal, onTutup, onSimpan }) {
  const { pengguna: saya } = useCms();
  const developer = punyaPeran(saya, 'developer');
  const [isian, setIsian] = useState({ nama: awal?.nama ?? '', email: awal?.email ?? '', peran: awal?.peran ?? [], sandi: '' });
  const [galat, setGalat] = useState('');
  const [memuat, setMemuat] = useState(false);
  const ubahPeran = (id) => setIsian((s) => ({ ...s, peran: s.peran.includes(id) ? s.peran.filter((x) => x !== id) : [...s.peran, id] }));

  async function kirim(e) {
    e.preventDefault();
    setMemuat(true);
    setGalat('');
    try {
      const data = { nama: isian.nama, email: isian.email, peran: isian.peran, ...(isian.sandi ? { sandi: isian.sandi } : {}) };
      const hasil = awal
        ? await api(`/pengguna/${awal.id}`, { metode: 'PUT', data })
        : await api('/pengguna', { metode: 'POST', data });
      onSimpan(hasil);
    } catch (err) {
      setGalat(err.message);
      setMemuat(false);
    }
  }

  const kotakPeran = (p) => {
    const terkunci = p.id === 'developer' && !developer;
    return (
      <label key={p.id} className={`flex gap-3 rounded-xl border p-3 ${isian.peran.includes(p.id) ? 'border-emas bg-emas/10' : 'border-garis bg-white'} ${terkunci ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[#9A7633]" checked={isian.peran.includes(p.id)} disabled={terkunci} onChange={() => ubahPeran(p.id)} />
        <span>
          <span className="block text-[.9rem] font-semibold">{p.nama}</span>
          <span className="block text-[.8rem] leading-snug text-batu-tua">{p.ket}</span>
        </span>
      </label>
    );
  };

  return (
    <Modal
      judul={awal ? `Ubah ${awal.nama}` : 'Tambah pengguna'} onTutup={onTutup} lebar="max-w-2xl"
      kaki={<><Tombol varian="hantu" onClick={onTutup}>Batal</Tombol><Tombol varian="emas" type="submit" form="form-pengguna" memuat={memuat}>{awal ? 'Simpan' : 'Tambah pengguna'}</Tombol></>}
    >
      <form id="form-pengguna" onSubmit={kirim} className="grid grid-cols-1 gap-5">
        {galat && <Pesan nada="galat">{galat}</Pesan>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Bidang label="Nama lengkap">{(id) => <input id={id} className={kelasInput} value={isian.nama} onChange={(e) => setIsian({ ...isian, nama: e.target.value })} required />}</Bidang>
          <Bidang label="Email">{(id) => <input id={id} type="email" className={kelasInput} value={isian.email} onChange={(e) => setIsian({ ...isian, email: e.target.value })} required />}</Bidang>
        </div>
        <Bidang label={awal ? 'Atur ulang kata sandi (opsional)' : 'Kata sandi awal'} bantuan={awal ? 'Isi hanya bila ingin mengganti. Pengguna akan keluar dari semua perangkat.' : 'Minimal 8 karakter. Minta pengguna menggantinya lewat menu Akun Saya.'}>
          {(id) => <input id={id} type="text" className={`${kelasInput} font-mono`} value={isian.sandi} onChange={(e) => setIsian({ ...isian, sandi: e.target.value })} autoComplete="new-password" required={!awal} />}
        </Bidang>
        <fieldset className="grid grid-cols-1 gap-3">
          <legend className="mb-2 text-[.85rem] font-semibold text-arang">Peran</legend>
          <p className="label text-[.65rem]">Akses penuh</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{PERAN.filter((p) => p.penuh).map(kotakPeran)}</div>
          <p className="label mt-2 text-[.65rem]">Bidang pelayanan</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{PERAN.filter((p) => !p.penuh).map(kotakPeran)}</div>
        </fieldset>
      </form>
    </Modal>
  );
}

export default function Pengguna() {
  const { pengguna: saya, beriTahu } = useCms();
  const [daftar, setDaftar] = useState(null);
  const [form, setForm] = useState(null); // null | 'baru' | objek pengguna
  const developer = punyaPeran(saya, 'developer');

  useEffect(() => { api('/pengguna').then(setDaftar).catch((e) => beriTahu(e.message, 'galat')); }, [beriTahu]);

  async function hapus(p) {
    if (!window.confirm(`Hapus akun ${p.nama}? Orang ini tidak dapat masuk lagi.`)) return;
    try {
      await api(`/pengguna/${p.id}`, { metode: 'DELETE' });
      setDaftar((d) => d.filter((x) => x.id !== p.id));
      beriTahu(`Akun ${p.nama} dihapus.`);
    } catch (e) { beriTahu(e.message, 'galat'); }
  }

  return (
    <>
      <KepalaHalaman
        remah="Administrasi" judul="Pengguna & Peran"
        ket="Setiap pengguna hanya dapat mengubah bagian website sesuai perannya. Ketua dan developer dapat mengakses semua peran."
        aksi={<Tombol varian="emas" ikon="pengguna" onClick={() => setForm('baru')}>Tambah pengguna</Tombol>}
      />

      {!daftar ? <Memuat /> : (
        <Kartu className="mb-8 !p-0 overflow-hidden">
          <ul className="divide-y divide-garis">
            {daftar.map((p) => {
              const terkunci = p.peran.includes('developer') && !developer;
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4 md:px-6">
                  <span className="grid grid-cols-1 h-11 w-11 shrink-0 place-items-center rounded-full bg-hitam font-bold text-emas">{inisial(p.nama)}</span>
                  <div className="min-w-[200px] flex-1">
                    <p className="font-semibold">{p.nama} {p.id === saya.id && <span className="text-[.8rem] font-normal text-batu">(Anda)</span>}</p>
                    <p className="text-[.85rem] text-batu-tua">{p.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{p.peran.map((r) => <Lencana key={r} nada={r === 'developer' || r === 'ketua' ? 'gelap' : 'emas'}>{namaPeran(r)}</Lencana>)}</div>
                  </div>
                  <p className="w-full text-[.8rem] text-batu sm:w-auto">{p.terakhirMasuk ? `Masuk ${waktuRelatif(p.terakhirMasuk)}` : 'Belum pernah masuk'}</p>
                  <div className="flex gap-2">
                    {terkunci ? <span className="text-[.8rem] text-batu">Hanya developer</span> : (
                      <>
                        <Tombol varian="garis" kecil onClick={() => setForm(p)}>Ubah</Tombol>
                        {p.id !== saya.id && <Tombol varian="bahaya" kecil onClick={() => hapus(p)}>Hapus</Tombol>}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Kartu>
      )}

      <Kartu judul="Hak akses tiap peran" ket="Kategori isi yang dapat diubah oleh masing-masing peran.">
        <div className="grid grid-cols-1 gap-3">
          {PERAN.map((p) => {
            const bisa = KATEGORI.filter((k) => bolehKategori({ peran: [p.id] }, k));
            return (
              <div key={p.id} className="grid grid-cols-1 gap-2 border-b border-garis pb-3 last:border-0 last:pb-0 md:grid-cols-[220px_1fr]">
                <p className="font-semibold">{p.nama}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.penuh ? <Lencana nada="gelap">Semua kategori{p.id === 'developer' ? ' + menu, cadangan & sistem' : ' + kelola pengguna'}</Lencana>
                    : bisa.map((k) => <Lencana key={k.id}>{k.judul}</Lencana>)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5"><Pesan>Semua pengguna dapat mengunggah foto ke Pustaka Media dan melihat riwayat perubahan pada kategori miliknya.</Pesan></div>
      </Kartu>

      {form && (
        <FormPengguna
          awal={form === 'baru' ? null : form}
          onTutup={() => setForm(null)}
          onSimpan={(hasil) => {
            setDaftar((d) => (form === 'baru' ? [...d, hasil] : d.map((x) => (x.id === hasil.id ? hasil : x))));
            setForm(null);
            beriTahu(form === 'baru' ? `Akun ${hasil.nama} dibuat. Berikan email dan kata sandinya kepada yang bersangkutan.` : `Akun ${hasil.nama} diperbarui.`);
          }}
        />
      )}
    </>
  );
}
