// ==========================================================
// PENGATURAN LINGKUNGAN (environment variables)
// Satu daftar untuk semua variabel: dipakai server, halaman Sistem di CMS, dan .env.example.
//
// Urutan prioritas nilai:
//   1. Variabel lingkungan dari panel hosting (hPanel)        -> tidak bisa diubah dari CMS
//   2. DATA_DIR/.env  (ditulis ulang otomatis setiap ada perubahan dari CMS > Sistem)
//   3. .env di folder aplikasi (dibuat manual, mis. lewat File Manager)
//
// Variabel baru? Tambahkan di VARIABEL lalu jalankan `npm run env:contoh` untuk memperbarui .env.example.
// File ini harus diimpor paling awal (lihat server.js) sebelum modul lain membaca process.env.
// ==========================================================
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

export const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const VARIABEL = [
  {
    nama: 'SITE_URL', kelompok: 'Website', cms: true, contoh: 'https://testingwebsite.click',
    ket: 'Alamat utama website tanpa garis miring di akhir. Dipakai untuk sitemap, tautan kanonik, gambar saat link dibagikan, dan tautan di email. Kosong = memakai alamat yang sedang diakses pengunjung.',
  },
  {
    nama: 'DATA_DIR', kelompok: 'Penyimpanan', contoh: '/home/u123456789/alfaomega-data',
    ket: 'Folder data CMS (isi, pengguna, foto unggahan, log, versi). Taruh di luar folder aplikasi agar tidak terhapus saat deploy ulang. Bawaan: ~/alfaomega-data.',
  },
  {
    nama: 'CMS_KODE_SETUP', kelompok: 'Keamanan', rahasia: true, contoh: 'ganti-dengan-kode-pilihan-anda',
    ket: 'Kode untuk membuat akun developer pertama di /admin. Bila kosong, kode dibuat otomatis di DATA_DIR/kode-setup.txt.',
  },
  {
    nama: 'SESSION_SECRET', kelompok: 'Keamanan', rahasia: true, contoh: 'teks-acak-panjang-minimal-32-karakter',
    ket: 'Kunci penanda tangan sesi masuk. Bila kosong, dibuat otomatis di DATA_DIR/rahasia-sesi.key. Mengubahnya membuat semua pengguna keluar.',
  },
  {
    nama: 'SMTP_HOST', kelompok: 'Email', cms: true, contoh: 'smtp.hostinger.com',
    ket: 'Server SMTP untuk mengirim email (OTP lupa kata sandi, pemberitahuan akun). Hostinger: smtp.hostinger.com. Gmail: smtp.gmail.com.',
  },
  { nama: 'SMTP_PORT', kelompok: 'Email', cms: true, contoh: '465', ket: 'Port SMTP. 465 (SSL, disarankan) atau 587 (STARTTLS).' },
  { nama: 'SMTP_USER', kelompok: 'Email', cms: true, contoh: 'noreply@testingwebsite.click', ket: 'Nama pengguna SMTP, biasanya alamat email lengkap.' },
  { nama: 'SMTP_PASS', kelompok: 'Email', cms: true, rahasia: true, contoh: 'kata-sandi-email', ket: 'Kata sandi akun email (Gmail: App Password, bukan sandi biasa).' },
  { nama: 'MAIL_FROM', kelompok: 'Email', cms: true, contoh: 'Gereja Alfa Omega <noreply@testingwebsite.click>', ket: 'Pengirim yang tampil di email. Bawaan: SMTP_USER.' },
  { nama: 'MAIL_BALAS', kelompok: 'Email', cms: true, contoh: 'sekretariat@testingwebsite.click', ket: 'Alamat balasan (Reply-To), opsional.' },
  { nama: 'PORT', kelompok: 'Server', contoh: '3000', ket: 'Port server. Biasanya diatur otomatis oleh Hostinger; bawaan 3000.' },
];
const DAFTAR_NAMA = new Set(VARIABEL.map((v) => v.nama));

