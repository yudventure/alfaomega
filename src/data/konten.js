// ==========================================================
// SEMUA ISI WEBSITE ADA DI FILE INI.
// Ganti teks, jam, alamat, dan tautan di sini; tampilan akan mengikuti.
// Yang ditandai "GANTI" masih berupa contoh.
// ==========================================================

export const gereja = {
  nama: 'Gereja Alfa Omega',
  namaPendek: 'Alfa Omega',
  tagline: 'Yang Awal dan Yang Akhir',
  ayat: '“Aku adalah Alfa dan Omega, Yang Pertama dan Yang Terkemudian, Yang Awal dan Yang Akhir.”',
  ayatRujukan: 'Wahyu 22:13',
};

export const menu = [
  { label: 'Siapa Kami', href: '#siapa' },
  { label: 'Bertumbuh', href: '#langkah' },
  { label: 'Jadwal', href: '#jadwal' },
  { label: 'Khotbah', href: '#khotbah' },
  { label: 'Jemaat', href: '#jemaat' },
];

export const hero = {
  label: 'Wahyu 22:13 · Yang Awal dan Yang Akhir',
  // bagian dalam <em> ... </em> tampil emas
  judul: 'Beribadah dan <em>Bertumbuh</em><br/>Bersama Keluarga Alfa Omega',
  teks: 'Gereja Alfa Omega adalah keluarga orang percaya yang bertumbuh dalam firman, doa, dan pelayanan. Siapa pun Anda, dari mana pun Anda datang, kami menantikan Anda hari Minggu ini.',
  tombolUtama: { label: 'Kunjungi Kami Minggu Ini', href: '#jadwal', ikon: 'lokasi' },
  tombolKedua: { label: 'Tonton Ibadah', href: '#khotbah', ikon: 'live' },
  // Foto saat ini dibuat dengan AI. GANTI dengan foto ibadah jemaat sendiri bila sudah ada.
  gambar: '/img/hero-ibadah.jpg',               // 16:9, min. 2400×1350
  gambarPonsel: '/img/hero-ibadah-ponsel.jpg',  // tegak 2:3, min. 1080×1600
};

export const siapaKami = {
  judul: 'Siapa <em>Kami</em>',
  paragraf: [
    'Nama kami diambil dari Wahyu 22:13. Kami percaya Kristus adalah awal dan akhir dari segala sesuatu, termasuk hidup setiap orang yang datang ke rumah ini.',
    'Di Alfa Omega kami beribadah dengan sukacita, belajar firman dengan sungguh, dan saling menopang dalam komunitas kecil, supaya setiap orang bertumbuh dan menjadi berkat bagi kota ini.',
  ],
  tautan: { label: 'Lihat langkah bertumbuh', href: '#langkah' },
  gambar: '/img/siapa-kami.jpg', // GANTI: foto jemaat (4:3)
};

export const langkah = {
  judul: 'Langkah <em>Bertumbuh</em><br/>Bersama Kami',
  teks: 'Lima langkah sederhana dari pertama kali datang sampai ikut melayani.',
  daftar: [
    { judul: 'Datang dan <em>Beribadah</em>', teks: 'Mulailah dengan hadir di Ibadah Raya hari Minggu. Tidak perlu persiapan khusus; datang apa adanya. Tim penyambut kami akan membantu Anda menemukan tempat duduk dan mengenal lingkungan gereja.', gambar: '/img/langkah-1.jpg' },
    { judul: 'Bergabung dalam <em>Komsel</em>', teks: 'Kelompok sel adalah tempat Anda dikenal dan didoakan. Kami bertemu setiap minggu di rumah-rumah jemaat untuk belajar firman, berbagi hidup, dan saling menopang.', gambar: '/img/langkah-2.jpg' },
    { judul: 'Ikuti <em>Kelas Pertumbuhan</em>', teks: 'Kelas dasar iman, pemuridan, dan keanggotaan membantu Anda memahami apa yang kami percayai dan bagaimana bertumbuh sebagai murid Kristus.', gambar: '/img/langkah-3.jpg' },
    { judul: 'Dibaptis dan <em>Diteguhkan</em>', teks: 'Baptisan adalah pengakuan iman di hadapan jemaat. Kami menyiapkan kelas baptisan dan mendampingi setiap langkahnya, dari persiapan sampai hari baptisan.', gambar: '/img/langkah-4.jpg' },
    { judul: '<em>Melayani</em> Sesuai Karunia', teks: 'Setiap orang diberi karunia untuk membangun tubuh Kristus: pujian, multimedia, anak, penyambutan, doa, atau pelayanan sosial. Temukan tempat Anda dan mulailah melayani.', gambar: '/img/langkah-5.jpg' },
  ],
};

