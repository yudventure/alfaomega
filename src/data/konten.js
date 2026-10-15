// ==========================================================
// ISI BAWAAN WEBSITE.
// Sehari-hari isi diubah lewat panel CMS di /admin; perubahan dari CMS ditimpakan di atas isi ini.
// File ini menjadi isi awal (dan cadangan bila suatu bagian belum pernah diubah di CMS).
// Yang ditandai "GANTI" masih berupa contoh.
//
// Tautan: '/siapa-kami' = halaman Siapa Kami, '/#jadwal' = bagian Jadwal di beranda.
// ==========================================================

// Sumber data gereja: bio Instagram @official.kapernaum.sorong dan poster ibadah (Juni–Juli 2026).
export const gereja = {
  nama: 'GBI Kapernaum Sorong',
  namaPendek: 'Kapernaum',
  tagline: 'Keluarga Rohani di Kota Sorong',
  // ayat yang menjelaskan lambang singa (dipakai di halaman Siapa Kami)
  ayat: '“Sesungguhnya, singa dari suku Yehuda, yaitu tunas Daud, telah menang.”',
  ayatRujukan: 'Wahyu 5:5',
};

export const menu = [
  { label: 'Siapa Kami', href: '/siapa-kami' },
  { label: 'Bertumbuh', href: '/#langkah' },
  { label: 'Jadwal', href: '/#jadwal' },
  { label: 'Khotbah', href: '/#khotbah' },
  { label: 'Jemaat', href: '/#jemaat' },
];

// ---------- BERANDA (urut dari atas ke bawah) ----------

export const hero = {
  label: 'Gereja Bethel Indonesia · Kota Sorong',
  // bagian dalam <em> ... </em> tampil emas
  judul: 'Beribadah dan <em>Bertumbuh</em><br/>Bersama Keluarga Kapernaum',
  teks: 'GBI Kapernaum Sorong adalah keluarga rohani yang bertumbuh dalam firman, doa, dan pelayanan. Siapa pun Anda, dari mana pun Anda datang, kami menantikan Anda di Ibadah Raya hari Minggu pukul 09.00 WIT.',
  tombolUtama: { label: 'Kunjungi Kami Minggu Ini', href: '#jadwal', ikon: 'lokasi' },
  tombolKedua: { label: 'Tonton Ibadah', href: '#khotbah', ikon: 'live' },
  // Foto saat ini dibuat dengan AI. GANTI dengan foto ibadah jemaat sendiri bila sudah ada.
  gambar: '/img/hero-ibadah.jpg',               // 16:9, min. 2400×1350
  gambarPonsel: '/img/hero-ibadah-ponsel.jpg',  // tegak 2:3, min. 1080×1600
};

// Bagian tepat di bawah hero: video sambutan dari pimpinan gereja
export const sambutan = {
  label: 'Sambutan',
  judul: 'Selamat Datang di <em>Kapernaum</em>',
  teks: 'Dengarkan sambutan dari gembala kami: siapa kami, apa yang kami percayai, dan bagaimana Anda dapat bertumbuh bersama keluarga Kapernaum.',
  nama: 'Nama Gembala Sidang',                    // GANTI
  jabatan: 'Gembala Sidang GBI Kapernaum Sorong', // GANTI
  // GANTI: tempel link video YouTube di sini, mis. 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
  // atau 'https://youtu.be/XXXXXXXXXXX'. Selama kosong, tampil keterangan "Video sambutan segera hadir".
  video: '',
  // Opsional: gambar sampul sendiri (16:9, mis. '/img/sambutan.jpg'). Kosong = memakai sampul dari YouTube.
  poster: '',
  tautan: { label: 'Kenali kami lebih dekat', href: '/siapa-kami' },
};

