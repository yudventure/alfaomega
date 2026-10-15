// Server produksi untuk Hostinger Node.js (atau VPS mana pun):
// - menyajikan hasil build Vite dari folder dist/ (SPA: rute lain dijawab index.html),
// - menyisipkan isi CMS dan meta tag SEO per halaman ke setiap halaman,
// - sitemap.xml, robots.txt, /sehat (cek versi yang sedang berjalan),
// - API panel CMS di /api dan media unggahan di /media (data di DATA_DIR).
// Bila dist/ belum ada (misalnya hosting hanya menjalankan `npm install` lalu `npm start`),
// build dijalankan otomatis sekali saat server mulai.
import './server/konfigurasi.js'; // harus paling awal: membaca .env sebelum modul lain
import crypto from 'node:crypto';
import express from 'express';
import compression from 'compression';
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as bawaan from './src/data/konten.js';
import { gabung } from './src/cms/gabung.js';
import { halamanUntuk } from './src/cms/halaman.js';
import { buatApi } from './server/api.js';
import { DATA_DIR, DIR_MEDIA, bacaIsi, daftarPengguna, kodeSetup } from './server/penyimpanan.js';
import { buatKepala, robotsTxt, sitemapXml } from './server/seo.js';
import { asalSitus, infoBuild } from './server/situs.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.log('dist/ belum ada, menjalankan `npm run build` ...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}
const template = readFileSync(path.join(dist, 'index.html'), 'utf8');
const ISI_BAWAAN = { ...bawaan };

function isiSaatIni() {
  try {
    return bacaIsi();
  } catch (e) {
    console.error(e.message);
    return { isi: {}, meta: {} };
  }
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Hostinger berada di belakang proxy HTTPS
app.use(compression());

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  });
  if (req.secure) res.set('Strict-Transport-Security', 'max-age=15552000');
  next();
});

// /siapa-kami/ -> /siapa-kami (satu alamat per halaman, baik untuk SEO); /index.html -> /
app.use((req, res, next) => {
  if (req.path === '/index.html') return res.redirect(301, `/${req.originalUrl.slice(req.path.length)}`);
  if ((req.method === 'GET' || req.method === 'HEAD') && req.path.length > 1 && req.path.endsWith('/') && !req.path.startsWith('/api/')) {
    const jalur = `/${req.path.replace(/^\/+|\/+$/g, '')}`;
    return res.redirect(301, jalur + req.originalUrl.slice(req.path.length));
  }
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').set('Cache-Control', 'public, max-age=3600').send(robotsTxt(asalSitus(req)));
});

app.get('/sitemap.xml', (req, res) => {
  const { isi, meta } = isiSaatIni();
  const build = infoBuild();
  res.type('application/xml').set('Cache-Control', 'public, max-age=3600')
    .send(sitemapXml({ isi: gabung(ISI_BAWAAN, isi), meta, asal: asalSitus(req), versi: build.aset, dibangun: build.dibangun }));
});

// Cek kesehatan & versi yang sedang berjalan: buka /sehat setelah deploy
app.get('/sehat', (req, res) => {
  res.set('Cache-Control', 'no-store').json({ status: 'ok', ...infoBuild(), node: process.version, waktu: new Date().toISOString() });
});

app.use('/api', buatApi());
// nama berkas media acak dan tidak pernah ditimpa, jadi aman di-cache lama
app.use('/media', express.static(DIR_MEDIA, { immutable: true, maxAge: '1y', index: false, dotfiles: 'deny' }));
// aset ber-hash dari Vite boleh di-cache lama
app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y' }));
// foto bawaan: dengan ?v=... (berubah tiap foto diganti) di-cache lama; tanpa itu selalu dicek ulang
app.use(express.static(dist, {
  maxAge: '1h',
  index: false,
  setHeaders(res, berkas) {
    const rel = path.relative(dist, berkas).split(path.sep).join('/');
    if (/^(img|og)\//.test(rel)) res.setHeader('Cache-Control', res.req.query.v ? 'public, max-age=31536000, immutable' : 'no-cache');
  },
}));

// Semua halaman: index.html + meta tag SEO + isi terbaru dari CMS
app.use((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(404).end();
  const jalur = req.path;
  const admin = jalur === '/admin' || jalur.startsWith('/admin/');
  const { isi } = isiSaatIni();
  const nonce = crypto.randomBytes(16).toString('base64');
  const { judul, tag } = buatKepala({ jalur, isi: gabung(ISI_BAWAAN, isi), asal: asalSitus(req), versi: infoBuild().aset, nonce, admin });
  const konten = JSON.stringify(isi).replace(/[<\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

  res.set({
    'Cache-Control': 'no-cache',
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self'",
      'frame-src https://www.youtube-nocookie.com https://www.youtube.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      ...(req.secure ? ['upgrade-insecure-requests'] : []),
    ].join('; '),
  });
  if (admin) res.set('X-Robots-Tag', 'noindex, nofollow');
  res.status(admin || halamanUntuk(jalur) ? 200 : 404);
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  res.type('html').send(
    template
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(judul)}</title>`)
      .replace('</head>', `    ${tag}\n    <script nonce="${nonce}">window.__KONTEN__=${konten}</script>\n  </head>`),
  );
});

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  const b = infoBuild();
  console.log(`Gereja Alfa Omega berjalan di port ${port} (commit ${b.commit}, dibangun ${b.dibangun})`);
  console.log(`Data CMS disimpan di ${DATA_DIR}`);
  try {
    if (daftarPengguna().length === 0) console.log(`Belum ada akun CMS. Buka /admin untuk membuat akun developer pertama dengan kode setup: ${kodeSetup()}`);
  } catch (e) {
    console.error(e.message);
  }
});

// berhenti dengan rapi saat hosting me-restart aplikasi
for (const sinyal of ['SIGTERM', 'SIGINT']) {
  process.on(sinyal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
