// Mockup: kaos, jaket, bendera, umbul-umbul (ilustrasi SVG + efek kain).
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { C, BRAND, TOOLS, MARK_RATIO, page, markPath, logoNested, chevrons } from './lib.mjs';

const DIR = 'mockup';
const W = 2400, H = 1600;

// ---------- latar & teks ----------
const studioBg = `<svg width="${W}" height="${H}" style="position:absolute;inset:0">
  <defs><radialGradient id="studio" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#F3EFE8"/><stop offset=".7" stop-color="#E4DED4"/><stop offset="1" stop-color="#D3CBBE"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#studio)"/></svg>`;

const skyBg = `<svg width="${W}" height="${H}" style="position:absolute;inset:0">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA3C2"/><stop offset=".55" stop-color="#B9CCD9"/><stop offset="1" stop-color="#EEDFC8"/></linearGradient>
  <filter id="cloud" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <g filter="url(#cloud)" fill="#fff" opacity=".55"><ellipse cx="420" cy="300" rx="380" ry="70"/><ellipse cx="1900" cy="220" rx="420" ry="60"/><ellipse cx="1450" cy="520" rx="300" ry="50"/><ellipse cx="300" cy="1150" rx="500" ry="90"/><ellipse cx="2100" cy="1250" rx="500" ry="90"/></g></svg>`;

function caption(x, y, text, color = '#6B655C') {
  return `<div class="jak" style="position:absolute;left:${x - 300}px;width:600px;top:${y}px;text-align:center;font-weight:700;font-size:22px;letter-spacing:.4em;color:${color}">${text}</div>`;
}
function title(main, sub, color = C.hitam, subColor = '#7A7368') {
  return `<div style="position:absolute;left:90px;top:80px">
    <div class="jak" style="font-weight:700;font-size:22px;letter-spacing:.42em;color:${subColor}">${sub}</div>
    <div class="cinzel" style="font-weight:700;font-size:54px;letter-spacing:.04em;color:${color};margin-top:10px">${main}</div></div>`;
}

// ---------- efek kain bersama ----------
// noise halus sebagai tekstur serat kain
const fabricNoise = (id) => `<filter id="${id}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/>
  <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0"/></filter>`;
const blur = (id, sd) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

// ---------- KAOS ----------
const TEE = 'M395 42C350 62 290 78 238 92C170 140 110 230 58 352L196 428C220 400 242 385 262 378C258 560 252 800 250 1052C400 1068 600 1068 750 1052C748 800 742 560 738 378C758 385 780 400 804 428L942 352C890 230 830 140 762 92C710 78 650 62 605 42';
const TEE_FRONT = `${TEE}C580 108 420 108 395 42Z`;
const TEE_BACK = `${TEE}C570 62 430 62 395 42Z`;

