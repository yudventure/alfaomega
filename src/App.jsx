import { Suspense, lazy, useLayoutEffect, useRef } from 'react';
import { gereja } from './data/isi.js';
import { useJalur, useTautanInternal } from './rute.js';
import Beranda from './halaman/Beranda.jsx';
import SiapaKami from './halaman/SiapaKami.jsx';
import TidakDitemukan from './halaman/TidakDitemukan.jsx';
import Footer from './components/Footer.jsx';

// panel CMS dimuat terpisah, hanya saat membuka /admin
const Admin = lazy(() => import('./admin/Admin.jsx'));

// Daftar halaman website. Tambah halaman baru di sini.
const RUTE = {
  '/': { Halaman: Beranda, judul: gereja.nama },
  '/siapa-kami': { Halaman: SiapaKami, judul: `Siapa Kami · ${gereja.nama}` },
};
const HALAMAN_404 = { Halaman: TidakDitemukan, judul: `Halaman Tidak Ditemukan · ${gereja.nama}` };
const halamanAdmin = (jalur) => jalur === '/admin' || jalur.startsWith('/admin/');
const adaRute = (jalur) => jalur in RUTE || halamanAdmin(jalur);

export default function App() {
  const jalur = useJalur();
  const admin = halamanAdmin(jalur);
  const { Halaman, judul } = admin ? { Halaman: null, judul: null } : RUTE[jalur] ?? HALAMAN_404;
  const pertama = useRef(true);

  useTautanInternal(adaRute);

  // judul tab, lalu gulir ke atas (atau ke #bagian bila ada) setiap pindah halaman
  useLayoutEffect(() => {
    if (judul) document.title = judul; // panel CMS mengatur judulnya sendiri
    const { hash } = window.location;
    if (pertama.current) {
      pertama.current = false;
      if (!hash) return; // muat pertama: biarkan browser memulihkan posisi gulir
    }
    const tujuan = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (tujuan) tujuan.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [jalur, judul]);

  if (admin) {
    return (
      <Suspense fallback={<div className="grid min-h-screen place-items-center text-batu-tua">Membuka panel…</div>}>
        <Admin jalur={jalur} />
      </Suspense>
    );
  }

  return (
    <>
      <a href="#utama" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-hitam focus:px-4 focus:py-2 focus:text-gading">
        Langsung ke isi
      </a>
      <Halaman />
      <Footer />
    </>
  );
}