export const langkah = {
  judul: 'Langkah <em>Bertumbuh</em><br/>Bersama Kami',
  teks: 'Lima langkah sederhana dari pertama kali datang sampai ikut melayani.',
  daftar: [
    { judul: 'Datang dan <em>Beribadah</em>', teks: 'Mulailah dengan hadir di Ibadah Raya hari Minggu. Tidak perlu persiapan khusus; datang apa adanya. Tim penyambut kami akan membantu Anda menemukan tempat duduk dan mengenal lingkungan gereja.', gambar: '/img/langkah-1.jpg', tombol: { label: 'Rencanakan Kunjungan', href: '/langkah/beribadah' } },
    { judul: 'Bergabung dalam <em>Komsel</em>', teks: 'Kelompok sel adalah tempat Anda dikenal dan didoakan. Kami bertemu setiap minggu di rumah-rumah jemaat untuk belajar firman, berbagi hidup, dan saling menopang.', gambar: '/img/langkah-2.jpg', tombol: { label: 'Tentang Komsel', href: '/langkah/komsel' } },
    { judul: 'Ikuti <em>Kelas Pertumbuhan</em>', teks: 'Kelas dasar iman, pemuridan, dan keanggotaan membantu Anda memahami apa yang kami percayai dan bagaimana bertumbuh sebagai murid Kristus.', gambar: '/img/langkah-3.jpg', tombol: { label: 'Lihat Kelas', href: '/langkah/kelas' } },
    { judul: 'Dibaptis dan <em>Diteguhkan</em>', teks: 'Baptisan adalah pengakuan iman di hadapan jemaat. Kami menyiapkan kelas baptisan dan mendampingi setiap langkahnya, dari persiapan sampai hari baptisan.', gambar: '/img/langkah-4.jpg', tombol: { label: 'Tentang Baptisan', href: '/langkah/baptisan' } },
    { judul: '<em>Melayani</em> Sesuai Karunia', teks: 'Setiap orang diberi karunia untuk membangun tubuh Kristus: pujian, multimedia, anak, penyambutan, doa, atau pelayanan sosial. Temukan tempat Anda dan mulailah melayani.', gambar: '/img/langkah-5.jpg', tombol: { label: 'Bidang Pelayanan', href: '/langkah/melayani' } },
  ],
};

