import { useEffect, useState } from 'react';
import { gereja, menu } from '../data/konten.js';
import Ikon from './Ikon.jsx';

export default function Nav() {
  const [buka, setBuka] = useState(false);

  useEffect(() => {
    if (!buka) return undefined;
    const tutup = (e) => { if (e.key === 'Escape') setBuka(false); };
    document.addEventListener('keydown', tutup);
    return () => document.removeEventListener('keydown', tutup);
  }, [buka]);

  const tautan = 'block rounded-2xl px-4 py-3.5 font-semibold text-[.8125rem] uppercase tracking-[.08em] text-batu-tua no-underline hover:bg-gading hover:text-hitam md:inline md:rounded-none md:p-0 md:py-2 md:hover:bg-transparent';

  return (
    <nav
      aria-label="Menu utama"
      className="absolute left-1/2 top-[18px] z-10 flex w-[min(calc(100%-36px),1180px)] -translate-x-1/2 items-center gap-3 rounded-full bg-krem/92 py-2 pl-[18px] pr-2 text-hitam shadow-[0_10px_30px_-14px_rgba(0,0,0,.35)] backdrop-blur-xl md:gap-6 md:py-[9px] md:pl-[26px] md:pr-[10px]"
    >
      <a href="#awal" aria-label={`${gereja.nama}, ke awal halaman`}>
        <img src="/logo/logo-header-terang.svg" alt="" width="166" height="40" className="h-9 w-auto" />
      </a>

      <ul
        id="menu"
        className={`${buka ? 'flex' : 'hidden'} absolute left-0 right-0 top-[calc(100%+10px)] flex-col rounded-3xl bg-krem p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,.4)] md:static md:ml-auto md:mr-2 md:flex md:flex-row md:gap-[1.6rem] md:rounded-none md:bg-transparent md:p-0 md:shadow-none`}
      >
        {menu.map((m) => (
          <li key={m.href}><a href={m.href} className={tautan} onClick={() => setBuka(false)}>{m.label}</a></li>
        ))}
        <li className="md:hidden"><a href="#kunjungi" className={tautan} onClick={() => setBuka(false)}>Kunjungi Kami</a></li>
      </ul>

      <a href="#kunjungi" className="tombol tombol-emas hidden md:inline-flex">Kunjungi Kami</a>

      <button
        type="button"
        className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-hitam text-gading md:hidden"
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
