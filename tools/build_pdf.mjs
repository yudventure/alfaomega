// Susun PDF panduan brand (A4 lanskap) dari aset di brand/.
//
//   node tools/build_pdf.mjs   ->  brand/panduan-brand-alfa-omega.pdf
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { C, BRAND, TOOLS, fontCSS, markSvg, logoSvg, chevrons } from './lib.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const KONTEN = JSON.parse(fs.readFileSync(path.join(TOOLS, 'konten.json'), 'utf8'));
const CACHE = path.join(TOOLS, '.cache');
const OUT = path.join(BRAND, 'panduan-brand-alfa-omega.pdf');

// ---------- gambar ----------
const RASTER = [
  'logo/asli/logo-asli.png',
  'media-sosial/instagram/profil-instagram-1080x1080.png', 'media-sosial/alternatif/profil-terang-1080x1080.png',
  'media-sosial/youtube/banner-youtube-2560x1440.png', 'media-sosial/youtube/thumbnail-khotbah-1280x720.png',
  'media-sosial/facebook/sampul-facebook-1640x624.png',
  ...['ibadah', 'renungan', 'acara', 'pemuda', 'doa', 'komsel', 'info'].map(n => `media-sosial/instagram/highlight-${n}.png`),
  'media-sosial/instagram/post-ayat-1080x1350.png', 'media-sosial/instagram/post-selamat-datang-1080x1350.png',
  'media-sosial/instagram/story-ibadah-1080x1920.png', 'media-sosial/tiktok/cover-video-1080x1920.png',
  'web/og-image-1200x630.png',
  'mockup/kaos-hitam.jpg', 'mockup/kaos-putih.jpg', 'mockup/jaket-bomber.jpg', 'mockup/bendera.jpg', 'mockup/umbul-umbul.jpg',
];
execFileSync('python3', [path.join(TOOLS, 'pdf_images.py'), ...RASTER], { stdio: 'inherit' });
const img = (rel) => 'file://' + path.join(CACHE, 'pdf-img', rel.replace(/\.(png|jpg)$/, '.jpg'));
const asset = (rel) => 'file://' + path.join(BRAND, rel);

// ---------- komponen ----------
const head = (eyebrow, title, lede = '') => `<div class="head"><div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}</div>`;
const fig = (inner, cap) => `<figure>${inner}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
const shot = (rel, alt = '', style = '') => `<img class="shot" src="${img(rel)}" alt="${alt}" style="${style}">`;
const pattern = (w, h, opts) => `<svg class="pattern" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs><radialGradient id="glow${w}${h}" cx="${opts.gx || '50%'}" cy="${opts.gy || '50%'}" r="60%"><stop offset="0" stop-color="#2E2619"/><stop offset=".6" stop-color="#181512"/><stop offset="1" stop-color="#121212"/></radialGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#glow${w}${h})"/>${chevrons({ cx: opts.cx ?? w / 2, cy: 0, count: opts.count || 14, step: -(opts.step || 60), opacity: opts.op || 0.2, width: 1, start: -(opts.apex || 80) })}</svg>`;

// ---------- halaman ----------
// tiap halaman: { sec (nama bab untuk daftar isi & footer), dark, body, bare (tanpa footer) }
const P = [];
const add = (sec, body, o = {}) => P.push({ sec, body, ...o });

// 1. Sampul
add(null, `${pattern(1122, 794, { cx: 820, gx: '73%', apex: 120, step: 54, count: 16, op: .22 })}
  <div class="cover">
    <div>
      <div class="eyebrow">Panduan Identitas Brand</div>
      <h1>ALFA<br>OMEGA</h1>
      <p class="tag">Yang Awal dan Yang Akhir</p>
    </div>
    <div class="cover-foot"><span>Gereja Alfa Omega</span><span>Versi 1.0 · Oktober 2026</span></div>
  </div>
  <div class="cover-mark">${markSvg({ h: 400, fill: 'gold' })}</div>`, { dark: true, bare: true });

// 2. Pengantar & daftar isi (diisi setelah nomor halaman diketahui)
add(null, '{{TOC}}');

// 3. Konstruksi logo
add('Logo', `${head('Logo', 'Makna & konstruksi', 'Logo asli dibangun ulang sebagai vektor: garis kaki A dibuat lurus dan sejajar, lengkung Omega dihitung ulang supaya simetris, lalu semuanya digabung menjadi satu bentuk yang tajam di ukuran berapa pun.')}
  <div class="cols c3">
    ${fig(`<div class="tile i h90"><img src="${img('logo/asli/logo-asli.png')}" style="height:70mm;mix-blend-mode:multiply"></div>`, '<b>Logo asli.</b> Gambar raster dengan tepi yang sedikit bergelombang.')}
    ${fig(`<div class="tile i h90">${markSvg({ h: 260, fill: C.hitam })}</div>`, '<b>Logo vektor baru.</b> Simetris sempurna, tepi bersih, satu path SVG.')}
    <div class="notes">
      <div class="note"><b>A · Alfa</b><span>Huruf pertama abjad Yunani. Puncaknya menunjuk ke atas, kepada Allah.</span></div>
      <div class="note"><b>Ω · Omega</b><span>Huruf terakhir. Lengkungnya memeluk huruf A dari atas sampai bawah.</span></div>
      <div class="note"><b>Satu kaki</b><span>Garis luar kaki A sekaligus menjadi kaki Omega: awal dan akhir menyatu dalam satu bentuk.</span></div>
      <div class="note"><b>Wahyu 22:13</b><span>“Aku adalah Alfa dan Omega, Yang Pertama dan Yang Terkemudian, Yang Awal dan Yang Akhir.”</span></div>
    </div>
  </div>`);