// ---------- HALAMAN TIAP LANGKAH (/langkah/...) ----------
// Dibuka dari tombol di kartu Langkah Bertumbuh. Bagian yang judulnya dikosongkan tidak ditampilkan.
// tombol.href '#' atau kosong = memakai tombol "Kirim Pesan" di bagian Kunjungi Kami.
// GANTI bila perlu: jadwal kelas, syarat baptisan, dan bidang pelayanan menyesuaikan kebijakan gereja.
export const halamanLangkah = {
  beribadah: {
    judul: 'Datang dan <em>Beribadah</em>',
    teks: 'Ibadah Raya setiap Minggu pukul 09.00 WIT adalah pintu masuk ke keluarga Kapernaum. Datang apa adanya; kami senang menyambut Anda.',
    gambar: '/img/langkah-1.jpg',
    pengantarJudul: 'Ibadah yang hangat dan <em>penuh sukacita</em>',
    pengantar: [
      'Ibadah Raya berlangsung sekitar dua jam: pujian dan penyembahan, doa, firman Tuhan, dan persekutuan. Pada Minggu pertama setiap bulan, ibadah disertai Perjamuan Kudus.',
      'Anak-anak beribadah di Ibadah Anak mulai pukul 09.40 WIT, di ruang yang aman dan didampingi guru-guru Sekolah Minggu, sementara orang tua beribadah dengan tenang.',
    ],
    poinJudul: 'Yang perlu <em>Anda ketahui</em>',
    poin: [
      { judul: 'Waktu', teks: 'Setiap Minggu pukul 09.00 WIT, sekitar dua jam. Datanglah 15 menit lebih awal.', ikon: 'jam' },
      { judul: 'Pakaian', teks: 'Tidak ada aturan khusus. Kenakan pakaian yang sopan dan nyaman bagi Anda.', ikon: 'pengguna' },
      { judul: 'Anak-anak', teks: 'Ibadah Anak mulai 09.40 WIT. Antar anak ke ruang anak; guru kami akan menyambut mereka.', ikon: 'anak' },
      { judul: 'Lokasi', teks: 'Gedung GBI Kapernaum, Jl. Sejahtera KM.10, Kota Sorong. Rute ada di bagian Kunjungi Kami.', ikon: 'lokasi' },
    ],
    tahapanJudul: 'Minggu <em>pertama</em> Anda',
    tahapan: [
      { judul: 'Datang lebih awal', teks: 'Tiba sekitar 08.45 WIT supaya ada waktu memarkir kendaraan dan mencari tempat duduk.' },
      { judul: 'Disambut tim penyambut', teks: 'Tim penyambut di pintu masuk menyapa Anda dan menunjukkan ruang ibadah serta ruang Ibadah Anak.' },
      { judul: 'Beribadah bersama', teks: 'Ikuti pujian, doa, dan firman Tuhan. Tidak ada yang meminta Anda maju atau berbicara di depan.' },
      { judul: 'Saling berkenalan', teks: 'Setelah ibadah, mampir ke meja penyambutan. Kami senang mengenal Anda dan menjawab pertanyaan Anda.' },
    ],
    tanyaJudul: 'Pertanyaan yang sering diajukan',
    tanya: [
      { tanya: 'Apakah saya harus menjadi anggota gereja untuk datang?', jawab: 'Tidak. Ibadah terbuka untuk siapa saja, termasuk Anda yang baru pertama kali ke gereja.' },
      { tanya: 'Bagaimana dengan persembahan?', jawab: 'Persembahan adalah bagian ibadah bagi jemaat. Sebagai tamu, Anda tidak perlu merasa wajib memberi.' },
      { tanya: 'Apakah ada ibadah selain hari Minggu?', jawab: 'Ada. Youth setiap Jumat pukul 18.00 WIT dan Menara Doa & Recharge setiap Sabtu pukul 17.00 WIT.' },
    ],
    // halaman ini sudah memuat Jadwal Ibadah & Kunjungi Kami, jadi ajakan dikosongkan
    ajakanJudul: '',
    ajakanTeks: '',
    tombol: { label: '', href: '' },
  },
  komsel: {
    judul: 'Bergabung dalam <em>Komsel</em>',
    teks: 'Gereja yang besar terasa dekat di dalam komsel. Di sinilah Anda dikenal, didoakan, dan bertumbuh bersama.',
    gambar: '/img/langkah-2.jpg',
    pengantarJudul: 'Apa itu <em>komsel</em>?',
    pengantar: [
      'Komsel (komunitas sel) adalah kelompok kecil 6 sampai 12 orang yang bertemu di rumah-rumah jemaat. Kami membaca firman, berbagi cerita hidup, dan saling mendoakan.',
      '“Mereka bertekun dalam pengajaran rasul-rasul dan dalam persekutuan. Dan mereka selalu berkumpul untuk memecahkan roti dan berdoa.” (Kisah Para Rasul 2:42)',
    ],
    poinJudul: 'Yang terjadi di <em>komsel</em>',
    poin: [
      { judul: 'Firman', teks: 'Renungan singkat dari Alkitab yang dibahas bersama dan diterapkan dalam hidup sehari-hari.', ikon: 'alkitab' },
      { judul: 'Doa', teks: 'Saling mendoakan pergumulan, pekerjaan, keluarga, dan kesehatan.', ikon: 'doa' },
      { judul: 'Persekutuan', teks: 'Makan bersama, saling mengunjungi, dan menolong ketika ada yang membutuhkan.', ikon: 'komsel' },
      { judul: 'Dekat rumah', teks: 'Komsel dibagi per wilayah di Kota Sorong supaya mudah dijangkau.', ikon: 'lokasi' },
    ],
    tahapanJudul: 'Cara <em>bergabung</em>',
    tahapan: [
      { judul: 'Hubungi kami', teks: 'Kirim pesan ke sekretariat dengan nama dan wilayah tempat tinggal Anda.' },
      { judul: 'Dikenalkan', teks: 'Kami menghubungkan Anda dengan pemimpin komsel di wilayah terdekat.' },
      { judul: 'Datang ke pertemuan', teks: 'Cukup datang dan berkenalan. Tidak perlu persiapan apa pun.' },
    ],
    tanyaJudul: 'Pertanyaan yang sering diajukan',
    tanya: [
      { tanya: 'Kapan komsel bertemu?', jawab: 'Setiap komsel menentukan harinya sendiri, biasanya sekali seminggu pada malam hari. Tanyakan jadwal komsel terdekat ke sekretariat.' },
      { tanya: 'Apakah saya harus sudah lama di gereja?', jawab: 'Tidak. Komsel justru cara terbaik untuk mengenal keluarga Kapernaum bila Anda baru datang.' },
      { tanya: 'Bagaimana kalau saya pemalu?', jawab: 'Tidak ada yang dipaksa berbicara. Anda boleh mendengarkan dulu sampai merasa nyaman.' },
    ],
    ajakanJudul: 'Temukan komsel <em>terdekat</em>',
    ajakanTeks: 'Beritahu kami wilayah tempat tinggal Anda; kami akan menghubungkan Anda dengan pemimpin komsel.',
    tombol: { label: 'Hubungi Sekretariat', href: '#' }, // GANTI: link WhatsApp koordinator komsel
  },
  kelas: {
    judul: 'Ikuti <em>Kelas Pertumbuhan</em>',
    teks: 'Kelas-kelas pembinaan menolong Anda memahami dasar iman Kristen dan bertumbuh menjadi murid Kristus.',
    gambar: '/img/langkah-3.jpg',
    pengantarJudul: 'Bertumbuh dengan <em>terarah</em>',
    pengantar: [
      'Kelas pertumbuhan diadakan beberapa kali dalam setahun dalam kelompok kecil, dipandu gembala dan tim pengajar. Materinya disusun bertahap, dari dasar iman sampai pelayanan.',
      '“Tetapi bertumbuhlah dalam kasih karunia dan dalam pengenalan akan Tuhan dan Juruselamat kita, Yesus Kristus.” (2 Petrus 3:18)',
    ],
    poinJudul: 'Kelas yang <em>tersedia</em>',
    poin: [
      { judul: 'Kelas Dasar Iman', teks: 'Siapa Allah, karya keselamatan di dalam Yesus, dan hidup baru di dalam Roh Kudus.', ikon: 'alkitab' },
      { judul: 'Kelas Baptisan', teks: 'Persiapan bagi Anda yang ingin dibaptis: arti baptisan dan komitmen mengikut Kristus.', ikon: 'baptisan' },
      { judul: 'Kelas Keanggotaan', teks: 'Mengenal Gereja Bethel Indonesia, visi GBI Kapernaum Sorong, dan peran Anda sebagai anggota jemaat.', ikon: 'komsel' },
      { judul: 'Kelas Pemuridan', teks: 'Kebiasaan rohani sehari-hari: doa, membaca Alkitab, memberi, dan membagikan iman.', ikon: 'renungan' },
    ],
    tahapanJudul: 'Cara <em>mendaftar</em>',
    tahapan: [
      { judul: 'Daftar', teks: 'Hubungi sekretariat atau isi formulir di meja penyambutan setelah ibadah.' },
      { judul: 'Ikuti kelas', teks: 'Kelas berlangsung beberapa pertemuan, biasanya setelah ibadah atau pada malam hari.' },
      { judul: 'Lanjutkan langkah', teks: 'Setelah selesai, Anda dapat melanjutkan ke baptisan atau mulai melayani.' },
    ],
    tanyaJudul: 'Pertanyaan yang sering diajukan',
    tanya: [
      { tanya: 'Apakah kelas ini berbayar?', jawab: 'Tidak. Semua kelas pertumbuhan gratis untuk jemaat dan siapa saja yang ingin belajar.' },
      { tanya: 'Kapan kelas berikutnya dimulai?', jawab: 'Jadwal kelas diumumkan di ibadah Minggu dan di Instagram gereja. Anda juga bisa menanyakannya ke sekretariat.' },
    ],
    ajakanJudul: 'Daftar kelas <em>berikutnya</em>',
    ajakanTeks: 'Sampaikan nama dan kelas yang ingin Anda ikuti; kami kabari jadwal pertemuannya.',
    tombol: { label: 'Daftar Kelas', href: '#' }, // GANTI: link WhatsApp / formulir pendaftaran
  },
  baptisan: {
    judul: 'Dibaptis dan <em>Diteguhkan</em>',
    teks: 'Baptisan air adalah langkah ketaatan dan pengakuan iman di hadapan jemaat bahwa Anda telah percaya kepada Yesus Kristus.',
    gambar: '/img/langkah-4.jpg',
    pengantarJudul: 'Arti <em>baptisan</em>',
    pengantar: [
      'Baptisan tidak menyelamatkan kita; keselamatan adalah anugerah Allah melalui iman kepada Yesus. Baptisan adalah tanda lahiriah dari perubahan di dalam hati: mati bagi hidup yang lama dan bangkit dalam hidup yang baru (Roma 6:4).',
      'Sesuai pengajaran Gereja Bethel Indonesia, baptisan dilakukan dengan cara diselamkan bagi mereka yang sudah percaya dan dapat mengaku imannya sendiri.',
    ],
    poinJudul: 'Syarat <em>baptisan</em>',
    poin: [
      { judul: 'Sudah percaya', teks: 'Telah menerima Yesus Kristus sebagai Tuhan dan Juruselamat pribadi.', ikon: 'baptisan' },
      { judul: 'Kelas baptisan', teks: 'Mengikuti seluruh pertemuan kelas persiapan baptisan.', ikon: 'alkitab' },
      { judul: 'Wawancara', teks: 'Berbincang dengan gembala tentang perjalanan iman Anda.', ikon: 'pesan' },
      { judul: 'Usia', teks: 'Remaja dan dewasa yang dapat mengaku imannya sendiri. Untuk anak-anak tersedia penyerahan anak.', ikon: 'anak' },
    ],
    tahapanJudul: 'Menuju <em>hari baptisan</em>',
    tahapan: [
      { judul: 'Daftar', teks: 'Hubungi sekretariat untuk mendaftar kelas baptisan berikutnya.' },
      { judul: 'Kelas baptisan', teks: 'Belajar arti baptisan dan hidup sebagai murid Kristus.' },
      { judul: 'Wawancara', teks: 'Bertemu gembala untuk berbagi kesaksian iman Anda.' },
      { judul: 'Hari baptisan', teks: 'Dibaptis di hadapan jemaat; keluarga dan sahabat boleh hadir menyaksikan.' },
    ],
    tanyaJudul: 'Pertanyaan yang sering diajukan',
    tanya: [
      { tanya: 'Saya sudah dibaptis percik waktu kecil. Apakah perlu dibaptis lagi?', jawab: 'Silakan bicarakan dengan gembala. Kami akan menjelaskan pengajaran gereja dan mendampingi keputusan Anda.' },
      { tanya: 'Apa yang perlu dibawa?', jawab: 'Pakaian ganti dan handuk. Pakaian untuk baptisan akan diinformasikan saat kelas.' },
      { tanya: 'Apakah saya akan menerima surat baptis?', jawab: 'Ya. Setiap orang yang dibaptis menerima surat baptis dari gereja.' },
    ],
    ajakanJudul: 'Siap mengambil <em>langkah ini</em>?',
    ajakanTeks: 'Daftarkan diri Anda untuk kelas baptisan berikutnya. Kami akan mendampingi Anda sampai hari baptisan.',
    tombol: { label: 'Daftar Baptisan', href: '#' }, // GANTI: link WhatsApp / formulir pendaftaran
  },
  melayani: {
    judul: '<em>Melayani</em> Sesuai Karunia',
    teks: 'Setiap orang diberi karunia oleh Tuhan untuk membangun jemaat. Temukan tempat Anda dan mulailah melayani bersama keluarga Kapernaum.',
    gambar: '/img/langkah-5.jpg',
    pengantarJudul: 'Dipanggil untuk <em>melayani</em>',
    pengantar: [
      '“Layanilah seorang akan yang lain, sesuai dengan karunia yang telah diperoleh tiap-tiap orang sebagai pengurus yang baik dari kasih karunia Allah.” (1 Petrus 4:10)',
      'Melayani bukan hanya untuk mereka yang tampil di depan. Ada banyak cara memberi diri: menyambut tamu, mengajar anak, mendoakan, atau menolong yang membutuhkan.',
    ],
    poinJudul: 'Bidang <em>pelayanan</em>',
    poin: [
      { judul: 'Pujian & Musik', teks: 'Pemimpin pujian, penyanyi, dan pemusik dalam ibadah.', ikon: 'pujian' },
      { judul: 'Multimedia', teks: 'Tata suara, slide, kamera, siaran langsung, dan media sosial gereja.', ikon: 'live' },
      { judul: 'Ibadah Anak', teks: 'Guru dan pendamping anak setiap hari Minggu.', ikon: 'anak' },
      { judul: 'Penyambutan', teks: 'Menyapa jemaat dan tamu, membantu tempat duduk dan informasi.', ikon: 'pengguna' },
      { judul: 'Doa', teks: 'Menara Doa & Recharge dan pelayanan doa bagi jemaat.', ikon: 'doa' },
      { judul: 'Diakonia & Misi', teks: 'Kunjungan, bakti sosial, dan dukungan bagi pekerjaan misi di Tanah Papua.', ikon: 'persembahan' },
    ],
    tahapanJudul: 'Cara <em>mulai melayani</em>',
    tahapan: [
      { judul: 'Bertumbuh dulu', teks: 'Beribadah rutin, bergabung dalam komsel, dan mengikuti kelas pertumbuhan.' },
      { judul: 'Pilih bidang', teks: 'Sampaikan bidang yang Anda minati kepada sekretariat atau pemimpin pelayanan.' },
      { judul: 'Dilatih & didampingi', teks: 'Anda dilatih dan melayani bersama tim yang sudah berpengalaman.' },
    ],
    tanyaJudul: 'Pertanyaan yang sering diajukan',
    tanya: [
      { tanya: 'Saya belum punya keahlian khusus. Bisakah saya melayani?', jawab: 'Bisa. Banyak pelayanan yang dipelajari sambil berjalan; yang terpenting adalah hati yang mau melayani.' },
      { tanya: 'Berapa banyak waktu yang dibutuhkan?', jawab: 'Tergantung bidangnya. Banyak tim melayani bergiliran sehingga tetap seimbang dengan pekerjaan dan keluarga.' },
    ],
    ajakanJudul: 'Mari melayani <em>bersama</em>',
    ajakanTeks: 'Ceritakan bidang yang Anda minati; kami akan menghubungkan Anda dengan pemimpin pelayanannya.',
    tombol: { label: 'Saya Ingin Melayani', href: '#' }, // GANTI: link WhatsApp sekretariat
  },
};

