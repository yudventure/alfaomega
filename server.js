// Server produksi untuk Hostinger Node.js (atau VPS mana pun):
// menyajikan hasil build Vite dari folder dist/ dan mengembalikan index.html untuk rute lain (SPA).
// Bila dist/ belum ada (misalnya hosting hanya menjalankan `npm install` lalu `npm start`),
// build dijalankan otomatis sekali saat server mulai.
import express from 'express';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.log('dist/ belum ada, menjalankan `npm run build` ...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

const app = express();
app.disable('x-powered-by');

// aset ber-hash dari Vite boleh di-cache lama; file lain satu jam
app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y' }));
app.use(express.static(dist, { maxAge: '1h' }));
app.use((req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => console.log(`Gereja Alfa Omega berjalan di port ${port}`));
