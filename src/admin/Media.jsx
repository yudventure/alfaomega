// Pustaka media: unggah, cari, salin alamat, hapus
import { useEffect, useRef, useState } from 'react';
import { aksesPenuh } from '../cms/skema.js';
import { api } from './api.js';
import { siapkanGambar, ukuranBerkas, waktuRelatif } from './alat.js';
import { Kosong, KepalaHalaman, Memuat, Tombol, kelasInput, useCms } from './ui.jsx';

export default function Media() {
  const { pengguna, beriTahu } = useCms();
  const [daftar, setDaftar] = useState(null);
  const [cari, setCari] = useState('');
  const [unggah, setUnggah] = useState(0);
  const [seret, setSeret] = useState(false);
  const berkas = useRef(null);

  useEffect(() => { api('/media').then(setDaftar).catch((e) => beriTahu(e.message, 'galat')); }, [beriTahu]);

  async function unggahSemua(files) {
    const list = [...(files ?? [])];
    if (!list.length) return;
    setUnggah(list.length);
    let berhasil = 0;
    for (const f of list) {
      try {
        const { data, lebar, tinggi } = await siapkanGambar(f);
        const item = await api('/media', { metode: 'POST', data: { nama: f.name, data, lebar, tinggi } });
        setDaftar((d) => [item, ...(d ?? [])]);
        berhasil += 1;
      } catch (e) {
        beriTahu(e.message, 'galat');
      }
      setUnggah((n) => n - 1);
    }
    if (berkas.current) berkas.current.value = '';
    if (berhasil) beriTahu(`${berhasil} gambar diunggah.`);
  }

  async function hapus(m) {
    if (!window.confirm(`Hapus ${m.nama}? Bila gambar ini masih dipakai di website, bagian tersebut akan kosong.`)) return;
    try {
      await api(`/media/${m.id}`, { metode: 'DELETE' });
      setDaftar((d) => d.filter((x) => x.id !== m.id));
      beriTahu('Gambar dihapus.');
    } catch (e) { beriTahu(e.message, 'galat'); }
  }

  const tampil = (daftar ?? []).filter((m) => m.nama.toLowerCase().includes(cari.trim().toLowerCase()));

  return (
    <>
      <KepalaHalaman
        remah="Administrasi" judul="Pustaka Media"
        ket="Foto yang diunggah otomatis diperkecil (maks. 2400 px) supaya website tetap cepat. Pilih foto dari sini lewat tombol Pustaka media di setiap bidang gambar."
        aksi={<Tombol varian="emas" ikon="unduh" memuat={unggah > 0} onClick={() => berkas.current?.click()}>{unggah ? `Mengunggah ${unggah}…` : 'Unggah gambar'}</Tombol>}
      />
      <input ref={berkas} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => unggahSemua(e.target.files)} />

      <div
        onDragOver={(e) => { e.preventDefault(); setSeret(true); }}
        onDragLeave={() => setSeret(false)}
        onDrop={(e) => { e.preventDefault(); setSeret(false); unggahSemua(e.dataTransfer.files); }}
        className={`mb-6 grid place-items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center text-[.9rem] transition-colors ${seret ? 'border-emas bg-emas/10 text-emas-teks' : 'border-garis text-batu-tua'}`}
      >
        Seret foto ke sini untuk mengunggah (JPG, PNG, atau WebP)
      </div>

      <input className={`${kelasInput} mb-6 max-w-sm`} placeholder="Cari nama berkas…" value={cari} onChange={(e) => setCari(e.target.value)} aria-label="Cari media" />

      {!daftar ? <Memuat /> : !tampil.length ? (
        <Kosong ikon="galeri" judul={cari ? 'Tidak ada yang cocok' : 'Belum ada gambar'} teks={cari ? 'Coba kata kunci lain.' : 'Unggah foto kegiatan, pengurus, atau QRIS untuk dipakai di website.'} />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tampil.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-garis bg-krem">
              <a href={m.berkas} target="_blank" rel="noopener" className="block aspect-[4/3] bg-pasir">
                <img src={m.berkas} alt={m.nama} loading="lazy" className="h-full w-full object-cover" />
              </a>
              <div className="grid grid-cols-1 gap-2 p-3">
                <p className="truncate text-[.85rem] font-semibold" title={m.nama}>{m.nama}</p>
                <p className="text-[.75rem] text-batu">{ukuranBerkas(m.ukuran)}{m.lebar ? ` · ${m.lebar}×${m.tinggi}` : ''} · {waktuRelatif(m.waktu)} · {m.oleh}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Tombol varian="garis" kecil onClick={() => navigator.clipboard?.writeText(m.berkas).then(() => beriTahu('Alamat gambar disalin.'))}>Salin alamat</Tombol>
                  {(aksesPenuh(pengguna) || m.olehId === pengguna.id) && <Tombol varian="bahaya" kecil onClick={() => hapus(m)}>Hapus</Tombol>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