// Jadwal dari bio Instagram & poster Sunday Service. Cek ulang bila ada perubahan.
export const jadwal = {
  judul: 'Jadwal <em>Ibadah</em>',
  teks: 'Semua ibadah diadakan di gedung GBI Kapernaum, Jl. Sejahtera KM.10, Kota Sorong. Datanglah lebih awal untuk mengenal keluarga Kapernaum.',
  ringkas: 'Minggu, 09.00 WIT', // dipakai di footer
  daftar: [
    { nama: 'Ibadah Raya', waktu: 'Minggu · 09.00 WIT', ikon: 'ibadah' },
    { nama: 'Ibadah Anak', waktu: 'Minggu · 09.40 WIT', ikon: 'anak' },
    { nama: 'Youth', waktu: 'Jumat · 18.00 WIT', ikon: 'pemuda' },
    { nama: 'Menara Doa & Recharge', waktu: 'Sabtu · 17.00 WIT', ikon: 'doa' },
  ],
};

export const khotbah = {
  judul: 'Khotbah <em>Terbaru</em>',
  teks: 'Dengarkan kembali firman Tuhan dari ibadah minggu-minggu terakhir.',
  tautanSemua: { label: 'Semua khotbah di YouTube', href: '#' }, // GANTI: tautan kanal YouTube
  // GANTI: judul khotbah di bawah ini masih contoh (seri mengikuti tema "Family Restoration in Home")
  daftar: [
    { seri: 'Family Restoration · 1', judul: 'Aku dan Seisi Rumahku', pembicara: 'Gembala Sidang', nas: 'Yosua 24:15', gambar: '/img/khotbah-1.jpg', href: '#' },
    { seri: 'Family Restoration · 2', judul: 'Kasih yang Memulihkan', pembicara: 'Gembala Sidang', nas: 'Kolose 3:12–14', gambar: '/img/khotbah-2.jpg', href: '#' },
    { seri: 'Family Restoration · 3', judul: 'Rumah di Atas Batu', pembicara: 'Gembala Sidang', nas: 'Matius 7:24–27', gambar: '/img/khotbah-3.jpg', href: '#' },
  ],
};

