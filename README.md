# Gereja Alfa Omega

Website Gereja Alfa Omega (**React + Vite + Tailwind CSS v4**, disajikan oleh Express) dengan **CMS berbasis peran** di `/admin`, sekaligus paket identitas brandnya:
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
| Daftar halaman (`/` beranda, `/siapa-kami`) | `src/App.jsx` (`RUTE`); isi tiap halaman di `src/halaman/` |
| Komponen bagian | `src/components/` (Hero, Nav, Sambutan, VideoYouTube, Langkah, Jadwal, Khotbah, Jemaat, Persembahan, Kunjungi, KepalaHalaman, SiapaKami, Nilai, Pengurus, Ajakan, Footer) |
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
   - **Variabel lingkungan** (Environment variables), disarankan:
     - `CMS_KODE_SETUP` = kode bebas pilihan Anda, dipakai sekali untuk membuat akun CMS pertama
     - `DATA_DIR` = folder data CMS **di luar** folder aplikasi, mis. `/home/uXXXXXXX/alfaomega-data` (lihat File Manager untuk path home Anda)
     - `SESSION_SECRET` (opsional) = teks acak panjang; bila kosong dibuat otomatis di folder data
     - `PORT` disediakan Hostinger; bila tidak ada, server memakai 3000
3. Deploy. Setiap `git push` ke branch tersebut akan men-deploy ulang.

`server.js` juga menjalankan `npm run build` sendiri bila `dist/` belum ada, jadi aman kalau hosting hanya menjalankan `npm install` lalu `npm start`.

### CMS (`/admin`)

Panel untuk mengubah isi website tanpa menyentuh kode. Setiap pengguna hanya bisa mengubah bagian sesuai perannya
dalam struktur pelayanan gereja; **Ketua/Gembala Sidang** dan **Developer** dapat mengakses semua peran.

**Mulai pertama kali**
1. Buka `https://domain-anda/admin`.
2. Masukkan **kode setup** (`CMS_KODE_SETUP`; bila tidak diatur, kode dibuat otomatis di `DATA_DIR/kode-setup.txt` dan dicetak di log server), lalu buat akun developer.
3. Di **Pengguna & Peran**, tambahkan akun untuk ketua, sekretariat, bendahara, multimedia, dan komisi.

| Peran | Kategori yang dapat diubah |
|---|---|
| **Developer** | Semua isi + menu & navigasi, pengguna, cadangan & sistem |
| **Ketua / Gembala Sidang** | Semua isi + kelola pengguna (tidak dapat memberi peran Developer) |
| Sekretariat | Halaman depan, jadwal ibadah, profil gereja (Siapa Kami), gembala & pengurus, kontak & lokasi, foto kehidupan jemaat |
| Bendahara | Persembahan: tombol online, **rekening** (dengan tombol salin) dan **QRIS** |
| Multimedia | Sambutan gembala (video YouTube), halaman depan, khotbah, foto kehidupan jemaat, media sosial |
| Pembinaan & Pengajaran | Langkah bertumbuh |
| Komisi Sekolah Minggu / Pemuda / Koordinator Komsel / Pelayanan Doa / Misi & Diakonia | Kartu masing-masing di bagian Kehidupan Jemaat |

Fitur: formulir per kategori (judul dengan `*kata*` untuk warna emas), unggah foto (otomatis diperkecil maks. 2400 px),
pustaka media, peringatan bila meninggalkan perubahan yang belum disimpan, deteksi bentrok bila dua orang menyimpan kategori yang sama,
riwayat aktivitas, **60 versi otomatis** yang bisa dipulihkan (ketua & developer), serta unduh/pulihkan cadangan (developer).

**Penyimpanan.** Tidak perlu database: isi, pengguna, log, versi, dan foto unggahan disimpan sebagai berkas di `DATA_DIR`
(bawaan `~/alfaomega-data`). Atur `DATA_DIR` ke folder di luar folder aplikasi agar tidak ikut terhapus saat deploy ulang,
dan unduh cadangan secara berkala dari menu **Sistem & Cadangan**.

