import Nav from './Nav.jsx';
import Monogram from './Monogram.jsx';
import { Teks } from './Dasar.jsx';
import { useParalaks } from '../paralaks.js';

// Kepala untuk halaman selain beranda: kartu gelap dengan menu, judul halaman, dan ornamen monogram.
// `remah` = nama halaman untuk jejak "Beranda / ...". `children` = tombol opsional di bawah teks.
export default function KepalaHalaman({ remah, label, judul, teks, children }) {
  const kepalaRef = useParalaks();
  return (
    <div className="pt-[88px] md:pt-[92px]">
      <Nav />
      <header
        ref={kepalaRef}
        id="awal"
        className="relative isolate mx-auto flex min-h-[min(64vh,580px)] max-w-[1440px] flex-col justify-end overflow-hidden rounded-besar bg-hitam text-gading shadow-kartu"
      >
        {/* latar + ornamen dalam bingkai yang dipotong membulat, supaya sudut tetap bulat walau ornamennya bergerak */}
        <div className="klip-besar absolute inset-0 -z-10 overflow-hidden rounded-[inherit]" aria-hidden="true">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(200,162,90,.32),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(154,118,51,.22),transparent_50%)]"
            aria-hidden="true"
          />
          <div className="paralaks-ornamen absolute -right-[6%] top-[12%] w-[min(70%,560px)] md:-right-[2%] md:w-[min(44%,560px)]">
            <Monogram garis strokeWidth={5} className="masuk-ornamen w-full text-emas/25" />
          </div>
        </div>

        <div className="paralaks-isi relative grid gap-4 px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(2rem,4vw,3.5rem)] pt-20 md:pt-28">
          {remah ? (
            <nav aria-label="Jejak halaman" className="masuk label text-emas-muda" style={{ '--tunda': '120ms' }}>
              <a href="/" className="text-gading/75 no-underline hover:text-white">Beranda</a>
              <span className="mx-3 text-gading/40" aria-hidden="true">/</span>
              <span aria-current="page">{remah}</span>
            </nav>
          ) : (
            label && <p className="masuk label text-emas-muda" style={{ '--tunda': '120ms' }}>{label}</p>
          )}
          <Teks
            as="h1"
            html={judul}
            className="masuk font-judul text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[1.02] text-white [&_em]:text-emas-muda"
            style={{ '--tunda': '220ms' }}
          />
          {teks && <p className="masuk max-w-[54ch] text-gading/85" style={{ '--tunda': '360ms' }}>{teks}</p>}
          {children && <div className="masuk mt-2 flex flex-wrap gap-3" style={{ '--tunda': '460ms' }}>{children}</div>}
        </div>
      </header>
    </div>
  );
}