export const jemaat = {
  judul: 'Kehidupan <em>Jemaat</em>',
  sekolahMinggu: { judul: 'Ibadah Anak', teks: 'Setiap Minggu pukul 09.40 WIT anak-anak belajar firman lewat cerita, lagu, dan permainan di ruang yang aman dan ceria.' },
  pemuda: { judul: 'Youth', teks: 'Setiap Jumat pukul 18.00 WIT generasi muda Kapernaum beribadah, bersekutu, dan berkarya bersama.' },
  komsel: { judul: 'Komsel', teks: 'Kelompok kecil yang bertemu di rumah-rumah jemaat: belajar firman, berbagi hidup, saling mendoakan.' },
  doa: { judul: 'Menara Doa & Recharge', teks: 'Setiap Sabtu pukul 17.00 WIT kami berdoa bersama dan dipulihkan sebelum memasuki hari Tuhan.' },
  misi: { judul: 'Pelayanan & Misi', teks: 'Bersama-sama menjadi berkat bagi Kota Sorong dan Tanah Papua: kunjungan, bakti sosial, dan dukungan bagi pekerjaan misi.' },
  gambarTinggi: '/img/bento-tinggi.jpg',
  gambarLebar: '/img/bento-lebar.jpg',
};

export const persembahan = {
  judul: 'Memberi dengan <em>Sukacita</em>',
  ayat: '“Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.”',
  rujukan: '2 Korintus 9:7',
  tombol: { label: 'Persembahan Online', href: '#' }, // GANTI: halaman persembahan / QRIS
  catatan: 'Transfer bank, virtual account, atau QRIS. Informasi rekening tersedia di halaman persembahan dan di sekretariat gereja.',
  // GANTI: rekening gereja, mis. { bank: 'BCA', nomor: '1234567890', atasNama: 'GBI Kapernaum Sorong' }. Kosong = tidak ditampilkan.
  rekening: [],
  qris: '', // gambar QRIS, mis. '/img/qris.png'. Kosong = tidak ditampilkan.
};

