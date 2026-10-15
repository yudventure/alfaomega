// Gambar bawaan (/img, /og) diberi penanda versi ?v=... yang berubah setiap kali fotonya diganti,
// sehingga browser dan CDN hosting tidak menampilkan foto lama dari cache.
// Unggahan CMS (/media/...) tidak perlu: namanya selalu baru.
export const denganVersi = (url, versi) =>
  typeof url === 'string' && versi && /^\/(img|og|logo)\/[^?]+$/.test(url) ? `${url}?v=${versi}` : url;
