// SEO: meta tag per halaman (disisipkan server), data terstruktur JSON-LD, sitemap.xml, dan robots.txt.
// Semua alamat memakai SITE_URL bila diatur, kalau tidak alamat yang sedang diakses (lihat situs.js),
// jadi tetap benar baik di domain uji maupun domain gereja nanti.
import * as bawaan from '../src/data/konten.js';
import { HALAMAN, halamanUntuk } from '../src/cms/halaman.js';
import { denganVersi } from '../src/cms/aset.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jsonAman = (obj) => JSON.stringify(obj).replace(/[<\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
const kodeVerifikasi = (v = '') => (String(v).match(/content=["']([^"']+)/)?.[1] ?? String(v)).trim();

const absolut = (asal, url, versi) => {
  const u = denganVersi(url, versi);
  return !u ? '' : /^https?:\/\//i.test(u) ? u : `${asal}${u.startsWith('/') ? '' : '/'}${u}`;
};

// Data terstruktur schema.org/Church supaya Google mengenali nama, alamat, kontak, dan media sosial gereja
function jsonLd(isi, asal, versi) {
  const info = isi.kunjungi?.info ?? [];
  const infoBawaan = bawaan.kunjungi.info;
  const barisInfo = (ikon) => {
    const i = info.findIndex((x) => x.ikon === ikon);
    if (i < 0) return '';
    const sama = JSON.stringify(info[i].isi) === JSON.stringify(infoBawaan.find((x) => x.ikon === ikon)?.isi);
    return sama ? '' : (info[i].isi ?? []).join(', '); // isi contoh (belum diganti) tidak ikut
  };
  const alamat = barisInfo('lokasi');
  const telepon = barisInfo('telepon').replace(/[^\d+]/g, '');
  const email = barisInfo('email').match(/[^\s@,]+@[^\s@,]+\.[^\s@,]+/)?.[0];
  const sosial = (isi.footer?.sosial ?? []).map((s) => s.href).filter((h) => /^https?:\/\//.test(h));
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: isi.gereja.nama,
    alternateName: isi.gereja.namaPendek,
    slogan: isi.gereja.tagline,
    description: isi.seo.deskripsi,
    url: `${asal}/`,
    logo: `${asal}/icon-512.png`,
    image: absolut(asal, isi.seo.gambarBerbagi || isi.hero.gambar, versi),
    ...(alamat ? { address: { '@type': 'PostalAddress', streetAddress: alamat, addressCountry: 'ID' } } : {}),
    ...(telepon.length >= 8 ? { telephone: telepon } : {}),
    ...(email ? { email } : {}),
    ...(sosial.length ? { sameAs: sosial } : {}),
  };
}

// Tag <head> untuk satu halaman. Mengembalikan judul dan HTML tag yang disisipkan sebelum </head>.
export function buatKepala({ jalur, isi, asal, versi, nonce, admin }) {
  const h = halamanUntuk(jalur);
  const nama = isi.gereja.nama;
  let judul;
  let deskripsi = isi.seo.deskripsi;
  let robots = 'index, follow, max-image-preview:large';
  if (admin) { judul = `CMS · ${nama}`; robots = 'noindex, nofollow'; }
  else if (!h) { judul = `Halaman Tidak Ditemukan · ${nama}`; robots = 'noindex, follow'; }
  else { judul = h.judul(isi); deskripsi = h.deskripsi(isi) || isi.seo.deskripsi; }

  const url = `${asal}${jalur === '/' ? '/' : jalur}`;
  const gambar = absolut(asal, isi.seo.gambarBerbagi || '/og/og-beranda.jpg', versi);
  const tag = [
    `<meta name="description" content="${esc(deskripsi)}">`,
    `<meta name="robots" content="${robots}">`,
  ];
  if (h && !admin) {
    tag.push(
      `<link rel="canonical" href="${esc(url)}">`,
      '<meta property="og:type" content="website">',
      '<meta property="og:locale" content="id_ID">',
      `<meta property="og:site_name" content="${esc(nama)}">`,
      `<meta property="og:title" content="${esc(judul)}">`,
      `<meta property="og:description" content="${esc(deskripsi)}">`,
      `<meta property="og:url" content="${esc(url)}">`,
      `<meta property="og:image" content="${esc(gambar)}">`,
      `<meta property="og:image:alt" content="${esc(`${nama} · ${isi.gereja.tagline}`)}">`,
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${esc(judul)}">`,
      `<meta name="twitter:description" content="${esc(deskripsi)}">`,
      `<meta name="twitter:image" content="${esc(gambar)}">`,
      `<script type="application/ld+json" nonce="${nonce}">${jsonAman(jsonLd(isi, asal, versi))}</script>`,
    );
  }
  if (isi.seo.verifikasiGoogle) tag.push(`<meta name="google-site-verification" content="${esc(kodeVerifikasi(isi.seo.verifikasiGoogle))}">`);
  if (isi.seo.verifikasiBing) tag.push(`<meta name="msvalidate.01" content="${esc(kodeVerifikasi(isi.seo.verifikasiBing))}">`);
  // foto hero dimuat paling awal (mempercepat tampilan pertama)
  if (jalur === '/' && !admin) {
    const g = (u) => esc(denganVersi(u, versi));
    if (isi.hero.gambarPonsel) tag.push(`<link rel="preload" as="image" href="${g(isi.hero.gambarPonsel)}" media="(max-width: 700px)" fetchpriority="high">`);
    if (isi.hero.gambar) tag.push(`<link rel="preload" as="image" href="${g(isi.hero.gambar)}" media="(min-width: 701px)" fetchpriority="high">`);
  }
  return { judul, tag: tag.join('\n    ') };
}

export function robotsTxt(asal) {
  return ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${asal}/sitemap.xml`, ''].join('\n');
}

// lastmod tiap halaman = waktu perubahan CMS terakhir pada kategorinya (atau waktu build)
export function sitemapXml({ isi, meta, asal, versi, dibangun }) {
  const waktu = (kategori) => {
    const daftar = Object.entries(meta ?? {}).filter(([k]) => !kategori || kategori.includes(k)).map(([, m]) => m.diubah);
    return [...daftar, dibangun].filter(Boolean).sort().at(-1);
  };
  const url = HALAMAN.map((h) => {
    const gambar = [...new Set(h.gambar(isi).filter(Boolean))].map((g) => absolut(asal, g, versi));
    const lastmod = waktu(h.kategori);
    return [
      '  <url>',
      `    <loc>${esc(`${asal}${h.jalur === '/' ? '/' : h.jalur}`)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod.slice(0, 10)}</lastmod>`] : []),
      `    <changefreq>${h.ubah}</changefreq>`,
      `    <priority>${h.prioritas}</priority>`,
      ...gambar.map((g) => `    <image:image><image:loc>${esc(g)}</image:loc></image:image>`),
      '  </url>',
    ].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...url,
    '</urlset>',
    '',
  ].join('\n');
}