function tee({ x, y, scale = 1, color, dark, back = false, print, id }) {
  const body = back ? TEE_BACK : TEE_FRONT;
  const hi = dark ? '#ffffff' : '#ffffff';
  const sh = dark ? '#000000' : '#5b5248';
  const shOp = dark ? 0.55 : 0.22;
  const hiOp = dark ? 0.09 : 0.14;
  const rib = dark ? '#2a2a2b' : '#e9e6e0';
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <defs>
      <clipPath id="${id}c"><path d="${body}"/></clipPath>
      <linearGradient id="${id}side" x1="0" x2="1"><stop offset="0" stop-color="${sh}" stop-opacity="${shOp}"/><stop offset=".2" stop-color="${sh}" stop-opacity="0"/><stop offset=".8" stop-color="${sh}" stop-opacity="0"/><stop offset="1" stop-color="${sh}" stop-opacity="${shOp}"/></linearGradient>
      <linearGradient id="${id}vert" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}" stop-opacity="${hiOp}"/><stop offset=".45" stop-color="${hi}" stop-opacity="0"/><stop offset="1" stop-color="${sh}" stop-opacity="${shOp * 0.6}"/></linearGradient>
      ${fabricNoise(id + 'n')}${blur(id + 'b1', 18)}${blur(id + 'b2', 40)}${blur(id + 'sh', 26)}
    </defs>
    <path d="${body}" transform="translate(18 34)" fill="#000" opacity=".22" filter="url(#${id}sh)"/>
    <path d="${body}" fill="${color}"/>
    ${back ? '' : `<path d="M395 42C430 60 570 60 605 42C580 108 420 108 395 42Z" fill="${dark ? '#0b0b0b' : '#d6d1c8'}"/>`}
    <g clip-path="url(#${id}c)">
      ${print}
      <rect width="1000" height="1100" fill="#808080" filter="url(#${id}n)" opacity="${dark ? 0.07 : 0.06}" style="mix-blend-mode:overlay"/>
      <rect width="1000" height="1100" fill="url(#${id}side)"/>
      <rect width="1000" height="1100" fill="url(#${id}vert)"/>
      <!-- lipatan -->
      <g filter="url(#${id}b1)" fill="none" stroke-linecap="round">
        <path d="M272 420C330 520 360 600 372 700" stroke="${sh}" stroke-width="26" opacity="${shOp * 0.7}"/>
        <path d="M728 420C670 520 640 600 628 700" stroke="${sh}" stroke-width="26" opacity="${shOp * 0.7}"/>
        <path d="M300 960C420 990 560 985 700 950" stroke="${sh}" stroke-width="30" opacity="${shOp * 0.5}"/>
        <path d="M880 300C840 330 810 360 790 400" stroke="${sh}" stroke-width="24" opacity="${shOp * 0.6}"/>
      </g>
      <ellipse cx="500" cy="380" rx="260" ry="300" fill="${hi}" opacity="${hiOp * 0.8}" filter="url(#${id}b2)"/>
      <!-- jahitan lengan & bahu -->
      <path d="M238 92C232 200 244 300 262 378M762 92C768 200 756 300 738 378" fill="none" stroke="${sh}" stroke-width="3" opacity="${shOp * 0.8}"/>
      <path d="M78 330L208 400M922 330L792 400" fill="none" stroke="${sh}" stroke-width="2.5" stroke-dasharray="7 6" opacity="${shOp}"/>
      <path d="M252 1024C400 1040 600 1040 748 1024" fill="none" stroke="${sh}" stroke-width="2.5" stroke-dasharray="7 6" opacity="${shOp}"/>
    </g>
    ${back
      ? `<path d="M395 42C430 62 570 62 605 42" fill="none" stroke="${rib}" stroke-width="16"/>`
      : `<path d="M395 42C420 108 580 108 605 42" fill="none" stroke="${rib}" stroke-width="20"/>
         <path d="M405 52C430 104 570 104 595 52" fill="none" stroke="${sh}" stroke-width="2" opacity="${shOp}"/>`}
    <path d="${body}" fill="none" stroke="${sh}" stroke-width="2" opacity="${dark ? 0.6 : 0.25}"/>
  </g>`;
}

// print untuk kaos/jaket (koordinat kanvas 1000 x 1100)
const chestPrint = (fill, cx = 640, cy = 250, h = 96) => {
  const w = h * 667.45 / 697.08;
  return `${markPath({ x: cx - w / 2, y: cy - h / 2, h, fill })}`;
};
const backPrint = (variant, cx, top, width) => logoNested(variant, cx - width / 2, top, width);

function kaos(color) {
  const dark = color === 'hitam';
  const fabric = dark ? '#1C1C1D' : '#F4F2EE';
  const gold = C.emas;
  const ink = dark ? gold : C.hitam;
  const frontPrint = chestPrint(ink) + (dark
    ? `<text x="640" y="330" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="17" letter-spacing="3" fill="${C.gading}">ALFA OMEGA</text>`
    : `<text x="640" y="330" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="17" letter-spacing="3" fill="${C.hitam}">ALFA OMEGA</text>`);
  const back = backPrint(dark ? 'bertumpuk-tagline-emas-gading' : 'bertumpuk-tagline-hitam', 500, 180, 340);
  const body = `${studioBg}
    <svg width="${W}" height="${H}" style="position:absolute;inset:0">
      ${tee({ x: 170, y: 250, scale: 0.98, color: fabric, dark, print: frontPrint, id: 'tf' })}
      ${tee({ x: 1250, y: 250, scale: 0.98, color: fabric, dark, back: true, print: back, id: 'tb' })}
    </svg>
    ${title(dark ? 'Kaos Hitam · Sablon Emas' : 'Kaos Putih · Sablon Hitam', 'MOCKUP MERCHANDISE')}
    ${caption(660, 1390, 'DEPAN')}${caption(1740, 1390, 'BELAKANG')}`;
  return { out: `${DIR}/kaos-${color}.jpg`, w: W, h: H, html: page(W, H, body, { bg: '#E4DED4' }) };
}

// ---------- JAKET BOMBER ----------
const JK = 'M380 46C330 66 280 84 224 104C150 180 118 520 104 930L102 1030L238 1036L246 934C252 760 262 560 286 400C292 600 292 800 290 958L292 1064C420 1078 580 1078 708 1064L710 958C708 800 708 600 714 400C738 560 748 760 754 934L762 1036L898 1030L896 930C882 520 850 180 776 104C720 84 670 66 620 46';
const JK_FRONT = `${JK}C600 96 560 128 500 140C440 128 400 96 380 46Z`;
const JK_BACK = `${JK}C580 70 420 70 380 46Z`;

function jacket({ x, y, scale = 1, back = false, print, id }) {
  const body = back ? JK_BACK : JK_FRONT;
  const base = '#18181A', sh = '#000', hi = '#fff';
  const ribC = '#202022';
  const stripe = (d, w = 6) => `<path d="${d}" fill="none" stroke="${C.emas}" stroke-width="${w}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <defs>
      <clipPath id="${id}c"><path d="${body}"/></clipPath>
      <linearGradient id="${id}side" x1="0" x2="1"><stop offset="0" stop-color="${sh}" stop-opacity=".6"/><stop offset=".22" stop-color="${sh}" stop-opacity="0"/><stop offset=".78" stop-color="${sh}" stop-opacity="0"/><stop offset="1" stop-color="${sh}" stop-opacity=".6"/></linearGradient>
      ${fabricNoise(id + 'n')}${blur(id + 'b1', 16)}${blur(id + 'b2', 46)}${blur(id + 'sh', 26)}
      <pattern id="${id}rib" width="9" height="10" patternUnits="userSpaceOnUse"><rect width="9" height="10" fill="${ribC}"/><rect width="3" height="10" fill="#0d0d0e"/></pattern>
    </defs>
    <path d="${body}" transform="translate(18 34)" fill="#000" opacity=".25" filter="url(#${id}sh)"/>
    <path d="${body}" fill="${base}"/>
    <g clip-path="url(#${id}c)">
      ${print}
      <!-- rib manset & pinggang -->
      <rect x="0" y="958" width="1000" height="120" fill="url(#${id}rib)"/>
      <rect x="0" y="930" width="1000" height="0" />
      <path d="M90 930L260 936L250 1040L90 1040ZM910 930L740 936L750 1040L910 1040Z" fill="url(#${id}rib)"/>
      ${stripe('M280 990C420 1002 580 1002 720 990')}${stripe('M280 1008C420 1020 580 1020 720 1008')}
      ${stripe('M100 962L246 968M900 962L754 968')}${stripe('M100 980L246 986M900 980L754 986')}
      <rect width="1000" height="1100" fill="#808080" filter="url(#${id}n)" opacity=".08" style="mix-blend-mode:overlay"/>
      <rect width="1000" height="1100" fill="url(#${id}side)"/>
      <g filter="url(#${id}b1)" fill="none" stroke-linecap="round">
        <path d="M300 430C360 540 380 640 390 760" stroke="${sh}" stroke-width="30" opacity=".45"/>
        <path d="M700 430C640 540 620 640 610 760" stroke="${sh}" stroke-width="30" opacity=".45"/>
        <path d="M850 300C860 500 860 700 850 900" stroke="${sh}" stroke-width="28" opacity=".4"/>
        <path d="M190 600C210 620 230 640 250 660M180 760C200 780 220 800 245 820" stroke="${sh}" stroke-width="20" opacity=".45"/>
        <path d="M300 930C420 948 580 948 700 930" stroke="${sh}" stroke-width="26" opacity=".5"/>
      </g>
      <ellipse cx="500" cy="380" rx="280" ry="320" fill="${hi}" opacity=".07" filter="url(#${id}b2)"/>
      <path d="M224 104C234 220 258 320 286 400M776 104C766 220 742 320 714 400" fill="none" stroke="${sh}" stroke-width="3.5" opacity=".7"/>
      ${back ? '' : `
        <!-- kantong samping -->
        <path d="M344 676L392 820" stroke="#060606" stroke-width="12" stroke-linecap="round"/><path d="M352 672L400 816" stroke="#3a3a3c" stroke-width="3" stroke-linecap="round"/>
        <path d="M656 676L608 820" stroke="#060606" stroke-width="12" stroke-linecap="round"/><path d="M648 672L600 816" stroke="#3a3a3c" stroke-width="3" stroke-linecap="round"/>
        <!-- ritsleting -->
        <path d="M500 140V1066" stroke="#0a0a0a" stroke-width="16"/>
        <path d="M500 142V1066" stroke="#9a968f" stroke-width="6" stroke-dasharray="3 3"/>
        <rect x="490" y="150" width="20" height="40" rx="5" fill="#b9b4ab"/><rect x="494" y="186" width="12" height="44" rx="5" fill="#d5d0c7"/>`}
    </g>
    <!-- kerah rib -->
    ${back
      ? `<path d="M380 46C420 70 580 70 620 46" fill="none" stroke="url(#${id}rib)" stroke-width="34"/>${stripe('M386 30C430 52 570 52 614 30', 5)}`
      : `<path d="M380 46C400 96 440 128 500 140C560 128 600 96 620 46" fill="none" stroke="url(#${id}rib)" stroke-width="36"/>
         ${stripe('M372 34C392 90 436 126 494 138', 5)}${stripe('M628 34C608 90 564 126 506 138', 5)}`}
    <path d="${body}" fill="none" stroke="#000" stroke-width="2" opacity=".7"/>
  </g>`;
}

function jaket() {
  // bordir emas: sedikit timbul (bayangan + sorotan)
  const emb = (inner) => `<g filter="url(#emb)">${inner}</g>`;
  const front = emb(chestPrint(C.emas, 650, 300, 110) + `<text x="650" y="392" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="20" letter-spacing="3" fill="${C.emas}">ALFA OMEGA</text>`);
  const back = emb(backPrint('bertumpuk-tagline-emas', 500, 210, 360));
  const defs = `<svg width="0" height="0" style="position:absolute"><defs>
    <filter id="emb" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="1.6 .25" numOctaves="1" seed="5" result="thread"/>
      <feColorMatrix in="thread" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .35 0" result="t2"/>
      <feComposite in="t2" in2="SourceAlpha" operator="in" result="tex"/>
      <feOffset in="SourceAlpha" dx="0" dy="3" result="o"/><feGaussianBlur in="o" stdDeviation="2" result="ob"/>
      <feFlood flood-color="#000" flood-opacity=".7"/><feComposite in2="ob" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/><feMergeNode in="tex"/></feMerge>
    </filter></defs></svg>`;
  const body = `${studioBg}${defs}
    <svg width="${W}" height="${H}" style="position:absolute;inset:0">
      ${jacket({ x: 170, y: 230, scale: 0.98, print: front, id: 'jf' })}
      ${jacket({ x: 1250, y: 230, scale: 0.98, back: true, print: back, id: 'jb' })}
    </svg>
    ${title('Jaket Bomber · Bordir Emas', 'MOCKUP MERCHANDISE')}
    ${caption(660, 1400, 'DEPAN')}${caption(1740, 1400, 'BELAKANG')}`;
  return { out: `${DIR}/jaket-bomber.jpg`, w: W, h: H, html: page(W, H, body, { bg: '#E4DED4' }) };
}

// ---------- KAIN BERKIBAR (bendera & umbul-umbul) ----------
// Tahap 1: artwork datar -> tools/.cache/kain/*.png
// Tahap 2: warp_kain.py melengkungkan artwork -> *-kibar.png
// Tahap 3: adegan akhir menempelkan hasil kibaran.
const KAIN = path.join(TOOLS, '.cache', 'kain');
const kainOut = (name) => path.relative(BRAND, path.join(KAIN, `${name}.png`));
const kibar = (name) => `data:image/png;base64,${fs.readFileSync(path.join(KAIN, `${name}-kibar.png`)).toString('base64')}`;

function benderaFlat() {
  const fw = 1500, fh = 1000;
  const body = `<svg width="${fw}" height="${fh}" style="position:absolute;inset:0">
    <rect width="${fw}" height="${fh}" fill="${C.hitam}"/>
    <rect x="0" y="0" width="34" height="${fh}" fill="#e9e4da"/>
    <rect x="70" y="40" width="${fw - 110}" height="${fh - 80}" fill="none" stroke="${C.emas}" stroke-width="6"/>
    <rect x="86" y="56" width="${fw - 142}" height="${fh - 112}" fill="none" stroke="${C.emas}" stroke-width="2" opacity=".6"/>
    ${logoNested('bertumpuk-tagline-emas-gading', fw / 2 + 17 - 290, 175, 580)}
  </svg>`;
  return { out: kainOut('bendera'), w: fw, h: fh, transparent: true, html: page(fw, fh, body) };
}

function umbulFlat(variant) {
  const w = 600, h = 2600, tail = 220;
  const bg = { hitam: C.hitam, emas: C.emas, anggur: C.anggur }[variant];
  const ink = { hitam: C.emas, emas: C.hitam, anggur: C.emas }[variant];
  const text = { hitam: C.gading, emas: C.hitam, anggur: C.gading }[variant];
  const shape = `M0 0H${w}V${h - tail}L${w / 2} ${h}L0 ${h - tail}Z`;
  const i = 30;
  const inner = `M${i} ${i}H${w - i}V${h - tail - 8}L${w / 2} ${h - i - 14}L${i} ${h - tail - 8}Z`;
  const mh = 330, mw = mh * MARK_RATIO;
  const body = `<svg width="${w}" height="${h}" style="position:absolute;inset:0">
    <defs><clipPath id="bn"><path d="${inner}"/></clipPath></defs>
    <path d="${shape}" fill="${bg}"/>
    <rect x="0" y="0" width="${w}" height="46" fill="${variant === 'emas' ? '#b48f4a' : '#0b0b0b'}" opacity=".5"/>
    <path d="${inner}" fill="none" stroke="${ink}" stroke-width="7"/>
    ${markPath({ x: (w - mw) / 2, y: 190, h: mh, fill: ink })}
    <rect x="${w / 2 - 70}" y="600" width="140" height="4" fill="${ink}"/>
    <text transform="translate(${w / 2 + 64} 1320) rotate(-90)" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="178" letter-spacing="10" fill="${text}">ALFA OMEGA</text>
    <rect x="${w / 2 - 70}" y="2010" width="140" height="4" fill="${ink}"/>
    <g clip-path="url(#bn)">${chevrons({ cx: w / 2, cy: 0, count: 3, step: -46, color: ink, width: 8, opacity: 1, fade: false, start: -2090 })}</g>
  </svg>`;
  return { out: kainOut(`umbul-${variant}`), w, h, transparent: true, html: page(w, h, body) };
}

let warped = false;
function runWarp() {
  if (warped) return;
  execFileSync('python3', [path.join(TOOLS, 'warp_kain.py')], { stdio: 'inherit' });
  warped = true;
}

function bendera() {
  return {
    out: `${DIR}/bendera.jpg`, w: W, h: H, before: runWarp,
    html: () => {
      // hasil kibaran: (1500 + 2*90) x (1000 + 2*90), sisi kiri menempel tiang di x = pad
      const sc = 0.93, fx = 560 - 90 * sc, fy = 300 - 90 * sc;
      const pole = `<defs><linearGradient id="pole" x1="0" x2="1"><stop offset="0" stop-color="#5d5952"/><stop offset=".35" stop-color="#ece8e1"/><stop offset=".6" stop-color="#b3ada3"/><stop offset="1" stop-color="#4f4b45"/></linearGradient>
        <radialGradient id="ball" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#F3E3B5"/><stop offset=".5" stop-color="${C.emas}"/><stop offset="1" stop-color="#7c5f28"/></radialGradient></defs>
        <rect x="528" y="250" width="34" height="1400" fill="url(#pole)"/>
        <circle cx="545" cy="244" r="30" fill="url(#ball)"/>`;
      const rings = `<rect x="520" y="${300 + 30}" width="50" height="16" rx="6" fill="#8d877d"/><rect x="520" y="${300 + 900}" width="50" height="16" rx="6" fill="#8d877d"/>`;
      const body = `${skyBg}
        <svg width="${W}" height="${H}" style="position:absolute;inset:0">${pole}</svg>
        <img src="${kibar('bendera')}" style="position:absolute;left:${fx}px;top:${fy}px;width:${1680 * sc}px;filter:drop-shadow(0 30px 40px rgba(30,40,60,.25))">
        <svg width="${W}" height="${H}" style="position:absolute;inset:0">${rings}</svg>
        <div style="position:absolute;right:90px;bottom:80px;text-align:right">
          <div class="jak" style="font-weight:700;font-size:22px;letter-spacing:.42em;color:#4a4236">MOCKUP</div>
          <div class="cinzel" style="font-weight:700;font-size:54px;letter-spacing:.04em;color:${C.hitam};margin-top:10px">Bendera · 150 × 100 cm</div>
        </div>`;
      return page(W, H, body, { bg: '#B9CCD9' });
    },
  };
}

function umbul() {
  const variants = ['hitam', 'emas', 'hitam', 'anggur'];
  const files = { hitam: 'umbul-hitam', emas: 'umbul-emas', anggur: 'umbul-anggur' };
  return {
    out: `${DIR}/umbul-umbul.jpg`, w: W, h: H, before: runWarp,
    html: () => {
      const sc = 0.46, bw = 600 * sc, bh = 2600 * sc, pad = 70 * sc;
      const xs = [380, 850, 1320, 1790], tops = [150, 120, 140, 110];
      const bamboo = (x, top) => `
        <rect x="${x - 16}" y="${top - 70}" width="22" height="${H}" fill="url(#bamboo)"/>
        ${[...Array(7)].map((_, i) => `<rect x="${x - 18}" y="${top + 150 + i * 230}" width="26" height="7" rx="3" fill="#7d5f2e"/>`).join('')}
        <rect x="${x - 10}" y="${top - 12}" width="${bw + 26}" height="12" rx="6" fill="#9b7841"/>
        <circle cx="${x - 5}" cy="${top - 76}" r="13" fill="${C.emas}"/>
        <path d="M${x - 5} ${top - 60}L${x + bw + 10} ${top - 8}" stroke="#6b5530" stroke-width="2.5"/>`;
      const body = `${skyBg}
        <svg width="${W}" height="${H}" style="position:absolute;inset:0"><defs><linearGradient id="bamboo" x1="0" x2="1"><stop offset="0" stop-color="#7d5f2e"/><stop offset=".4" stop-color="#d9b977"/><stop offset="1" stop-color="#6f5328"/></linearGradient></defs>
        ${xs.map((x, i) => bamboo(x, tops[i])).join('')}</svg>
        ${xs.map((x, i) => `<img src="${kibar(files[variants[i]])}" style="position:absolute;left:${x + 4 - pad}px;top:${tops[i] - pad}px;width:${bw + 2 * pad}px;filter:drop-shadow(0 24px 30px rgba(30,40,60,.25))">`).join('')}
        <div style="position:absolute;right:70px;bottom:60px;background:rgba(246,241,231,.94);padding:30px 40px;border-radius:10px;box-shadow:0 10px 30px rgba(30,40,60,.18)">
          <div class="jak" style="font-weight:700;font-size:22px;letter-spacing:.42em;color:#4a4236">MOCKUP</div>
          <div class="cinzel" style="font-weight:700;font-size:54px;letter-spacing:.04em;color:${C.hitam};margin-top:10px">Umbul-umbul</div>
          <div class="jak" style="font-weight:600;font-size:24px;color:#4a4236;margin-top:6px">60 × 260 cm · 3 varian warna</div>
        </div>`;
      return page(W, H, body, { bg: '#B9CCD9' });
    },
  };
}

export default function () {
  return [
    kaos('hitam'), kaos('putih'), jaket(),
    benderaFlat(), umbulFlat('hitam'), umbulFlat('emas'), umbulFlat('anggur'),
    bendera(), umbul(),
  ];
}
