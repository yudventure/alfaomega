import KepalaHalaman from '../components/KepalaHalaman.jsx';
import { Tombol } from '../components/Dasar.jsx';

export default function TidakDitemukan() {
  return (
    <>
      <KepalaHalaman
        label="Galat 404"
        judul="Halaman <em>Tidak Ditemukan</em>"
        teks="Halaman yang Anda cari mungkin sudah dipindahkan atau alamatnya salah ketik."
      >
        <Tombol varian="gading" href="/" ikon="panah-kanan">Kembali ke Beranda</Tombol>
      </KepalaHalaman>
      <main id="utama" />
    </>
  );
}
