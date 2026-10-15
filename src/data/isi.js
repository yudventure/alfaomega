// Isi yang dipakai situs: isi bawaan (konten.js) ditimpa isi dari CMS.
// Server menyisipkan isi CMS ke halaman sebagai window.__KONTEN__ (lihat server.js).
import * as bawaan from './konten.js';
import { gabung } from '../cms/gabung.js';

const dariCms = typeof window !== 'undefined' ? window.__KONTEN__ : undefined;
export const isi = gabung({ ...bawaan }, dariCms && typeof dariCms === 'object' ? dariCms : undefined);

export const {
  gereja, menu, hero, sambutan, langkah, jadwal, khotbah, jemaat, persembahan, kunjungi,
  halamanSiapaKami, siapaKami, nilai, pengurus, ajakan, footer, seo, halamanLangkah, kalender,
} = isi;
