# GBI Kapernaum Sorong

Website GBI Kapernaum Sorong — Gereja Bethel Indonesia, Jl. Sejahtera KM.10, Kota Sorong (**React + Vite + Tailwind CSS v4**, disajikan oleh Express) dengan **CMS berbasis peran** di `/admin`, sekaligus paket identitas brandnya:
logo, warna, font, aset media sosial, mockup merchandise, dan 10 referensi website gereja.

## Website (aplikasi di root repo)

```bash
npm install
npm run dev      # pengembangan: http://localhost:5173
npm run build    # hasil ke dist/
npm start        # server produksi (Express) menyajikan dist/, port dari $PORT atau 3000
```

| Bagian | File |
|---|---|
| **Isi website sehari-hari** (teks, jadwal, foto, video sambutan, rekening) | panel **CMS di `/admin`** (lihat bagian CMS di bawah) |
| Isi bawaan (isi awal sebelum diubah di CMS) | `src/data/konten.js` |
| Kategori CMS, peran, dan hak aksesnya | `src/cms/skema.js` |
| Panel CMS / API CMS | `src/admin/` / `server/` |
| Daftar halaman (`/` beranda, `/siapa-kami`, `/langkah/beribadah` · `komsel` · `kelas` · `baptisan` · `melayani`) | `src/App.jsx` (`RUTE`) + `src/cms/halaman.js`; isi tiap halaman di `src/halaman/` |
| Komponen bagian | `src/components/` (Hero, Nav, Sambutan, VideoYouTube, Langkah, Jadwal, KalenderKegiatan, Khotbah, Jemaat, Persembahan, Kunjungi, KepalaHalaman, SiapaKami, Nilai, Pengurus, Ajakan, Footer) |
| Foto bawaan (dibuat dengan AI, ganti dengan foto jemaat sendiri lewat CMS) | `public/img/` |
| Token brand Tailwind (warna, font, radius) & @font-face | `src/index.css` (blok `@theme`) |
| Font, favicon, logo | `public/` |
| Server produksi | `server.js` |
| Meta tag & og:image (ganti `DOMAIN-GEREJA`) | `index.html` |

### Deploy di Hostinger (Node.js, metode Git)

1. hPanel → **Websites → Add website → Node.js** (butuh paket Business/Cloud), pilih **Deploy from GitHub**, lalu pilih repo `yudventure/alfaomega` dan branch yang dipakai.
2. Pengaturan build:
   - **Node version**: **22.x** (disarankan). Vite 8 butuh Node 20.19+ atau 22.12+; jangan pakai 18.x
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Entry file / start command**: `server.js` (`npm start`)
   - **Variabel lingkungan**: lihat bagian *Pengaturan lingkungan* di bawah. Minimal isi `CMS_KODE_SETUP` dan `DATA_DIR`.
3. Deploy. Setiap `git push` ke branch tersebut akan men-deploy ulang.
4. Setelah deploy, buka **`https://domain-anda/sehat`**: nilai `commit` harus sama dengan commit terakhir di GitHub.
   Kalau masih commit lama, deploy belum jalan/gagal (lihat log deploy di hPanel).
5. Bila memakai **CDN Hostinger**, klik *Flush cache* sekali setelah deploy pertama versi ini.

`server.js` juga menjalankan `npm run build` sendiri bila `dist/` belum ada, jadi aman kalau hosting hanya menjalankan `npm install` lalu `npm start`.

### CMS (`/admin`)

Panel untuk mengubah isi website tanpa menyentuh kode. Setiap pengguna hanya bisa mengubah bagian sesuai perannya
dalam struktur pelayanan gereja; **Ketua/Gembala Sidang** dan **Developer** dapat mengakses semua peran.