// Alamat dari poster ibadah. GANTI: WhatsApp & email sekretariat.
export const kunjungi = {
  judul: 'Kunjungi <em>Kami</em>',
  teks: 'Pertama kali datang? Datanglah 15 menit sebelum Ibadah Raya pukul 09.00 WIT. Tim penyambut kami ada di pintu masuk untuk menyapa Anda dan menunjukkan ruang ibadah, ruang anak, dan tempat parkir.',
  info: [
    { label: 'Alamat', isi: ['GBI Kapernaum Sorong', 'Jl. Sejahtera KM.10, Kota Sorong', 'Papua Barat Daya'], ikon: 'lokasi' },
    { label: 'WhatsApp sekretariat', isi: ['Nomor WhatsApp'], ikon: 'telepon' },
    { label: 'Email', isi: ['Alamat email gereja'], ikon: 'email' },
  ],
  // GANTI: tujuan rute Google Maps untuk semua tombol Petunjuk Arah: nama tempat persis seperti di Google Maps,
  // alamat lengkap, atau koordinat (mis. '-6.200000, 106.816666'). Kosong = memakai nama gereja + alamat di atas.
  tujuanPeta: '',
  // link lokasi resmi gereja (dari bio Instagram); dipakai selama tujuanPeta kosong
  tombolArah: { label: 'Petunjuk Arah', href: 'https://maps.app.goo.gl/xSUaYspkDh4NTNph9' },
  tombolPesan: { label: 'Kirim Pesan', href: '#' }, // GANTI: tautan WhatsApp, mis. https://wa.me/62...
  gambar: '/img/kunjungi.jpg', // GANTI: foto gedung gereja atau peta
  keteranganGambar: 'Lokasi gedung gereja',
};