// 4. Susunan logo
add('Logo', `${head('Logo', 'Empat susunan')}
  <div class="cols c3 tight">
    ${fig(`<div class="tile i h52"><img src="${asset('logo/svg/alfaomega-horizontal-hitam.svg')}" style="width:68mm"></div>`, '<b>Horizontal (utama).</b> Header website, kop surat, banner lebar.')}
    ${fig(`<div class="tile i h52"><img src="${asset('logo/svg/alfaomega-horizontal-ringkas-hitam.svg')}" style="width:62mm"></div>`, '<b>Horizontal ringkas.</b> Ruang sempit: header ponsel, tanda tangan email.')}
    ${fig(`<div class="tile i h52"><img src="${asset('logo/svg/alfaomega-wordmark-hitam.svg')}" style="width:62mm"></div>`, '<b>Wordmark.</b> Bila monogram sudah tampil di dekatnya.')}
    ${fig(`<div class="tile i h68"><img src="${asset('logo/svg/alfaomega-bertumpuk-tagline-hitam.svg')}" style="height:48mm"></div>`, '<b>Bertumpuk + tagline.</b> Punggung kaos, bendera, poster.')}
    ${fig(`<div class="tile i h68"><img src="${asset('logo/svg/alfaomega-bertumpuk-hitam.svg')}" style="height:42mm"></div>`, '<b>Bertumpuk.</b> Ruang hampir persegi, slide pembuka ibadah.')}
    ${fig(`<div class="tile i h68">${markSvg({ h: 150, fill: C.hitam })}</div>`, '<b>Monogram.</b> Foto profil, favicon, bordir dada, stempel.')}
  </div>`);

// 5. Varian warna
const V = [
  ['hitam', 'i', 'Hitam', 'di latar terang'], ['emas', 'k', 'Emas', 'di latar hitam'],
  ['emas-gading', 'k', 'Emas-gading', 'monogram emas, teks gading'], ['putih', 'w', 'Putih', 'di foto atau warna gelap'],
];
add('Logo', `${head('Logo', 'Empat varian warna', 'Setiap susunan tersedia dalam empat varian ini, sebagai SVG (vektor) dan PNG transparan. Jangan membuat varian warna lain.')}
  <div class="cols c4 tight">
    ${V.map(([v, bg, n, d]) => fig(`<div class="tile ${bg} h52">${v === 'emas-gading' ? markSvg({ h: 120, fill: C.emas }) : `<img src="${asset(`logo/svg/alfaomega-monogram-${v}.svg`)}" style="height:32mm">`}</div>
      <div class="tile ${bg} h28" style="margin-top:3mm"><img src="${asset(`logo/svg/alfaomega-horizontal-ringkas-${v}.svg`)}" style="width:52mm"></div>`, `<b>${n}</b>, ${d}`)).join('')}
  </div>`);

// 6. Ruang aman & larangan
const dont = (style, label, bg = '') => fig(`<div class="tile i h34" style="position:relative;${bg}"><span class="x">✕</span>${markSvg({ h: 80, fill: style.fill || C.hitam, style: style.css || '' })}</div>`, label);
add('Logo', `${head('Logo', 'Ruang aman & ukuran minimum')}
  <div class="cols c2">
    <div class="tile i" style="height:78mm"><svg viewBox="-200 -200 1067.45 1097.08" style="height:68mm">
      <rect x="-174.27" y="-174.27" width="1015.99" height="1045.62" fill="none" stroke="#C8A25A" stroke-width="5" stroke-dasharray="18 12"/>
      <rect x="0" y="0" width="667.45" height="697.08" fill="none" stroke="#C8A25A" stroke-width="2" opacity=".6"/>
      ${markSvg({ h: 697.08, fill: C.hitam }).replace('<svg ', '<svg x="0" y="0" ')}
      <g font-family="Plus Jakarta Sans" font-weight="700" font-size="56" fill="#9A7633" text-anchor="middle"><text x="333.7" y="-60">X</text><text x="-87" y="370">X</text><text x="754" y="370">X</text><text x="333.7" y="800">X</text></g></svg></div>
    <div>
      <p class="body">Sisakan ruang kosong minimal <b>X</b> di sekeliling logo, yaitu seperempat tinggi monogram. Tidak boleh ada teks, foto, atau tepi kertas di area ini.</p>
      <table><thead><tr><th>Susunan</th><th>Layar</th><th>Cetak</th></tr></thead><tbody>
        <tr><td>Monogram</td><td>16 px</td><td>8 mm tinggi</td></tr>
        <tr><td>Horizontal</td><td>140 px lebar</td><td>35 mm lebar</td></tr>
        <tr><td>Bertumpuk</td><td>90 px lebar</td><td>25 mm lebar</td></tr>
        <tr><td>Bertumpuk + tagline</td><td>160 px lebar</td><td>45 mm lebar</td></tr>
        <tr><td>Bordir</td><td>-</td><td>45 mm tinggi monogram</td></tr></tbody></table>
    </div>
  </div>
  <div class="eyebrow" style="margin:7mm 0 3mm">Yang tidak boleh</div>
  <div class="cols c5 tight">
    ${dont({ css: 'transform:scaleX(1.45)' }, 'Ditarik / dipipihkan')}
    ${dont({ css: 'transform:rotate(-18deg)' }, 'Diputar / dimiringkan')}
    ${dont({ fill: '#2F6FD6' }, 'Warna di luar palet')}
    ${dont({ css: 'filter:drop-shadow(5px 5px 3px rgba(0,0,0,.55))' }, 'Diberi bayangan / efek')}
    ${dont({}, 'Latar ramai tanpa lapisan gelap', 'background:repeating-linear-gradient(45deg,#8FB8DE 0 12px,#E8B04B 12px 24px,#D9534F 24px 36px)')}
  </div>`);

