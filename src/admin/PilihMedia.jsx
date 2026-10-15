// Jendela memilih gambar dari pustaka media (unggahan) atau foto bawaan website
import { useEffect, useMemo, useState } from 'react';
import * as bawaan from '../data/konten.js';
import { api } from './api.js';
import { Kosong, Memuat, Modal, kelasInput } from './ui.jsx';
import { aset } from '../aset.js';

// semua gambar /img/... yang dipakai isi bawaan
function gambarBawaan() {
  const hasil = new Set();
  const jelajah = (v) => {
    if (typeof v === 'string' && /^\/img\/.+\.(jpe?g|png|webp)$/i.test(v)) hasil.add(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(jelajah);
  };
  jelajah({ ...bawaan });
  return [...hasil].sort();
}

export default function PilihMedia({ onPilih, onTutup }) {
  const [media, setMedia] = useState(null);
  const [galat, setGalat] = useState('');
  const [cari, setCari] = useState('');
  const bawaanSitus = useMemo(gambarBawaan, []);

  useEffect(() => {
    api('/media').then(setMedia).catch((e) => setGalat(e.message));
  }, []);

  const cocok = (teks) => teks.toLowerCase().includes(cari.trim().toLowerCase());
  const daftar = (media ?? []).filter((m) => cocok(m.nama));
  const kotak = (alamat, nama) => (
    <button
      key={alamat} type="button" onClick={() => onPilih(alamat)}
      className="group grid grid-cols-1 gap-1.5 rounded-xl p-1.5 text-left hover:bg-pasir focus-visible:bg-pasir"
    >
      <span className="aspect-[4/3] overflow-hidden rounded-lg bg-pasir">
        <img src={aset(alamat)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" />
      </span>
      <span className="truncate px-0.5 text-[.75rem] text-batu-tua">{nama}</span>
    </button>
  );

  return (
    <Modal judul="Pilih gambar" onTutup={onTutup} lebar="max-w-4xl">
      <input className={`${kelasInput} mb-5`} placeholder="Cari nama berkas…" value={cari} onChange={(e) => setCari(e.target.value)} aria-label="Cari gambar" />
      <h3 className="label mb-3">Unggahan</h3>
      {galat && <p className="text-anggur">{galat}</p>}
      {!media && !galat && <Memuat />}
      {media && (daftar.length ? (
        <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">{daftar.map((m) => kotak(m.berkas, m.nama))}</div>
      ) : (
        <div className="mb-7"><Kosong ikon="galeri" judul="Belum ada unggahan" teks="Gunakan tombol Unggah foto pada bidang gambar atau menu Pustaka Media." /></div>
      ))}
      <h3 className="label mb-3">Foto bawaan website</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {bawaanSitus.filter(cocok).map((a) => kotak(a, a.replace('/img/', '')))}
      </div>
    </Modal>
  );
}
