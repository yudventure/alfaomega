// Visual untuk website (site/img): komposisi "cahaya" bergaya brand sebagai pengganti foto
// sampai foto gereja asli tersedia. Dirender lewat render.mjs ("site/").
import { C, page, markSvg, chevrons } from './lib.mjs';

const DIR = '../site/img';

// Lingkaran cahaya lembut (bokeh). c = [x%, y%, ukuran px, warna, opasitas, blur px]
const orb = ([x, y, s, col, op, bl]) =>
  `<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;border-radius:50%;background:radial-gradient(circle at 40% 40%, ${col} 0%, ${col} 35%, transparent 72%);opacity:${op};filter:blur(${bl}px)"></div>`;

function scene(w, h, { base, orbs, pattern = {}, vignette = 0.55, grain = true, mark = null, tint = null }) {
  const pat = pattern.count === 0 ? '' : `<svg width="${w}" height="${h}" style="position:absolute;inset:0;opacity:${pattern.op ?? 0.16}">
    ${chevrons({ cx: pattern.cx ?? w / 2, cy: 0, count: pattern.count ?? 12, step: -(pattern.step ?? h * 0.08), color: pattern.color ?? C.emas, opacity: 1, width: Math.max(1.2, w / 1400), start: -(pattern.apex ?? h * 0.12) })}</svg>`;
  const body = `
    <div style="position:absolute;inset:0;background:${base}"></div>
    ${pat}
    ${orbs.map(orb).join('')}
    ${tint ? `<div style="position:absolute;inset:0;background:${tint}"></div>` : ''}
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,${vignette}) 100%)"></div>
    ${mark ? `<div style="position:absolute;inset:0;display:grid;place-items:center;opacity:${mark.op}">${markSvg({ h: mark.h, fill: mark.fill })}</div>` : ''}
    ${grain ? `<svg width="${w}" height="${h}" style="position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>` : ''}`;
  return page(w, h, body, { bg: C.hitam });
}

const GOLD = '#E6C27A', AMBER = '#C8863E', CREAM = '#F3E3B5', WINE = '#8E2A3A', WARM = '#5A3F1C';