// 7. Warna
add('Warna', `${head('Warna', 'Hitam, emas, gading', 'Hitam untuk keteguhan Allah yang kekal, emas untuk kemuliaan-Nya, gading untuk terang dan kesucian. Empat warna pendukung dipakai secukupnya.')}
  <div class="cols c4 sw-grid">
    ${KONTEN.warna.map(c => `<div class="sw"><div class="chip" style="background:${c.hex};color:${c.ink}">${c.tag}</div>
      <div class="info"><div class="name">${c.name}</div><div class="role">${c.role}</div>
      <div class="codes"><span>HEX</span>${c.hex}<span>RGB</span>${c.rgb}<span>CMYK</span>${c.cmyk}</div></div></div>`).join('')}
  </div>
  <div class="ratio"><span style="flex:60;background:#121212;color:#F6F1E7">60% HITAM / GADING</span><span style="flex:30;background:#F6F1E7;color:#121212">30% LAWANNYA</span><span style="flex:10;background:#C8A25A;color:#121212">10% EMAS</span></div>
  <p class="small" style="margin-top:3mm">Teks kecil di latar gading pakai Hitam Kekal (kontras 16,6 : 1). Emas Mulia di latar hitam aman untuk semua ukuran (7,8 : 1); di latar gading hanya untuk garis, ikon, dan judul besar.
  CMYK adalah konversi langsung dari RGB, jadi minta proof cetak. Emas berkilau: tinta metalik (mis. Pantone 871 C) atau foil. Hitam pekat: rich black C60 M40 Y40 K100.</p>`);

// 8. Tipografi
const font = (name, role, sample, alpha, style) => `<div class="font"><div class="spec"><div class="big" style="${style}">${sample}</div><div class="alpha" style="${style};font-size:11pt;font-weight:inherit">${alpha}</div></div>
  <div class="meta"><b>${name}</b><span>${role}</span></div></div>`;
add('Tipografi', `${head('Tipografi', 'Tiga keluarga huruf', 'Semua dari Google Fonts dengan lisensi SIL Open Font License: gratis, boleh untuk cetak, website, dan merchandise. File TTF ada di folder brand/fonts.')}
  <div class="fonts">
    ${font('Cinzel', 'Logo, judul kapital, nama acara. Huruf pahatan Romawi yang serasi dengan monogram. SemiBold 600 & Bold 700, selalu kapital dengan jarak huruf lebar.', 'ALFA OMEGA', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789', "font-family:'Cinzel';font-weight:700;letter-spacing:.04em")}
    ${font('Cormorant Garamond', 'Headline, kutipan ayat, judul khotbah. Serif klasik yang anggun. Medium 500, SemiBold 600, dan Italic. Untuk ukuran besar (18 pt ke atas).', 'Yang Awal <i style="font-weight:500">dan</i> Yang Akhir', '“Kasih karunia Tuhan Yesus menyertai kamu sekalian.”', "font-family:'Cormorant Garamond';font-weight:600")}
    ${font('Plus Jakarta Sans', 'Teks isi, menu, tombol, jadwal. Didesain Tokotype di Jakarta, jelas dibaca di ponsel. Regular 400 sampai Bold 700.', 'Ibadah Raya Minggu', 'Persekutuan doa setiap Rabu, pukul 19.00 WIB. Semua orang disambut.', "font-family:'Plus Jakarta Sans';font-weight:700;letter-spacing:-.01em")}
  </div>`);

// 9. Hierarki & elemen grafis
add('Tipografi', `${head('Tipografi & elemen', 'Hierarki dan pola Gema Alfa')}
  <div class="cols c2">
    <div class="scale">
      <div class="row"><span>Label · Jakarta 600</span><div class="eyebrow">Renungan Harian</div></div>
      <div class="row"><span>Display · Cinzel 700</span><div style="font:700 19pt/1.05 'Cinzel';letter-spacing:.04em;white-space:nowrap">IBADAH PASKAH</div></div>
      <div class="row"><span>Judul · Cormorant 600</span><div style="font:600 19pt/1.15 'Cormorant Garamond'">Kasih yang tidak berkesudahan</div></div>
      <div class="row"><span>Ayat · Cormorant Italic</span><div style="font:italic 500 13pt/1.35 'Cormorant Garamond'">“Aku adalah Alfa dan Omega, firman Tuhan Allah.” Wahyu 1:8</div></div>
      <div class="row"><span>Teks · Jakarta 400</span><div style="font-size:9pt">Gereja Alfa Omega adalah keluarga orang percaya yang bertumbuh bersama dalam firman, doa, dan pelayanan.</div></div>
    </div>
    <div>
      ${fig(shot('web/og-image-1200x630.png'), '<b>Pola Gema Alfa.</b> Chevron tipis bersudut sama dengan kaki huruf A (64°), bertumpuk dan memudar. Opasitas 15–25%, jangan menimpa teks kecil.')}
      <div class="cols c2 tight" style="margin-top:4mm">
        ${fig(`<div class="tile h30" style="background:linear-gradient(135deg,#EBD9A6 0%,#C8A25A 38%,#A9843F 70%,#D8BC7A 100%);border:0">${markSvg({ h: 70, fill: C.hitam })}</div>`, '<b>Gradien emas</b>, layar saja.')}
        ${fig(`<div class="tile h30" style="background:#C8A25A;border:0">${markSvg({ h: 70, fill: C.hitam })}</div>`, '<b>Emas rata / foil</b>, untuk cetak.')}
      </div>
    </div>
  </div>`);

