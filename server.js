// Server produksi untuk Hostinger Node.js (atau VPS mana pun):
// - menyajikan hasil build Vite dari folder dist/ (SPA: rute lain dijawab index.html),
// - menyisipkan isi dari CMS ke setiap halaman (window.__KONTEN__),
// - API panel CMS di /api dan media unggahan di /media (data di DATA_DIR).
// Bila dist/ belum ada (misalnya hosting hanya menjalankan `npm install` lalu `npm start`),
// build dijalankan otomatis sekali saat server mulai.
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buatApi } from './server/api.js';
import { DATA_DIR, DIR_MEDIA, bacaIsi, daftarPengguna, kodeSetup } from './server/penyimpanan.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.log('dist/ belum ada, menjalankan `npm run build` ...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}
const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Hostinger berada di belakang proxy HTTPS

app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' });
  next();
});

app.use('/api', buatApi());
// nama berkas media acak dan tidak pernah ditimpa, jadi aman di-cache lama
app.use('/media', express.static(DIR_MEDIA, { immutable: true, maxAge: '1y', index: false, dotfiles: 'deny' }));
// aset ber-hash dari Vite boleh di-cache lama; file lain satu jam
app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y' }));
app.use(express.static(dist, { maxAge: '1h', index: false }));

// Semua halaman: index.html + isi terbaru dari CMS
app.use((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(404).end();
  let tersimpan = {};
  try { tersimpan = bacaIsi().isi; } catch (e) { console.error(e.message); }
  const isi = JSON.stringify(tersimpan).replace(/[<\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
  if (req.path === '/admin' || req.path.startsWith('/admin/')) res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-cache');
  res.type('html').send(template.replace('</head>', `<script>window.__KONTEN__=${isi}</script></head>`));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Gereja Alfa Omega berjalan di port ${port}`);
  console.log(`Data CMS disimpan di ${DATA_DIR}`);
  try {
    if (daftarPengguna().length === 0) console.log(`Belum ada akun CMS. Buka /admin untuk membuat akun developer pertama dengan kode setup: ${kodeSetup()}`);
  } catch (e) {
    console.error(e.message);
  }
});
