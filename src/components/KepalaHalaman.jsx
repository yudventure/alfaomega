import Nav from './Nav.jsx';
import Monogram from './Monogram.jsx';
import { Teks } from './Dasar.jsx';

// Kepala untuk halaman selain beranda: kartu gelap dengan menu, judul halaman, dan ornamen monogram.
// `remah` = nama halaman untuk jejak "Beranda / ...". `children` = tombol opsional di bawah teks.
export default function KepalaHalaman({ remah, label, judul, teks, children }) {
  return (
    <div className="pt-[88px] md:pt-[92px]">
      <Nav />
      <header
        id="awal"
        className="relative isolate mx-auto flex min-h-[min(64vh,580px)] max-w-[1440px] flex-col justify-end overflow-hidden rounded-besar bg-hitam text-gading shadow-kartu"
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_82%_18%,rgba(200,162,90,.32),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(154,118,51,.22),transparent_50%)]"
          aria-hidden="true"
        />
        <Monogram garis strokeWidth={5} className="absolute -right-[6%] top-[12%] -z-10 w-[min(70%,560px)] text-emas/25 md:-right-[2%] md:w-[min(44%,560px)]" />

        <div className="relative grid gap-4 px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(2rem,4vw,3.5rem)] pt-20 md:pt-28">
          {remah ? (
            <nav aria-label="Jejak halaman" className="label text-emas-muda">
              <a href="/" className="text-gading/75 no-underline hover:text-white">Beranda</a>
              <span className="mx-3 text-gading/40" aria-hidden="true">/</span>
              <span aria-current="page">{remah}</span>
            </nav>
          ) : (
            label && <p className="label text-emas-muda">{label}</p>
          )}
          <Teks
            as="h1"
            html={judul}
            className="font-judul text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[1.02] text-white [&_em]:text-emas-muda"
          />
          {teks && <p className="max-w-[54ch] text-gading/85">{teks}</p>}
          {children && <div className="mt-2 flex flex-wrap gap-3">{children}</div>}
        </div>
      </header>
    </div>
  );
}
