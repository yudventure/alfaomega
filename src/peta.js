import { kunjungi as kunjungiBawaan } from './data/konten.js';

const RUTE = 'https://www.google.com/maps/dir/?api=1&destination=';

// Tautan Google Maps yang langsung membuka rute dari lokasi pengunjung ke gereja
// (di ponsel terbuka di aplikasi Google Maps). Tujuan diambil berurutan dari:
// 1. kunjungi.tujuanPeta  (CMS: Kontak & Lokasi → "Tujuan di Google Maps")
// 2. link khusus di tombol Petunjuk Arah, bila sudah diisi
// 3. nama gereja + alamat (alamat contoh yang belum diganti tidak ikut)
export function tautanArah({ gereja, kunjungi }) {
  const tujuan = String(kunjungi?.tujuanPeta ?? '').trim();
  if (tujuan) return RUTE + encodeURIComponent(tujuan);
  const khusus = String(kunjungi?.tombolArah?.href ?? '').trim();
  if (khusus && khusus !== '#') return khusus;
  const alamat = kunjungi?.info?.find((k) => k.ikon === 'lokasi')?.isi ?? [];
  const contoh = kunjungiBawaan.info.find((k) => k.ikon === 'lokasi')?.isi ?? [];
  const pakaiAlamat = alamat.length && JSON.stringify(alamat) !== JSON.stringify(contoh);
  const baris = [gereja?.nama, ...(pakaiAlamat ? alamat : [])].filter(Boolean);
  return RUTE + encodeURIComponent([...new Set(baris)].join(', '));
}
