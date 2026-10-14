import { halamanSiapaKami } from '../data/konten.js';
import KepalaHalaman from '../components/KepalaHalaman.jsx';
import TentangNama from '../components/SiapaKami.jsx';
import Nilai from '../components/Nilai.jsx';
import Pengurus from '../components/Pengurus.jsx';
import Ajakan from '../components/Ajakan.jsx';

export default function SiapaKami() {
  return (
    <>
      <KepalaHalaman remah="Siapa Kami" judul={halamanSiapaKami.judul} teks={halamanSiapaKami.teks} />
      <main id="utama">
        <TentangNama />
        <Nilai />
        <Pengurus />
        <Ajakan />
      </main>
    </>
  );
}
