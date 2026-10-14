import { useState } from 'react';
import Monogram from './Monogram.jsx';

// Ambil ID video dari link YouTube apa pun (watch?v=, youtu.be/, shorts/, live/, embed/) atau ID langsung.
export function idYouTube(sumber = '') {
  const s = sumber.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);
  return m ? m[1] : '';
}

function TombolPutar({ className = '' }) {
  return (
    <span className={`grid h-[74px] w-[74px] place-items-center rounded-full bg-emas text-hitam shadow-[0_12px_40px_-10px_rgba(0,0,0,.6)] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor"><path d="M7 4.5v15l12.5-7.5z" /></svg>
    </span>
  );
}

// Pemutar YouTube ringan: yang dimuat awalnya hanya gambar sampul; iframe YouTube baru dimuat
// setelah tombol putar diklik, jadi beranda tetap cepat. Tanpa link video, tampil keterangan "segera hadir".
export default function VideoYouTube({ sumber, judul, poster, keterangan, className = '' }) {
  const id = idYouTube(sumber);
  const [putar, setPutar] = useState(false);
  const bingkai = `relative aspect-video overflow-hidden bg-hitam text-gading ${className}`;

  if (!id) {
    return (
      <div className={bingkai}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(200,162,90,.3),transparent_60%)]" aria-hidden="true" />
        <Monogram garis strokeWidth={5} className="absolute -right-[6%] -top-[10%] w-[52%] text-emas/20" />
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 p-6 text-center">
          <TombolPutar className="opacity-60" />
          <p className="label text-emas-muda">Video sambutan segera hadir</p>
        </div>
      </div>
    );
  }

  if (putar) {
    return (
      <div className={bingkai}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={judul}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className={bingkai}>
      <button type="button" onClick={() => setPutar(true)} className="group absolute inset-0 cursor-pointer" aria-label={`Putar video: ${judul}`}>
        <img
          src={poster || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          width="1280"
          height="720"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,.1)_40%,rgba(18,18,18,.7)_100%)]" aria-hidden="true" />
        <TombolPutar className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 group-hover:scale-105" />
        {keterangan && (
          <span className="label absolute bottom-5 left-5 right-5 text-left text-emas-muda [text-shadow:0_2px_12px_rgba(0,0,0,.5)]">{keterangan}</span>
        )}
      </button>
    </div>
  );
}
