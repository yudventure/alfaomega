# Website Gereja Alfa Omega

Website satu halaman (landing page) yang dibangun dari panduan brand Alfa Omega, dengan tata letak
mengacu pada referensi: navigasi mengambang di atas hero membulat, kartu ayat + "Siapa Kami",
kartu langkah bertumpuk bernomor, jadwal, khotbah, grid bento kehidupan jemaat, persembahan, dan kunjungi kami.

Folder ini **siap diunggah apa adanya** ke hosting statis apa pun (Netlify, Vercel, GitHub Pages, cPanel, dll.).
Tidak butuh proses build: cukup unggah seluruh isi folder `site/`.

## Isi

```
index.html        halaman utama
css/style.css     gaya halaman (warna & font sesuai brand)
css/fonts.css     @font-face (font di-host sendiri)
js/main.js        menu ponsel, animasi masuk, tahun footer
img/              visual latar bergaya brand (pengganti foto)
logo/             logo header & footer (SVG)
fonts/            WOFF2: Cinzel, Cormorant Garamond, Plus Jakarta Sans
og/og-beranda.jpg gambar saat link dibagikan
favicon.*, apple-touch-icon.png, icon-*.png, site.webmanifest
```

## Yang perlu diganti sebelum tayang

Cari komentar `<!-- GANTI -->` di `index.html`:

1. **Jadwal ibadah** (bagian `#jadwal` dan kolom "Ibadah Minggu" di footer): jam yang tertulis hanya contoh.
2. **Alamat, WhatsApp, email** (bagian `#kunjungi`).
3. **Tautan**: kanal YouTube, tiap tombol "Tonton", halaman persembahan, petunjuk arah (Google Maps), media sosial. Semua masih `href="#"`.
4. **Domain** di `og:url` dan `og:image` (ganti `DOMAIN-GEREJA`).
5. **Nama pembicara** pada kartu khotbah (saat ini "Gembala Sidang").

## Mengganti visual dengan foto asli

Gambar di `img/` adalah komposisi cahaya bergaya brand, dibuat karena belum ada foto gereja. Ganti dengan foto asli
dengan nama file yang sama (rasio sama) supaya tata letak tidak berubah:

| File | Rasio | Saran foto |
|---|---|---|
| `hero-cahaya.jpg` | 16:9 (2400 × 1350) | suasana ibadah / gedung gereja, sisi kiri agak gelap untuk teks |
| `hero-cahaya-ponsel.jpg` | 2:3 (1080 × 1600) | versi tegak |
| `siapa-kami.jpg` | 4:3 | jemaat bersekutu |
| `langkah-1..5.jpg` | 4:3 | ibadah, komsel, kelas, baptisan, pelayanan |
| `bento-lebar.jpg` | 16:9 | bakti sosial / misi |
| `bento-tinggi.jpg` | 9:14 | komsel / doa |
| `khotbah-1..3.jpg` | 16:9 | thumbnail khotbah (judul ditulis HTML, bukan di gambar) |
| `kunjungi.jpg` | 4:3 | foto gedung gereja atau peta |

Untuk hero yang gelap, pastikan foto tidak terlalu terang di bagian bawah supaya teks putih tetap terbaca
(lapisan gradien gelap sudah ditambahkan lewat CSS).

## Membuat ulang

```bash
node tools/render.mjs "site/img"   # visual latar
python3 tools/build_site.py        # salin aset kit + susun index.html
```
Sumber: `tools/site-template.html`, `tools/site-style.css`, `tools/site-main.js`, `tools/assets-site.mjs`.
