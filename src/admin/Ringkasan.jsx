// Halaman awal panel: kategori yang bisa dikelola + aktivitas terbaru
import { useEffect, useState } from 'react';
import Ikon from '../components/Ikon.jsx';
import { KELOMPOK, kategoriUntuk, namaPeran, aksesPenuh } from '../cms/skema.js';
import { api } from './api.js';
import { waktuRelatif } from './alat.js';
import { Kartu, KepalaHalaman, Lencana, useCms } from './ui.jsx';
import { LABEL_AKSI } from './Riwayat.jsx';

export default function Ringkasan() {
  const { pengguna, meta } = useCms();
  const [log, setLog] = useState(null);
  const kategori = kategoriUntuk(pengguna);
  const namaDepan = pengguna.nama.split(' ')[0];

  useEffect(() => {
    api('/riwayat').then((r) => setLog(r.log.filter((e) => e.aksi !== 'masuk').slice(0, 8))).catch(() => setLog([]));
  }, []);

  const pekan = Date.now() - 7 * 86400e3;
  const diubahPekanIni = kategori.filter((k) => meta[k.id] && new Date(meta[k.id].diubah).getTime() > pekan).length;

  return (
    <>
      <KepalaHalaman
        remah="Panel CMS"
        judul={`Shalom, ${namaDepan}`}
        ket={aksesPenuh(pengguna)
          ? 'Anda memiliki akses ke seluruh isi website. Pilih kategori di bawah untuk mulai mengubah.'
          : 'Berikut bagian website yang menjadi tanggung jawab pelayanan Anda.'}
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {pengguna.peran.map((p) => <Lencana key={p} nada={p === 'developer' || p === 'ketua' ? 'gelap' : 'emas'}>{namaPeran(p)}</Lencana>)}
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ['Kategori yang Anda kelola', kategori.length],
          ['Diperbarui 7 hari terakhir', diubahPekanIni],
          ['Masih memakai isi bawaan', kategori.filter((k) => !meta[k.id]).length],
        ].map(([label, angka]) => (
          <div key={label} className="rounded-2xl border border-garis bg-krem px-5 py-4">
            <p className="font-judul text-[2.4rem] font-semibold leading-none">{angka}</p>
            <p className="mt-1.5 text-[.85rem] text-batu-tua">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
        {KELOMPOK.map((kel) => {
          const isi = kategori.filter((k) => k.kelompok === kel.id);
          if (!isi.length) return null;
          return (
            <section key={kel.id} aria-labelledby={`kel-${kel.id}`}>
              <h2 id={`kel-${kel.id}`} className="label mb-3">{kel.nama}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {isi.map((k) => (
                  <a key={k.id} href={`/admin/isi/${k.id}`} className="group grid grid-cols-1 content-start gap-3 rounded-2xl border border-garis bg-krem p-5 no-underline transition-[border-color,transform] hover:-translate-y-0.5 hover:border-emas">
                    <div className="flex items-center justify-between">
                      <span className="grid grid-cols-1 h-11 w-11 place-items-center rounded-xl bg-pasir text-emas-tua"><Ikon nama={k.ikon} className="h-6 w-6" /></span>
                      <Ikon nama="panah-kanan" className="h-5 w-5 text-batu transition-transform group-hover:translate-x-1 group-hover:text-emas-tua" />
                    </div>
                    <div>
                      <h3 className="font-judul text-[1.35rem] font-semibold leading-tight text-hitam">{k.judul}</h3>
                      <p className="mt-1 text-[.85rem] leading-snug text-batu-tua">{k.ket}</p>
                    </div>
                    <p className="text-[.78rem] text-batu">
                      {meta[k.id] ? `Diubah ${waktuRelatif(meta[k.id].diubah)} oleh ${meta[k.id].oleh}` : 'Masih memakai isi bawaan'}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        <Kartu judul="Aktivitas terbaru" aksi={<a href="/admin/riwayat" className="tautan">Semua riwayat</a>}>
          {!log && <p className="text-batu-tua">Memuat…</p>}
          {log && !log.length && <p className="text-batu-tua">Belum ada perubahan.</p>}
          {log && log.length > 0 && (
            <ul className="divide-y divide-garis">
              {log.map((e, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-[.9rem]">
                  <span><b className="font-semibold">{e.oleh}</b> {LABEL_AKSI[e.aksi] ?? e.aksi}{e.ket ? <> · <span className="text-batu-tua">{e.ket}</span></> : null}</span>
                  <span className="text-[.8rem] text-batu">{waktuRelatif(e.waktu)}</span>
                </li>
              ))}
            </ul>
          )}
        </Kartu>
      </div>
    </>
  );
}
