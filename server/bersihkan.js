// Membersihkan setiap nilai kiriman CMS sesuai jenis bidangnya di skema,
// supaya tidak ada HTML, skrip, atau tautan berbahaya yang tersimpan.
import { IKON } from '../src/components/ikon-paths.js';
import { idYouTube } from '../src/cms/youtube.js';
import { objekBiasa } from '../src/cms/gabung.js';
import { tanggalSah } from '../src/kalender.js';

const KONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const str = (v) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');
const potong = (s, n) => (s.length > n ? s.slice(0, n) : s);

export const bersihTeks = (v, n = 200) => potong(str(v).replace(KONTROL, '').replace(/\s*[\r\n]+\s*/g, ' ').trim(), n);
export const bersihParagraf = (v, n = 2000) => potong(str(v).replace(KONTROL, '').replace(/\r\n?/g, '\n').trim(), n);

// Judul hanya boleh memuat <em>...</em> (warna emas) dan <br/>; selebihnya di-escape menjadi teks biasa.
export function bersihJudul(v, n = 300) {
  return potong(str(v).replace(KONTROL, ''), n)
    .split(/(<\/?em>|<br\s*\/?>)/i)
    .map((bagian, i) => {
      if (i % 2 === 1) return /^<br/i.test(bagian) ? '<br/>' : bagian.toLowerCase();
      return bagian
        .replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    })
    .join('')
    .trim();
}

// Tautan: https://, http://, mailto:, tel:, atau alamat di website ini (/... atau #...)
export function bersihTautan(v) {
  const s = bersihTeks(v, 500).replace(/\s+/g, '');
  if (!s || s.includes('\\')) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return /["'<>]/.test(s) ? '' : s;
  if (/^(\/(?!\/)|#)/.test(s)) return /["'<>]/.test(s) ? '' : s;
  if (/^(wa\.me|www\.)/i.test(s)) return `https://${s}`;
  return '';
}

// Gambar: file di website ini (/img, /media, /logo, /og) atau URL https
export function bersihGambar(v) {
  const s = bersihTeks(v, 500);
  if (!s) return '';
  if (/^\/(img|media|logo|og)\/[\w\-./]+\.(jpe?g|png|webp|gif|avif|svg)$/i.test(s) && !s.includes('..')) return s;
  if (/^https:\/\/[^\s"'<>()\\]+$/i.test(s)) return s;
  return '';
}

export function bersihVideo(v) {
  const id = idYouTube(bersihTeks(v, 300));
  return id ? `https://www.youtube.com/watch?v=${id}` : '';
}

export const bersihIkon = (v) => (Object.hasOwn(IKON, str(v)) ? str(v) : '');

// Tanggal 'YYYY-MM-DD' yang benar-benar ada; pilihan harus salah satu nilai di skema
export const bersihTanggal = (v) => { const s = bersihTeks(v, 10); return tanggalSah(s) ? s : ''; };
export const bersihPilihan = (def, v) => (def.pilihan ?? []).some((o) => o.nilai === str(v)) ? str(v) : '';

const kosong = (def) => (def.jenis === 'objek' ? kosongObjek(def.bidang) : def.jenis === 'daftar' || def.jenis === 'daftar-teks' ? [] : '');
const kosongObjek = (bidang) => Object.fromEntries(bidang.map((f) => [f.kunci, kosong(f)]));

function terapkanBidang(bidang, nilai, lama) {
  const hasil = { ...lama };
  for (const f of bidang) {
    if (Object.hasOwn(nilai, f.kunci)) hasil[f.kunci] = bersihkan(f, nilai[f.kunci], lama[f.kunci]);
  }
  return hasil;
}

// def: bidang dari skema (atau bagian kategori; tanpa `jenis` berarti objek)
export function bersihkan(def, nilai, lama) {
  switch (def.jenis ?? 'objek') {
    case 'teks': return bersihTeks(nilai);
    case 'paragraf': return bersihParagraf(nilai);
    case 'judul': return bersihJudul(nilai);
    case 'tautan': return bersihTautan(nilai);
    case 'gambar': return bersihGambar(nilai);
    case 'video': return bersihVideo(nilai);
    case 'ikon': return bersihIkon(nilai);
    case 'tanggal': return bersihTanggal(nilai);
    case 'pilihan': return bersihPilihan(def, nilai);
    case 'daftar-teks':
      return (Array.isArray(nilai) ? nilai : []).slice(0, def.maks ?? 12).map((t) => bersihParagraf(t, 1000)).filter(Boolean);
    case 'daftar':
      return (Array.isArray(nilai) ? nilai : []).filter(objekBiasa).slice(0, def.maks ?? 30)
        .map((butir) => terapkanBidang(def.butir, butir, kosongObjek(def.butir)));
    case 'objek':
      return terapkanBidang(def.bidang, objekBiasa(nilai) ? nilai : {}, objekBiasa(lama) ? lama : kosongObjek(def.bidang));
    default:
      return lama;
  }
}
