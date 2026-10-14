// Aset media sosial: Instagram, Facebook, YouTube, TikTok.
import { C, page, markSvg, logoSvg, chevrons } from './lib.mjs';

const DIR = 'media-sosial';

// Latar gelap standar: hitam + cahaya keemasan lembut + pola Gema Alfa
function darkBg(w, h, { cx = w / 2, glowY = '46%', apex = h * 0.12, step = h * 0.1, count = 12, opacity = 0.2, r = '62%' } = {}) {
  return `<svg width="${w}" height="${h}" style="position:absolute;inset:0">
    <defs><radialGradient id="glow" cx="${typeof cx === 'number' ? (cx / w * 100) + '%' : cx}" cy="${glowY}" r="${r}"><stop offset="0" stop-color="#2E2619"/><stop offset=".55" stop-color="#1A1713"/><stop offset="1" stop-color="${C.hitam}"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${chevrons({ cx, cy: 0, count, step: -step, opacity, width: Math.max(1.2, w / 1100), start: -apex })}
  </svg>`;
}

const center = (inner, extra = '') => `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;${extra}">${inner}</div>`;

function profile(out, size, variant = 'gelap') {
  const dark = variant === 'gelap';
  const bg = dark ? darkBg(size, size, { apex: -size, count: 0 }) : '';
  const body = `${bg}${center(markSvg({ h: size * 0.54, fill: dark ? 'gold' : C.hitam, style: `margin-top:${size * 0.03}px` }))}`;
  return { out, w: size, h: size, html: page(size, size, body, { bg: dark ? C.hitam : C.gading }) };
}

