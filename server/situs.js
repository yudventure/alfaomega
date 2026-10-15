// Info situs yang dipakai beberapa modul server: alamat utama dan versi build.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { AKAR } from './konfigurasi.js';

// Alamat utama: SITE_URL bila diatur, kalau tidak alamat yang sedang diakses (mis. https://testingwebsite.click)
export const asalSitus = (req) => (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

let build = null;
export function infoBuild() {
  if (!build) {
    try { build = JSON.parse(readFileSync(path.join(AKAR, 'dist', 'versi.json'), 'utf8')); } catch { build = { commit: 'tidak diketahui', dibangun: null, aset: '' }; }
  }
  return build;
}
