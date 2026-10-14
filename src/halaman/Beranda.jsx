import Hero from '../components/Hero.jsx';
import Sambutan from '../components/Sambutan.jsx';
import Langkah from '../components/Langkah.jsx';
import Jadwal from '../components/Jadwal.jsx';
import Khotbah from '../components/Khotbah.jsx';
import Jemaat from '../components/Jemaat.jsx';
import Persembahan from '../components/Persembahan.jsx';
import Kunjungi from '../components/Kunjungi.jsx';

export default function Beranda() {
  return (
    <>
      <Hero />
      <main id="utama">
        <Sambutan />
        <Langkah />
        <Jadwal />
        <Khotbah />
        <Jemaat />
        <Persembahan />
        <Kunjungi />
      </main>
    </>
  );
}
