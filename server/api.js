// API panel CMS (/api/...). Semua perubahan dicek hak aksesnya per peran dan dibersihkan sesuai skema.
import crypto from 'node:crypto';
import express from 'express';
import * as bawaan from '../src/data/konten.js';
import { gabung, ambil, pasang } from '../src/cms/gabung.js';
import {
  KATEGORI, kategoriById, kategoriUntuk, bolehKategori, bolehKelolaPengguna, bolehSistem, aksesPenuh, punyaPeran, ID_PERAN,
} from '../src/cms/skema.js';
import { bersihkan, bersihTeks } from './bersihkan.js';
import * as data from './penyimpanan.js';
import * as sesi from './sesi.js';

const ISI_BAWAAN = { ...bawaan };
const isiLengkap = (tersimpan = data.bacaIsi().isi) => gabung(ISI_BAWAAN, tersimpan);
const kini = () => new Date().toISOString();

class Galat extends Error {
  constructor(status, pesan) { super(pesan); this.status = status; this.pesan = pesan; }
}

const publik = (p) => (p ? { id: p.id, nama: p.nama, email: p.email, peran: p.peran, dibuat: p.dibuat, terakhirMasuk: p.terakhirMasuk ?? null } : null);
const jumlahDeveloper = (daftar) => daftar.filter((p) => p.peran.includes('developer')).length;

function bacaSandiBaru(sandi) {
  if (typeof sandi !== 'string' || sandi.length < 8) throw new Galat(400, 'Kata sandi minimal 8 karakter.');
  if (sandi.length > 200) throw new Galat(400, 'Kata sandi terlalu panjang.');
  return sandi;
}

