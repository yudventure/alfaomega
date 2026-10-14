// Alat bantu panel CMS: kompres gambar sebelum diunggah, format waktu & ukuran.

const bacaDataUrl = (file) => new Promise((ok, gagal) => {
  const r = new FileReader();
  r.onload = () => ok(r.result);
  r.onerror = () => gagal(new Error('Berkas tidak dapat dibaca.'));
  r.readAsDataURL(file);
});

// Foto dari ponsel sering 5–10 MB. Sisi terpanjang diperkecil ke 2400 px dan dikompres
// supaya website tetap cepat. PNG (logo, QRIS) dibiarkan PNG agar tetap tajam.
export async function siapkanGambar(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error(`${file.name}: format harus JPG, PNG, atau WebP.`);
  if (file.size > 30 * 1024 * 1024) throw new Error(`${file.name}: berkas terlalu besar (maks. 30 MB).`);
  const bmp = await createImageBitmap(file);
  const skala = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
  const lebar = Math.round(bmp.width * skala);
  const tinggi = Math.round(bmp.height * skala);
  if (skala === 1 && file.size <= 1.5 * 1024 * 1024) {
    bmp.close?.();
    return { data: await bacaDataUrl(file), lebar, tinggi };
  }
  const kanvas = Object.assign(document.createElement('canvas'), { width: lebar, height: tinggi });
  const ctx = kanvas.getContext('2d');
  const png = file.type === 'image/png';
  if (!png) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, lebar, tinggi);
  }
  ctx.drawImage(bmp, 0, 0, lebar, tinggi);
  bmp.close?.();
  let data = kanvas.toDataURL(png ? 'image/png' : 'image/jpeg', 0.85);
  if (png && data.length > 9_000_000) data = kanvas.toDataURL('image/jpeg', 0.85);
  return { data, lebar, tinggi };
}

export function waktuRelatif(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const detik = (Date.now() - d.getTime()) / 1000;
  if (detik < 60) return 'baru saja';
  if (detik < 3600) return `${Math.floor(detik / 60)} menit lalu`;
  if (detik < 86400) return `${Math.floor(detik / 3600)} jam lalu`;
  if (detik < 172800) return 'kemarin';
  if (detik < 7 * 86400) return `${Math.floor(detik / 86400)} hari lalu`;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const waktuLengkap = (iso) => (iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '–');

export function ukuranBerkas(b = 0) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export const inisial = (nama = '') => nama.trim().split(/\s+/).slice(0, 2).map((k) => k[0]?.toUpperCase() ?? '').join('') || '?';
