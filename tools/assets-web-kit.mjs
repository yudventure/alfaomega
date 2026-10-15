// Kit website (raster): logo PNG @1x/@2x, gambar share per halaman, latar hero, placeholder, ikon tambahan.
// Versi WebP & file SVG dibuat oleh build_web.py setelah render.
import fs from 'fs';
import path from 'path';
import { C, TOOLS, PREFIX, page, markSvg, logoSvg, gema } from './lib.mjs';

const W = 'web';
const LOGOS = JSON.parse(fs.readFileSync(path.join(TOOLS, 'logos.json'), 'utf8'));

// ---------- logo PNG ----------
const WEB_LOGOS = [
  // [nama file, logo sumber, ukuran @1x (h = tinggi, w = lebar)]
  ['logo-header-terang', 'horizontal-ringkas-warna', { h: 48 }],
  ['logo-header-gelap', 'horizontal-ringkas-emas-gading', { h: 48 }],
  ['logo-lengkap-terang', 'horizontal-warna', { h: 64 }],
  ['logo-lengkap-gelap', 'horizontal-emas-gading', { h: 64 }],
  ['logo-footer-terang', 'bertumpuk-lengkap-warna', { w: 240 }],
  ['logo-footer-gelap', 'bertumpuk-lengkap-emas-gading', { w: 240 }],
  ['lambang-warna', 'lambang-warna', { h: 256 }],
  ['lambang-hitam', 'lambang-hitam', { h: 256 }],
  ['lambang-emas', 'lambang-emas', { h: 256 }],
  ['lambang-putih', 'lambang-putih', { h: 256 }],
];
function logoPngs() {
  return WEB_LOGOS.flatMap(([out, src, size]) => {
    const m = LOGOS[`${PREFIX}-${src}`];
    return [1, 2].map(k => {
      const w = Math.round((size.w || size.h * m.w / m.h) * k), h = Math.round((size.h || size.w * m.h / m.w) * k);
      return { out: `${W}/logo/${out}${k === 2 ? '@2x' : ''}.png`, w, h, transparent: true, html: page(w, h, logoSvg(src, { width: w, height: h, style: 'display:block' })) };
    });
  });
}

// ---------- latar ----------
// Latar dengan pola "Gema Cincin" berpusat di (cx, cy). apex = jari-jari cincin pertama.
function darkBg(w, h, { cx = w / 2, cy = h * 0.5, gx = '50%', gy = '45%', r = '60%', apex = h * 0.1, step = h * 0.09, count = 14, op = 0.18 } = {}) {
  return `<svg width="${w}" height="${h}" style="position:absolute;inset:0">
    <defs><radialGradient id="glow" cx="${gx}" cy="${gy}" r="${r}"><stop offset="0" stop-color="#2E2619"/><stop offset=".55" stop-color="#1A1713"/><stop offset="1" stop-color="${C.hitam}"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${count ? gema({ cx, cy, r0: apex, count, step, opacity: op, width: Math.max(1.2, w / 1200) }) : ''}</svg>`;
}
function lightBg(w, h, { cx = w / 2, cy = h * 0.5, apex = h * 0.1, step = h * 0.09, count = 14, op = 0.22 } = {}) {
  return `<svg width="${w}" height="${h}" style="position:absolute;inset:0">
    <defs><radialGradient id="glowL" cx="50%" cy="42%" r="65%"><stop offset="0" stop-color="#FFFDF8"/><stop offset=".6" stop-color="${C.gading}"/><stop offset="1" stop-color="#EDE5D4"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#glowL)"/>
    ${gema({ cx, cy, r0: apex, count, step, color: C.emas, opacity: op, width: Math.max(1.2, w / 1200) })}</svg>`;
}

function heroes() {
  return [
    { out: `${W}/hero/hero-gelap-2560x1440.jpg`, w: 2560, h: 1440, html: page(2560, 1440, darkBg(2560, 1440, { apex: 120, step: 110, count: 16, op: 0.16, gy: '55%', r: '55%' }), { bg: C.hitam }) },
    { out: `${W}/hero/hero-gelap-ponsel-1080x1920.jpg`, w: 1080, h: 1920, html: page(1080, 1920, darkBg(1080, 1920, { apex: 260, step: 120, count: 16, op: 0.17, gy: '48%' }), { bg: C.hitam }) },
    { out: `${W}/hero/hero-terang-2560x1440.jpg`, w: 2560, h: 1440, html: page(2560, 1440, lightBg(2560, 1440, { apex: 120, step: 110, count: 16, op: 0.2 }), { bg: C.gading }) },
    { out: `${W}/hero/hero-terang-ponsel-1080x1920.jpg`, w: 1080, h: 1920, html: page(1080, 1920, lightBg(1080, 1920, { apex: 260, step: 120, count: 16, op: 0.2 }), { bg: C.gading }) },
  ];
}

