import { useEffect, useRef, useState } from 'react';
import { hero } from '../data/isi.js';
import Nav from './Nav.jsx';
import { Teks, Tombol } from './Dasar.jsx';
import { aset } from '../aset.js';
import { useParalaks } from '../paralaks.js';

export default function Hero() {
  const kepalaRef = useParalaks();
  const fotoRef = useRef(null);
  const [termuat, setTermuat] = useState(false);

  // foto masuk dengan "zoom out" halus setelah benar-benar termuat (bukan saat masih kosong)
  useEffect(() => { if (fotoRef.current?.complete) setTermuat(true); }, []);

  return (
    <div className="pt-[88px] md:pt-[92px]">
      <Nav />
      <header
        ref={kepalaRef}
        id="awal"
        className="relative isolate mx-auto flex min-h-[min(88vh,820px)] max-w-[1440px] flex-col justify-end overflow-hidden rounded-besar bg-hitam text-gading shadow-kartu max-sm:min-h-[80vh]"
      >
        {/* foto + lapisan gelap dalam bingkai yang dipotong membulat (klip-besar), supaya sudut tetap bulat
            walau fotonya bergerak; foto bergerak lebih lambat dari halaman (paralaks) dan dibuat lebih tinggi agar tidak ada celah */}
        <div className="klip-besar absolute inset-0 -z-10 overflow-hidden rounded-[inherit] bg-hitam">
          <picture className="paralaks-foto absolute inset-x-0 -top-[12%] bottom-0 bg-hitam">
            <source media="(max-width: 700px)" srcSet={aset(hero.gambarPonsel)} />
            <img
              ref={fotoRef}
              src={aset(hero.gambar)}
              alt=""
              onLoad={() => setTermuat(true)}
              onError={() => setTermuat(true)}
              className={`foto-masuk h-full w-full object-cover ${termuat ? '' : 'foto-menunggu'}`}
              width="2400"
              height="1350"
              fetchPriority="high"
            />
          </picture>
          <div className="hero-lapisan absolute inset-0" aria-hidden="true" />
        </div>

        <div className="paralaks-isi relative grid items-end gap-x-16 gap-y-10 px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(2rem,4vw,3.5rem)] pt-16 md:grid-cols-[1.3fr_1fr] md:pt-24">
          <div className="grid gap-4">
            <p className="masuk label text-emas-muda" style={{ '--tunda': '150ms' }}>{hero.label}</p>
            <Teks
              as="h1"
              html={hero.judul}
              className="masuk font-judul text-[clamp(2.4rem,5.2vw,4.4rem)] font-semibold leading-[1.05] text-white [&_em]:text-emas-muda"
              style={{ '--tunda': '260ms' }}
            />
          </div>
          <div className="grid max-w-[460px] gap-[1.4rem] md:justify-self-end">
            <p className="masuk text-gading/90" style={{ '--tunda': '420ms' }}>{hero.teks}</p>
            <div className="masuk flex flex-wrap gap-3" style={{ '--tunda': '540ms' }}>
              <Tombol varian="gading" href={hero.tombolUtama.href} ikon={hero.tombolUtama.ikon}>{hero.tombolUtama.label}</Tombol>
              <Tombol varian="garis" href={hero.tombolKedua.href} ikon={hero.tombolKedua.ikon}>{hero.tombolKedua.label}</Tombol>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