**Mulai pertama kali**
1. Buka `https://domain-anda/admin`.
2. Masukkan **kode setup** (`CMS_KODE_SETUP`; bila tidak diatur, kode dibuat otomatis di `DATA_DIR/kode-setup.txt` dan dicetak di log server), lalu buat akun developer.
3. Di **Pengguna & Peran**, tambahkan akun untuk ketua, sekretariat, bendahara, multimedia, dan komisi.
4. Di **Kontak & Lokasi**, isi **Tujuan di Google Maps** (nama tempat persis seperti di Google Maps, alamat lengkap, atau koordinat).
   Semua tombol **Petunjuk Arah** (bagian Kunjungi Kami dan footer) langsung membuka rute ke tujuan itu di Google Maps
   (di ponsel terbuka di aplikasi Maps). Selama kosong, rute memakai nama gereja + alamat.

Pengurus bisa masuk lewat tombol **Login Admin** di bagian paling bawah footer. Logo media sosial di footer dipilih otomatis
dari nama platform atau link profil (Instagram, YouTube, Facebook, TikTok, WhatsApp, X, Threads, Spotify, Telegram).

| Peran | Kategori yang dapat diubah |
|---|---|
| **Developer** | Semua isi + menu & navigasi, pengguna, cadangan & sistem |
| **Ketua / Gembala Sidang** | Semua isi + kelola pengguna (tidak dapat memberi peran Developer) |
| Sekretariat | Halaman depan, jadwal ibadah, **kalender kegiatan**, profil gereja (Siapa Kami), gembala & pengurus, kontak & lokasi, foto kehidupan jemaat, SEO & berbagi link, halaman Datang & Beribadah |
| Bendahara | Persembahan: tombol online, **rekening** (dengan tombol salin) dan **QRIS** |
| Multimedia | Sambutan gembala (video YouTube), halaman depan, khotbah, foto kehidupan jemaat, media sosial, SEO & berbagi link |
| Pembinaan & Pengajaran | Langkah bertumbuh (termasuk tombol tiap kartu) dan kelima halaman langkah: Datang & Beribadah, Komsel, Kelas Pertumbuhan, Baptisan, Melayani |
| Komisi Sekolah Minggu / Pemuda / Koordinator Komsel / Pelayanan Doa / Misi & Diakonia | Kartu masing-masing di bagian Kehidupan Jemaat (Koordinator Komsel juga halaman Komsel) |

**Halaman tiap langkah.** Setiap kartu Langkah Bertumbuh di beranda punya tombol ke halamannya sendiri (`/langkah/...`):
pengantar, kartu poin, tahapan "cara bergabung", tanya jawab, ajakan, dan tautan ke langkah sebelum/sesudahnya; halaman
Datang & Beribadah juga memuat Jadwal Ibadah dan Kunjungi Kami. Isinya diubah di CMS → Pembinaan → *Halaman …*;
kosongkan judul sebuah bagian untuk menyembunyikannya. Tombol ajakan dengan link `#` otomatis memakai tombol *Kirim Pesan* di Kontak & Lokasi.

**Kalender kegiatan.** Di bawah Jadwal Ibadah ada kalender setahun (`/#kalender`): kalender bulanan di kiri, rincian
tanggal yang dipilih dan daftar agenda sebulan di kanan. "Hari ini" mengikuti WIT. Isinya diubah di CMS → Sekretariat →
*Kalender Kegiatan*: **agenda** (tanggal mulai/selesai, jam, tempat), **agenda rutin bulanan** (mis. Perjamuan Kudus tiap
Minggu pertama), dan **hari raya & libur** (gerejawi, nasional, cuti bersama, daerah; menentukan warna tanggal). Ibadah
mingguan otomatis diambil dari Jadwal Ibadah, jadi tidak perlu dimasukkan lagi. Kalender bisa dijelajahi dari tahun ini
sampai tahun terakhir yang punya agenda; tambahkan agenda tahun depan di CMS bila programnya sudah ada.

Fitur: formulir per kategori (judul dengan `*kata*` untuk warna emas), unggah foto (otomatis diperkecil maks. 2400 px),
pustaka media, peringatan bila meninggalkan perubahan yang belum disimpan, deteksi bentrok bila dua orang menyimpan kategori yang sama,
riwayat aktivitas, **60 versi otomatis** yang bisa dipulihkan (ketua & developer), serta unduh/pulihkan cadangan (developer).