function youtubeBanner() {
  const w = 2560, h = 1440;
  // Area aman semua perangkat: 1546 x 423 di tengah
  const body = `${darkBg(w, h, { apex: 380, step: 120, count: 14, opacity: 0.16, glowY: '50%', r: '45%' })}
  ${center(`
    ${logoSvg('horizontal-emas-gading', { width: 1120, gold: true })}
    <div style="display:flex;align-items:center;gap:28px;margin-top:44px">
      <span style="width:120px;height:1.5px;background:${C.emas};opacity:.7"></span>
      <span class="jak" style="font-weight:600;font-size:24px;letter-spacing:.5em;color:${C.emasMuda};margin-right:-.5em">YANG AWAL DAN YANG AKHIR</span>
      <span style="width:120px;height:1.5px;background:${C.emas};opacity:.7"></span>
    </div>`)}`;
  return { out: `${DIR}/youtube/banner-youtube-2560x1440.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

function facebookCover() {
  const w = 1640, h = 624;
  const body = `${darkBg(w, h, { apex: 70, step: 64, count: 12, opacity: 0.18, glowY: '50%', r: '55%' })}
  ${center(`
    ${logoSvg('horizontal-emas-gading', { width: 700, gold: true })}
    <div class="corm" style="font-style:italic;font-weight:500;font-size:36px;color:${C.emasMuda};margin-top:30px">“Aku adalah Alfa dan Omega, Yang Awal dan Yang Akhir.”</div>
    <div class="jak" style="font-weight:600;font-size:15px;letter-spacing:.45em;color:${C.batu};margin-top:16px;margin-right:-.45em">WAHYU 22:13</div>`, 'padding-bottom:20px')}`;
  return { out: `${DIR}/facebook/sampul-facebook-1640x624.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

// Ikon garis (kanvas 100x100) untuk sorotan/highlight Instagram
const ICONS = {
  ibadah: '<path d="M50 14V86M30 36H70"/>',
  renungan: '<path d="M50 32C40 25 26 24 14 28V76C26 72 40 72 50 78C60 72 74 72 86 76V28C74 24 60 25 50 32ZM50 32V78"/>',
  acara: '<rect x="18" y="24" width="64" height="58" rx="8"/><path d="M18 42H82M34 16V30M66 16V30"/><path d="M34 58h.01M50 58h.01M66 58h.01M34 70h.01M50 70h.01" stroke-width="7"/>',
  pemuda: '<path d="M50 14C54 30 72 40 72 60C72 74 62 84 50 84C38 84 28 74 28 60C28 48 35 41 39 33C41 42 45 47 50 49C54 40 53 26 50 14Z"/><path d="M50 84C44 84 40 79 40 72C40 65 46 61 50 56C54 61 60 65 60 72C60 79 56 84 50 84Z"/>',
  doa: '<path d="M38 50H62V86H38Z"/><path d="M50 14C56 23 59 28 59 33C59 38 55 42 50 42C45 42 41 38 41 33C41 28 44 23 50 14Z"/><path d="M50 42V50"/>',
  komsel: '<circle cx="50" cy="32" r="10"/><path d="M32 66C32 55 40 48 50 48C60 48 68 55 68 66"/><circle cx="22" cy="44" r="8"/><path d="M8 72C8 63 14 58 22 58C26 58 29 59 31 61"/><circle cx="78" cy="44" r="8"/><path d="M92 72C92 63 86 58 78 58C74 58 71 59 69 61"/>',
  info: '<circle cx="50" cy="50" r="34"/><path d="M50 46V68"/><path d="M50 33h.01" stroke-width="8"/>',
};

function highlight(name) {
  const w = 1080, h = 1920;
  const body = `${darkBg(w, h, { apex: -h, count: 0, glowY: '50%', r: '40%' })}
  ${center(`<div style="width:760px;height:760px;border-radius:50%;border:5px solid ${C.emas};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 18px rgba(200,162,90,.08)">
    <svg viewBox="0 0 100 100" width="400" height="400" fill="none" stroke="${C.emas}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>
  </div>`)}`;
  return { out: `${DIR}/instagram/highlight-${name}.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

function postAyat() {
  const w = 1080, h = 1350;
  const body = `<div style="position:absolute;inset:44px;border:1.5px solid ${C.emas};opacity:.9"></div>
  <div style="position:absolute;inset:56px;border:1px solid rgba(200,162,90,.45)"></div>
  ${center(`
    ${markSvg({ h: 92, fill: C.hitam })}
    <div class="jak" style="font-weight:600;font-size:19px;letter-spacing:.5em;color:${C.emasTua};margin:44px -0.5em 40px 0">RENUNGAN</div>
    <div class="corm" style="font-weight:600;font-size:66px;line-height:1.16;color:${C.hitam};text-align:center;max-width:820px">“Aku adalah Alfa dan Omega, Yang Pertama dan Yang Terkemudian, Yang Awal dan Yang Akhir.”</div>
    <div style="width:64px;height:2px;background:${C.emas};margin:46px 0 26px"></div>
    <div class="jak" style="font-weight:700;font-size:22px;letter-spacing:.32em;color:${C.hitam};margin-right:-.32em">WAHYU 22:13</div>
  `)}
  <div style="position:absolute;left:0;right:0;bottom:92px;text-align:center" class="cinzel"><span style="font-weight:700;font-size:20px;letter-spacing:.3em;color:${C.batu}">GEREJA ALFA OMEGA</span></div>`;
  return { out: `${DIR}/instagram/post-ayat-1080x1350.png`, w, h, html: page(w, h, body, { bg: C.gading }) };
}

function postWelcome() {
  const w = 1080, h = 1350;
  const body = `${darkBg(w, h, { apex: 150, step: 96, count: 14, opacity: 0.2, glowY: '40%' })}
  ${center(`
    ${markSvg({ h: 210, fill: 'gold' })}
    <div class="jak" style="font-weight:600;font-size:22px;letter-spacing:.5em;color:${C.emasMuda};margin:64px -0.5em 22px 0">SELAMAT DATANG DI</div>
    <div class="cinzel" style="font-weight:700;font-size:92px;letter-spacing:.06em;color:${C.gading};line-height:1">ALFA OMEGA</div>
    <div class="corm" style="font-style:italic;font-weight:500;font-size:44px;color:${C.emasMuda};margin-top:34px;text-align:center;line-height:1.25">Mari datang dan beribadah bersama<br>setiap hari Minggu.</div>
  `)}
  <div style="position:absolute;left:0;right:0;bottom:84px;display:flex;justify-content:center;align-items:center;gap:20px">
    <span style="width:70px;height:1.5px;background:${C.emas}"></span><span class="jak" style="font-weight:600;font-size:18px;letter-spacing:.4em;color:${C.batu};margin-right:-.4em">YANG AWAL DAN YANG AKHIR</span><span style="width:70px;height:1.5px;background:${C.emas}"></span>
  </div>`;
  return { out: `${DIR}/instagram/post-selamat-datang-1080x1350.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

function storyIbadah() {
  const w = 1080, h = 1920;
  const body = `${darkBg(w, h, { apex: 260, step: 120, count: 16, opacity: 0.2, glowY: '42%' })}
  ${center(`
    ${markSvg({ h: 230, fill: 'gold' })}
    <div class="jak" style="font-weight:600;font-size:26px;letter-spacing:.5em;color:${C.emasMuda};margin:90px -0.5em 30px 0">MINGGU INI</div>
    <div class="cinzel" style="font-weight:700;font-size:120px;letter-spacing:.05em;color:${C.gading};line-height:1.02;text-align:center">IBADAH<br>RAYA</div>
    <div class="corm" style="font-style:italic;font-weight:500;font-size:50px;color:${C.emasMuda};margin-top:44px;text-align:center;line-height:1.3">Ajak keluarga dan sahabatmu<br>untuk beribadah bersama.</div>
    <div class="jak" style="margin-top:80px;padding:26px 56px;border:2px solid ${C.emas};border-radius:999px;font-weight:700;font-size:26px;letter-spacing:.3em;color:${C.emas};margin-right:-.3em">GEREJA ALFA OMEGA</div>
  `, 'padding-bottom:60px')}`;
  return { out: `${DIR}/instagram/story-ibadah-1080x1920.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

function tiktokCover() {
  // Area aman TikTok: hindari 150px atas, ~420px bawah, ~140px kanan. Grid profil memotong 3:4 di tengah.
  const w = 1080, h = 1920;
  const body = `${darkBg(w, h, { apex: 320, step: 110, count: 16, opacity: 0.18, glowY: '45%' })}
  ${center(`
    <div class="jak" style="font-weight:700;font-size:30px;letter-spacing:.45em;color:${C.hitam};background:${C.emas};padding:16px 34px 16px 40px;border-radius:6px">RENUNGAN</div>
    <div class="corm" style="font-weight:600;font-size:132px;line-height:1.02;color:${C.gading};text-align:center;margin-top:60px">Yang Awal<br><span style="font-style:italic;color:${C.emasMuda}">dan</span> Yang Akhir</div>
    <div class="jak" style="font-weight:600;font-size:28px;letter-spacing:.35em;color:${C.batu};margin-top:56px;margin-right:-.35em">WAHYU 22:13</div>
  `, 'padding-bottom:140px')}
  <div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">${logoSvg('horizontal-ringkas-emas-gading', { width: 420, gold: true })}</div>`;
  return { out: `${DIR}/tiktok/cover-video-1080x1920.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

function youtubeThumb() {
  const w = 1280, h = 720;
  const body = `${darkBg(w, h, { cx: 960, apex: 70, step: 70, count: 12, opacity: 0.22, glowY: '50%', r: '55%' })}
  <div style="position:absolute;right:120px;top:50%;transform:translateY(-50%)">${markSvg({ h: 440, fill: 'gold' })}</div>
  <div style="position:absolute;left:84px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;width:700px">
    <div class="jak" style="font-weight:700;font-size:22px;letter-spacing:.4em;color:${C.emas}">KHOTBAH MINGGU</div>
    <div class="cinzel" style="font-weight:700;font-size:76px;line-height:1.05;color:${C.gading};margin-top:22px">YANG AWAL<br>&amp; YANG AKHIR</div>
    <div style="width:80px;height:3px;background:${C.emas};margin:34px 0 22px"></div>
    <div class="corm" style="font-style:italic;font-weight:500;font-size:38px;color:${C.emasMuda}">Seri Kitab Wahyu · Bagian 1</div>
  </div>`;
  return { out: `${DIR}/youtube/thumbnail-khotbah-1280x720.png`, w, h, html: page(w, h, body, { bg: C.hitam }) };
}

function youtubeWatermark() {
  const s = 150;
  return { out: `${DIR}/youtube/watermark-150x150.png`, w: s, h: s, transparent: true, html: page(s, s, center(markSvg({ h: 118, fill: C.putih }))) };
}

export default function () {
  return [
    profile(`${DIR}/instagram/profil-instagram-1080x1080.png`, 1080),
    profile(`${DIR}/facebook/profil-facebook-1080x1080.png`, 1080),
    profile(`${DIR}/youtube/profil-youtube-800x800.png`, 800),
    profile(`${DIR}/tiktok/profil-tiktok-1080x1080.png`, 1080),
    profile(`${DIR}/alternatif/profil-terang-1080x1080.png`, 1080, 'terang'),
    youtubeBanner(), youtubeThumb(), youtubeWatermark(),
    facebookCover(),
    ...Object.keys(ICONS).map(highlight),
    postAyat(), postWelcome(), storyIbadah(),
    tiktokCover(),
  ];
}
