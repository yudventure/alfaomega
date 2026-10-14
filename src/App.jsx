import { useLayoutEffect, useRef } from 'react';
import { gereja } from './data/konten.js';
import { useJalur, useTautanInternal } from './rute.js';
import Beranda from './halaman/Beranda.jsx';
import SiapaKami from './halaman/SiapaKami.jsx';
import TidakDitemukan from './halaman/TidakDitemukan.jsx';
import Footer from './components/Footer.jsx';

// Daftar halaman website. Tambah halaman baru di sini.
const RUTE = {
  '/': { Halaman: Beranda, judul: gereja.nama },
  '/siapa-kami': { Halaman: SiapaKami, judul: `Siapa Kami · ${gereja.nama}` },
};
const HALAMAN_404 = { Halaman: TidakDitemukan, judul: `Halaman Tidak Ditemukan · ${gereja.nama}` };
const adaRute = (jalur) => jalur in RUTE;

export default function App() {
  const jalur = useJalur();
  const { Halaman, judul } = RUTE[jalur] ?? HALAMAN_404;
  const pertama = useRef(true);

  useTautanInternal(adaRute);

  // judul tab, lalu gulir ke atas (atau ke #bagian bila ada) setiap pindah halaman
  useLayoutEffect(() => {
    document.title = judul;
    const { hash } = window.location;
    if (pertama.current) {
      pertama.current = false;
      if (!hash) return; // muat pertama: biarkan browser memulihkan posisi gulir
    }
    const tujuan = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (tujuan) tujuan.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [jalur, judul]);

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