**Penyimpanan.** Tidak perlu database: isi, pengguna, log, versi, dan foto unggahan disimpan sebagai berkas di `DATA_DIR`
(bawaan `~/alfaomega-data`; nama folder dari sebelum rebranding sengaja dipertahankan agar data yang sudah ada tetap terbaca). Atur `DATA_DIR` ke folder di luar folder aplikasi agar tidak ikut terhapus saat deploy ulang,
dan unduh cadangan secara berkala dari menu **Sistem & Cadangan**.

**Keamanan.** Kata sandi di-hash dengan scrypt; sesi berupa cookie HttpOnly bertanda tangan (12 jam, otomatis tidak berlaku saat sandi diganti);
5 kali salah masuk mengunci 15 menit; setiap permintaan API wajib header khusus (pelindung CSRF); semua isi dibersihkan di server
(judul hanya boleh `<em>`/`<br>`, tautan `javascript:` ditolak, unggahan dicek benar-benar JPG/PNG/WebP); hak akses dicek ulang di server untuk setiap perubahan.

**Pengembangan lokal:** jalankan `npm start` (server + API di port 3000) dan `npm run dev` bersamaan; Vite meneruskan `/api` dan `/media` ke port 3000.

### Pengaturan lingkungan (`.env`)

Semua variabel didefinisikan di satu tempat, `server/konfigurasi.js`, dan dirangkum di **[`.env.example`](.env.example)**.
Setiap kali variabel ditambah/diubah di kode, jalankan `npm run env:contoh` agar `.env.example` ikut diperbarui.

| Variabel | Untuk apa | Bisa diubah dari CMS |
|---|---|---|
| `SITE_URL` | Alamat utama (sitemap, tautan kanonik, gambar berbagi, tautan email). Kosong = alamat yang sedang diakses | ✓ |
| `DATA_DIR` | Folder data CMS, **di luar** folder aplikasi | |
| `CMS_KODE_SETUP` | Kode membuat akun developer pertama | |
| `SESSION_SECRET` | Kunci sesi masuk (opsional, dibuat otomatis) | |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Server email untuk OTP & pemberitahuan | ✓ |
| `MAIL_FROM`, `MAIL_BALAS` | Pengirim dan alamat balasan email | ✓ |
| `PORT` | Port server (biasanya dari Hostinger) | |

Nilai dibaca dengan urutan prioritas:
1. **Panel hosting** (hPanel → Node.js → Environment variables), tidak bisa ditimpa dari CMS.
2. **`DATA_DIR/.env`**: ditulis ulang **otomatis setiap kali** developer menyimpan perubahan di **CMS → Sistem & Cadangan → Pengaturan lingkungan**
   (versi sebelumnya disimpan sebagai `.env.sebelumnya`, izin berkas 600) dan langsung berlaku tanpa restart.
3. **`.env` di folder aplikasi**: dibuat manual (salin dari `.env.example`, mis. lewat File Manager).

Berkas `.env` asli tidak pernah masuk Git (`.gitignore`), karena bisa berisi kata sandi.

### Email otomatis (OTP lupa kata sandi)

Di halaman masuk CMS ada **"Lupa kata sandi?"**: pengguna memasukkan email, menerima **kode OTP 6 angka** (berlaku 10 menit),
lalu membuat kata sandi baru dan langsung masuk. Setelah itu dikirim juga email pemberitahuan bahwa kata sandi diubah.
Pengamanan: maks. 5 kode per jam per email (jeda 60 detik), maks. 5 kali salah per kode, kode hanya bisa dipakai sekali,
semua sesi lama otomatis keluar, dan respons selalu sama sehingga tidak bisa dipakai menebak email mana yang terdaftar.

