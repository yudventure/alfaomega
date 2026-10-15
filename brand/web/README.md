# Kit Website GBI Kapernaum Sorong

Semua file yang dibutuhkan untuk membangun website gereja dengan identitas brand GBI Kapernaum Sorong (lambang singa, hitam & emas).
**Salin seluruh isi folder ini ke folder publik website** (root domain, misalnya `public/` atau `static/`),
lalu tempel isi [`head-snippet.html`](head-snippet.html) ke `<head>` setiap halaman.

Lihat [`contoh.html`](contoh.html) untuk contoh pemakaian: header, hero, tombol, kartu, ikon, dan footer.

## Isi folder

### Ikon browser & aplikasi (root)

| File | Ukuran | Dipakai untuk |
|---|---|---|
| `favicon.ico` | 16, 32, 48 px | ikon tab browser (semua browser) |
| `favicon.svg` | vektor | ikon tab browser modern, tajam di layar retina |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | 16–48 px | cadangan PNG |
| `apple-touch-icon.png` | 180 × 180 | ikon saat website disimpan ke layar utama iPhone/iPad |
| `icon-192.png`, `icon-512.png` | 192, 512 px | ikon aplikasi Android / PWA |
| `icon-maskable-192.png`, `icon-maskable-512.png` | 192, 512 px | ikon Android yang dipotong bentuk (lingkaran, squircle) |
| `mstile-150x150.png` + `browserconfig.xml` | 150 × 150 | ubin Windows |
| `safari-pinned-tab.svg` | vektor | tab yang disematkan di Safari |
| `site.webmanifest` | | nama, warna, dan ikon aplikasi web |

### `logo/`

| File | Dipakai untuk |
|---|---|
| `logo-header-terang.svg/.png/@2x.png` | header di latar terang (lencana singa berwarna + KAPERNAUM / SORONG, tinggi 48 px) |
| `logo-header-gelap.svg/.png/@2x.png` | header di latar gelap (lambang emas, teks gading) |
| `logo-lengkap-terang/gelap` | dengan baris GEREJA BETHEL INDONESIA, untuk header lebar atau halaman Tentang |
| `logo-footer-terang/gelap` | logo bertumpuk lengkap untuk footer (lebar 240 px) |
| `lambang-warna/hitam/emas/putih` | lambang singa saja (warna = lencana berpiringan hitam), PNG 256 px & @2x |
| `lambang-gradien.svg`, `lencana-gradien.svg` | lambang emas metalik (tanpa / dengan piringan hitam) untuk hero gelap |

Utamakan SVG. PNG `@2x` untuk layar retina bila SVG tidak bisa dipakai (misalnya email).

### `og/`: gambar share per halaman (1200 × 630)

Muncul saat link dibagikan di WhatsApp, Facebook, Telegram, atau X.
`og-beranda`, `og-ibadah`, `og-kunjungi`, `og-renungan`, `og-khotbah`, `og-acara`, `og-komsel`, `og-persembahan`, `og-tentang`, `og-kontak`.

### `hero/`: latar bagian pembuka

| File | Ukuran |
|---|---|
| `hero-gelap-2560x1440` | desktop, latar hitam + cahaya emas + pola Gema Cincin |
| `hero-gelap-ponsel-1080x1920` | ponsel |
| `hero-terang-2560x1440`, `hero-terang-ponsel-1080x1920` | versi gading |

Tersedia `.webp` (lebih ringan, dipakai di CSS) dan `.jpg` (cadangan). Teks hero ditulis dengan HTML di atasnya, bukan dicetak di gambar.
Untuk hero video, taruh lapisan `.kp-hero-lapisan` di atas video supaya teks tetap terbaca.

### `pola/`

