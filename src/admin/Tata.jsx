// Tata letak panel: menu samping per bidang pelayanan + kepala halaman
import { useEffect, useState } from 'react';
import Ikon from '../components/Ikon.jsx';
import { KELOMPOK, kategoriUntuk, aksesPenuh, bolehSistem, namaPeran } from '../cms/skema.js';
import { inisial } from './alat.js';
import { useCms } from './ui.jsx';

function TautanMenu({ href, ikon, aktif, children }) {
  return (
    <a
      href={href} aria-current={aktif ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[.88rem] no-underline transition-colors ${aktif ? 'bg-emas text-hitam font-semibold' : 'text-gading/75 hover:bg-white/5 hover:text-white'}`}
    >
      <Ikon nama={ikon} className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate">{children}</span>
    </a>
  );
}

export default function Tata({ jalur, children }) {
  const { pengguna, keluar } = useCms();
  const [buka, setBuka] = useState(false);
  const kategori = kategoriUntuk(pengguna);
  const aktif = (href) => jalur === href || (href !== '/admin' && jalur.startsWith(`${href}/`));

  useEffect(() => { setBuka(false); }, [jalur]);

  const menu = (
    <nav aria-label="Menu CMS" className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-1">
        <TautanMenu href="/admin" ikon="renungan" aktif={jalur === '/admin'}>Ringkasan</TautanMenu>
      </div>
      {KELOMPOK.map((k) => {
        const isi = kategori.filter((x) => x.kelompok === k.id);
        if (!isi.length) return null;
        return (
          <div key={k.id} className="grid grid-cols-1 gap-1">
            <p className="px-3 pb-1 text-[.66rem] font-semibold uppercase tracking-[.22em] text-batu">{k.nama}</p>
            {isi.map((x) => <TautanMenu key={x.id} href={`/admin/isi/${x.id}`} ikon={x.ikon} aktif={aktif(`/admin/isi/${x.id}`)}>{x.judul}</TautanMenu>)}
          </div>
        );
      })}
      <div className="grid grid-cols-1 gap-1">
        <p className="px-3 pb-1 text-[.66rem] font-semibold uppercase tracking-[.22em] text-batu">Administrasi</p>
        <TautanMenu href="/admin/media" ikon="galeri" aktif={aktif('/admin/media')}>Pustaka Media</TautanMenu>
        {aksesPenuh(pengguna) && <TautanMenu href="/admin/pengguna" ikon="komsel" aktif={aktif('/admin/pengguna')}>Pengguna & Peran</TautanMenu>}
        <TautanMenu href="/admin/riwayat" ikon="jam" aktif={aktif('/admin/riwayat')}>Riwayat</TautanMenu>
        {bolehSistem(pengguna) && <TautanMenu href="/admin/sistem" ikon="unduh" aktif={aktif('/admin/sistem')}>Sistem & Cadangan</TautanMenu>}
      </div>
    </nav>
  );

  const kartuPengguna = (
    <div className="grid grid-cols-1 gap-2 border-t border-white/10 pt-4">
      <a href="/admin/akun" className="flex items-center gap-3 rounded-xl px-2 py-2 no-underline hover:bg-white/5">
        <span className="grid grid-cols-1 h-10 w-10 shrink-0 place-items-center rounded-full bg-emas font-bold text-hitam">{inisial(pengguna.nama)}</span>
        <span className="min-w-0">
          <span className="block truncate text-[.9rem] font-semibold text-white">{pengguna.nama}</span>
          <span className="block truncate text-[.75rem] text-gading/60">{pengguna.peran.map(namaPeran).join(', ')}</span>
        </span>
      </a>
      <button type="button" onClick={keluar} className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-[.85rem] text-gading/70 hover:bg-white/5 hover:text-white">
        <Ikon nama="panah-kanan" className="h-[18px] w-[18px]" /> Keluar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gading lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* menu samping (layar lebar) */}
      <aside className="hidden bg-hitam text-gading lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-6 lg:overflow-y-auto lg:px-4 lg:py-6">
        <a href="/admin" className="px-3"><img src="/logo/logo-header-gelap.svg" alt="CMS Gereja Alfa Omega" className="h-9 w-auto" /></a>
        <div className="flex-1">{menu}</div>
        {kartuPengguna}
      </aside>

      {/* bilah atas (ponsel & tablet) */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-hitam px-4 py-3 text-gading lg:hidden">
        <a href="/admin"><img src="/logo/logo-header-gelap.svg" alt="CMS Gereja Alfa Omega" className="h-8 w-auto" /></a>
        <button type="button" onClick={() => setBuka((b) => !b)} className="grid grid-cols-1 h-10 w-10 place-items-center rounded-full bg-white/10" aria-expanded={buka} aria-label={buka ? 'Tutup menu' : 'Buka menu'}>
          <Ikon nama={buka ? 'tutup' : 'menu'} className="h-5 w-5" />
        </button>
      </div>
      {buka && (
        <div className="fixed inset-x-0 bottom-0 top-[64px] z-30 overflow-y-auto bg-hitam px-4 pb-8 pt-4 text-gading lg:hidden">
          {menu}
          <div className="mt-6">{kartuPengguna}</div>
        </div>
      )}

      <div className="min-w-0">
        <div className="flex items-center justify-end gap-3 border-b border-garis bg-gading/90 px-5 py-3 backdrop-blur md:px-10">
          <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[.82rem] font-semibold text-emas-teks no-underline hover:bg-pasir">
            Lihat website <Ikon nama="tautan-luar" className="h-4 w-4" />
          </a>
        </div>
        <main className="mx-auto max-w-[1100px] px-5 pb-32 pt-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
