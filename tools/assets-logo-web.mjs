// Ekspor PNG logo + aset website (favicon, ikon aplikasi, gambar share).
import fs from 'fs';
import path from 'path';
import { C, TOOLS, page, markSvg, markPath, logoSvg, chevrons } from './lib.mjs';

const logos = JSON.parse(fs.readFileSync(path.join(TOOLS, 'logos.json'), 'utf8'));

function logoPng(name, meta) {
  // sisi terpanjang 2000px (monogram 1200px), latar transparan
  const long = name.includes('monogram') ? 1200 : 2000;
  const k = long / Math.max(meta.w, meta.h);
  const w = Math.round(meta.w * k), h = Math.round(meta.h * k);
  const short = name.replace('alfaomega-', '');
  return {
    out: `logo/png/${name}.png`, w, h, transparent: true,
    html: page(w, h, logoSvg(short, { width: w, height: h, style: 'display:block' })),
  };
}

export const faviconSvg = (size = 64) => {
  const mh = size * 0.62, mw = mh * 667.45 / 697.08;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${C.hitam}"/>${markPath({ x: (size - mw) / 2, y: (size - mh) / 2 + size * 0.01, h: mh, fill: C.emas })}</svg>`;
};

function icon(out, size, { rounded = true, markScale = 0.62 } = {}) {
  const mh = size * markScale;
  const body = `<div style="width:${size}px;height:${size}px;background:${C.hitam};border-radius:${rounded ? size * 0.22 : 0}px;display:flex;align-items:center;justify-content:center">${markSvg({ h: mh, fill: size >= 180 ? 'gold' : C.emas, style: `margin-top:${size * 0.02}px` })}</div>`;
  return { out, w: size, h: size, transparent: rounded, html: page(size, size, body) };
}

function ogImage() {
  const w = 1200, h = 630;
  const body = `
  <svg width="${w}" height="${h}" style="position:absolute;inset:0">
    <defs><radialGradient id="glow" cx="50%" cy="46%" r="60%"><stop offset="0" stop-color="#2B2418"/><stop offset="1" stop-color="${C.hitam}"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${chevrons({ cx: w / 2, cy: -40, count: 12, step: -64, opacity: 0.22, width: 1.2, start: -130 })}
  </svg>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px">
    ${logoSvg('horizontal-emas-gading', { width: 640, gold: true })}
    <div class="corm" style="font-style:italic;font-weight:500;font-size:34px;color:${C.emasMuda};letter-spacing:.01em">“Aku adalah Alfa dan Omega, Yang Awal dan Yang Akhir.”</div>
    <div class="jak" style="font-weight:600;font-size:15px;letter-spacing:.42em;color:${C.batu}">WAHYU 22:13</div>
  </div>`;
  return { out: 'web/og-image-1200x630.png', w, h, html: page(w, h, body, { bg: C.hitam }) };
}

export default function () {
  const list = Object.entries(logos).map(([n, m]) => logoPng(n, m));
  list.push(
    icon('web/favicon-16.png', 16, { markScale: 0.72 }),
    icon('web/favicon-32.png', 32, { markScale: 0.68 }),
    icon('web/favicon-48.png', 48),
    icon('web/apple-touch-icon.png', 180, { rounded: false, markScale: 0.6 }),
    icon('web/icon-192.png', 192),
    icon('web/icon-512.png', 512),
    icon('web/icon-maskable-512.png', 512, { rounded: false, markScale: 0.5 }),
    ogImage(),
  );
  return list;
}
