// Alat bantu objek isi website, dipakai situs, panel CMS, dan server.

export const objekBiasa = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Isi tersimpan (dari CMS) ditimpakan ke isi bawaan. Objek digabung per kunci;
// teks dan daftar diganti utuh. Kunci baru di isi bawaan tetap muncul walau belum pernah disimpan.
export function gabung(dasar, atas) {
  if (atas === undefined) return dasar;
  if (!objekBiasa(dasar) || !objekBiasa(atas)) return atas;
  const hasil = { ...dasar };
  for (const [k, v] of Object.entries(atas)) hasil[k] = gabung(dasar[k], v);
  return hasil;
}

// ambil(isi, 'jemaat.pemuda') -> isi.jemaat.pemuda
export function ambil(obj, jalur) {
  return jalur.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// pasang(isi, 'jemaat.pemuda', nilai) -> salinan isi dengan nilai baru (isi asli tidak diubah)
export function pasang(obj, jalur, nilai) {
  const [k, ...sisa] = jalur.split('.');
  const dasar = objekBiasa(obj) ? obj : {};
  return { ...dasar, [k]: sisa.length ? pasang(dasar[k], sisa.join('.'), nilai) : nilai };
}
