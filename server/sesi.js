// Kata sandi (scrypt), sesi masuk (cookie bertanda tangan HMAC), dan pembatas percobaan masuk.
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { rahasiaSesi } from './penyimpanan.js';

const scrypt = promisify(crypto.scrypt);
const NAMA_COOKIE = 'ao_sesi';
export const UMUR_SESI_DETIK = 12 * 60 * 60;
const RAHASIA = rahasiaSesi();

export async function hashSandi(sandi) {
  const garam = crypto.randomBytes(16);
  const hasil = await scrypt(String(sandi), garam, 64);
  return `scrypt$${garam.toString('base64')}$${hasil.toString('base64')}`;
}

export async function cocokSandi(sandi, simpanan) {
  if (typeof sandi !== 'string' || typeof simpanan !== 'string') return false;
  const [jenis, garam, hash] = simpanan.split('$');
  if (jenis !== 'scrypt' || !garam || !hash) return false;
  const target = Buffer.from(hash, 'base64');
  const hasil = await scrypt(sandi, Buffer.from(garam, 'base64'), target.length);
  return crypto.timingSafeEqual(hasil, target);
}

const tanda = (s) => crypto.createHmac('sha256', RAHASIA).update(s).digest('base64url');

// Token memuat id pengguna dan "versi" akunnya; versi naik saat sandi diganti
// sehingga semua sesi lama otomatis tidak berlaku.
export function buatToken(p) {
  const isi = Buffer.from(JSON.stringify({ u: p.id, v: p.versi, e: Date.now() + UMUR_SESI_DETIK * 1000 })).toString('base64url');
  return `${isi}.${tanda(isi)}`;
}

export function bacaToken(token) {
  if (typeof token !== 'string') return null;
  const [isi, sig] = token.split('.');
  if (!isi || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(tanda(isi));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const d = JSON.parse(Buffer.from(isi, 'base64url').toString('utf8'));
    return typeof d.e === 'number' && d.e > Date.now() ? d : null;
  } catch {
    return null;
  }
}

export function tokenDariPermintaan(req) {
  for (const bagian of (req.headers.cookie || '').split(';')) {
    const i = bagian.indexOf('=');
    if (i > 0 && bagian.slice(0, i).trim() === NAMA_COOKIE) return bagian.slice(i + 1).trim();
  }
  return null;
}

export function pasangSesi(req, res, p) {
  const aman = req.secure ? '; Secure' : '';
  res.append('Set-Cookie', `${NAMA_COOKIE}=${buatToken(p)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${UMUR_SESI_DETIK}${aman}`);
}

export function hapusSesi(req, res) {
  const aman = req.secure ? '; Secure' : '';
  res.append('Set-Cookie', `${NAMA_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${aman}`);
}

// 5 kali gagal dalam 15 menit -> dikunci 15 menit (per alamat IP)
const JENDELA = 15 * 60 * 1000;
const gagal = new Map();

export function menitTerkunci(ip) {
  const g = gagal.get(ip);
  return g && g.sampai > Date.now() ? Math.ceil((g.sampai - Date.now()) / 60000) : 0;
}

export function catatGagal(ip) {
  const kini = Date.now();
  if (gagal.size > 5000) for (const [k, v] of gagal) if (v.awal < kini - JENDELA && v.sampai < kini) gagal.delete(k);
  const g = gagal.get(ip);
  const lanjut = g && g.awal > kini - JENDELA;
  const n = lanjut ? g.n + 1 : 1;
  gagal.set(ip, { n, awal: lanjut ? g.awal : kini, sampai: n >= 5 ? kini + JENDELA : 0 });
}

export const hapusGagal = (ip) => gagal.delete(ip);
