// Panel CMS Gereja Alfa Omega (/admin). Dimuat terpisah sehingga tidak memperberat website.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { kategoriById, bolehKategori, bolehKelolaPengguna, bolehSistem } from '../cms/skema.js';
import { api } from './api.js';
import { KonteksCms, Memuat } from './ui.jsx';
import Masuk from './Masuk.jsx';
import Tata from './Tata.jsx';
import Ringkasan from './Ringkasan.jsx';
import Editor from './Editor.jsx';
import Pengguna from './Pengguna.jsx';
import Media from './Media.jsx';
import Riwayat from './Riwayat.jsx';
import Sistem from './Sistem.jsx';
import Akun from './Akun.jsx';

function Tanpa({ judul, teks }) {
  return (
    <div className="grid grid-cols-1 min-h-[50vh] place-content-center justify-items-center gap-3 text-center">
      <p className="font-judul text-[2rem] font-semibold">{judul}</p>
      <p className="max-w-[48ch] text-batu-tua">{teks}</p>
      <a href="/admin" className="tautan mt-2">Kembali ke ringkasan</a>
    </div>
  );
}

export default function Admin({ jalur }) {
  const [sesi, setSesi] = useState(null); // { pengguna, perluSetup }
  const [data, setData] = useState(null); // { isi, meta }
  const [galatMuat, setGalatMuat] = useState('');
  const [pemberitahuan, setPemberitahuan] = useState(null);

  useEffect(() => {
    document.body.classList.add('cms');
    return () => document.body.classList.remove('cms');
  }, []);

  const beriTahu = useCallback((pesan, jenis = 'sukses') => {
    setPemberitahuan({ pesan, jenis, id: Date.now() });
  }, []);
  useEffect(() => {
    if (!pemberitahuan) return undefined;
    const t = setTimeout(() => setPemberitahuan(null), pemberitahuan.jenis === 'galat' ? 7000 : 4000);
    return () => clearTimeout(t);
  }, [pemberitahuan]);

  const muatIsi = useCallback(async () => {
    const d = await api('/isi');
    setData({ isi: d.isi, meta: d.meta });
  }, []);

  useEffect(() => {
    api('/sesi')
      .then(async (s) => {
        setSesi(s);
        if (s.pengguna) await muatIsi();
      })
      .catch((e) => setGalatMuat(e.message));
  }, [muatIsi]);

  useEffect(() => {
    const berakhir = () => {
      setSesi((s) => (s?.pengguna ? { pengguna: null, perluSetup: false, berakhir: true } : s));
      setData(null);
    };
    window.addEventListener('cms:sesi-berakhir', berakhir);
    return () => window.removeEventListener('cms:sesi-berakhir', berakhir);
  }, []);

  const pengguna = sesi?.pengguna ?? null;
  const masuk = useCallback(async (p) => {
    setSesi({ pengguna: p, perluSetup: false });
    await muatIsi();
  }, [muatIsi]);
  const keluar = useCallback(async () => {
    await api('/keluar', { metode: 'POST' }).catch(() => {});
    setSesi({ pengguna: null, perluSetup: false });
    setData(null);
    setPemberitahuan(null);
  }, []);
  const setPengguna = useCallback((p) => setSesi((s) => ({ ...s, pengguna: p })), []);

  const konteks = useMemo(
    () => ({ pengguna, setPengguna, isi: data?.isi, meta: data?.meta ?? {}, setData, muatIsi, beriTahu, keluar }),
    [pengguna, setPengguna, data, muatIsi, beriTahu, keluar],
  );

  let konten;
  let judul = 'Panel CMS';
  if (galatMuat) konten = <Tanpa judul="Server tidak dapat dihubungi" teks={galatMuat} />;
  else if (!sesi || (pengguna && !data)) konten = null;
  else if (!pengguna) {
    konten = <Masuk perluSetup={sesi.perluSetup} berakhir={sesi.berakhir} onMasuk={masuk} />;
    judul = sesi.perluSetup ? 'Setup Awal' : 'Masuk';
  } else {
    const sub = jalur.replace(/^\/admin\/?/, '');
    const [bagian, id] = sub.split('/');
    if (!bagian) { konten = <Ringkasan />; judul = 'Ringkasan'; }
    else if (bagian === 'isi') {
      const kat = kategoriById(id);
      if (!kat) konten = <Tanpa judul="Kategori tidak ditemukan" teks="Alamat ini tidak cocok dengan kategori isi mana pun." />;
      else if (!bolehKategori(pengguna, kat)) konten = <Tanpa judul="Tidak ada akses" teks={`Peran Anda belum mencakup kategori "${kat.judul}". Hubungi ketua atau developer bila perlu akses.`} />;
      else { konten = <Editor key={kat.id} kat={kat} />; judul = kat.judul; }
    } else if (bagian === 'pengguna') {
      konten = bolehKelolaPengguna(pengguna) ? <Pengguna /> : <Tanpa judul="Tidak ada akses" teks="Hanya ketua dan developer yang dapat mengelola pengguna." />;
      judul = 'Pengguna & Peran';
    } else if (bagian === 'media') { konten = <Media />; judul = 'Pustaka Media'; }
    else if (bagian === 'riwayat') { konten = <Riwayat />; judul = 'Riwayat'; }
    else if (bagian === 'sistem') {
      konten = bolehSistem(pengguna) ? <Sistem /> : <Tanpa judul="Tidak ada akses" teks="Halaman sistem khusus developer." />;
      judul = 'Sistem';
    } else if (bagian === 'akun') { konten = <Akun />; judul = 'Akun Saya'; }
    else konten = <Tanpa judul="Halaman tidak ditemukan" teks="Periksa kembali alamatnya." />;
  }

  useEffect(() => { document.title = `${judul} · CMS Alfa Omega`; }, [judul]);

  return (
    <KonteksCms.Provider value={konteks}>
      {pengguna && data ? <Tata jalur={jalur}>{konten}</Tata> : (konten ?? <Memuat teks="Membuka panel…" />)}
      {pemberitahuan && (
        <div
          key={pemberitahuan.id} role={pemberitahuan.jenis === 'galat' ? 'alert' : 'status'}
          className={`fixed bottom-5 left-1/2 z-[60] w-[min(92vw,460px)] -translate-x-1/2 rounded-2xl px-5 py-3.5 text-[.92rem] font-medium shadow-2xl ${pemberitahuan.jenis === 'galat' ? 'bg-anggur text-white' : 'bg-hitam text-gading'}`}
        >
          {pemberitahuan.pesan}
        </div>
      )}
    </KonteksCms.Provider>
  );
}
