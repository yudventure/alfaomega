// Penyimpanan data CMS berupa berkas JSON di DATA_DIR (tanpa database terpisah).
// DATA_DIR sebaiknya di luar folder aplikasi supaya tidak terhapus saat deploy ulang.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { DATA_DIR } from './konfigurasi.js';

export { DATA_DIR };
export const DIR_MEDIA = path.join(DATA_DIR, 'media');
const DIR_RIWAYAT = path.join(DATA_DIR, 'riwayat');
const MAKS_RIWAYAT = 60;

try {
  for (const d of [DATA_DIR, DIR_MEDIA, DIR_RIWAYAT]) fs.mkdirSync(d, { recursive: true });
} catch (e) {
  console.error(`Folder data CMS tidak dapat dibuat di ${DATA_DIR} (${e.message}). Website tetap berjalan dengan isi bawaan; atur DATA_DIR ke folder yang dapat ditulis agar CMS bisa menyimpan.`);
}

const berkas = (nama) => path.join(DATA_DIR, nama);

// Galat folder data ditandai supaya API bisa memberi pesan yang jelas ke panel CMS
function galatData(pesan, sebab) {
  const e = new Error(`${pesan}: ${sebab.message}`);
  e.kode = 'DATA';
  return e;
}

function bacaJson(nama, bawaan) {
  try {
    return JSON.parse(fs.readFileSync(berkas(nama), 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return bawaan;
    throw galatData(`Berkas data ${nama} rusak atau tidak terbaca`, e);
  }
}

// Tulis ke berkas sementara lalu ganti nama, supaya berkas tidak pernah setengah tertulis.
function tulisJson(nama, data) {
  const tujuan = berkas(nama);
  const sementara = `${tujuan}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(sementara, JSON.stringify(data, null, 2), { mode: 0o600 });
    fs.renameSync(sementara, tujuan);
  } catch (e) {
    throw galatData(`Berkas data ${nama} tidak dapat ditulis`, e);
  }
}

// ---------- isi website ----------
let cacheIsi = null;
export function bacaIsi() {
  if (!cacheIsi) {
    const d = bacaJson('isi.json', {});
    cacheIsi = { isi: d.isi && typeof d.isi === 'object' ? d.isi : {}, meta: d.meta && typeof d.meta === 'object' ? d.meta : {} };
  }
  return cacheIsi;
}
export function tulisIsi(isi, meta) {
  tulisJson('isi.json', { isi, meta });
  cacheIsi = { isi, meta };
}

// ---------- pengguna ----------
export const daftarPengguna = () => bacaJson('pengguna.json', []);
export const penggunaById = (id) => daftarPengguna().find((p) => p.id === id) ?? null;
export const penggunaByEmail = (email) => daftarPengguna().find((p) => p.email === email) ?? null;
export function simpanPengguna(daftar) { tulisJson('pengguna.json', daftar); }
export function ubahPengguna(id, perubahan) {
  const daftar = daftarPengguna().map((p) => (p.id === id ? { ...p, ...perubahan } : p));
  simpanPengguna(daftar);
  return daftar.find((p) => p.id === id) ?? null;
}

// ---------- media ----------
export const daftarMedia = () => bacaJson('media.json', []);
export function simpanDaftarMedia(daftar) { tulisJson('media.json', daftar); }
export function tulisBerkasMedia(nama, buf) {
  try { fs.writeFileSync(path.join(DIR_MEDIA, nama), buf, { mode: 0o644 }); } catch (e) { throw galatData('Foto tidak dapat disimpan', e); }
}
export function hapusBerkasMedia(nama) { fs.rmSync(path.join(DIR_MEDIA, path.basename(nama)), { force: true }); }

// ---------- log aktivitas ----------
// Log aktivitas tidak boleh menggagalkan perubahan yang sudah tersimpan
export function catat(entri) {
  try {
    fs.appendFileSync(berkas('log.jsonl'), `${JSON.stringify({ waktu: new Date().toISOString(), ...entri })}\n`, { mode: 0o600 });
  } catch (e) {
    console.error(`Log aktivitas tidak dapat ditulis: ${e.message}`);
  }
}
export function bacaLog(batas = 300) {
  let teks = '';
  try { teks = fs.readFileSync(berkas('log.jsonl'), 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  return teks.trim().split('\n').filter(Boolean).slice(-batas).reverse().flatMap((baris) => {
    try { return [JSON.parse(baris)]; } catch { return []; }
  });
}

// ---------- riwayat versi isi ----------
export function simpanRiwayat(data, info) {
  const id = `${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
  try {
    fs.writeFileSync(path.join(DIR_RIWAYAT, `${id}.json`), JSON.stringify({ id, waktu: new Date().toISOString(), ...info, data }), { mode: 0o600 });
  } catch (e) {
    throw galatData('Versi cadangan tidak dapat disimpan', e);
  }
  const semua = fs.readdirSync(DIR_RIWAYAT).filter((f) => f.endsWith('.json')).sort();
  for (const f of semua.slice(0, Math.max(0, semua.length - MAKS_RIWAYAT))) fs.rmSync(path.join(DIR_RIWAYAT, f), { force: true });
  return id;
}
export function daftarRiwayat() {
  return fs.readdirSync(DIR_RIWAYAT).filter((f) => f.endsWith('.json')).sort().reverse().flatMap((f) => {
    try {
      const { data, ...info } = JSON.parse(fs.readFileSync(path.join(DIR_RIWAYAT, f), 'utf8'));
      return [info];
    } catch { return []; }
  });
}
export function bacaRiwayat(id) {
  if (!/^[a-z0-9]+-[a-f0-9]{6}$/.test(id)) return null;
  try { return JSON.parse(fs.readFileSync(path.join(DIR_RIWAYAT, `${id}.json`), 'utf8')); } catch { return null; }
}

// ---------- rahasia sesi & kode setup ----------
export function rahasiaSesi() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const f = berkas('rahasia-sesi.key');
  try { return fs.readFileSync(f, 'utf8').trim(); } catch { /* buat baru */ }
  const r = crypto.randomBytes(32).toString('hex');
  try { fs.writeFileSync(f, r, { mode: 0o600 }); } catch (e) { console.warn(`Kunci sesi tidak dapat disimpan (${e.message}); sesi masuk akan berakhir setiap server dimulai ulang.`); }
  return r;
}

// Kode untuk membuat akun developer pertama: dari env CMS_KODE_SETUP,
// atau dibuat otomatis di DATA_DIR/kode-setup.txt (juga dicetak di log server).
let kodeSementara = null;
export function kodeSetup() {
  if (process.env.CMS_KODE_SETUP) return process.env.CMS_KODE_SETUP.trim();
  if (kodeSementara) return kodeSementara;
  const f = berkas('kode-setup.txt');
  try { return fs.readFileSync(f, 'utf8').trim(); } catch { /* buat baru */ }
  const kode = crypto.randomBytes(6).toString('hex').toUpperCase();
  try { fs.writeFileSync(f, kode, { mode: 0o600 }); } catch { /* tetap dipakai selama server berjalan */ }
  kodeSementara = kode;
  return kode;
}
export function hapusKodeSetup() { kodeSementara = null; fs.rmSync(berkas('kode-setup.txt'), { force: true }); }

export function ukuranFolder(dir = DATA_DIR) {
  let total = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    total += e.isDirectory() ? ukuranFolder(p) : fs.statSync(p).size;
  }
  return total;
}