// 10. Media sosial: profil + YouTube banner
add('Media sosial', `${head('Media sosial', 'Foto profil & banner YouTube', 'Foto profil dibuat sama di keempat platform supaya jemaat langsung mengenali akun resmi.')}
  <div class="cols" style="grid-template-columns:52mm 70mm minmax(0,1fr)">
    ${fig(shot('media-sosial/instagram/profil-instagram-1080x1080.png', '', 'border-radius:50%'), '<b>Profil utama</b>')}
    <div><table><thead><tr><th>Platform</th><th>File</th><th>Tampil</th></tr></thead><tbody>
      <tr><td>Instagram</td><td>1080²</td><td>110–320 px</td></tr><tr><td>Facebook</td><td>1080²</td><td>176–196 px</td></tr>
      <tr><td>YouTube</td><td>800²</td><td>98 px</td></tr><tr><td>TikTok</td><td>1080²</td><td>200 px</td></tr></tbody></table>
      <p class="small" style="margin-top:3mm">Semua dipotong lingkaran oleh platform. Versi terang ada di folder <b>alternatif</b>.</p></div>
    ${fig(shot('media-sosial/youtube/banner-youtube-2560x1440.png'), '<b>Banner YouTube</b> · 2560 × 1440. Logo berada di area aman 1546 × 423 di tengah, jadi tidak terpotong di ponsel, laptop, maupun TV.')}
  </div>`);

// 11. YouTube + Facebook
add('Media sosial', `${head('Media sosial', 'YouTube & Facebook')}
  <div class="cols" style="grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)">
    ${fig(shot('media-sosial/facebook/sampul-facebook-1640x624.png'), '<b>Sampul Facebook</b> · 1640 × 624. Isi di tengah karena sisi kiri-kanan terpotong di ponsel.')}
    ${fig(shot('media-sosial/youtube/thumbnail-khotbah-1280x720.png'), '<b>Thumbnail khotbah</b> · 1280 × 720. Ganti judul & seri tiap minggu; foto pembicara boleh menggantikan monogram.')}
  </div>
  <div class="cols" style="grid-template-columns:40mm minmax(0,1fr);margin-top:6mm;align-items:center">
    <div class="tile k h34"><img src="${asset('media-sosial/youtube/watermark-150x150.png')}" style="height:20mm"></div>
    <p class="body"><b>Watermark video</b> · 150 × 150 PNG putih transparan. Pasang di YouTube Studio → Kustomisasi → Branding, supaya monogram muncul di pojok setiap video.</p>
  </div>`);

// 12. Instagram
const HL = ['ibadah', 'renungan', 'acara', 'pemuda', 'doa', 'komsel', 'info'];
add('Media sosial', `${head('Media sosial', 'Instagram', 'Instagram tidak punya banner profil. Sebagai gantinya: tujuh sampul sorotan (highlight), template post 4:5, dan template story.')}
  <div class="cols c7 tight">${HL.map(n => fig(`<div class="hl"><img src="${img(`media-sosial/instagram/highlight-${n}.png`)}"></div>`, `<b>${n[0].toUpperCase() + n.slice(1)}</b>`)).join('')}</div>
  <div class="cols" style="grid-template-columns:repeat(3,auto) minmax(0,1fr);margin-top:5mm;align-items:start;justify-content:start">
    ${fig(shot('media-sosial/instagram/post-ayat-1080x1350.png', '', 'height:74mm;width:auto'), '<b>Post ayat</b> · 1080 × 1350')}
    ${fig(shot('media-sosial/instagram/post-selamat-datang-1080x1350.png', '', 'height:74mm;width:auto'), '<b>Post sambutan</b>')}
    ${fig(shot('media-sosial/instagram/story-ibadah-1080x1920.png', '', 'height:74mm;width:auto'), '<b>Story</b> · 1080 × 1920')}
    <p class="small" style="padding-top:1mm">Sampul sorotan berukuran 1080 × 1920; Instagram hanya menampilkan lingkaran di tengahnya.<br><br>Template dibuat dari kode, jadi teks ayat, judul, dan jadwal bisa diganti lalu dirender ulang, atau dibuat ulang di Canva memakai font dan warna yang sama.</p>
  </div>`);

// 13. TikTok
add('Media sosial', `${head('Media sosial', 'TikTok', 'TikTok juga tidak punya banner profil. Yang disiapkan: foto profil dan sampul video untuk seri konten.')}
  <div class="cols" style="grid-template-columns:auto 62mm minmax(0,1fr);align-items:start;justify-content:start">
    ${fig(shot('media-sosial/tiktok/cover-video-1080x1920.png', '', 'height:118mm;width:auto'), '<b>Sampul video</b> · 1080 × 1920')}
    ${fig(shot('media-sosial/instagram/profil-instagram-1080x1080.png', '', 'border-radius:50%'), '<b>Profil TikTok</b> · 1080 × 1080')}
    <div class="notes">
      <div class="note"><b>Area aman</b><span>Judul di tengah layar. Hindari 150 px teratas, ±420 px terbawah, dan ±140 px di kanan karena tertutup tombol aplikasi.</span></div>
      <div class="note"><b>Grid profil</b><span>TikTok memotong sampul jadi 3:4 di tengah. Judul seri tetap terbaca di grid.</span></div>
      <div class="note"><b>Seri konten</b><span>Ganti label (RENUNGAN, KESAKSIAN, PUJIAN) dan judul; pertahankan latar, logo, dan susunannya.</span></div>
    </div>
  </div>`);