**Keamanan.** Kata sandi di-hash dengan scrypt; sesi berupa cookie HttpOnly bertanda tangan (12 jam, otomatis tidak berlaku saat sandi diganti);
5 kali salah masuk mengunci 15 menit; setiap permintaan API wajib header khusus (pelindung CSRF); semua isi dibersihkan di server
(judul hanya boleh `<em>`/`<br>`, tautan `javascript:` ditolak, unggahan dicek benar-benar JPG/PNG/WebP); hak akses dicek ulang di server untuk setiap perubahan.

**Pengembangan lokal:** jalankan `npm start` (server + API di port 3000) dan `npm run dev` bersamaan; Vite meneruskan `/api` dan `/media` ke port 3000.

### Keamanan dependensi

- Build memakai **Vite 8** (Rolldown), jadi tidak ada lagi `esbuild` di pohon dependensi. `package.json` juga memuat
  `"overrides": { "esbuild": "^0.28.1" }` sebagai pengaman bila suatu paket menariknya kembali.
- `.github/dependabot.yml` memeriksa pembaruan npm setiap Senin dan membuka pull request otomatis.
  Aktifkan juga **Settings → Code security → Dependabot alerts & security updates** di GitHub supaya tambalan keamanan dibuat seketika.
- Cek manual kapan saja: `npm audit`.

Dokumen Hostinger: [How to add a Node.js web app](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

## Identitas brand

**Mulai dari sini:** buka [`brand/panduan-brand-alfa-omega.pdf`](brand/panduan-brand-alfa-omega.pdf) (24 halaman, A4 lanskap) untuk dibagikan atau dicetak,
atau [`brand/panduan-brand.html`](brand/panduan-brand.html) di browser untuk versi interaktif.

### Ringkasan brand

| | |
|---|---|
| **Logo** | Monogram Alfa (A) dan Omega (Ω) yang saling mengunci, dibangun ulang secara geometris dari logo asli |
| **Tagline** | *Yang Awal dan Yang Akhir* (Wahyu 22:13) |
| **Warna inti** | Hitam Kekal `#121212` · Emas Mulia `#C8A25A` · Putih Gading `#F6F1E7` |
| **Warna pendukung** | Emas Tua `#9A7633` · Emas Muda `#E6CF95` · Arang `#2A2826` · Abu Batu `#8A8378` · Merah Anggur `#6E1E2A` |
| **Font** | Cinzel (logo & judul kapital) · Cormorant Garamond (headline & ayat) · Plus Jakarta Sans (teks & UI) |

### Isi folder

```
src/, public/, server/, index.html, server.js   aplikasi website + CMS (lihat di atas)
brand/
├── panduan-brand-alfa-omega.pdf   panduan brand untuk dibagikan / dicetak
├── panduan-brand.html   panduan brand interaktif (buka di browser)
├── logo/svg/            23 logo vektor: monogram, horizontal, horizontal-ringkas, bertumpuk,
│                        bertumpuk-tagline, wordmark × hitam / emas / emas-gading / putih
├── logo/png/            versi PNG transparan
├── logo/asli/           logo asli (arsip)
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
python3 tools/build_mark.py   # monogram -> tools/mark.json
python3 tools/build_logos.py  # logo SVG
node tools/render.mjs         # semua PNG/JPG (logo, web, media sosial, mockup)
python3 tools/build_web.py    # kit website: SVG, ikon, font WOFF2, WebP, contoh.html
python3 tools/build_panduan.py # halaman HTML
node tools/build_pdf.mjs       # PDF A4 lanskap
python3 tools/build_react_assets.py  # ikon & monogram untuk komponen React
```

`node tools/render.mjs "youtube"` hanya merender aset yang path-nya cocok dengan pola tersebut.
