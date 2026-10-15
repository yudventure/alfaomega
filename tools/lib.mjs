// Bahan bersama untuk render.mjs: warna, font, lambang singa, logo, pola.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const TOOLS = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(TOOLS, '..');
export const BRAND = path.join(ROOT, 'brand');

export const C = {
  hitam: '#121212', emas: '#C89C4A', emasTua: '#94702B', emasMuda: '#E8CB86',
  gading: '#F6F1E7', putih: '#FFFFFF', arang: '#2A2826', batu: '#8A8378', anggur: '#6E1E2A',
};

export const MARK = JSON.parse(fs.readFileSync(path.join(TOOLS, 'mark.json'), 'utf8'));
export const MARK_RATIO = MARK.w / MARK.h;
export const PREFIX = 'kapernaum';

let gid = 0;
// Gradien emas metalik (dipakai di media digital & mockup, bukan untuk cetak 1 warna)
export function goldGradient(id, x1 = '0%', y1 = '0%', x2 = '100%', y2 = '100%') {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
    <stop offset="0" stop-color="#F0D99E"/><stop offset=".38" stop-color="#C89C4A"/>
    <stop offset=".7" stop-color="#A27A2E"/><stop offset="1" stop-color="#DDB86A"/></linearGradient>`;
}

// Lambang (cincin + singa; bagian: 'singa' untuk singa saja) sebagai elemen <svg> mandiri.
// fill boleh warna atau 'gold' (gradien).
export function markSvg({ h, fill = C.hitam, style = '', attrs = '', bagian = 'd' }) {
  const w = h * MARK_RATIO;
  let defs = '', f = fill;
  if (fill === 'gold') { const id = `g${gid++}`; defs = `<defs>${goldGradient(id)}</defs>`; f = `url(#${id})`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK.w} ${MARK.h}" width="${w.toFixed(2)}" height="${h}" style="${style}" ${attrs}>${defs}<path fill="${f}" fill-rule="evenodd" d="${MARK[bagian]}"/></svg>`;
}

// Lencana berwarna seperti logo asli: piringan (hitam) + cincin & singa (emas / 'gold'). h = diameter piringan.
export function lencanaSvg({ h, disc = C.hitam, fill = 'gold', style = '', attrs = '' }) {
  const rp = MARK.r_piringan;
  let defs = '', f = fill;
  if (fill === 'gold') { const id = `g${gid++}`; defs = `<defs>${goldGradient(id)}</defs>`; f = `url(#${id})`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${50 - rp} ${50 - rp} ${2 * rp} ${2 * rp}" width="${h}" height="${h}" style="${style}" ${attrs}>${defs}<circle cx="50" cy="50" r="${rp}" fill="${disc}"/><path fill="${f}" fill-rule="evenodd" d="${MARK.d}"/></svg>`;
}

// Path lambang untuk disisipkan di dalam SVG lain (x, y = pojok kiri atas)
export function markPath({ x = 0, y = 0, h, fill = C.hitam, extra = '', bagian = 'd' }) {
  const k = h / MARK.h;
  return `<path transform="translate(${x} ${y}) scale(${k})" fill="${fill}" fill-rule="evenodd" d="${MARK[bagian]}" ${extra}/>`;
}

// File logo dari brand/logo/svg. Warna emas bisa diganti gradien.
export function logoSvg(name, { width, height, style = '', gold = false } = {}) {
  let s = fs.readFileSync(path.join(BRAND, 'logo', 'svg', `${PREFIX}-${name}.svg`), 'utf8').trim();
  s = s.replace(/ width="[\d.]+" height="[\d.]+"/, `${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''} style="${style}"`);
  if (gold) {
    const id = `g${gid++}`;
    s = s.replace('<title>', `<defs>${goldGradient(id)}</defs><title>`).replaceAll(`fill="${C.emas}"`, `fill="url(#${id})"`);
  }
  return s;
}

// Pola "Gema Cincin": lingkaran-lingkaran sepusat yang memantulkan cincin lambang,
// makin jauh makin pudar. (cx, cy) = pusat, r0 = jari-jari pertama, step = jarak antarlingkaran.
export function gema({ cx, cy, r0 = 120, count = 12, step = 60, color = C.emas, width = 1.5, opacity = 0.5, fade = true }) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const op = fade ? opacity * (1 - i / count) : opacity;
    out += `<circle cx="${cx}" cy="${cy}" r="${(r0 + i * step).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-opacity="${op.toFixed(3)}"/>`;
  }
  return out;
}

const fontFiles = {
  'Cormorant Garamond': [['CormorantGaramond/CormorantGaramond-SemiBold.ttf', 600, 'normal'], ['CormorantGaramond/CormorantGaramond-Italic.ttf', 400, 'italic'], ['CormorantGaramond/CormorantGaramond-MediumItalic.ttf', 500, 'italic'], ['CormorantGaramond/CormorantGaramond-SemiBoldItalic.ttf', 600, 'italic'], ['CormorantGaramond/CormorantGaramond-Medium.ttf', 500, 'normal']],
  'Plus Jakarta Sans': [['PlusJakartaSans/PlusJakartaSans-Regular.ttf', 400, 'normal'], ['PlusJakartaSans/PlusJakartaSans-Medium.ttf', 500, 'normal'], ['PlusJakartaSans/PlusJakartaSans-SemiBold.ttf', 600, 'normal'], ['PlusJakartaSans/PlusJakartaSans-Bold.ttf', 700, 'normal'], ['PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf', 800, 'normal']],
};
let fontCSSCache;
export function fontCSS() {
  if (fontCSSCache) return fontCSSCache;
  fontCSSCache = Object.entries(fontFiles).flatMap(([fam, files]) => files.map(([f, w, st]) =>
    `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(data:font/ttf;base64,${fs.readFileSync(path.join(BRAND, 'fonts', f)).toString('base64')}) format('truetype');}`)).join('\n');
  return fontCSSCache;
}

export function page(w, h, body, { bg = 'transparent', css = '' } = {}) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS()}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${w}px;height:${h}px;background:${bg};overflow:hidden}
  .logo{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800}.corm{font-family:'Cormorant Garamond',serif}.jak{font-family:'Plus Jakarta Sans',sans-serif}
  ${css}</style></head><body>${body}</body></html>`;
}

const LOGOS = JSON.parse(fs.readFileSync(path.join(TOOLS, 'logos.json'), 'utf8'));
// Logo sebagai <svg> bersarang di dalam SVG lain, pada (x, y) dengan lebar tertentu.
export function logoNested(name, x, y, width, opts = {}) {
  const m = LOGOS[`${PREFIX}-${name}`];
  const height = width * m.h / m.w;
  return logoSvg(name, { ...opts, width, height }).replace('<svg ', `<svg x="${x}" y="${y}" `);
}