| File | Dipakai untuk |
|---|---|
| `pola-gema-cincin-emas.svg` / `-hitam.svg` | lingkaran sepusat yang memantulkan cincin lambang (di latar gelap / terang), `background-size: cover` |
| `pola-ubin-emas.svg` / `-hitam.svg` | ubin cincin kecil berulang, `background-repeat: repeat` |
| `ornamen-pembatas-emas.svg` / `-hitam.svg` | pembatas antar bagian (garis + lambang singa) |

### `ikon/`: 29 ikon garis

`ibadah, alkitab, renungan, khotbah, pujian, doa, baptisan, persembahan, komsel, pemuda, anak, acara, jam, lokasi, live,
galeri, telepon, email, pesan, info, pengguna, cari, menu, tutup, panah-kanan, panah-bawah, unduh, bagikan, tautan-luar`

Kanvas 24 × 24, garis 1,75 px, warna mengikuti teks (`currentColor`). Dua cara pakai:

```html
<!-- 1. salin isi file ikon/jam.svg langsung ke HTML; warnanya mengikuti CSS color -->
<!-- 2. sprite: satu file untuk semua ikon -->
<svg class="kp-ikon"><use href="/ikon/ikon-sprite.svg#ikon-jam"/></svg>
```

Ikon media sosial (Instagram, Facebook, YouTube, TikTok, WhatsApp) tidak disertakan di sini: pakai logo resmi masing-masing platform,
misalnya dari [Simple Icons](https://simpleicons.org) (website gereja sudah memakainya di footer).

### `placeholder/`

Gambar pengganti selama foto asli belum ada: `placeholder-gelap/terang` dalam rasio `16x9`, `4x3`, `1x1` (.webp + .jpg),
dan `avatar-gelap.svg` / `avatar-terang.svg` untuk pembicara atau pengurus yang belum punya foto.

### `loader/`

`loader-emas.svg`: lambang singa emas berkilau (animasi SVG, tanpa JavaScript) untuk layar memuat.

### `fonts/` + `css/`

| File | Isi |
|---|---|
| `fonts/*.woff2` | Cormorant Garamond 500/600 (+ italic), Plus Jakarta Sans 400/500/600/700/800 (+ italic 400). Subset Latin, lisensi SIL OFL |
| `css/fonts.css` | `@font-face` untuk semua font di atas |
| `css/brand-tokens.css` | variabel warna & font (`--kp-*`), plus kelas siap pakai: `.kp-label`, `.kp-display`, `.kp-judul`, `.kp-ayat`, `.kp-tombol`, `.kp-hero-gelap`, `.kp-kartu`, `.kp-pembatas` |
| `css/tokens.json` | token yang sama dalam format JSON |
| `css/tailwind-preset.js` | preset Tailwind CSS: `bg-kp-hitam`, `text-kp-emas`, `font-logo`, `font-judul`, `font-teks` |

## Warna & font singkat

| Token | Nilai | Peran |
|---|---|---|
| `--kp-hitam` | `#121212` | warna utama, teks, latar gelap |
| `--kp-emas` | `#C89C4A` | aksen, tombol, garis |
| `--kp-gading` | `#F6F1E7` | latar terang |
| `--kp-emas-teks` | `#76561C` | teks kecil berwarna emas di latar terang |
| `--kp-emas-muda` | `#E8CB86` | kutipan ayat di latar gelap |
| `--kp-arang` | `#2A2826` | kartu di mode gelap |

Font: **Plus Jakarta Sans ExtraBold** untuk logo & judul kapital (KAPERNAUM), **Cormorant Garamond** untuk headline dan ayat, **Plus Jakarta Sans** untuk teks dan menu.

## Catatan

- `head-snippet.html` memakai alamat `https://DOMAIN-GEREJA`. Ganti dengan domain gereja, dan ganti `og:image` per halaman.
- Membuka `contoh.html` langsung dari folder sudah cukup untuk melihat tampilan. Di website sungguhan, font dimuat dari `css/fonts.css`.
- Semua file ini dibuat dari skrip di folder `tools/` repositori, jadi bisa dibuat ulang bila warna atau teks berubah.