// 14. Website
add('Website', `${head('Website', 'Siap dipasang di website', 'Logo header untuk latar terang dan gelap, favicon, ikon aplikasi, gambar pratinjau link, dan brand-tokens.css berisi warna dan font.')}
  <div class="cols c2">
    <div class="stack">
      <div class="cols c2 tight">
        ${fig(`<div class="tile i h30"><img src="${asset('web/logo-header-terang.svg')}" style="width:48mm"></div>`, '<b>logo-header-terang.svg</b>')}
        ${fig(`<div class="tile k h30"><img src="${asset('web/logo-header-gelap.svg')}" style="width:48mm"></div>`, '<b>logo-header-gelap.svg</b>')}
      </div>
      ${fig(`<div class="tile i h34" style="grid-auto-flow:column;gap:8mm"><img src="${asset('web/icon-512.png')}" style="height:22mm"><img src="${asset('web/favicon-48.png')}" style="height:12mm"><img src="${asset('web/favicon-32.png')}" style="height:8mm"><img src="${asset('web/favicon-16.png')}" style="height:4mm"></div>`, '<b>Favicon & ikon aplikasi</b> · 16, 32, 48, 180, 192, 512 px, favicon.ico, favicon.svg, site.webmanifest')}
      <pre>&lt;link rel="icon" href="/favicon.ico" sizes="any"&gt;
&lt;link rel="icon" href="/favicon.svg" type="image/svg+xml"&gt;
&lt;link rel="apple-touch-icon" href="/apple-touch-icon.png"&gt;
&lt;link rel="manifest" href="/site.webmanifest"&gt;
&lt;meta name="theme-color" content="#121212"&gt;
&lt;meta property="og:image" content="/og-image-1200x630.png"&gt;
&lt;link rel="stylesheet" href="/brand-tokens.css"&gt;</pre>
    </div>
    ${fig(shot('web/og-image-1200x630.png'), '<b>og-image-1200x630.png</b>, muncul saat link website dibagikan di WhatsApp, Facebook, atau Telegram.')}
  </div>`);

// 15–19. Mockup
const MOCK = [
  ['kaos-hitam', 'Kaos hitam, sablon emas', 'Dada kiri: monogram ±9 cm + ALFA OMEGA. Punggung: logo bertumpuk + tagline ±30 cm. Sablon plastisol emas atau DTF.'],
  ['kaos-putih', 'Kaos putih, sablon hitam', 'Tata letak sama dengan kaos hitam. Tagline boleh memakai Emas Tua.'],
  ['jaket-bomber', 'Jaket bomber, bordir emas', 'Bahan hitam, rib kerah, manset, dan pinggang dengan dua garis emas. Bordir dada ±10 cm, punggung ±32 cm.'],
  ['bendera', 'Bendera 150 × 100 cm', 'Hitam dengan bingkai emas ganda dan logo bertumpuk + tagline. Kain satin atau dinier, cetak sublim, sisi tiang dijahit selongsong.'],
  ['umbul-umbul', 'Umbul-umbul 60 × 260 cm', 'Tiga varian: hitam, emas, merah anggur. Monogram di atas, nama dibaca dari bawah ke atas, pola Gema Alfa di ujung lancip.'],
];
for (const [f, t, d] of MOCK) {
  add('Mockup', `<img class="mock" src="${img(`mockup/${f}.jpg`)}">
    <div class="mock-cap"><b>${t}</b><p>${d}</p><span>${String(P.length + 1).padStart(2, '0')}</span></div>`, { bare: true, mock: true });
}

// 20. Referensi: arah
add('Referensi website', `${head('Referensi website', 'Tiga arah desain', 'Sepuluh website gereja dipilih dari ulasan “best church websites” 2025–2026 dan dikelompokkan jadi tiga arah. Pilih satu arah atau gabungan untuk website Alfa Omega.')}
  <div class="cols c3">
    <div class="dir"><span class="tag">ARAH A</span><h3>Kemuliaan Gelap</h3><p>Latar hitam, video ibadah layar penuh, aksen emas. Paling dramatis dan paling dekat dengan logo emas di atas hitam.</p><div class="who">Elevation · VOUS · Transformation · Hillsong</div></div>
    <div class="dir"><span class="tag">ARAH B</span><h3>Klasik Terang</h3><p>Latar gading, ruang kosong lega, judul serif besar. Tenang, berwibawa, mudah dibaca jemaat segala usia.</p><div class="who">Passion City · St Paul's Cathedral</div></div>
    <div class="dir"><span class="tag">ARAH C</span><h3>Hangat & Komunitas</h3><p>Foto jemaat sendiri dan ajakan “Kunjungi Kami” yang jelas. Paling ramah untuk pengunjung baru.</p><div class="who">Mariners · Life.Church · City Harvest · JPCC</div></div>
  </div>
  <p class="rec">Rekomendasi: beranda memakai hero gelap dari Arah A, halaman isi (jadwal, renungan, tentang kami) memakai Arah B. Tombol dan garis emas menjadi benang merah keduanya.</p>`);

// 21–22. Kartu referensi
const DIRN = { A: 'Arah A', B: 'Arah B', C: 'Arah C' };
const card = r => `<div class="ref"><div class="rh"><span class="n">${r.n}</span><div><h4>${r.name}</h4><div class="loc">${r.country} · ${r.style} · ${DIRN[r.dir]}</div><div class="url">${r.url.replace('https://', '')}</div></div></div>
  <p>${r.why}</p><p class="take"><b>Yang bisa dipinjam</b> ${r.take}</p></div>`;
const refs = KONTEN.referensi;
add('Referensi website', `${head('Referensi website', 'Arah A & B')}<div class="cols c3 refs">${refs.filter(r => r.dir !== 'C').map(card).join('')}</div>`);
add('Referensi website', `${head('Referensi website', 'Arah C & fitur wajib')}<div class="cols c3 refs">${refs.filter(r => r.dir === 'C').map(card).join('')}
  <div class="ref feat"><h4>Fitur yang dimiliki hampir semua situs</h4><ol>
    <li><b>Kunjungi Kami / Pertama Kali?</b> Jam ibadah, alamat, parkir, Sekolah Minggu.</li>
    <li><b>Tonton online + arsip khotbah</b> per seri, pembicara, kitab.</li>
    <li><b>Persembahan online</b> di header: QRIS, transfer, VA, e-wallet.</li>
    <li><b>Komsel & langkah berikutnya</b>: baptisan, melayani, kelas.</li>
    <li><b>Acara & kalender</b> dengan pendaftaran online.</li>
    <li><b>Mobile-first</b>: 4–6 menu, tombol ID/EN.</li></ol></div>
  <div class="ref feat"><h4>Catatan</h4><p>Kesepuluh situs dipastikan masih aktif lewat hasil pencarian (Oktober 2026), tetapi tidak dibuka langsung saat riset. Deskripsi tampilan diambil dari ulasan pihak ketiga, jadi buka sendiri setiap link sebelum memutuskan arah.</p></div>
</div>`);

