// ==========================================================
// SKEMA CMS: peran pelayanan, kategori isi, dan bidang yang boleh diubah.
// Dipakai bersama oleh server (validasi & hak akses) dan panel admin (formulir).
// Menambah kategori baru = menambah satu entri di KATEGORI.
// ==========================================================

// ---------- Peran (mengikuti struktur pelayanan gereja pada umumnya) ----------
export const PERAN = [
  { id: 'developer', nama: 'Developer', ket: 'Akses penuh ke semua isi, pengguna, menu, cadangan data, dan pengaturan sistem.', penuh: true },
  { id: 'ketua', nama: 'Ketua / Gembala Sidang', ket: 'Akses ke semua isi website dan mengelola pengguna serta perannya.', penuh: true },
  { id: 'sekretariat', nama: 'Sekretariat', ket: 'Halaman depan, jadwal ibadah, profil gereja, pengurus, kontak & lokasi.' },
  { id: 'bendahara', nama: 'Bendahara', ket: 'Persembahan, rekening, dan QRIS gereja.' },
  { id: 'multimedia', nama: 'Multimedia', ket: 'Khotbah, video sambutan, foto halaman depan & kehidupan jemaat, media sosial.' },
  { id: 'pembinaan', nama: 'Pembinaan & Pengajaran', ket: 'Langkah bertumbuh dan kelas pembinaan.' },
  { id: 'komisi-anak', nama: 'Komisi Sekolah Minggu', ket: 'Keterangan Sekolah Minggu.' },
  { id: 'komisi-pemuda', nama: 'Komisi Pemuda', ket: 'Keterangan pelayanan pemuda.' },
  { id: 'komsel', nama: 'Koordinator Komsel', ket: 'Keterangan kelompok sel.' },
  { id: 'doa', nama: 'Pelayanan Doa', ket: 'Keterangan doa & puasa.' },
  { id: 'diakonia', nama: 'Misi & Diakonia', ket: 'Keterangan pelayanan sosial dan misi.' },
];
export const ID_PERAN = PERAN.map((p) => p.id);
export const namaPeran = (id) => PERAN.find((p) => p.id === id)?.nama ?? id;

export const KELOMPOK = [
  { id: 'pimpinan', nama: 'Pimpinan' },
  { id: 'sekretariat', nama: 'Sekretariat' },
  { id: 'keuangan', nama: 'Keuangan' },
  { id: 'multimedia', nama: 'Multimedia' },
  { id: 'pembinaan', nama: 'Pembinaan' },
  { id: 'komisi', nama: 'Komisi & Pelayanan' },
  { id: 'pengembang', nama: 'Pengembang' },
];

// ---------- Pembuat bidang ----------
// jenis: teks | paragraf | judul (boleh *emas* & baris baru) | tautan | gambar | video | ikon | objek | daftar | daftar-teks
const teks = (kunci, label, bantuan) => ({ kunci, label, jenis: 'teks', bantuan });
const paragraf = (kunci, label, bantuan) => ({ kunci, label, jenis: 'paragraf', bantuan });
const judul = (kunci = 'judul', label = 'Judul') => ({ kunci, label, jenis: 'judul' });
const tautan = (kunci, label, bantuan) => ({ kunci, label, jenis: 'tautan', bantuan });
const gambar = (kunci, label, rasio, bantuan) => ({ kunci, label, jenis: 'gambar', rasio, bantuan });
const video = (kunci, label, bantuan) => ({ kunci, label, jenis: 'video', bantuan });
const ikon = (kunci = 'ikon', label = 'Ikon') => ({ kunci, label, jenis: 'ikon' });
const objek = (kunci, label, bidang) => ({ kunci, label, jenis: 'objek', bidang });
const daftar = (kunci, label, labelButir, butir, maks = 30) => ({ kunci, label, jenis: 'daftar', labelButir, butir, maks });
const daftarTeks = (kunci, label, labelButir, maks = 12) => ({ kunci, label, jenis: 'daftar-teks', labelButir, maks });
const tombol = (kunci, label, denganIkon = false) =>
  objek(kunci, label, [teks('label', 'Teks tombol'), tautan('href', 'Tautan'), ...(denganIkon ? [ikon()] : [])]);
