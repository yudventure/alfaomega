// Komponen dasar panel CMS
import { createContext, useContext, useEffect, useId, useRef } from 'react';
import Ikon from '../components/Ikon.jsx';

export const KonteksCms = createContext(null);
export const useCms = () => useContext(KonteksCms);

export const kelasInput =
  'w-full rounded-xl border border-garis bg-white px-3.5 py-2.5 text-[.95rem] leading-snug text-hitam shadow-[inset_0_1px_2px_rgba(0,0,0,.04)] placeholder:text-batu/70 focus:border-emas focus:outline-none focus:ring-2 focus:ring-emas/30 disabled:cursor-not-allowed disabled:bg-pasir/60';

const VARIAN = {
  utama: 'bg-hitam text-gading hover:bg-arang',
  emas: 'bg-emas text-hitam hover:bg-[#D6B36E]',
  garis: 'bg-white text-hitam shadow-[inset_0_0_0_1px_#E3D9C4] hover:bg-pasir/60',
  hantu: 'bg-transparent text-batu-tua hover:bg-pasir/70 hover:text-hitam',
  bahaya: 'bg-white text-anggur shadow-[inset_0_0_0_1px_rgba(110,30,42,.35)] hover:bg-anggur hover:text-white',
};

export function Tombol({ varian = 'utama', kecil = false, ikon, memuat = false, className = '', children, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${kecil ? 'px-3.5 py-1.5 text-[.8rem]' : 'px-5 py-2.5 text-[.875rem]'} ${VARIAN[varian]} ${className}`}
      disabled={memuat || rest.disabled}
      {...rest}
    >
      {memuat ? <Putaran /> : ikon && <Ikon nama={ikon} className={kecil ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />}
      {children}
    </button>
  );
}

export function Putaran({ className = 'h-4 w-4' }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} aria-hidden="true" />;
}

export function Memuat({ teks = 'Memuat…' }) {
  return (
    <div className="grid grid-cols-1 min-h-[40vh] place-items-center text-batu-tua" role="status">
      <span className="flex items-center gap-3"><Putaran className="h-5 w-5 text-emas-tua" /> {teks}</span>
    </div>
  );
}

export function Kartu({ judul, ket, aksi, className = '', children }) {
  return (
    <section className={`rounded-2xl border border-garis bg-krem p-5 shadow-[0_1px_2px_rgba(40,30,10,.04)] md:p-7 ${className}`}>
      {(judul || aksi) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {judul && <h2 className="font-judul text-[1.5rem] font-semibold leading-tight">{judul}</h2>}
            {ket && <p className="mt-1 text-[.9rem] text-batu-tua">{ket}</p>}
          </div>
          {aksi}
        </header>
      )}
      {children}
    </section>
  );
}

export function KepalaHalaman({ remah, judul, ket, aksi }) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="grid grid-cols-1 gap-1.5">
        {remah && <p className="label text-[.68rem]">{remah}</p>}
        <h1 className="font-judul text-[clamp(2rem,3.4vw,2.6rem)] font-semibold leading-[1.05]">{judul}</h1>
        {ket && <p className="max-w-[62ch] text-batu-tua">{ket}</p>}
      </div>
      {aksi && <div className="flex flex-wrap gap-2">{aksi}</div>}
    </header>
  );
}

export function Lencana({ children, nada = 'netral', className = '' }) {
  const warna = {
    netral: 'bg-pasir text-batu-tua',
    emas: 'bg-emas/20 text-emas-teks',
    gelap: 'bg-hitam text-gading',
    hijau: 'bg-[#E3F1E4] text-[#2E6B36]',
    merah: 'bg-anggur/10 text-anggur',
  }[nada];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[.72rem] font-semibold leading-none ${warna} ${className}`}>{children}</span>;
}

// Label + bantuan untuk satu bidang formulir
export function Bidang({ label, bantuan, galat, children, id }) {
  const otomatis = useId();
  const idBidang = id ?? otomatis;
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {label && <label htmlFor={idBidang} className="text-[.85rem] font-semibold text-arang">{label}</label>}
      {typeof children === 'function' ? children(idBidang) : children}
      {bantuan && !galat && <p className="text-[.8rem] leading-snug text-batu">{bantuan}</p>}
      {galat && <p className="text-[.8rem] font-medium leading-snug text-anggur">{galat}</p>}
    </div>
  );
}

export function Kosong({ ikon = 'info', judul, teks, children }) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-2 rounded-2xl border border-dashed border-garis px-6 py-12 text-center">
      <Ikon nama={ikon} className="h-9 w-9 text-emas-tua" />
      <p className="font-judul text-[1.3rem] font-semibold">{judul}</p>
      {teks && <p className="max-w-[46ch] text-[.9rem] text-batu-tua">{teks}</p>}
      {children}
    </div>
  );
}

export function Pesan({ nada = 'info', children }) {
  const warna = nada === 'galat' ? 'border-anggur/30 bg-anggur/5 text-anggur' : nada === 'peringatan' ? 'border-emas/50 bg-emas/10 text-emas-teks' : 'border-garis bg-pasir/50 text-batu-tua';
  return <div className={`rounded-xl border px-4 py-3 text-[.88rem] leading-relaxed ${warna}`} role={nada === 'galat' ? 'alert' : undefined}>{children}</div>;
}

export function Modal({ judul, onTutup, children, kaki, lebar = 'max-w-xl' }) {
  const ref = useRef(null);
  useEffect(() => {
    const tutup = (e) => { if (e.key === 'Escape') onTutup(); };
    document.addEventListener('keydown', tutup);
    const sebelumnya = document.activeElement;
    ref.current?.querySelector('input, textarea, select, button')?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tutup);
      document.body.style.overflow = '';
      sebelumnya?.focus?.();
    };
  }, [onTutup]);
  return (
    <div className="fixed inset-0 z-50 grid grid-cols-1 place-items-end bg-hitam/55 p-0 backdrop-blur-[2px] sm:place-items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={judul} className={`flex max-h-[92vh] w-full ${lebar} flex-col overflow-hidden rounded-t-3xl bg-krem shadow-2xl sm:rounded-3xl`}>
        <header className="flex items-center justify-between gap-4 border-b border-garis px-6 py-4">
          <h2 className="font-judul text-[1.45rem] font-semibold">{judul}</h2>
          <button type="button" onClick={onTutup} className="grid grid-cols-1 h-9 w-9 place-items-center rounded-full text-batu-tua hover:bg-pasir" aria-label="Tutup">
            <Ikon nama="tutup" className="h-5 w-5" />
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {kaki && <footer className="flex flex-wrap justify-end gap-2 border-t border-garis bg-gading/60 px-6 py-4">{kaki}</footer>}
      </div>
    </div>
  );
}