// ---------- HALAMAN SIAPA KAMI (/siapa-kami) ----------

export const halamanSiapaKami = {
  judul: 'Siapa <em>Kami</em>',
  teks: 'Mengenal keluarga GBI Kapernaum Sorong: arti nama dan lambang kami, hal-hal yang kami hidupi, dan mereka yang melayani jemaat.',
};

// GANTI bila perlu: arti nama & lambang ditulis dari kisah Alkitab; sesuaikan dengan sejarah gereja.
export const siapaKami = {
  judul: 'Mengapa <em>Kapernaum</em>',
  paragraf: [
    'Kapernaum adalah kota di tepi Danau Galilea tempat Yesus tinggal dan memulai pelayanan-Nya (Matius 4:13–17). Di sana Ia mengajar, menyembuhkan, dan memanggil murid-murid-Nya. Namanya sendiri berarti “kampung penghiburan”.',
    'Lambang singa mengingatkan kami pada Yesus, Singa dari suku Yehuda yang telah menang. Di GBI Kapernaum Sorong kami beribadah dengan sukacita, belajar firman dengan sungguh, dan saling menopang sebagai keluarga rohani, supaya setiap orang bertumbuh dan menjadi berkat bagi Kota Sorong.',
  ],
  tautan: { label: 'Lihat langkah bertumbuh', href: '/#langkah' },
  gambar: '/img/siapa-kami.jpg', // GANTI: foto jemaat (4:3)
};