// 23. File
add('File', `${head('File', 'Isi paket brand', 'Semua file ada di repositori alfaomega. Gambar dibuat dari kode di folder tools, jadi warna, teks, atau ukuran bisa diubah lalu dirender ulang.')}
  <div class="cols c2">
    <pre class="tree">brand/
├── logo/svg/        23 logo vektor (kirim ini ke percetakan)
├── logo/png/        PNG transparan (untuk Canva & media sosial)
├── logo/asli/       logo asli sebagai arsip
├── fonts/           Cinzel, Cormorant Garamond, Plus Jakarta Sans
├── media-sosial/    instagram, facebook, youtube, tiktok, alternatif
├── web/             favicon, ikon, logo header, og-image, tokens CSS
├── mockup/          kaos, jaket, bendera, umbul-umbul
├── panduan-brand.html
└── panduan-brand-alfa-omega.pdf
referensi-website/   10 referensi lengkap + sumber</pre>
    <table><thead><tr><th>Kebutuhan</th><th>File</th></tr></thead><tbody>
      <tr><td>Profil IG / FB / TikTok</td><td>media-sosial/&lt;platform&gt;/profil-…-1080x1080.png</td></tr>
      <tr><td>Profil YouTube</td><td>media-sosial/youtube/profil-youtube-800x800.png</td></tr>
      <tr><td>Banner YouTube</td><td>media-sosial/youtube/banner-youtube-2560x1440.png</td></tr>
      <tr><td>Sampul Facebook</td><td>media-sosial/facebook/sampul-facebook-1640x624.png</td></tr>
      <tr><td>Sorotan Instagram</td><td>media-sosial/instagram/highlight-*.png</td></tr>
      <tr><td>Header website</td><td>web/logo-header-terang.svg · -gelap.svg</td></tr>
      <tr><td>Percetakan / konveksi</td><td>logo/svg/*.svg</td></tr>
      <tr><td>Desain di Canva</td><td>logo/png/*.png + fonts/</td></tr></tbody></table>
  </div>`);

// 24. Sampul belakang
add(null, `${pattern(1122, 794, { apex: 330, step: 44, count: 16, op: .2 })}
  <div class="back">${markSvg({ h: 210, fill: 'gold' })}<div class="bt">YANG AWAL DAN YANG AKHIR</div><div class="bs">Gereja Alfa Omega · Panduan Identitas Brand · Versi 1.0</div></div>`, { dark: true, bare: true });

// ---------- daftar isi ----------
const firstPage = {};
P.forEach((p, i) => { if (p.sec && !(p.sec in firstPage)) firstPage[p.sec] = i + 1; });
P[1].body = `<div class="cols intro">
  <div>
    <div class="eyebrow">Pengantar</div>
    <p class="verse">“Aku adalah Alfa dan Omega, Yang Pertama dan Yang Terkemudian, Yang Awal dan Yang Akhir.”</p>
    <div class="cite">WAHYU 22:13</div>
    <p class="body" style="margin-top:7mm;max-width:118mm">Alfa dan Omega adalah huruf pertama dan terakhir abjad Yunani. Panduan ini mengatur cara memakai logo, warna, dan huruf Gereja Alfa Omega,
      supaya gereja tampil sama di mana pun: di website, media sosial, kaos pelayanan, sampai umbul-umbul di halaman gereja.
      Siapa pun yang membuat materi untuk gereja (tim multimedia, percetakan, konveksi, desainer website) cukup mengikuti halaman-halaman ini.</p>
  </div>
  <div>
    <div class="eyebrow">Daftar isi</div>
    <ol class="toc">${Object.entries(firstPage).map(([s, n]) => `<li><span>${s}</span><i></i><b>${String(n).padStart(2, '0')}</b></li>`).join('')}</ol>
  </div></div>`;
P[1].sec = null;