function bacaDataPengguna(body) {
  const nama = bersihTeks(body?.nama, 80);
  const email = bersihTeks(body?.email, 120).toLowerCase();
  if (!nama) throw new Galat(400, 'Nama wajib diisi.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Galat(400, 'Alamat email tidak valid.');
  const peran = [...new Set((Array.isArray(body?.peran) ? body.peran : []).filter((x) => ID_PERAN.includes(x)))];
  if (!peran.length) throw new Galat(400, 'Pilih minimal satu peran.');
  return { nama, email, peran };
}

function jenisGambar(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.length > 12 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
  return null;
}

export function buatApi() {
  const r = express.Router();
  const json = express.json({ limit: '1mb' });
  const jsonBesar = express.json({ limit: '12mb' });

  // Header X-CMS wajib (pelindung CSRF: browser lain tidak bisa mengirim header ini lintas situs).
  r.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (req.get('x-cms') !== '1') throw new Galat(400, 'Permintaan tidak valid.');
    next();
  });

  // Siapa yang sedang masuk
  r.use((req, res, next) => {
    const t = sesi.bacaToken(sesi.tokenDariPermintaan(req));
    const p = t ? data.penggunaById(t.u) : null;
    req.pengguna = p && p.versi === t.v ? p : null;
    next();
  });

  const wajibMasuk = (req, res, next) => {
    if (!req.pengguna) throw new Galat(401, 'Sesi Anda berakhir. Silakan masuk kembali.');
    next();
  };
  const wajib = (cek) => (req, res, next) => {
    if (!req.pengguna) throw new Galat(401, 'Sesi Anda berakhir. Silakan masuk kembali.');
    if (!cek(req.pengguna)) throw new Galat(403, 'Peran Anda tidak memiliki akses untuk tindakan ini.');
    next();
  };
  const catat = (req, aksi, tambahan = {}) => data.catat({ oleh: req.pengguna?.nama, olehId: req.pengguna?.id, aksi, ...tambahan });

  // ---------- sesi ----------
  r.get('/sesi', (req, res) => {
    res.json({ pengguna: publik(req.pengguna), perluSetup: data.daftarPengguna().length === 0 });
  });

  r.post('/setup', json, async (req, res) => {
    if (data.daftarPengguna().length) throw new Galat(409, 'Akun pertama sudah dibuat. Silakan masuk.');
    const tunggu = sesi.menitTerkunci(req.ip);
    if (tunggu) throw new Galat(429, `Terlalu banyak percobaan. Coba lagi dalam ${tunggu} menit.`);
    const kode = String(req.body?.kode ?? '').trim().toUpperCase();
    const benar = data.kodeSetup().toUpperCase();
    if (kode.length !== benar.length || !crypto.timingSafeEqual(Buffer.from(kode), Buffer.from(benar))) {
      sesi.catatGagal(req.ip);
      throw new Galat(403, 'Kode setup salah.');
    }
    const { nama, email } = bacaDataPengguna({ ...req.body, peran: ['developer'] });
    const p = {
      id: crypto.randomUUID(), nama, email, peran: ['developer'],
      sandi: await sesi.hashSandi(bacaSandiBaru(req.body?.sandi)), versi: 1, dibuat: kini(), terakhirMasuk: kini(),
    };
    if (data.daftarPengguna().length) throw new Galat(409, 'Akun pertama sudah dibuat. Silakan masuk.');
    data.simpanPengguna([p]);
    data.hapusKodeSetup();
    sesi.hapusGagal(req.ip);
    sesi.pasangSesi(req, res, p);
    data.catat({ oleh: p.nama, olehId: p.id, aksi: 'setup', ket: 'Membuat akun developer pertama' });
    res.json({ pengguna: publik(p) });
  });

  r.post('/masuk', json, async (req, res) => {
    const tunggu = sesi.menitTerkunci(req.ip);
    if (tunggu) throw new Galat(429, `Terlalu banyak percobaan masuk. Coba lagi dalam ${tunggu} menit.`);
    const email = bersihTeks(req.body?.email, 120).toLowerCase();
    const p = email ? data.penggunaByEmail(email) : null;
    const cocok = p ? await sesi.cocokSandi(req.body?.sandi, p.sandi) : (await sesi.hashSandi('penyeimbang-waktu'), false);
    if (!cocok) {
      sesi.catatGagal(req.ip);
      throw new Galat(401, 'Email atau kata sandi salah.');
    }
    sesi.hapusGagal(req.ip);
    const diperbarui = data.ubahPengguna(p.id, { terakhirMasuk: kini() });
    sesi.pasangSesi(req, res, diperbarui);
    data.catat({ oleh: p.nama, olehId: p.id, aksi: 'masuk' });
    res.json({ pengguna: publik(diperbarui) });
  });

  r.post('/keluar', (req, res) => {
    sesi.hapusSesi(req, res);
    res.json({ ok: true });
  });

  // ---------- isi website ----------
  r.get('/isi', wajibMasuk, (req, res) => {
    const { meta } = data.bacaIsi();
    res.json({ isi: isiLengkap(), meta, kategori: kategoriUntuk(req.pengguna).map((k) => k.id) });
  });

  r.put('/isi/:kategori', wajibMasuk, json, (req, res) => {
    const kat = kategoriById(req.params.kategori);
    if (!kat) throw new Galat(404, 'Kategori tidak ditemukan.');
    if (!bolehKategori(req.pengguna, kat)) throw new Galat(403, 'Peran Anda tidak memiliki akses ke kategori ini.');

    const simpanan = data.bacaIsi();
    const metaLama = simpanan.meta[kat.id];
    const dasar = req.body?.dasar ?? null;
    if (metaLama && dasar !== metaLama.diubah) {
      throw new Galat(409, `Kategori ini baru saja diubah oleh ${metaLama.oleh}. Muat ulang halaman untuk melihat versi terbaru sebelum menyimpan.`);
    }

    const kiriman = req.body?.nilai ?? {};
    const lengkap = isiLengkap(simpanan.isi);
    let isiBaru = simpanan.isi;
    for (const b of kat.bagian) {
      if (!Object.hasOwn(kiriman, b.kunci)) continue;
      isiBaru = pasang(isiBaru, b.kunci, bersihkan({ jenis: 'objek', ...b }, kiriman[b.kunci], ambil(lengkap, b.kunci)));
    }

    data.simpanRiwayat(simpanan, { kategori: kat.id, ket: `Sebelum "${kat.judul}" diubah oleh ${req.pengguna.nama}` });
    const meta = { ...simpanan.meta, [kat.id]: { diubah: kini(), oleh: req.pengguna.nama } };
    data.tulisIsi(isiBaru, meta);
    catat(req, 'ubah-isi', { kategori: kat.id, ket: kat.judul });
    res.json({ isi: isiLengkap(isiBaru), meta });
  });

  // ---------- pengguna ----------
  r.get('/pengguna', wajib(bolehKelolaPengguna), (req, res) => {
    res.json(data.daftarPengguna().map(publik));
  });

  r.post('/pengguna', wajib(bolehKelolaPengguna), json, async (req, res) => {
    const isian = bacaDataPengguna(req.body);
    if (isian.peran.includes('developer') && !punyaPeran(req.pengguna, 'developer')) throw new Galat(403, 'Hanya developer yang dapat memberi peran Developer.');
    const sandi = await sesi.hashSandi(bacaSandiBaru(req.body?.sandi));
    const daftar = data.daftarPengguna();
    if (daftar.some((p) => p.email === isian.email)) throw new Galat(409, 'Email ini sudah terdaftar.');
    const p = { id: crypto.randomUUID(), ...isian, sandi, versi: 1, dibuat: kini(), terakhirMasuk: null };
    data.simpanPengguna([...daftar, p]);
    catat(req, 'tambah-pengguna', { ket: `${p.nama} (${p.peran.join(', ')})` });
    res.json(publik(p));
  });

  r.put('/pengguna/:id', wajib(bolehKelolaPengguna), json, async (req, res) => {
    const sandiBaru = req.body?.sandi ? await sesi.hashSandi(bacaSandiBaru(req.body.sandi)) : null;
    const daftar = data.daftarPengguna();
    const lama = daftar.find((p) => p.id === req.params.id);
    if (!lama) throw new Galat(404, 'Pengguna tidak ditemukan.');
    const developer = punyaPeran(req.pengguna, 'developer');
    if (!developer && lama.peran.includes('developer')) throw new Galat(403, 'Akun developer hanya dapat diubah oleh developer.');
    const isian = bacaDataPengguna(req.body);
    if (!developer && isian.peran.includes('developer')) throw new Galat(403, 'Hanya developer yang dapat memberi peran Developer.');
    if (daftar.some((p) => p.email === isian.email && p.id !== lama.id)) throw new Galat(409, 'Email ini sudah dipakai pengguna lain.');
    const baru = { ...lama, ...isian };
    if (sandiBaru) Object.assign(baru, { sandi: sandiBaru, versi: lama.versi + 1 });
    const hasil = daftar.map((p) => (p.id === lama.id ? baru : p));
    if (jumlahDeveloper(hasil) === 0) throw new Galat(400, 'Harus tetap ada minimal satu akun developer.');
    data.simpanPengguna(hasil);
    if (baru.id === req.pengguna.id && baru.versi !== lama.versi) sesi.pasangSesi(req, res, baru);
    catat(req, 'ubah-pengguna', { ket: `${baru.nama} (${baru.peran.join(', ')})${req.body?.sandi ? ', sandi diatur ulang' : ''}` });
    res.json(publik(baru));
  });

  r.delete('/pengguna/:id', wajib(bolehKelolaPengguna), (req, res) => {
    const daftar = data.daftarPengguna();
    const target = daftar.find((p) => p.id === req.params.id);
    if (!target) throw new Galat(404, 'Pengguna tidak ditemukan.');
    if (target.id === req.pengguna.id) throw new Galat(400, 'Anda tidak dapat menghapus akun sendiri.');
    if (target.peran.includes('developer') && !punyaPeran(req.pengguna, 'developer')) throw new Galat(403, 'Akun developer hanya dapat dihapus oleh developer.');
    const hasil = daftar.filter((p) => p.id !== target.id);
    if (jumlahDeveloper(hasil) === 0) throw new Galat(400, 'Harus tetap ada minimal satu akun developer.');
    data.simpanPengguna(hasil);
    catat(req, 'hapus-pengguna', { ket: target.nama });
    res.json({ ok: true });
  });

  // ---------- akun sendiri ----------
  r.put('/akun', wajibMasuk, json, async (req, res) => {
    const p = req.pengguna;
    const perubahan = {};
    const nama = bersihTeks(req.body?.nama, 80);
    if (nama) perubahan.nama = nama;
    if (req.body?.sandiBaru) {
      if (!(await sesi.cocokSandi(req.body?.sandiLama, p.sandi))) throw new Galat(400, 'Kata sandi lama salah.');
      Object.assign(perubahan, { sandi: await sesi.hashSandi(bacaSandiBaru(req.body.sandiBaru)), versi: p.versi + 1 });
    }
    const baru = data.ubahPengguna(p.id, perubahan);
    if (perubahan.versi) sesi.pasangSesi(req, res, baru);
    catat(req, 'ubah-akun', { ket: perubahan.versi ? 'Mengganti kata sandi' : 'Mengubah nama' });
    res.json({ pengguna: publik(baru) });
  });

  // ---------- media ----------
  r.get('/media', wajibMasuk, (req, res) => {
    res.json(data.daftarMedia());
  });

  r.post('/media', wajibMasuk, jsonBesar, (req, res) => {
    const m = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+=*)$/.exec(String(req.body?.data ?? ''));
    if (!m) throw new Galat(400, 'Format gambar harus JPG, PNG, atau WebP.');
    const buf = Buffer.from(m[1], 'base64');
    if (buf.length > 8 * 1024 * 1024) throw new Galat(413, 'Gambar terlalu besar (maksimal 8 MB).');
    const ext = jenisGambar(buf);
    if (!ext) throw new Galat(400, 'Berkas ini bukan gambar yang valid.');
    const id = crypto.randomBytes(8).toString('hex');
    const nama = `${kini().slice(0, 7)}-${id}.${ext}`;
    data.tulisBerkasMedia(nama, buf);
    const item = {
      id, berkas: `/media/${nama}`, nama: bersihTeks(req.body?.nama, 120) || nama, ukuran: buf.length,
      lebar: Number(req.body?.lebar) || null, tinggi: Number(req.body?.tinggi) || null,
      oleh: req.pengguna.nama, olehId: req.pengguna.id, waktu: kini(),
    };
    data.simpanDaftarMedia([item, ...data.daftarMedia()]);
    catat(req, 'unggah-media', { ket: item.nama });
    res.json(item);
  });

  r.delete('/media/:id', wajibMasuk, (req, res) => {
    const daftar = data.daftarMedia();
    const item = daftar.find((x) => x.id === req.params.id);
    if (!item) throw new Galat(404, 'Media tidak ditemukan.');
    if (!aksesPenuh(req.pengguna) && item.olehId !== req.pengguna.id) throw new Galat(403, 'Anda hanya dapat menghapus media yang Anda unggah sendiri.');
    data.hapusBerkasMedia(item.berkas);
    data.simpanDaftarMedia(daftar.filter((x) => x.id !== item.id));
    catat(req, 'hapus-media', { ket: item.nama });
    res.json({ ok: true });
  });

  // ---------- riwayat ----------
  r.get('/riwayat', wajibMasuk, (req, res) => {
    const penuh = aksesPenuh(req.pengguna);
    const boleh = new Set(kategoriUntuk(req.pengguna).map((k) => k.id));
    const log = data.bacaLog().filter((e) => penuh || e.olehId === req.pengguna.id || (e.kategori && boleh.has(e.kategori))).slice(0, 150);
    res.json({ log, versi: penuh ? data.daftarRiwayat() : [] });
  });

  r.post('/riwayat/:id/pulihkan', wajib(aksesPenuh), (req, res) => {
    const versi = data.bacaRiwayat(req.params.id);
    if (!versi?.data?.isi) throw new Galat(404, 'Versi tidak ditemukan.');
    const simpanan = data.bacaIsi();
    data.simpanRiwayat(simpanan, { kategori: null, ket: `Sebelum pemulihan versi oleh ${req.pengguna.nama}` });
    const meta = { ...versi.data.meta };
    data.tulisIsi(versi.data.isi, meta);
    catat(req, 'pulihkan-versi', { ket: versi.ket });
    res.json({ isi: isiLengkap(versi.data.isi), meta });
  });

  // ---------- sistem (developer) ----------
  r.get('/sistem', wajib(bolehSistem), (req, res) => {
    res.json({
      dataDir: data.DATA_DIR, node: process.version, pengguna: data.daftarPengguna().length, media: data.daftarMedia().length,
      ukuranData: data.ukuranFolder(), versi: data.daftarRiwayat().length,
      env: { DATA_DIR: Boolean(process.env.DATA_DIR), SESSION_SECRET: Boolean(process.env.SESSION_SECRET), CMS_KODE_SETUP: Boolean(process.env.CMS_KODE_SETUP) },
    });
  });

  r.get('/cadangan', wajib(bolehSistem), (req, res) => {
    const { isi, meta } = data.bacaIsi();
    res.attachment(`cadangan-alfaomega-${kini().slice(0, 10)}.json`);
    res.json({ format: 'alfaomega-cms', versi: 1, dibuat: kini(), isi, meta, media: data.daftarMedia() });
  });

  r.post('/cadangan', wajib(bolehSistem), jsonBesar, (req, res) => {
    if (req.body?.format !== 'alfaomega-cms' || typeof req.body?.isi !== 'object') throw new Galat(400, 'Berkas ini bukan cadangan CMS Alfa Omega.');
    const simpanan = data.bacaIsi();
    const sumber = isiLengkap(req.body.isi);
    let isiBaru = simpanan.isi;
    for (const kat of KATEGORI) {
      for (const b of kat.bagian) {
        isiBaru = pasang(isiBaru, b.kunci, bersihkan({ jenis: 'objek', ...b }, ambil(sumber, b.kunci), ambil(isiLengkap(isiBaru), b.kunci)));
      }
    }
    data.simpanRiwayat(simpanan, { kategori: null, ket: `Sebelum memulihkan cadangan oleh ${req.pengguna.nama}` });
    const meta = Object.fromEntries(KATEGORI.map((k) => [k.id, { diubah: kini(), oleh: req.pengguna.nama }]));
    data.tulisIsi(isiBaru, meta);
    catat(req, 'pulihkan-cadangan');
    res.json({ isi: isiLengkap(isiBaru), meta });
  });

  r.use((req, res) => { throw new Galat(404, 'Alamat API tidak ditemukan.'); });

  // eslint-disable-next-line no-unused-vars
  r.use((err, req, res, next) => {
    if (err.kode === 'DATA') {
      console.error(err.message);
      return res.status(503).json({ pesan: 'Folder data CMS tidak dapat dibaca atau ditulis. Developer perlu memeriksa pengaturan DATA_DIR di hosting.' });
    }
    const status = err instanceof Galat ? err.status : err.type === 'entity.too.large' ? 413 : err.status === 400 ? 400 : 500;
    if (status >= 500) console.error(err);
    const pesan = err instanceof Galat ? err.pesan
      : status === 413 ? 'Data yang dikirim terlalu besar.'
        : status === 400 ? 'Data yang dikirim tidak valid.'
          : 'Terjadi kesalahan di server. Coba lagi sebentar lagi.';
    res.status(status).json({ pesan });
  });

  return r;
}