Saat menambah pengguna, ketua/developer juga bisa mengirim **email pemberitahuan akun** (tanpa kata sandi).

Mengaktifkan email (developer, **CMS → Sistem & Cadangan**):
1. Buat akun email di hPanel → **Emails**, mis. `noreply@domain-anda`.
2. Isi `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER=noreply@domain-anda`, `SMTP_PASS=` kata sandi email itu,
   dan `MAIL_FROM=GBI Kapernaum Sorong <noreply@domain-anda>`. (Gmail: `smtp.gmail.com`, port 465, pakai *App Password*.)
3. Klik **Kirim email uji**.

### SEO & berbagi link

- **`/sitemap.xml`** dan **`/robots.txt`** dibuat otomatis memakai `SITE_URL` (kalau kosong: alamat yang sedang diakses),
  jadi tetap benar di domain uji sekarang dan langsung ikut berganti saat domain gereja dipasang. `lastmod` mengikuti perubahan terakhir di CMS.
- Server menyisipkan per halaman: judul, deskripsi, tautan kanonik, Open Graph & Twitter Card (gambar saat link dibagikan di WhatsApp/Facebook),
  serta data terstruktur **schema.org/Church** (nama, alamat, kontak, media sosial; data contoh yang belum diganti tidak ikut).
- Deskripsi, gambar berbagi (1200×630), dan kode verifikasi **Google Search Console**/Bing diatur di **CMS → SEO & Berbagi Link**.
- Setelah domain final aktif: isi `SITE_URL`, verifikasi situs di Google Search Console, lalu kirim `https://domain-anda/sitemap.xml`.
- Halaman yang tidak ada menjawab status 404; `/alamat/` dialihkan (301) ke `/alamat`; panel `/admin` tidak diindeks.

### Gambar & cache

Alamat foto & logo bawaan diberi penanda versi otomatis (`/img/langkah-1.jpg?v=…`, dari sidik isi folder `public/img`, `public/og`, `public/logo`).
Setiap kali foto diganti, alamatnya berubah sehingga browser dan CDN langsung mengambil foto baru, sementara foto yang sama
tetap di-cache lama (cepat). Foto unggahan CMS selalu bernama baru. Halaman HTML tidak di-cache, jadi isi CMS langsung tampil.

### Produksi

Kompresi gzip/brotli; header keamanan (Content-Security-Policy dengan nonce, HSTS di HTTPS, X-Frame-Options, Referrer-Policy,
Permissions-Policy); foto hero dimuat lebih awal (preload); penahan galat agar halaman tidak kosong bila satu bagian gagal;
**`/sehat`** untuk cek versi yang berjalan; server berhenti dengan rapi saat hosting me-restart.

### Keamanan dependensi

- Build memakai **Vite 8** (Rolldown), jadi tidak ada lagi `esbuild` di pohon dependensi. `package.json` juga memuat
  `"overrides": { "esbuild": "^0.28.1" }` sebagai pengaman bila suatu paket menariknya kembali.
- `.github/dependabot.yml` memeriksa pembaruan npm setiap Senin dan membuka pull request otomatis.
  Aktifkan juga **Settings → Code security → Dependabot alerts & security updates** di GitHub supaya tambalan keamanan dibuat seketika.
- Cek manual kapan saja: `npm audit`.