const keterangan = (kunci, judulBagian) => ({
  kunci, judul: judulBagian, bidang: [teks('judul', 'Nama bagian'), paragraf('teks', 'Keterangan singkat', 'Satu sampai tiga kalimat.')],
});

// ---------- Kategori isi ----------
// bagian: nilai di `kunci` (boleh berjalur, mis. 'jemaat.pemuda') yang diubah lewat kategori ini.
// Bagian berjenis objek hanya mengubah bidang yang terdaftar; bidang lain tetap.
export const KATEGORI = [
  {
    id: 'identitas', kelompok: 'pimpinan', ikon: 'info', judul: 'Identitas Gereja', situs: '/',
    ket: 'Nama gereja, tagline, dan ayat pegangan yang tampil di seluruh website.',
    peran: ['ketua'],
    bagian: [{
      kunci: 'gereja', judul: 'Identitas',
      bidang: [teks('nama', 'Nama gereja'), teks('namaPendek', 'Nama pendek'), teks('tagline', 'Tagline'),
        paragraf('ayat', 'Ayat pegangan'), teks('ayatRujukan', 'Rujukan ayat', 'Contoh: Wahyu 5:5')],
    }],
  },
  {
    id: 'sambutan', kelompok: 'pimpinan', ikon: 'live', judul: 'Sambutan Gembala', situs: '/#sambutan',
    ket: 'Video sambutan dari pimpinan gereja di bawah foto utama beranda.',
    peran: ['ketua', 'multimedia'],
    bagian: [{
      kunci: 'sambutan', judul: 'Sambutan',
      bidang: [teks('label', 'Label kecil'), judul(), paragraf('teks', 'Pengantar'),
        teks('nama', 'Nama pembicara'), teks('jabatan', 'Jabatan'),
        video('video', 'Link video YouTube', 'Tempel link dari YouTube (Bagikan → Salin link). Kosongkan bila belum ada.'),
        gambar('poster', 'Sampul video (opsional)', '16:9', 'Kosongkan untuk memakai sampul dari YouTube.'),
        tombol('tautan', 'Tautan di bawah sambutan')],
    }],
  },
  {
    id: 'beranda', kelompok: 'sekretariat', ikon: 'galeri', judul: 'Halaman Depan', situs: '/',
    ket: 'Foto utama, judul besar, dan tombol di bagian paling atas beranda.',
    peran: ['sekretariat', 'multimedia'],
    bagian: [{
      kunci: 'hero', judul: 'Bagian utama (hero)',
      bidang: [teks('label', 'Label kecil di atas judul'), judul(), paragraf('teks', 'Teks pengantar'),
        tombol('tombolUtama', 'Tombol utama', true), tombol('tombolKedua', 'Tombol kedua', true),
        gambar('gambar', 'Foto layar lebar', '16:9', 'Minimal 2400×1350 piksel.'),
        gambar('gambarPonsel', 'Foto ponsel', '2:3', 'Foto tegak, minimal 1080×1600 piksel.')],
    }],
  },
  {
    id: 'jadwal', kelompok: 'sekretariat', ikon: 'jam', judul: 'Jadwal Ibadah', situs: '/#jadwal',
    ket: 'Daftar ibadah mingguan beserta harinya dan jamnya.',
    peran: ['sekretariat'],
    bagian: [{
      kunci: 'jadwal', judul: 'Jadwal',
      bidang: [judul(), paragraf('teks', 'Keterangan'), teks('ringkas', 'Ringkasan jam', 'Tampil di footer. Contoh: Minggu, 09.00 WIT'),
        daftar('daftar', 'Daftar ibadah', 'Ibadah', [teks('nama', 'Nama ibadah'), teks('waktu', 'Hari & jam', 'Contoh: Minggu · 09.00 WIT'), ikon()], 12)],
    }],
  },
  {
    id: 'profil', kelompok: 'sekretariat', ikon: 'info', judul: 'Profil Gereja', situs: '/siapa-kami',
    ket: 'Isi halaman Siapa Kami: arti nama, nilai-nilai, dan ajakan beribadah.',
    peran: ['sekretariat'],
    bagian: [
      { kunci: 'halamanSiapaKami', judul: 'Kepala halaman', bidang: [judul(), paragraf('teks', 'Pengantar')] },
      {
        kunci: 'siapaKami', judul: 'Arti nama & lambang',
        bidang: [judul(), daftarTeks('paragraf', 'Paragraf', 'Paragraf', 6), tombol('tautan', 'Tautan'),
          gambar('gambar', 'Foto', '4:3', 'Foto jemaat, minimal 1200×900 piksel.')],
      },
      {
        kunci: 'nilai', judul: 'Nilai gereja',
        bidang: [judul(), paragraf('teks', 'Keterangan'),
          daftar('daftar', 'Daftar nilai', 'Nilai', [teks('judul', 'Nama nilai'), paragraf('teks', 'Penjelasan'), ikon()], 8)],
      },
      { kunci: 'ajakan', judul: 'Ajakan beribadah', bidang: [judul(), paragraf('teks', 'Teks'), tombol('tombolUtama', 'Tombol utama'), tombol('tombolKedua', 'Tombol kedua')] },
    ],
  },
  {
    id: 'pengurus', kelompok: 'sekretariat', ikon: 'pengguna', judul: 'Gembala & Pengurus', situs: '/siapa-kami#pengurus',
    ket: 'Nama, jabatan, dan foto gembala serta pengurus gereja.',
    peran: ['sekretariat'],
    bagian: [{
      kunci: 'pengurus', judul: 'Gembala & pengurus',
      bidang: [judul(), paragraf('teks', 'Keterangan'),
        daftar('daftar', 'Daftar pengurus', 'Pengurus', [teks('nama', 'Nama lengkap'), teks('jabatan', 'Jabatan'),
          gambar('foto', 'Foto', '4:5', 'Foto tegak, minimal 800×1000 piksel. Kosong = lambang singa.')], 24)],
    }],
  },
  {
    id: 'kontak', kelompok: 'sekretariat', ikon: 'lokasi', judul: 'Kontak & Lokasi', situs: '/#kunjungi',
    ket: 'Alamat, WhatsApp, email, petunjuk arah, dan foto gedung gereja.',
    peran: ['sekretariat'],
    bagian: [
      {
        kunci: 'kunjungi', judul: 'Kunjungi kami',
        bidang: [judul(), paragraf('teks', 'Keterangan'),
          daftar('info', 'Info kontak', 'Info', [teks('label', 'Label'), daftarTeks('isi', 'Isi', 'Baris', 4), ikon()], 6),
          teks('tujuanPeta', 'Tujuan di Google Maps', 'Nama tempat persis seperti di Google Maps, alamat lengkap, atau koordinat (mis. -6.2000, 106.8166). Semua tombol Petunjuk Arah langsung membuka rute ke sini.'),
          tombol('tombolArah', 'Tombol petunjuk arah', false), tombol('tombolPesan', 'Tombol kirim pesan', false),
          gambar('gambar', 'Foto gedung', '4:3'), teks('keteranganGambar', 'Keterangan foto')],
      },
      { kunci: 'footer', judul: 'Footer', bidang: [teks('tempat', 'Nama tempat ibadah di footer')] },
    ],
  },
  {
    id: 'persembahan', kelompok: 'keuangan', ikon: 'persembahan', judul: 'Persembahan', situs: '/#persembahan',
    ket: 'Ayat persembahan, tombol persembahan online, rekening, dan QRIS.',
    peran: ['bendahara'],
    bagian: [{
      kunci: 'persembahan', judul: 'Persembahan',
      bidang: [judul(), paragraf('ayat', 'Ayat'), teks('rujukan', 'Rujukan ayat'), tombol('tombol', 'Tombol persembahan online'),
        paragraf('catatan', 'Catatan'),
        daftar('rekening', 'Rekening gereja', 'Rekening', [teks('bank', 'Nama bank'), teks('nomor', 'Nomor rekening'), teks('atasNama', 'Atas nama')], 6),
        gambar('qris', 'Gambar QRIS', '1:1', 'Unggah gambar QRIS resmi gereja (PNG lebih tajam).')],
    }],
  },
  {
    id: 'khotbah', kelompok: 'multimedia', ikon: 'khotbah', judul: 'Khotbah', situs: '/#khotbah',
    ket: 'Khotbah terbaru beserta link video dan gambar sampulnya.',
    peran: ['multimedia'],
    bagian: [{
      kunci: 'khotbah', judul: 'Khotbah terbaru',
      bidang: [judul(), paragraf('teks', 'Keterangan'), tombol('tautanSemua', 'Tautan kanal YouTube'),
        daftar('daftar', 'Daftar khotbah', 'Khotbah', [teks('seri', 'Seri'), teks('judul', 'Judul khotbah'), teks('pembicara', 'Pembicara'),
          teks('nas', 'Nas Alkitab'), gambar('gambar', 'Gambar sampul', '16:9'), tautan('href', 'Link video')], 9)],
    }],
  },
  {
    id: 'jemaat-umum', kelompok: 'multimedia', ikon: 'galeri', judul: 'Foto Kehidupan Jemaat', situs: '/#jemaat',
    ket: 'Judul dan foto latar bagian Kehidupan Jemaat.',
    peran: ['multimedia', 'sekretariat'],
    bagian: [{
      kunci: 'jemaat', judul: 'Kehidupan jemaat',
      bidang: [judul(), gambar('gambarTinggi', 'Foto latar Komsel & Doa', '2:3'), gambar('gambarLebar', 'Foto latar Pelayanan & Misi', '16:9')],
    }],
  },
  {
    id: 'sosial', kelompok: 'multimedia', ikon: 'bagikan', judul: 'Media Sosial', situs: '/',
    ket: 'Tautan Instagram, YouTube, Facebook, dan TikTok di footer.',
    peran: ['multimedia'],
    bagian: [{ kunci: 'footer.sosial', judul: 'Akun media sosial', jenis: 'daftar', labelButir: 'Akun', maks: 8, butir: [teks('label', 'Nama platform'), tautan('href', 'Link profil')] }],
  },
  {
    id: 'seo', kelompok: 'multimedia', ikon: 'cari', judul: 'SEO & Berbagi Link', situs: '/',
    ket: 'Deskripsi di hasil pencarian Google, gambar saat link dibagikan, dan kode verifikasi Search Console.',
    peran: ['multimedia', 'sekretariat'],
    bagian: [{
      kunci: 'seo', judul: 'SEO',
      bidang: [
        paragraf('deskripsi', 'Deskripsi beranda', 'Sekitar 120–160 karakter. Tampil di bawah judul pada hasil pencarian Google dan saat link dibagikan.'),
        paragraf('deskripsiSiapaKami', 'Deskripsi halaman Siapa Kami'),
        gambar('gambarBerbagi', 'Gambar saat link dibagikan', '1.91:1', '1200×630 piksel. Tampil di WhatsApp, Facebook, X, dan lainnya.'),
        teks('verifikasiGoogle', 'Kode verifikasi Google Search Console', 'Tempel nilai content dari meta tag google-site-verification (atau seluruh tag-nya).'),
        teks('verifikasiBing', 'Kode verifikasi Bing Webmaster (opsional)'),
      ],
    }],
  },
  {
    id: 'langkah', kelompok: 'pembinaan', ikon: 'alkitab', judul: 'Langkah Bertumbuh', situs: '/#langkah',
    ket: 'Langkah dari pertama kali datang sampai ikut melayani.',
    peran: ['pembinaan'],
    bagian: [{
      kunci: 'langkah', judul: 'Langkah bertumbuh',
      bidang: [judul(), paragraf('teks', 'Keterangan'),
        daftar('daftar', 'Daftar langkah', 'Langkah', [judul('judul', 'Judul langkah'), paragraf('teks', 'Penjelasan'), gambar('gambar', 'Foto', '4:3')], 8)],
    }],
  },
  { id: 'sekolah-minggu', kelompok: 'komisi', ikon: 'anak', judul: 'Sekolah Minggu', situs: '/#jemaat', ket: 'Kartu Sekolah Minggu di bagian Kehidupan Jemaat.', peran: ['komisi-anak'], bagian: [keterangan('jemaat.sekolahMinggu', 'Sekolah Minggu')] },
  { id: 'pemuda', kelompok: 'komisi', ikon: 'pemuda', judul: 'Pemuda', situs: '/#jemaat', ket: 'Kartu Pemuda di bagian Kehidupan Jemaat.', peran: ['komisi-pemuda'], bagian: [keterangan('jemaat.pemuda', 'Pemuda')] },
  { id: 'komsel', kelompok: 'komisi', ikon: 'komsel', judul: 'Komsel', situs: '/#jemaat', ket: 'Kartu Komsel di bagian Kehidupan Jemaat.', peran: ['komsel'], bagian: [keterangan('jemaat.komsel', 'Komsel')] },
  { id: 'doa', kelompok: 'komisi', ikon: 'doa', judul: 'Doa & Puasa', situs: '/#jemaat', ket: 'Kartu Doa & Puasa di bagian Kehidupan Jemaat.', peran: ['doa'], bagian: [keterangan('jemaat.doa', 'Doa & Puasa')] },
  { id: 'misi', kelompok: 'komisi', ikon: 'acara', judul: 'Pelayanan & Misi', situs: '/#jemaat', ket: 'Kartu Pelayanan & Misi di bagian Kehidupan Jemaat.', peran: ['diakonia'], bagian: [keterangan('jemaat.misi', 'Pelayanan & Misi')] },
  {
    id: 'navigasi', kelompok: 'pengembang', ikon: 'menu', judul: 'Menu & Navigasi', situs: '/',
    ket: 'Menu utama di atas dan daftar halaman di footer.',
    peran: [], khusus: 'developer',
    bagian: [
      { kunci: 'menu', judul: 'Menu utama', jenis: 'daftar', labelButir: 'Menu', maks: 8, butir: [teks('label', 'Teks menu'), tautan('href', 'Tautan')] },
      { kunci: 'footer.halaman', judul: 'Daftar halaman di footer', jenis: 'daftar', labelButir: 'Tautan', maks: 12, butir: [teks('label', 'Teks'), tautan('href', 'Tautan')] },
    ],
  },
];
export const kategoriById = (id) => KATEGORI.find((k) => k.id === id);

// ---------- Hak akses ----------
export const punyaPeran = (p, id) => Boolean(p?.peran?.includes(id));
export const aksesPenuh = (p) => punyaPeran(p, 'developer') || punyaPeran(p, 'ketua');
export const bolehKelolaPengguna = aksesPenuh;
export const bolehSistem = (p) => punyaPeran(p, 'developer');

export function bolehKategori(p, kat) {
  if (!p || !kat) return false;
  if (punyaPeran(p, 'developer')) return true;
  if (kat.khusus === 'developer') return false;
  if (punyaPeran(p, 'ketua')) return true;
  return kat.peran.some((r) => punyaPeran(p, r));
}
export const kategoriUntuk = (p) => KATEGORI.filter((k) => bolehKategori(p, k));