const SCENES = {
  // hero: gelap, cahaya emas dari kanan atas, ruang teks di kiri bawah
  'hero-cahaya': [2400, 1350, {
    base: 'linear-gradient(115deg, #0C0B0A 0%, #1A1612 45%, #2B2216 100%)',
    orbs: [[78, 28, 1100, AMBER, .55, 90], [86, 22, 420, GOLD, .9, 30], [62, 70, 700, WARM, .6, 80], [30, 85, 900, '#1E1710', .9, 100], [92, 60, 260, CREAM, .5, 24], [70, 40, 90, CREAM, .9, 6], [58, 25, 60, GOLD, .8, 5]],
    pattern: { cx: 1750, count: 16, step: 96, apex: 60, op: .14 }, vignette: .5 }],
  // ponsel
  'hero-cahaya-ponsel': [1080, 1600, {
    base: 'linear-gradient(160deg, #0C0B0A 0%, #1A1612 50%, #2B2216 100%)',
    orbs: [[70, 24, 700, AMBER, .55, 80], [80, 18, 300, GOLD, .9, 28], [40, 50, 500, WARM, .6, 70], [50, 95, 900, '#161210', .95, 100], [88, 48, 180, CREAM, .5, 20]],
    pattern: { cx: 540, count: 16, step: 110, apex: 160, op: .14 }, vignette: .5 }],
  // siapa kami: lebih terang & hangat
  'siapa-kami': [1200, 900, {
    base: 'linear-gradient(135deg, #3A2B17 0%, #6B4E26 55%, #A5803F 100%)',
    orbs: [[75, 30, 620, CREAM, .75, 60], [25, 75, 520, AMBER, .6, 70], [60, 60, 160, '#FFF6DC', .9, 14], [40, 30, 90, '#FFF6DC', .8, 8]],
    pattern: { cx: 900, count: 10, step: 80, apex: 40, op: .22 }, vignette: .35 }],
  // langkah 1–5
  'langkah-1': [1200, 900, { base: 'linear-gradient(135deg, #171310 0%, #2E2416 100%)', orbs: [[70, 35, 700, AMBER, .6, 80], [30, 80, 500, WARM, .7, 70], [80, 30, 180, CREAM, .7, 18]], pattern: { cx: 800, count: 10, step: 84, apex: 60, op: .2 } }],
  'langkah-2': [1200, 900, { base: 'linear-gradient(135deg, #8A6A33 0%, #C8A25A 60%, #E6CF95 100%)', orbs: [[30, 30, 600, '#FFF4D6', .8, 60], [80, 75, 500, '#A07A33', .7, 70]], pattern: { cx: 400, count: 10, step: 84, apex: 40, color: '#5A3F1C', op: .18 }, vignette: .3 }],
  'langkah-3': [1200, 900, { base: 'linear-gradient(135deg, #EDE4D1 0%, #F6F1E7 60%, #FFFCF6 100%)', orbs: [[70, 30, 600, '#E6CF95', .9, 60], [25, 80, 500, '#D9C7A0', .7, 70]], pattern: { cx: 800, count: 10, step: 84, apex: 40, color: C.emas, op: .35 }, vignette: .12, grain: false, mark: { h: 300, fill: '#D9C7A0', op: .55 } }],
  'langkah-4': [1200, 900, { base: 'linear-gradient(135deg, #1D1A24 0%, #2E3542 60%, #4C5B6B 100%)', orbs: [[70, 30, 600, '#9DB7CC', .55, 70], [30, 80, 520, '#2A3340', .9, 80], [80, 70, 200, '#DCE9F2', .5, 20]], pattern: { cx: 800, count: 10, step: 84, apex: 60, color: '#CFE0EC', op: .16 } }],
  'langkah-5': [1200, 900, { base: 'linear-gradient(135deg, #3E1016 0%, #6E1E2A 60%, #8E2A3A 100%)', orbs: [[70, 30, 600, '#C8A25A', .55, 70], [30, 80, 500, '#4A1119', .9, 80], [84, 66, 160, CREAM, .5, 18]], pattern: { cx: 800, count: 10, step: 84, apex: 60, op: .22 } }],
  // bento
  'bento-lebar': [1600, 900, { base: 'linear-gradient(120deg, #0F0D0B 0%, #241B12 60%, #3B2C19 100%)', orbs: [[80, 40, 800, AMBER, .5, 90], [20, 70, 600, WARM, .7, 80], [88, 36, 220, CREAM, .6, 20], [60, 20, 90, GOLD, .8, 6]], pattern: { cx: 1300, count: 12, step: 80, apex: 40, op: .16 } }],
  'bento-tinggi': [900, 1400, { base: 'linear-gradient(170deg, #241B12 0%, #0F0D0B 100%)', orbs: [[50, 22, 700, AMBER, .5, 90], [50, 20, 260, GOLD, .9, 30], [30, 85, 600, '#1A140E', .9, 90]], pattern: { cx: 450, count: 14, step: 90, apex: 120, op: .16 } }],
  // khotbah thumbnail latar (judul ditulis HTML di atasnya)
  'khotbah-1': [1280, 720, { base: 'linear-gradient(120deg, #0F0D0B 0%, #2A2015 100%)', orbs: [[80, 45, 640, AMBER, .55, 70], [30, 80, 500, WARM, .6, 70]], pattern: { cx: 1000, count: 10, step: 70, apex: 30, op: .18 } }],
  'khotbah-2': [1280, 720, { base: 'linear-gradient(120deg, #15110C 0%, #3A2D18 100%)', orbs: [[20, 40, 640, GOLD, .45, 70], [80, 80, 500, WARM, .6, 70]], pattern: { cx: 300, count: 10, step: 70, apex: 30, op: .18 } }],
  'khotbah-3': [1280, 720, { base: 'linear-gradient(120deg, #1A1414 0%, #4A1A22 100%)', orbs: [[75, 40, 600, '#C8A25A', .45, 70], [25, 80, 500, '#5A1620', .8, 70]], pattern: { cx: 950, count: 10, step: 70, apex: 30, op: .2 } }],
  // kunjungi kami: peta abstrak (grid jalan) di atas gading
  'kunjungi': [1200, 900, { base: '#EDE4D1', orbs: [[60, 45, 500, '#E6CF95', .9, 50]], pattern: { count: 0 }, vignette: .1, grain: false, mark: { h: 180, fill: C.hitam, op: 1 } }],
};

export default function () {
  return Object.entries(SCENES).map(([name, [w, h, o]]) => ({ out: `${DIR}/${name}.jpg`, w, h, html: scene(w, h, o) }));
}
