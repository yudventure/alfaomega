import { useEffect, useState } from 'react';
import { gereja, menu } from '../data/isi.js';
import Ikon from './Ikon.jsx';
import { useJalur } from '../rute.js';

// Menu utama. Di posisi paling atas: transparan di atas foto hero (logo & teks terang).
// Begitu halaman digulir: menempel di atas layar dengan latar krem (logo & teks gelap).
export default function Nav() {
  const [buka, setBuka] = useState(false);
  const [tergulir, setTergulir] = useState(false);
  const jalur = useJalur();
  const padat = tergulir || buka;

  useEffect(() => {
    let rafId = 0;
    const cek = () => { rafId = 0; setTergulir(window.scrollY > 24); };
    const saatGulir = () => { if (!rafId) rafId = requestAnimationFrame(cek); };
    cek();
    window.addEventListener('scroll', saatGulir, { passive: true });
    return () => {
      window.removeEventListener('scroll', saatGulir);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!buka) return undefined;
    const tutup = (e) => { if (e.key === 'Escape') setBuka(false); };
    document.addEventListener('keydown', tutup);
    return () => document.removeEventListener('keydown', tutup);
  }, [buka]);

  const tautan = padat
    ? 'block rounded-2xl px-4 py-3.5 font-semibold text-[.8125rem] uppercase tracking-[.08em] text-batu-tua no-underline hover:bg-gading hover:text-hitam aria-[current=page]:text-emas-teks md:inline md:rounded-none md:p-0 md:py-2 md:hover:bg-transparent'
    : 'block rounded-2xl px-4 py-3.5 font-semibold text-[.8125rem] uppercase tracking-[.08em] text-batu-tua no-underline hover:bg-gading hover:text-hitam aria-[current=page]:text-emas-teks md:inline md:rounded-none md:p-0 md:py-2 md:text-gading/90 md:hover:bg-transparent md:hover:text-white md:aria-[current=page]:text-emas-muda md:[text-shadow:0_1px_10px_rgba(0,0,0,.45)]';

  return (
    <nav
      aria-label="Menu utama"
      className={`fixed left-1/2 z-40 flex w-[min(calc(100%-68px),1180px)] -translate-x-1/2 items-center gap-3 rounded-full py-2 pl-[18px] pr-2 transition-[top,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none md:gap-6 md:py-[9px] md:pl-[26px] md:pr-[10px] ${
        padat
          ? 'top-3 bg-krem/92 text-hitam shadow-[0_10px_30px_-14px_rgba(0,0,0,.35)] backdrop-blur-xl'
          : 'top-8 bg-transparent text-gading shadow-none'
      }`}
    >
      <a href="/" aria-label={`${gereja.nama}, ke beranda`} className="relative block shrink-0">
        {/* dua versi logo ditumpuk supaya pergantiannya halus, tanpa berkedip */}
        <img src="/logo/logo-header-terang.svg" alt="" width="166" height="40" className={`h-9 w-auto transition-opacity duration-300 ${padat ? 'opacity-100' : 'opacity-0'}`} />
        <img src="/logo/logo-header-gelap.svg" alt="" width="166" height="40" className={`absolute inset-0 h-9 w-auto transition-opacity duration-300 ${padat ? 'opacity-0' : 'opacity-100'}`} />
      </a>

      <ul
        id="menu"
        className={`${buka ? 'flex' : 'hidden'} absolute left-0 right-0 top-[calc(100%+10px)] flex-col rounded-3xl bg-krem p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,.4)] md:static md:ml-auto md:mr-2 md:flex md:flex-row md:gap-[1.6rem] md:rounded-none md:bg-transparent md:p-0 md:shadow-none`}
      >
        {menu.map((m) => (
          <li key={m.href}>
            <a href={m.href} className={tautan} aria-current={m.href === jalur ? 'page' : undefined} onClick={() => setBuka(false)}>{m.label}</a>
          </li>
        ))}
        <li className="md:hidden"><a href="/#kunjungi" className={tautan} onClick={() => setBuka(false)}>Kunjungi Kami</a></li>
      </ul>

      <a href="/#kunjungi" className="tombol tombol-emas hidden md:inline-flex">Kunjungi Kami</a>

      <button
        type="button"
        className={`ml-auto grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 md:hidden ${padat ? 'bg-hitam text-gading' : 'bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md'}`}
        aria-expanded={buka}
        aria-controls="menu"
        aria-label={buka ? 'Tutup menu' : 'Buka menu'}
        onClick={() => setBuka((b) => !b)}
      >
        <Ikon nama={buka ? 'tutup' : 'menu'} className="h-[22px] w-[22px]" />
      </button>
    </nav>
  );
}
