import { teksPolos } from './judul.js';

// Halaman detail tiap langkah bertumbuh (/langkah/<slug>), urut sesuai kartu di beranda.
// Isinya ada di isi.halamanLangkah[slug] dan diubah lewat kategori CMS "langkah-<slug>".
export const LANGKAH = ['beribadah', 'komsel', 'kelas', 'baptisan', 'melayani'];
export const jalurLangkah = (slug) => `/langkah/${slug}`;

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
  ...LANGKAH.map((slug) => ({
    jalur: jalurLangkah(slug),
    judul: (isi) => `${teksPolos(isi.halamanLangkah?.[slug]?.judul ?? '')} · ${isi.gereja.nama}`,
    deskripsi: (isi) => isi.halamanLangkah?.[slug]?.teks || isi.seo.deskripsi,
    gambar: (isi) => [isi.halamanLangkah?.[slug]?.gambar],
    ubah: 'monthly',
    prioritas: '0.7',
    kategori: [`langkah-${slug}`, 'identitas', 'seo'],
  })),
];

export const halamanUntuk = (jalur) => HALAMAN.find((h) => h.jalur === jalur);
