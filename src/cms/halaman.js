// Halaman publik website. Dipakai server (sitemap.xml, meta tag, status 404) dan situs (judul tab).
// Menambah halaman: tambahkan di sini dan di RUTE (src/App.jsx).
export const HALAMAN = [
  {
    jalur: '/',
    judul: (isi) => `${isi.gereja.nama} · ${isi.gereja.tagline}`,
    deskripsi: (isi) => isi.seo.deskripsi,
    gambar: (isi) => [isi.hero.gambar, ...isi.langkah.daftar.map((l) => l.gambar)],
    ubah: 'weekly',
    prioritas: '1.0',
    kategori: null, // semua kategori memengaruhi beranda
  },
  {
    jalur: '/siapa-kami',
    judul: (isi) => `Siapa Kami · ${isi.gereja.nama}`,
    deskripsi: (isi) => isi.seo.deskripsiSiapaKami,
    gambar: (isi) => [isi.siapaKami.gambar, ...isi.pengurus.daftar.map((p) => p.foto)],
    ubah: 'monthly',
    prioritas: '0.8',
    kategori: ['identitas', 'profil', 'pengurus', 'seo'],
  },
];

export const halamanUntuk = (jalur) => HALAMAN.find((h) => h.jalur === jalur);
