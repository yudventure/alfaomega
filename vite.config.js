import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// Sidik isi foto bawaan (public/img, public/og). Ditempel sebagai ?v=... pada alamat gambar,
// jadi setiap kali foto diganti browser & CDN langsung mengambil yang baru (tidak tertahan cache).
function sidikFolder(folder) {
  const h = createHash('sha1');
  const jelajah = (dir) => {
    for (const nama of readdirSync(dir).sort()) {
      const p = path.join(dir, nama);
      if (statSync(p).isDirectory()) jelajah(p);
      else h.update(path.relative(folder, p)).update(readFileSync(p));
    }
  };
  for (const d of ['img', 'og']) jelajah(path.join(folder, d));
  return h.digest('hex').slice(0, 10);
}

const VERSI_ASET = sidikFolder(path.resolve('public'));
let commit = 'lokal';
try { commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* bukan repo git */ }

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // pengingat: .env.example harus mengikuti daftar variabel di server/konfigurasi.js
      name: 'cek-env-contoh',
      async buildStart() {
        try {
          const { teksEnvContoh } = await import('./server/konfigurasi.js');
          if (readFileSync('.env.example', 'utf8') !== teksEnvContoh()) this.warn('.env.example belum sesuai server/konfigurasi.js. Jalankan `npm run env:contoh` lalu commit.');
        } catch { /* abaikan */ }
      },
    },
    {
      // dist/versi.json: dibaca server untuk /sehat dan alamat gambar di meta tag
      name: 'versi-build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'versi.json', source: JSON.stringify({ commit, dibangun: new Date().toISOString(), aset: VERSI_ASET }) });
      },
    },
  ],
  define: { __VERSI_ASET__: JSON.stringify(VERSI_ASET) },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // `npm run dev` + `npm start` bersamaan: API & media CMS diteruskan ke server Express (port 3000)
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000', '/media': 'http://localhost:3000' },
  },
});
