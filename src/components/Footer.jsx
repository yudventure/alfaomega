import { footer, gereja, jadwal, kunjungi } from '../data/isi.js';
import Ikon from './Ikon.jsx';
import { LOGO_SOSIAL, POLA_SOSIAL } from './logo-sosial.js';
import { tautanArah } from '../peta.js';
import { aset } from '../aset.js';

const judulKolom = 'mb-1.5 font-teks text-[.7rem] font-semibold uppercase leading-[1.6] tracking-[.3em] text-emas';
const tautanKaki = 'text-[.95rem] text-gading/80 no-underline hover:text-white';

// Logo dikenali dari nama platform atau link profilnya (Instagram, YouTube, Facebook, TikTok, WhatsApp, X, ...)
const logoUntuk = (s) => POLA_SOSIAL.find(([, pola]) => pola.test(`${s.label} ${s.href}`))?.[0];

function LogoSosial({ nama, className }) {
  const d = LOGO_SOSIAL[nama];
  if (!d) return <Ikon nama="tautan-luar" className={className} />;
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// Tombol petunjuk arah: langsung membuka rute ke gereja di Google Maps (aplikasi Maps di ponsel)
function TombolArah() {
  return (
    <a
      href={tautanArah({ gereja, kunjungi })}
      target="_blank"
      rel="noopener"
      aria-label={`${kunjungi.tombolArah.label} ke ${gereja.nama} di Google Maps`}
      className="group mt-3 flex w-full max-w-[290px] items-center gap-3 rounded-full border border-emas/40 bg-[linear-gradient(120deg,rgba(200,156,74,.2),rgba(200,156,74,.04))] p-[7px] pr-5 no-underline transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:border-emas hover:shadow-[0_18px_40px_-18px_rgba(200,156,74,.7)] focus-visible:border-emas"
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emas text-hitam">
        <span className="denyut absolute inset-0 rounded-full bg-emas" aria-hidden="true" />
        <Ikon nama="lokasi" className="relative h-[21px] w-[21px]" />
      </span>
      <span className="grid gap-1">
        <span className="font-teks text-[.78rem] font-bold uppercase leading-none tracking-[.14em] text-gading">{kunjungi.tombolArah.label}</span>
        <span className="text-[.78rem] leading-none text-gading/60">Buka rute di Google Maps</span>
      </span>
      <Ikon nama="tautan-luar" className="ml-auto h-[17px] w-[17px] text-emas transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-4 rounded-t-besar bg-hitam px-[clamp(1.25rem,4vw,3rem)] pb-8 pt-[clamp(3rem,6vw,4.5rem)] text-gading">
      <div className="isi grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <img src={aset('/logo/logo-footer-gelap.svg')} alt={gereja.nama} width="214" height="188" className="w-[200px]" />
        </div>
        <nav className="grid content-start gap-2" aria-label="Menu footer">
          <h4 className={judulKolom}>Halaman</h4>
          {footer.halaman.map((h) => <a key={h.href} href={h.href} className={tautanKaki}>{h.label}</a>)}
        </nav>
        <div className="grid content-start gap-2">
          <h4 className={judulKolom}>Ikuti Kami</h4>
          <ul className="grid gap-2.5">
            {footer.sosial.filter((s) => s.href && s.href !== '#').map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="group inline-flex items-center gap-3 text-[.95rem] text-gading/80 no-underline hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-garis-gelap text-emas transition-colors duration-200 group-hover:border-emas group-hover:bg-emas group-hover:text-hitam">
                    <LogoSosial nama={logoUntuk(s)} className="h-[17px] w-[17px]" />
                  </span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-2">
          <h4 className={judulKolom}>Ibadah Minggu</h4>
          <p className="text-[.95rem] text-gading/80">{jadwal.ringkas}<br />{footer.tempat}</p>
          <TombolArah />
        </div>
      </div>
      <div className="isi mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-garis-gelap pt-6 text-[.85rem] text-batu">
        <span>© {new Date().getFullYear()} {gereja.nama}</span>
        <a
          href="/admin"
          rel="nofollow"
          className="inline-flex items-center gap-2 rounded-full border border-garis-gelap px-4 py-2.5 font-teks text-[.68rem] font-semibold uppercase leading-none tracking-[.24em] text-emas no-underline transition-colors duration-200 hover:border-emas hover:bg-emas hover:text-hitam"
        >
          <Ikon nama="pengguna" className="h-[15px] w-[15px]" />
          Login Admin
        </a>
      </div>
    </footer>
  );
}