// ---------- HTML ----------
const css = `
@page { size: 297mm 210mm; margin: 0 }
* { box-sizing: border-box }
html, body { margin: 0; padding: 0 }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact }
.pg { width: 297mm; height: 210mm; position: relative; overflow: hidden; break-after: page; padding: 15mm 18mm 20mm;
  background: var(--bg); color: var(--fg); font: 400 9pt/1.55 'Plus Jakarta Sans', sans-serif }
.pg:last-child { break-after: auto }
.light { --bg: #F6F1E7; --fg: #121212; --muted: #5E5850; --line: #D9CCB0; --accent: #7A5C22; --surface: #FFFCF6 }
.dark { --bg: #121212; --fg: #F1ECE2; --muted: #A39C90; --line: #3A342A; --accent: #D9B670; --surface: #1B1A18 }
.foot { position: absolute; left: 18mm; right: 18mm; bottom: 9mm; display: flex; justify-content: space-between; border-top: .25mm solid var(--line);
  padding-top: 2.6mm; font: 600 6.3pt/1 'Plus Jakarta Sans'; letter-spacing: .22em; text-transform: uppercase; color: var(--muted) }
.eyebrow { font: 600 7pt/1.3 'Plus Jakarta Sans'; letter-spacing: .3em; text-transform: uppercase; color: var(--accent) }
h2 { font: 700 23pt/1.1 'Cinzel'; letter-spacing: .02em; margin: 2mm 0 0 }
h3 { font: 600 16pt/1.15 'Cormorant Garamond'; margin: 0 }
.head { margin-bottom: 7mm }
.lede { color: var(--muted); max-width: 165mm; margin: 2.5mm 0 0; font-size: 9pt }
.body { margin: 0; font-size: 9pt }
.small { margin: 0; font-size: 7.6pt; color: var(--muted); line-height: 1.5 }
.cols { display: grid; gap: 7mm; align-items: start }
.cols.tight { gap: 4.5mm }
.c2 { grid-template-columns: repeat(2, minmax(0, 1fr)) } .c3 { grid-template-columns: repeat(3, minmax(0, 1fr)) }
.c4 { grid-template-columns: repeat(4, minmax(0, 1fr)) } .c5 { grid-template-columns: repeat(5, minmax(0, 1fr)) } .c7 { grid-template-columns: repeat(7, minmax(0, 1fr)) }
figure { margin: 0; min-width: 0 }
figcaption { font-size: 7.4pt; color: var(--muted); margin-top: 2mm; line-height: 1.45 }
figcaption b { color: var(--fg); font-weight: 600 }
.tile { border: .25mm solid var(--line); border-radius: 1.2mm; display: grid; place-items: center; overflow: hidden }
.tile.i { background: #F6F1E7 } .tile.k { background: #121212; border-color: #121212 } .tile.w { background: #6E1E2A; border-color: #6E1E2A }
.light .tile.i { background: #FFFCF6 }
.h28 { height: 28mm } .h30 { height: 30mm } .h34 { height: 34mm } .h52 { height: 52mm } .h68 { height: 68mm } .h90 { height: 104mm }
.tile > svg { max-width: 100%; height: auto }
img.shot { width: 100%; display: block; border-radius: 1.2mm; border: .25mm solid var(--line) }
.x { position: absolute; top: 2mm; right: 2.5mm; font: 700 8pt/1 'Plus Jakarta Sans'; color: #B3261E }
.notes { display: grid; gap: 4.5mm }
.note { display: grid; gap: 1mm; border-top: .25mm solid var(--line); padding-top: 3mm }
.note b { font: 600 13pt/1.1 'Cormorant Garamond' }
.note span { font-size: 8.2pt; color: var(--muted) }
table { border-collapse: collapse; width: 100%; font-size: 8pt; margin-top: 4mm }
th, td { text-align: left; padding: 2.1mm 3mm 2.1mm 0; border-bottom: .25mm solid var(--line); vertical-align: top }
th { font: 600 6.5pt/1.3 'Plus Jakarta Sans'; letter-spacing: .16em; text-transform: uppercase; color: var(--muted) }
pre { margin: 0; background: #121212; color: #E9E2D3; border-radius: 1.2mm; padding: 4mm 5mm; font: 7.2pt/1.6 ui-monospace, Menlo, Consolas, monospace; white-space: pre; overflow: hidden }
.stack { display: grid; gap: 5mm }

/* sampul */
.pattern { position: absolute; inset: 0; width: 100%; height: 100% }
.cover { position: absolute; inset: 22mm 22mm 18mm; display: flex; flex-direction: column; justify-content: space-between }
.cover h1 { font: 700 60pt/0.98 'Cinzel'; letter-spacing: .04em; margin: 6mm 0 0; color: #F1ECE2 }
.cover .tag { font: italic 500 22pt/1.2 'Cormorant Garamond'; color: #E6CF95; margin: 7mm 0 0 }
.cover-foot { display: flex; gap: 14mm; font: 600 7.5pt/1 'Plus Jakarta Sans'; letter-spacing: .26em; text-transform: uppercase; color: #A39C90 }
.cover-mark { position: absolute; right: 30mm; top: 50%; transform: translateY(-50%) }
.cover-mark svg { height: 112mm; width: auto }
.back { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9mm }
.back svg { height: 56mm; width: auto }
.bt { font: 600 10pt/1 'Plus Jakarta Sans'; letter-spacing: .5em; color: #E6CF95; margin-right: -.5em }
.bs { font-size: 7.5pt; letter-spacing: .1em; color: #A39C90 }

/* pengantar */
.intro { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 18mm; height: 100%; align-items: center }
.verse { font: italic 500 25pt/1.25 'Cormorant Garamond'; margin: 5mm 0 0 }
.cite { font: 600 7.5pt/1 'Plus Jakarta Sans'; letter-spacing: .3em; color: var(--muted); margin-top: 4mm }
.toc { list-style: none; margin: 5mm 0 0; padding: 0; display: grid; gap: 3.2mm }
.toc li { display: flex; align-items: baseline; gap: 3mm; font: 600 14pt/1.1 'Cormorant Garamond' }
.toc i { flex: 1; border-bottom: .3mm dotted var(--line); transform: translateY(-1mm) }
.toc b { font: 700 9pt/1 'Cinzel'; color: var(--accent) }

/* warna */
.sw-grid { gap: 4mm }
.sw { border: .25mm solid var(--line); border-radius: 1.2mm; overflow: hidden; background: var(--surface) }
.sw .chip { height: 20mm; display: flex; align-items: flex-end; padding: 2.4mm 3mm; font: 600 6pt/1 'Plus Jakarta Sans'; letter-spacing: .2em; text-transform: uppercase }
.sw .info { padding: 2.6mm 3mm 3mm }
.sw .name { font: 600 12.5pt/1.1 'Cormorant Garamond' }
.sw .role { font-size: 6.8pt; color: var(--muted); margin-top: .8mm; min-height: 6mm; line-height: 1.35 }
.sw .codes { display: grid; grid-template-columns: auto 1fr; gap: .3mm 3mm; font-size: 7pt; margin-top: 1.6mm; font-variant-numeric: tabular-nums }
.sw .codes span { color: var(--muted) }
.ratio { display: flex; height: 9mm; border-radius: 1.2mm; overflow: hidden; border: .25mm solid var(--line); margin-top: 5mm }
.ratio span { display: flex; align-items: center; padding-left: 3mm; font: 600 6.5pt/1 'Plus Jakarta Sans'; letter-spacing: .12em; white-space: nowrap }

/* tipografi */
.fonts { display: grid; gap: 5mm }
.font { border: .25mm solid var(--line); border-radius: 1.2mm; background: var(--surface); padding: 8.5mm 9mm; display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); gap: 8mm; align-items: center }
.font .big { font-size: 36pt; line-height: 1.05 }
.font .alpha { color: var(--muted); margin-top: 2mm }
.font .meta { display: grid; gap: 2mm; font-size: 8.6pt; color: var(--muted) }
.font .meta b { color: var(--fg); font: 600 7.5pt/1 'Plus Jakarta Sans'; letter-spacing: .16em; text-transform: uppercase }
.scale { border: .25mm solid var(--line); border-radius: 1.2mm; padding: 6mm; display: grid; gap: 5mm; background: var(--surface) }
.scale .row { display: grid; grid-template-columns: 36mm minmax(0, 1fr); gap: 4mm; align-items: baseline }
.scale .row > span { font: 600 6.3pt/1.3 'Plus Jakarta Sans'; letter-spacing: .14em; text-transform: uppercase; color: var(--muted) }

/* instagram */
.hl { aspect-ratio: 1; border-radius: 50%; overflow: hidden; border: .25mm solid var(--line) }
.hl img { width: 100%; height: 100%; object-fit: cover; display: block }

/* mockup */
.pg.mock { padding: 0; background: #E4DED4 }
img.mock { position: absolute; left: 0; top: 0; width: 297mm; height: 198mm; object-fit: cover }
.mock-cap { position: absolute; left: 0; right: 0; bottom: 0; height: 12mm; background: #121212; color: #F1ECE2; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 8mm; align-items: center; padding: 0 18mm }
.mock-cap b { font: 700 9pt/1 'Cinzel'; letter-spacing: .04em; color: #D9B670; white-space: nowrap }
.mock-cap p { margin: 0; font-size: 7.4pt; line-height: 1.35; color: #CFC7B9 }
.mock-cap span { font: 600 6.3pt/1 'Plus Jakarta Sans'; letter-spacing: .22em; color: #A39C90 }

/* referensi */
.dir { border: .25mm solid var(--line); border-radius: 1.2mm; padding: 6mm; background: var(--surface); display: grid; gap: 2.5mm; align-content: start; min-height: 74mm }
.dir .tag { font: 700 7pt/1 'Plus Jakarta Sans'; letter-spacing: .22em; color: var(--accent) }
.dir h3 { font-size: 21pt }
.dir p { margin: 0; color: var(--muted); font-size: 9pt }
.dir .who { margin-top: auto; padding-top: 3mm; border-top: .25mm solid var(--line); font: 600 7.4pt/1.5 'Plus Jakarta Sans'; color: var(--fg) }
.rec { margin: 9mm 0 0; border-left: .8mm solid #C8A25A; padding: 1mm 0 1mm 6mm; font: italic 500 15pt/1.4 'Cormorant Garamond'; max-width: 210mm }
.refs { gap: 4.5mm }
.ref { border: .25mm solid var(--line); border-radius: 1.2mm; padding: 4mm 4.5mm; background: var(--surface); display: grid; gap: 2mm; align-content: start; min-height: 66mm }
.ref .rh { display: grid; grid-template-columns: 9mm minmax(0, 1fr); gap: 2mm; align-items: start }
.ref .n { font: 700 15pt/1 'Cinzel'; color: #C8A25A }
.ref h4 { margin: 0; font: 600 13.5pt/1.1 'Cormorant Garamond' }
.ref .loc { font: 600 5.8pt/1.4 'Plus Jakarta Sans'; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-top: 1mm }
.ref .url { font-size: 7pt; color: var(--accent); margin-top: .6mm }
.ref p { margin: 0; font-size: 7.2pt; line-height: 1.45 }
.ref .take { color: var(--muted) }
.ref .take b { display: block; color: var(--accent); font: 600 5.8pt/1.4 'Plus Jakarta Sans'; letter-spacing: .14em; text-transform: uppercase; margin-bottom: .5mm }
.ref.feat ol { margin: 0; padding-left: 4mm; display: grid; gap: 1.2mm; font-size: 7.2pt; line-height: 1.4 }
.ref.feat b { font-weight: 600 }
.tree { font-size: 7.6pt; line-height: 1.75 }
`;

const pages = P.map((p, i) => {
  const cls = `pg ${p.dark ? 'dark' : 'light'}${p.mock ? ' mock' : ''}`;
  const foot = p.bare || !p.sec ? (i === 1 ? `<div class="foot"><span>Gereja Alfa Omega · Panduan Brand</span><span>02</span></div>` : '')
    : `<div class="foot"><span>Gereja Alfa Omega · ${p.sec}</span><span>${String(i + 1).padStart(2, '0')}</span></div>`;
  return `<section class="${cls}">${p.body}${foot}</section>`;
}).join('\n');

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Panduan Brand Alfa Omega</title><style>${fontCSS()}${css}</style></head><body>${pages}</body></html>`;
fs.mkdirSync(path.join(CACHE, 'pdf'), { recursive: true });
const htmlPath = path.join(CACHE, 'pdf', 'panduan.html');
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: OUT, width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`${path.relative(process.cwd(), OUT)}  ${P.length} halaman  ${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB`);
