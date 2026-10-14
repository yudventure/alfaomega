import Hero from './components/Hero.jsx';
import SiapaKami from './components/SiapaKami.jsx';
import Langkah from './components/Langkah.jsx';
import Jadwal from './components/Jadwal.jsx';
import Khotbah from './components/Khotbah.jsx';
import Jemaat from './components/Jemaat.jsx';
import Persembahan from './components/Persembahan.jsx';
import Kunjungi from './components/Kunjungi.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a href="#utama" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-hitam focus:px-4 focus:py-2 focus:text-gading">
        Langsung ke isi
      </a>
      <Hero />
      <main id="utama">
        <SiapaKami />
        <Langkah />
        <Jadwal />
        <Khotbah />
        <Jemaat />
        <Persembahan />
        <Kunjungi />
      </main>
      <Footer />
    </>
  );
}