// ---------- gambar share (Open Graph) per halaman ----------
const OG = [
  ['ibadah', 'Ibadah Raya', 'Mari datang dan beribadah bersama.'],
  ['kunjungi', 'Kunjungi Kami', 'Pertama kali datang? Kami menantikan Anda.'],
  ['renungan', 'Renungan', 'Firman Tuhan untuk setiap hari.'],
  ['khotbah', 'Khotbah', 'Saksikan dan dengarkan kembali firman Tuhan.'],
  ['acara', 'Acara & Kegiatan', 'Bertumbuh bersama dalam persekutuan.'],
  ['komsel', 'Komsel', 'Bertumbuh bersama dalam kelompok sel.'],
  ['persembahan', 'Persembahan', '“Allah mengasihi orang yang memberi dengan sukacita.”', '2 KORINTUS 9:7'],
  ['tentang', 'Tentang Kami', 'Keluarga rohani di Kota Sorong.'],
  ['kontak', 'Hubungi Kami', 'Kami siap mendengar dan mendoakan Anda.'],
];
function ogPage([slug, title, sub, ref]) {
  const w = 1200, h = 630;
  const body = `${darkBg(w, h, { cx: 930, cy: h / 2, gx: '78%', gy: '50%', r: '55%', apex: 200, step: 58, count: 10, op: 0.2 })}
    <div style="position:absolute;right:110px;top:50%;transform:translateY(-50%)">${markSvg({ h: 340, fill: 'gold' })}</div>
    <div style="position:absolute;left:84px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center">
      <div class="jak" style="font-weight:700;font-size:18px;letter-spacing:.42em;color:${C.emas}">GBI KAPERNAUM SORONG</div>
      <div class="logo" style="font-size:${title.length > 13 ? 56 : 68}px;line-height:1.05;letter-spacing:.01em;text-transform:uppercase;color:${C.gading};margin-top:22px">${title.replace('&', '&amp;')}</div>
      <div style="width:72px;height:3px;background:${C.emas};margin:30px 0 24px"></div>
      <div class="corm" style="font-style:italic;font-weight:500;font-size:${sub.length > 50 ? 30 : 34}px;line-height:1.3;color:${C.emasMuda}">${sub}</div>
      ${ref ? `<div class="jak" style="font-weight:600;font-size:15px;letter-spacing:.36em;color:${C.batu};margin-top:16px;white-space:nowrap">${ref}</div>` : ''}
    </div>`;
  return { out: `${W}/og/og-${slug}.jpg`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

// ---------- placeholder ----------
function placeholder(ratio, w, h, tone) {
  const dark = tone === 'gelap';
  const bg = dark ? darkBg(w, h, { count: 10, apex: h * 0.2, step: h * 0.09, op: 0.1 }) : lightBg(w, h, { count: 10, apex: h * 0.2, step: h * 0.09, op: 0.14 });
  const body = `${bg}<div style="position:absolute;inset:0;display:grid;place-items:center">${markSvg({ h: Math.round(Math.min(w, h) * 0.26), fill: dark ? '#3B352B' : '#E2D6BC' })}</div>`;
  return { out: `${W}/placeholder/placeholder-${tone}-${ratio}.jpg`, w, h, html: page(w, h, body, { bg: dark ? C.hitam : C.gading }) };
}

// ---------- ikon aplikasi tambahan ----------
function appIcon(out, size, markScale, rounded = false) {
  const body = `<div style="width:${size}px;height:${size}px;background:${C.hitam};border-radius:${rounded ? size * 0.22 : 0}px;display:grid;place-items:center">${markSvg({ h: size * markScale, fill: size >= 150 ? 'gold' : C.emas })}</div>`;
  return { out, w: size, h: size, html: page(size, size, body, { bg: C.hitam }) };
}

export const OG_PAGES = OG;
export default function () {
  return [
    ...logoPngs(),
    ...heroes(),
    ...OG.map(ogPage),
    ...[['16x9', 1600, 900], ['4x3', 1200, 900], ['1x1', 1080, 1080]].flatMap(([r, w, h]) => ['gelap', 'terang'].map(t => placeholder(r, w, h, t))),
    appIcon(`${W}/icon-maskable-192.png`, 192, 0.6),
    appIcon(`${W}/mstile-150x150.png`, 150, 0.56),
  ];
}
