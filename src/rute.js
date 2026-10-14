// Navigasi antarhalaman tanpa memuat ulang browser, tanpa pustaka tambahan.
// Daftar halamannya ada di src/App.jsx (RUTE).
import { useEffect, useSyncExternalStore } from 'react';

const PERISTIWA = 'alfaomega:navigasi';

function langganan(ubah) {
  window.addEventListener('popstate', ubah);
  window.addEventListener(PERISTIWA, ubah);
  return () => {
    window.removeEventListener('popstate', ubah);
    window.removeEventListener(PERISTIWA, ubah);
  };
}

// '/siapa-kami/' dan '/siapa-kami' dianggap sama
export const rapikan = (jalur) => jalur.replace(/\/+$/, '') || '/';

export function useJalur() {
  return useSyncExternalStore(langganan, () => rapikan(window.location.pathname));
}

export function pindahKe(href) {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new Event(PERISTIWA));
}

// Klik pada tautan internal ke halaman yang dikenal (mis. /siapa-kami, /#jadwal)
// ditangani di sini supaya halaman tidak dimuat ulang.
export function useTautanInternal(adaRute) {
  useEffect(() => {
    const klik = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href);
      const jalur = rapikan(url.pathname);
      if (url.origin !== window.location.origin || !adaRute(jalur)) return;
      const halamanSama = jalur === rapikan(window.location.pathname);
      if (halamanSama && url.hash) return; // lompat ke bagian di halaman yang sama: biarkan browser
      e.preventDefault();
      if (halamanSama) {
        window.history.replaceState(null, '', url.pathname + url.search);
        window.scrollTo({ top: 0 });
        return;
      }
      pindahKe(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', klik);
    return () => document.removeEventListener('click', klik);
  }, [adaRute]);
}
