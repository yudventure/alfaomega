// Ekspor PNG logo + aset website (favicon, ikon aplikasi, gambar share).
import fs from 'fs';
import path from 'path';
import { C, TOOLS, PREFIX, page, markSvg, markPath, logoSvg, gema } from './lib.mjs';

const logos = JSON.parse(fs.readFileSync(path.join(TOOLS, 'logos.json'), 'utf8'));

function logoPng(name, meta) {
  // sisi terpanjang 2000px (lambang 1200px), latar transparan
  const long = name.includes('lambang') ? 1200 : 2000;
  const k = long / Math.max(meta.w, meta.h);
  const w = Math.round(meta.w * k), h = Math.round(meta.h * k);
  const short = name.replace(`${PREFIX}-`, '');
  return {
    out: `logo/png/${name}.png`, w, h, transparent: true,
    html: page(w, h, logoSvg(short, { width: w, height: h, style: 'display:block' })),
  };
}

// Favicon: piringan hitam + singa emas. Di ukuran kecil cincin terlalu tipis, jadi singa saja yang dibesarkan.
export const faviconSvg = (size = 64) => {
  const kecil = size <= 32;
  const mh = size * (kecil ? 0.86 : 0.8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${C.hitam}"/>${markPath({ x: (size - mh) / 2, y: (size - mh) / 2, h: mh, fill: C.emas, bagian: kecil ? 'singa' : 'd' })}</svg>`;
};

// Ikon aplikasi: kotak hitam (membulat) + lambang emas. markScale = tinggi cincin terhadap sisi ikon.
function icon(out, size, { rounded = true, markScale = 0.72, bulat = false } = {}) {
  const kecil = size <= 32;
  const mh = size * (kecil ? 0.86 : markScale);
  const radius = bulat ? '50%' : `${rounded ? size * 0.22 : 0}px`;
  const body = `<div style="width:${size}px;height:${size}px;background:${C.hitam};border-radius:${radius};display:flex;align-items:center;justify-content:center">${markSvg({ h: mh, fill: size >= 180 ? 'gold' : C.emas, bagian: kecil ? 'singa' : 'd' })}</div>`;
  return { out, w: size, h: size, transparent: rounded || bulat, html: page(size, size, body) };
}

function ogImage() {
  const w = 1200, h = 630;
  const body = `
  <svg width="${w}" height="${h}" style="position:absolute;inset:0">
    <defs><radialGradient id="glow" cx="50%" cy="44%" r="62%"><stop offset="0" stop-color="#2E2516"/><stop offset="1" stop-color="${C.hitam}"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${gema({ cx: w / 2, cy: h * 0.44, r0: 250, count: 9, step: 62, opacity: 0.2, width: 1.2 })}
  </svg>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px">
    ${logoSvg('horizontal-emas-gading', { width: 660, gold: true })}
    <div class="corm" style="font-style:italic;font-weight:500;font-size:36px;color:${C.emasMuda};letter-spacing:.01em">Keluarga rohani di Kota Sorong</div>
    <div class="jak" style="font-weight:600;font-size:15px;letter-spacing:.38em;color:${C.batu}">IBADAH RAYA MINGGU · 09.00 WIT · JL. SEJAHTERA KM.10</div>
  </div>`;
  return { out: 'web/og/og-beranda.jpg', w, h, html: page(w, h, body, { bg: C.hitam }) };
}

export default function () {
  const list = Object.entries(logos).map(([n, m]) => logoPng(n, m));
  list.push(
    icon('web/favicon-16.png', 16, { bulat: true }),
    icon('web/favicon-32.png', 32, { bulat: true }),
    icon('web/favicon-48.png', 48, { bulat: true, markScale: 0.8 }),
    icon('web/apple-touch-icon.png', 180, { rounded: false, markScale: 0.74 }),
    icon('web/icon-192.png', 192, { bulat: true, markScale: 0.8 }),
    icon('web/icon-512.png', 512, { bulat: true, markScale: 0.8 }),
    icon('web/icon-maskable-512.png', 512, { rounded: false, markScale: 0.6 }),
    ogImage(),
  );
  return list;
}