function bacaEnv(berkas) {
  try {
    return parseEnv(fs.readFileSync(berkas, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn(`Berkas ${berkas} tidak dapat dibaca: ${e.message}`);
    return {};
  }
}

export const FILE_ENV_AKAR = path.join(AKAR, '.env');
const dariAkar = bacaEnv(FILE_ENV_AKAR);
const dariHosting = Object.fromEntries(VARIABEL.filter((v) => process.env[v.nama]).map((v) => [v.nama, process.env[v.nama]]));

export const DATA_DIR = path.resolve(dariHosting.DATA_DIR || dariAkar.DATA_DIR || path.join(os.homedir(), 'alfaomega-data'));
export const FILE_ENV_CMS = path.join(DATA_DIR, '.env');
let dariCms = bacaEnv(FILE_ENV_CMS);

const sumber = {};
function terapkan() {
  for (const v of VARIABEL) {
    if (dariHosting[v.nama] !== undefined) { sumber[v.nama] = 'hosting'; continue; }
    const nilai = (v.cms && dariCms[v.nama]) || dariAkar[v.nama];
    sumber[v.nama] = v.cms && dariCms[v.nama] ? 'cms' : dariAkar[v.nama] ? 'berkas' : 'kosong';
    if (nilai) process.env[v.nama] = nilai;
    else delete process.env[v.nama];
  }
}
terapkan();

// Untuk halaman Sistem: daftar variabel, sumbernya, dan nilainya (rahasia tidak pernah dikirim)
export function infoEnv() {
  let diubah = null;
  try { diubah = fs.statSync(FILE_ENV_CMS).mtime.toISOString(); } catch { /* belum ada */ }
  return {
    berkasCms: FILE_ENV_CMS,
    berkasAkar: FILE_ENV_AKAR,
    diubah,
    variabel: VARIABEL.map((v) => ({
      nama: v.nama, kelompok: v.kelompok, ket: v.ket, contoh: v.contoh, rahasia: Boolean(v.rahasia),
      sumber: sumber[v.nama], terisi: Boolean(process.env[v.nama]),
      nilai: v.rahasia ? '' : process.env[v.nama] ?? '',
      bisaDiubah: Boolean(v.cms) && sumber[v.nama] !== 'hosting',
    })),
  };
}

// Tulis satu nilai .env dengan kutip yang aman untuk parser Node
function kutip(nilai) {
  if (!/[\s#'"`\\$]/.test(nilai)) return nilai;
  if (!nilai.includes("'")) return `'${nilai}'`;
  if (!nilai.includes('`')) return `\`${nilai}\``;
  throw Object.assign(new Error('Nilai tidak boleh memuat tanda kutip satu dan backtick sekaligus.'), { status: 400 });
}

function tulisFileEnv(berkas, judul, nilai) {
  const baris = [
    `# ${judul}`,
    `# Ditulis otomatis oleh CMS Gereja Alfa Omega pada ${new Date().toISOString()}. Jangan dibagikan: dapat memuat kata sandi.`,
    '',
  ];
  let kelompok = '';
  for (const v of VARIABEL) {
    if (!nilai[v.nama]) continue;
    if (v.kelompok !== kelompok) { kelompok = v.kelompok; baris.push(`# --- ${kelompok} ---`); }
    baris.push(`${v.nama}=${kutip(nilai[v.nama])}`);
  }
  const sementara = `${berkas}.tmp`;
  fs.writeFileSync(sementara, `${baris.join('\n')}\n`, { mode: 0o600 });
  try { fs.copyFileSync(berkas, `${berkas}.sebelumnya`); fs.chmodSync(`${berkas}.sebelumnya`, 0o600); } catch { /* belum ada versi lama */ }
  fs.renameSync(sementara, berkas);
}

// Simpan perubahan dari CMS ke DATA_DIR/.env lalu langsung berlaku tanpa restart.
// perubahan: { NAMA: 'nilai' }; '' = hapus; rahasia yang tidak dikirim tetap.
export function simpanEnvCms(perubahan) {
  const baru = { ...dariCms };
  const diubah = [];
  for (const [nama, mentah] of Object.entries(perubahan ?? {})) {
    const v = VARIABEL.find((x) => x.nama === nama);
    if (!v?.cms || !DAFTAR_NAMA.has(nama) || sumber[nama] === 'hosting') continue;
    if (typeof mentah !== 'string') continue;
    const nilai = mentah.replace(/[\r\n\0]/g, '').trim().slice(0, 500);
    if ((baru[nama] ?? '') === nilai) continue;
    if (nilai) baru[nama] = nilai; else delete baru[nama];
    diubah.push(nama);
  }
  if (baru.SITE_URL) {
    if (!/^https?:\/\/[^\s/]+$/i.test(baru.SITE_URL.replace(/\/+$/, ''))) throw Object.assign(new Error('SITE_URL harus berupa alamat lengkap, mis. https://gerejaalfaomega.org'), { status: 400 });
    baru.SITE_URL = baru.SITE_URL.replace(/\/+$/, '');
  }
  if (baru.SMTP_PORT && !/^\d{2,5}$/.test(baru.SMTP_PORT)) throw Object.assign(new Error('SMTP_PORT harus berupa angka, mis. 465.'), { status: 400 });
  if (!diubah.length) return [];
  tulisFileEnv(FILE_ENV_CMS, 'Pengaturan lingkungan dari CMS > Sistem', baru);
  dariCms = baru;
  terapkan();
  return diubah;
}

export function teksEnvContoh() {
  const baris = [
    '# ==========================================================',
    '# Contoh pengaturan lingkungan Gereja Alfa Omega',
    '# Salin menjadi .env (folder aplikasi) atau isi di hPanel > Node.js > Environment variables.',
    '# Variabel bertanda [CMS] juga bisa diubah developer dari /admin > Sistem & Cadangan;',
    '# perubahan itu disimpan otomatis ke DATA_DIR/.env setiap kali disimpan.',
    '# Berkas ini dibuat dari server/konfigurasi.js: jalankan `npm run env:contoh` setelah menambah variabel.',
    '# ==========================================================',
  ];
  let kelompok = '';
  for (const v of VARIABEL) {
    if (v.kelompok !== kelompok) { kelompok = v.kelompok; baris.push('', `# --- ${kelompok} ---`); }
    baris.push(`# ${v.ket}${v.cms ? ' [CMS]' : ''}`, `# Contoh: ${v.nama}=${kutip(v.contoh)}`, `${v.nama}=`);
  }
  return `${baris.join('\n')}\n`;
}

// `node server/konfigurasi.js --contoh` menulis ulang .env.example
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--contoh')) {
  fs.writeFileSync(path.join(AKAR, '.env.example'), teksEnvContoh());
  console.log('.env.example diperbarui.');
}
