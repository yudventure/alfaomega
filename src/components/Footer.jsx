import { footer, gereja, jadwal } from '../data/konten.js';
import { Tautan } from './Dasar.jsx';

const judulKolom = 'mb-1.5 font-teks text-[.7rem] font-semibold uppercase leading-[1.6] tracking-[.3em] text-emas';
const tautanKaki = 'text-[.95rem] text-gading/80 no-underline hover:text-white';

export default function Footer() {
  return (
    <footer className="mt-4 rounded-t-besar bg-hitam px-[clamp(1.25rem,4vw,3rem)] pb-8 pt-[clamp(3rem,6vw,4.5rem)] text-gading">
      <div className="isi grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <img src="/logo/logo-footer-gelap.svg" alt={gereja.nama} width="220" height="190" className="w-[200px]" />
        </div>
        <nav className="grid content-start gap-2" aria-label="Menu footer">
          <h4 className={judulKolom}>Halaman</h4>
          {footer.halaman.map((h) => <a key={h.href} href={h.href} className={tautanKaki}>{h.label}</a>)}
        </nav>
        <div className="grid content-start gap-2">
          <h4 className={judulKolom}>Ikuti Kami</h4>
          {footer.sosial.map((s) => <a key={s.label} href={s.href} className={tautanKaki} target="_blank" rel="noopener">{s.label}</a>)}
        </div>
        <div className="grid content-start gap-2">
          <h4 className={judulKolom}>Ibadah Minggu</h4>
          <p className="text-[.95rem] text-gading/80">{jadwal.ringkas}<br />{footer.tempat}</p>
          <Tautan href="#kunjungi" terang className="mt-1 justify-self-start">Petunjuk arah</Tautan>
        </div>
      </div>
      <div className="isi mt-12 flex flex-wrap justify-between gap-2 border-t border-garis-gelap pt-6 text-[.85rem] text-batu">
        <span>© {new Date().getFullYear()} {gereja.nama}</span>
        <span className="label text-[.68rem] tracking-[.28em] text-emas">{gereja.tagline}</span>
      </div>
    </footer>
  );
}