// GANTI: jadwal di bawah ini masih contoh
export const jadwal = {
  judul: 'Jadwal <em>Ibadah</em>',
  teks: 'Semua ibadah diadakan di gedung gereja. Datanglah lebih awal untuk mengenal keluarga Alfa Omega.',
  ringkas: '07.00 & 10.00 WIB', // dipakai di footer
  daftar: [
    { nama: 'Ibadah Raya 1', waktu: 'Minggu · 07.00 WIB', ikon: 'ibadah' },
    { nama: 'Ibadah Raya 2', waktu: 'Minggu · 10.00 WIB', ikon: 'ibadah' },
    { nama: 'Sekolah Minggu', waktu: 'Minggu · 10.00 WIB', ikon: 'anak' },
    { nama: 'Persekutuan Doa', waktu: 'Rabu · 19.00 WIB', ikon: 'doa' },
  ],
};

export const khotbah = {
  judul: 'Khotbah <em>Terbaru</em>',
  teks: 'Dengarkan kembali firman Tuhan dari ibadah minggu-minggu terakhir.',
  tautanSemua: { label: 'Semua khotbah di YouTube', href: '#' }, // GANTI: tautan kanal YouTube
  daftar: [
    { seri: 'Seri Kitab Wahyu · 1', judul: 'Yang Awal dan Yang Akhir', pembicara: 'Gembala Sidang', nas: 'Wahyu 22:13', gambar: '/img/khotbah-1.jpg', href: '#' },
    { seri: 'Seri Kitab Wahyu · 2', judul: 'Kasih yang Mula-mula', pembicara: 'Gembala Sidang', nas: 'Wahyu 2:1–7', gambar: '/img/khotbah-2.jpg', href: '#' },
    { seri: 'Seri Kitab Wahyu · 3', judul: 'Setia Sampai Akhir', pembicara: 'Gembala Sidang', nas: 'Wahyu 2:8–11', gambar: '/img/khotbah-3.jpg', href: '#' },
  ],
};

export const jemaat = {
  judul: 'Kehidupan <em>Jemaat</em>',
  sekolahMinggu: { judul: 'Sekolah Minggu', teks: 'Anak-anak belajar firman lewat cerita, lagu, dan permainan di ruang yang aman dan ceria.' },
  pemuda: { judul: 'Pemuda', teks: 'Ibadah pemuda, persekutuan, dan kegiatan kreatif untuk generasi muda bertumbuh bersama.' },
  komsel: { judul: 'Komsel', teks: 'Kelompok kecil yang bertemu setiap minggu di rumah-rumah jemaat: belajar firman, berbagi hidup, saling mendoakan.' },
  doa: { judul: 'Doa & Puasa', teks: 'Persekutuan doa mingguan dan doa puasa bersama pada momen-momen khusus sepanjang tahun.' },
  misi: { judul: 'Pelayanan & Misi', teks: 'Bersama-sama menjadi berkat bagi kota: kunjungan, bakti sosial, dan dukungan bagi pekerjaan misi.' },
  gambarTinggi: '/img/bento-tinggi.jpg',
  gambarLebar: '/img/bento-lebar.jpg',
};

export const persembahan = {
  judul: 'Memberi dengan <em>Sukacita</em>',
  ayat: '“Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.”',
  rujukan: '2 Korintus 9:7',
  tombol: { label: 'Persembahan Online', href: '#' }, // GANTI: halaman persembahan / QRIS
  catatan: 'Transfer bank, virtual account, atau QRIS. Informasi rekening tersedia di halaman persembahan dan di sekretariat gereja.',
};

// GANTI: alamat & kontak
export const kunjungi = {
  judul: 'Kunjungi <em>Kami</em>',
  teks: 'Pertama kali datang? Datanglah 15 menit lebih awal. Tim penyambut kami ada di pintu masuk untuk menyapa Anda dan menunjukkan ruang ibadah, ruang anak, dan tempat parkir.',
  info: [
    { label: 'Alamat', isi: ['Gedung Gereja Alfa Omega', 'Nama jalan, kota'], ikon: 'lokasi' },
    { label: 'WhatsApp sekretariat', isi: ['Nomor WhatsApp'], ikon: 'telepon' },
    { label: 'Email', isi: ['Alamat email gereja'], ikon: 'email' },
  ],
  tombolArah: { label: 'Petunjuk Arah', href: '#' }, // GANTI: tautan Google Maps
  tombolPesan: { label: 'Kirim Pesan', href: '#' }, // GANTI: tautan WhatsApp, mis. https://wa.me/62...
  gambar: '/img/kunjungi.jpg', // GANTI: foto gedung gereja atau peta
  keteranganGambar: 'Lokasi gedung gereja',
};

export const footer = {
  halaman: [
    { label: 'Siapa Kami', href: '#siapa' },
    { label: 'Langkah Bertumbuh', href: '#langkah' },
    { label: 'Jadwal Ibadah', href: '#jadwal' },
    { label: 'Khotbah', href: '#khotbah' },
    { label: 'Kehidupan Jemaat', href: '#jemaat' },
    { label: 'Persembahan', href: '#persembahan' },
  ],
  // GANTI: tautan media sosial
  sosial: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'TikTok', href: '#' },
  ],
  tempat: 'Gedung Gereja Alfa Omega',
};
