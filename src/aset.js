import { denganVersi } from './cms/aset.js';

// __VERSI_ASET__ diisi Vite saat build (lihat vite.config.js)
// eslint-disable-next-line no-undef
export const aset = (url) => denganVersi(url, __VERSI_ASET__);
