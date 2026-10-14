# Gereja Alfa Omega: Identitas Brand

Paket identitas visual Gereja Alfa Omega: logo, warna, font, aset media sosial, aset website, mockup merchandise,
dan 10 referensi website gereja untuk menentukan arah desain website.

**Mulai dari sini:** buka [`brand/panduan-brand.html`](brand/panduan-brand.html) di browser. Halaman ini memuat seluruh panduan beserta pratinjau semua aset.

## Ringkasan brand

| | |
|---|---|
| **Logo** | Monogram Alfa (A) dan Omega (Ω) yang saling mengunci, dibangun ulang secara geometris dari logo asli |
| **Tagline** | *Yang Awal dan Yang Akhir* (Wahyu 22:13) |
| **Warna inti** | Hitam Kekal `#121212` · Emas Mulia `#C8A25A` · Putih Gading `#F6F1E7` |
| **Warna pendukung** | Emas Tua `#9A7633` · Emas Muda `#E6CF95` · Arang `#2A2826` · Abu Batu `#8A8378` · Merah Anggur `#6E1E2A` |
| **Font** | Cinzel (logo & judul kapital) · Cormorant Garamond (headline & ayat) · Plus Jakarta Sans (teks & UI) |

## Isi folder

```
brand/
├── panduan-brand.html   panduan brand lengkap (buka di browser)
├── logo/svg/            23 logo vektor: monogram, horizontal, horizontal-ringkas, bertumpuk,
│                        bertumpuk-tagline, wordmark × hitam / emas / emas-gading / putih
├── logo/png/            versi PNG transparan
├── logo/asli/           logo asli (arsip)
├── fonts/               file TTF + lisensi OFL (gratis, boleh untuk komersial)
├── media-sosial/        instagram/ facebook/ youtube/ tiktok/ alternatif/
├── web/                 favicon, ikon aplikasi, logo header, og-image, brand-tokens.css, site.webmanifest
└── mockup/              kaos hitam, kaos putih, jaket bomber, bendera, umbul-umbul
referensi-website/       10 referensi website gereja + 3 arah desain + fitur wajib
tools/                   skrip untuk membuat ulang semua aset
```

### File mana untuk apa

| Kebutuhan | File |
|---|---|
| Foto profil Instagram / Facebook / TikTok | `brand/media-sosial/<platform>/profil-*-1080x1080.png` |
| Foto profil YouTube | `brand/media-sosial/youtube/profil-youtube-800x800.png` |
| Banner YouTube | `brand/media-sosial/youtube/banner-youtube-2560x1440.png` |
| Sampul Facebook | `brand/media-sosial/facebook/sampul-facebook-1640x624.png` |
| Sorotan (highlight) Instagram | `brand/media-sosial/instagram/highlight-*.png` |
| Header website | `brand/web/logo-header-terang.svg`, `brand/web/logo-header-gelap.svg` |
| Kirim ke percetakan / konveksi | `brand/logo/svg/*.svg` (vektor) |
| Desain di Canva | unggah PNG dari `brand/logo/png/` dan font dari `brand/fonts/` |

Instagram dan TikTok tidak punya banner profil, jadi untuk keduanya disediakan sampul sorotan, template post/story, dan sampul video.

## Membuat ulang aset

Semua gambar dihasilkan dari kode, jadi warna, teks, atau ukuran bisa diubah lalu dirender ulang:

```bash
pip install numpy scipy pillow potracer uharfbuzz fonttools
npm install playwright        # memakai Chromium
python3 tools/build_mark.py   # monogram -> tools/mark.json
python3 tools/build_logos.py  # logo SVG
node tools/render.mjs         # semua PNG/JPG (logo, web, media sosial, mockup)
python3 tools/build_panduan.py
```

`node tools/render.mjs "youtube"` hanya merender aset yang path-nya cocok dengan pola tersebut.