// Kosongkan `daftar: []` untuk menyembunyikan bagian ini
export const nilai = {
  judul: 'Yang Kami <em>Hidupi</em>',
  teks: 'Empat hal yang membentuk kehidupan bergereja kami setiap minggu.',
  daftar: [
    { judul: 'Ibadah', teks: 'Kami datang ke hadirat Tuhan dengan sukacita dan hati yang tulus, sebagai satu keluarga.', ikon: 'pujian' },
    { judul: 'Firman', teks: 'Kami belajar Alkitab dengan sungguh-sungguh dan membiarkannya membentuk cara kami hidup.', ikon: 'alkitab' },
    { judul: 'Komunitas', teks: 'Kami saling mengenal, menopang, dan mendoakan dalam kelompok-kelompok kecil.', ikon: 'komsel' },
    { judul: 'Menjadi Berkat', teks: 'Kami melayani sesuai karunia masing-masing dan rindu menjadi berkat bagi Kota Sorong.', ikon: 'persembahan' },
  ],
};

// GANTI: nama, jabatan, dan foto (tegak 4:5, min. 800×1000, mis. '/img/pengurus-1.jpg').
// Foto kosong = tampil lambang singa. Kosongkan `daftar: []` untuk menyembunyikan bagian ini.
export const pengurus = {
  judul: 'Gembala & <em>Pengurus</em>',
  teks: 'Mereka yang dipercaya menggembalakan dan melayani jemaat GBI Kapernaum Sorong.',
  daftar: [
    { nama: 'Nama Gembala Sidang', jabatan: 'Gembala Sidang', foto: '' },
    { nama: 'Nama Pendamping', jabatan: 'Wakil Gembala', foto: '' },
    { nama: 'Nama Pengurus', jabatan: 'Ketua Majelis', foto: '' },
  ],
};

export const ajakan = {
  judul: 'Mari Beribadah <em>Bersama</em>',
  teks: 'Kami menantikan Anda di ibadah hari Minggu. Datang apa adanya; tim penyambut kami siap menyapa Anda.',
  tombolUtama: { label: 'Jadwal Ibadah', href: '/#jadwal' },
  tombolKedua: { label: 'Petunjuk Arah', href: '/#kunjungi' },
};

// ---------- SEO & BERBAGI LINK ----------

// Tampilan di hasil pencarian Google dan saat link dibagikan (WhatsApp, Facebook, dll.)
export const seo = {
  deskripsi: 'GBI Kapernaum Sorong (Gereja Bethel Indonesia), Jl. Sejahtera KM.10, Kota Sorong. Ibadah Raya Minggu 09.00 WIT, Ibadah Anak, Youth, dan Menara Doa. Mari beribadah bersama kami.',
  deskripsiSiapaKami: 'Mengenal GBI Kapernaum Sorong: arti nama dan lambang singa kami, nilai-nilai yang kami hidupi, serta gembala dan pengurus yang melayani jemaat.',
  gambarBerbagi: '/og/og-beranda.jpg', // 1200×630
  verifikasiGoogle: '', // kode dari Google Search Console (meta tag google-site-verification)
  verifikasiBing: '',
};

// ---------- FOOTER (semua halaman) ----------

export const footer = {
  halaman: [
    { label: 'Beranda', href: '/' },
    { label: 'Siapa Kami', href: '/siapa-kami' },
    { label: 'Langkah Bertumbuh', href: '/#langkah' },
    { label: 'Jadwal Ibadah', href: '/#jadwal' },
    { label: 'Khotbah', href: '/#khotbah' },
    { label: 'Kehidupan Jemaat', href: '/#jemaat' },
    { label: 'Persembahan', href: '/#persembahan' },
  ],
  // Akun yang link-nya masih '#' tidak ditampilkan. Instagram dari profil resmi; Facebook dari poster (@kapernaum.soq).
  sosial: [
    { label: 'Instagram', href: 'https://www.instagram.com/official.kapernaum.sorong/' },
    { label: 'Facebook', href: 'https://www.facebook.com/kapernaum.soq' },
    { label: 'YouTube', href: '#' }, // GANTI: link kanal YouTube
    { label: 'TikTok', href: '#' },  // GANTI: link akun TikTok
  ],
  tempat: 'Jl. Sejahtera KM.10, Kota Sorong',
};