Dokumen Hostinger: [How to add a Node.js web app](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

## Identitas brand

**Mulai dari sini:** buka [`brand/panduan-brand-kapernaum.pdf`](brand/panduan-brand-kapernaum.pdf) (25 halaman, A4 lanskap) untuk dibagikan atau dicetak,
atau [`brand/panduan-brand.html`](brand/panduan-brand.html) di browser untuk versi interaktif.

### Ringkasan brand

| | |
|---|---|
| **Logo** | Lambang singa emas dalam cincin di piringan hitam (Singa dari suku Yehuda, Wahyu 5:5), divektorkan dari logo asli; tulisan KAPERNAUM / SORONG |
| **Nama** | GBI Kapernaum Sorong · Gereja Bethel Indonesia, Jl. Sejahtera KM.10, Kota Sorong |
| **Warna inti** | Hitam Malam `#121212` · Emas Singa `#C89C4A` (diambil dari logo) · Putih Gading `#F6F1E7` |
| **Warna pendukung** | Emas Tua `#94702B` · Emas Muda `#E8CB86` · Arang `#2A2826` · Abu Batu `#8A8378` · Krem `#FFFCF6` |
| **Font** | Plus Jakarta Sans ExtraBold (logo & judul kapital) · Cormorant Garamond (headline & ayat) · Plus Jakarta Sans (teks & UI) |

### Isi folder

```
src/, public/, server/, index.html, server.js   aplikasi website + CMS (lihat di atas)
brand/
├── panduan-brand-kapernaum.pdf    panduan brand untuk dibagikan / dicetak
├── panduan-brand.html   panduan brand interaktif (buka di browser)
├── logo/svg/            28 logo vektor: lambang, horizontal, horizontal-ringkas, bertumpuk,
│                        bertumpuk-lengkap, wordmark × warna / hitam / emas / emas-gading / putih
├── logo/png/            versi PNG transparan
├── logo/asli/           logo asli singa (arsip, sumber vektorisasi)
├── fonts/               file TTF + lisensi OFL (gratis, boleh untuk komersial)
├── media-sosial/        instagram/ facebook/ youtube/ tiktok/ alternatif/
├── web/                 kit website siap pakai (lihat brand/web/README.md): favicon, logo, 29 ikon,
│                        gambar share per halaman, latar hero, pola, placeholder, loader, font WOFF2, CSS
└── mockup/              kaos hitam, kaos putih, jaket bomber, bendera, umbul-umbul
referensi-website/       10 referensi website gereja + 3 arah desain + fitur wajib
tools/                   skrip untuk membuat ulang semua aset brand
```

#### File mana untuk apa

| Kebutuhan | File |
|---|---|
| Foto profil Instagram / Facebook / TikTok | `brand/media-sosial/<platform>/profil-*-1080x1080.png` |
| Foto profil YouTube | `brand/media-sosial/youtube/profil-youtube-800x800.png` |
| Banner YouTube | `brand/media-sosial/youtube/banner-youtube-2560x1440.png` |
| Sampul Facebook | `brand/media-sosial/facebook/sampul-facebook-1640x624.png` |
| Sorotan (highlight) Instagram | `brand/media-sosial/instagram/highlight-*.png` |
| Kit aset website lain (ikon, og, hero, CSS token) | `brand/web/` (panduan: `brand/web/README.md`) |
| Kirim ke percetakan / konveksi | `brand/logo/svg/*.svg` (vektor) |
| Desain di Canva | unggah PNG dari `brand/logo/png/` dan font dari `brand/fonts/` |

Instagram dan TikTok tidak punya banner profil, jadi untuk keduanya disediakan sampul sorotan, template post/story, dan sampul video.

### Membuat ulang aset

Semua gambar dihasilkan dari kode, jadi warna, teks, atau ukuran bisa diubah lalu dirender ulang:

```bash
pip install numpy scipy pillow potracer uharfbuzz fonttools brotli
npm install playwright        # memakai Chromium
python3 tools/build_mark.py   # lambang singa dari logo asli -> tools/mark.json
python3 tools/build_logos.py  # logo SVG
node tools/render.mjs         # semua PNG/JPG (logo, web, media sosial, mockup)
python3 tools/build_web.py    # kit website: SVG, ikon, font WOFF2, WebP, contoh.html
python3 tools/build_panduan.py # halaman HTML
node tools/build_pdf.mjs       # PDF A4 lanskap
python3 tools/build_react_assets.py  # ikon & lambang untuk komponen React
python3 tools/sync_public.py  # salin favicon, logo, gambar share, font ke public/
```

`node tools/render.mjs "youtube"` hanya merender aset yang path-nya cocok dengan pola tersebut.
