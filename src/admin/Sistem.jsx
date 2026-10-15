// Sistem, pengaturan lingkungan (.env), email, dan cadangan (khusus developer)
import { useEffect, useRef, useState } from 'react';
import { api, unduh } from './api.js';
import { ukuranBerkas, waktuLengkap } from './alat.js';
import { Kartu, KepalaHalaman, Lencana, Memuat, Pesan, Tombol, kelasInput, useCms } from './ui.jsx';

const SUMBER = {
  hosting: ['Panel hosting', 'gelap'],
  cms: ['CMS · .env data', 'emas'],
  berkas: ['.env aplikasi', 'netral'],
  kosong: ['Belum diisi', 'merah'],
};

function PengaturanEnv({ env, onSimpan }) {
  const { beriTahu } = useCms();
  const [nilai, setNilai] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);
  const berubah = Object.keys(nilai).length > 0;
  const kelompok = [...new Set(env.variabel.map((v) => v.kelompok))];

  async function simpan() {
    setMenyimpan(true);
    try {
      const r = await api('/sistem/env', { metode: 'PUT', data: { nilai } });
      onSimpan(r);
      setNilai({});
      beriTahu(r.diubah.length ? `Tersimpan ke ${r.env.berkasCms} dan langsung berlaku: ${r.diubah.join(', ')}.` : 'Tidak ada yang berubah.');
    } catch (e) {
      beriTahu(e.message, 'galat');
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <Kartu
      judul="Pengaturan lingkungan (.env)"
      ket="Variabel bertanda CMS bisa diubah di sini. Setiap kali disimpan, berkas .env di folder data ditulis ulang otomatis dan langsung berlaku tanpa restart. Nilai dari panel hosting selalu diutamakan."
      aksi={<Tombol varian="garis" kecil ikon="unduh" onClick={() => unduh('/sistem/env-contoh', '.env.example').catch((e) => beriTahu(e.message, 'galat'))}>Unduh .env.example</Tombol>}
    >
      <div className="mb-5 grid grid-cols-1 gap-1 rounded-xl bg-pasir/50 px-4 py-3 text-[.82rem] text-batu-tua">
        <span>Berkas yang ditulis CMS: <code className="break-all text-hitam">{env.berkasCms}</code></span>
        <span>Terakhir ditulis: {env.diubah ? waktuLengkap(env.diubah) : 'belum pernah'}{env.diubah ? ' (versi sebelumnya: .env.sebelumnya)' : ''}</span>
        <span>Berkas .env manual di folder aplikasi: <code className="break-all text-hitam">{env.berkasAkar}</code></span>
      </div>
      <div className="grid grid-cols-1 gap-7">
        {kelompok.map((k) => (
          <fieldset key={k} className="grid grid-cols-1 gap-4">
            <legend className="label mb-3">{k}</legend>
            {env.variabel.filter((v) => v.kelompok === k).map((v) => {
              const [labelSumber, nada] = SUMBER[v.sumber] ?? SUMBER.kosong;
              const id = `env-${v.nama}`;
              return (
                <div key={v.nama} className="grid grid-cols-1 gap-2 border-b border-garis pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor={id}><code className="rounded bg-pasir px-1.5 py-0.5 text-[.82rem] font-semibold">{v.nama}</code></label>
                    <Lencana nada={nada}>{labelSumber}</Lencana>
                    {v.rahasia && v.terisi && <Lencana nada="hijau">terisi</Lencana>}
                  </div>
                  <p className="text-[.82rem] leading-snug text-batu-tua">{v.ket}</p>
                  {v.bisaDiubah ? (
                    <input
                      id={id} className={`${kelasInput} font-mono text-[.85rem]`} type={v.rahasia ? 'password' : 'text'} autoComplete="off"
                      placeholder={v.rahasia ? (v.terisi ? '•••••••• (tersimpan, isi untuk mengganti)' : 'belum diisi') : `contoh: ${v.contoh}`}
                      value={nilai[v.nama] ?? (v.rahasia ? '' : v.nilai)}
                      onChange={(e) => {
                        const isi = e.target.value;
                        // kolom rahasia yang dikosongkan berarti "tidak diubah", bukan menghapus nilai tersimpan
                        setNilai((s) => {
                          const { [v.nama]: _lama, ...sisa } = s;
                          return v.rahasia && !isi ? sisa : { ...sisa, [v.nama]: isi };
                        });
                      }}
                    />
                  ) : (
                    <p id={id} className="rounded-xl border border-dashed border-garis px-3.5 py-2.5 font-mono text-[.82rem] text-batu-tua">
                      {v.rahasia ? (v.terisi ? '•••••••• (rahasia)' : 'kosong') : v.nilai || 'kosong'}
                      <span className="ml-2 font-teks text-[.75rem] text-batu">{v.sumber === 'hosting' ? '· ubah di hPanel' : '· atur di hPanel atau berkas .env aplikasi'}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </fieldset>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Tombol varian="emas" memuat={menyimpan} disabled={!berubah} onClick={simpan}>Simpan & tulis .env</Tombol>
        {berubah && <Tombol varian="hantu" onClick={() => setNilai({})}>Batalkan</Tombol>}
      </div>
    </Kartu>
  );
}

function EmailUji({ siap }) {
  const { pengguna, beriTahu } = useCms();
  const [ke, setKe] = useState(pengguna.email);
  const [memuat, setMemuat] = useState(false);
  async function kirim() {
    setMemuat(true);
    try {
      const r = await api('/sistem/email-uji', { metode: 'POST', data: { ke } });
      beriTahu(r.pesan);
    } catch (e) {
      beriTahu(e.message, 'galat');
    } finally {
      setMemuat(false);
    }
  }
  return (
    <Kartu judul="Email otomatis" ket="Dipakai untuk kode OTP lupa kata sandi, pemberitahuan kata sandi diubah, dan email akun baru.">
      <div className="mb-4">
        {siap
          ? <Pesan>Email siap dipakai. Kirim email uji untuk memastikan pengaturan SMTP benar.</Pesan>
          : <Pesan nada="peringatan">Email belum aktif. Isi SMTP_HOST, SMTP_PORT, SMTP_USER, dan SMTP_PASS di pengaturan lingkungan di atas. Untuk email Hostinger: smtp.hostinger.com, port 465, user = alamat email lengkap.</Pesan>}
      </div>
      <div className="flex flex-wrap gap-2">
        <input className={`${kelasInput} max-w-sm`} type="email" value={ke} onChange={(e) => setKe(e.target.value)} aria-label="Kirim email uji ke" />
        <Tombol varian="utama" memuat={memuat} disabled={!siap} onClick={kirim}>Kirim email uji</Tombol>
      </div>
    </Kartu>
  );
}

export default function Sistem() {
  const { setData, beriTahu } = useCms();
  const [info, setInfo] = useState(null);
  const [memulihkan, setMemulihkan] = useState(false);
  const berkas = useRef(null);

  useEffect(() => { api('/sistem').then(setInfo).catch((e) => beriTahu(e.message, 'galat')); }, [beriTahu]);

  async function pulihkan(file) {
    if (!file) return;
    try {
      const cadangan = JSON.parse(await file.text());
      if (!window.confirm('Pulihkan semua isi website dari berkas cadangan ini? Keadaan sekarang tetap disimpan sebagai versi di menu Riwayat.')) return;
      setMemulihkan(true);
      const hasil = await api('/cadangan', { metode: 'POST', data: cadangan });
      setData(hasil);
      beriTahu('Isi website dipulihkan dari cadangan.');
    } catch (e) {
      beriTahu(e instanceof SyntaxError ? 'Berkas bukan JSON yang valid.' : e.message, 'galat');
    } finally {
      setMemulihkan(false);
      if (berkas.current) berkas.current.value = '';
    }
  }

  if (!info) return <Memuat />;
  const dataDiatur = info.env.variabel.find((v) => v.nama === 'DATA_DIR')?.sumber !== 'kosong';
  const tautan = (jalur, label) => <a href={jalur} target="_blank" rel="noopener" className="font-semibold text-emas-teks underline underline-offset-4">{label}</a>;

  return (
    <>
      <KepalaHalaman remah="Pengembang" judul="Sistem & Cadangan" ket="Versi yang berjalan, pengaturan lingkungan, email, lokasi data, dan cadangan isi website." />
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[['Pengguna', info.pengguna], ['Gambar', info.media], ['Versi tersimpan', info.versi], ['Ukuran data', ukuranBerkas(info.ukuranData)]].map(([l, n]) => (
            <div key={l} className="rounded-2xl border border-garis bg-krem px-5 py-4">
              <p className="font-judul text-[2rem] font-semibold leading-none">{n}</p>
              <p className="mt-1.5 text-[.85rem] text-batu-tua">{l}</p>
            </div>
          ))}
        </div>

        <Kartu judul="Versi yang berjalan" ket="Cocokkan commit ini dengan commit terakhir di GitHub untuk memastikan deploy Hostinger sudah memakai kode terbaru.">
          <div className="grid grid-cols-1 gap-2 text-[.9rem] sm:grid-cols-2">
            <p>Commit: <code className="rounded bg-pasir px-1.5 py-0.5">{info.build.commit}</code></p>
            <p>Dibangun: {info.build.dibangun ? waktuLengkap(info.build.dibangun) : '–'}</p>
            <p>Versi foto: <code className="rounded bg-pasir px-1.5 py-0.5">{info.build.aset}</code></p>
            <p>Node.js {info.node}</p>
            <p className="sm:col-span-2">Alamat utama: <code className="break-all rounded bg-pasir px-1.5 py-0.5">{info.alamat}</code></p>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[.88rem]">
            {tautan('/sehat', 'Cek /sehat')} {tautan('/sitemap.xml', 'Lihat sitemap.xml')} {tautan('/robots.txt', 'Lihat robots.txt')}
          </p>
        </Kartu>

        <PengaturanEnv env={info.env} onSimpan={(r) => setInfo((s) => ({ ...s, env: r.env, emailSiap: r.emailSiap }))} />
        <EmailUji siap={info.emailSiap} />

        <Kartu judul="Lokasi data" ket="Isi, pengguna, log, versi, foto unggahan, dan .env dari CMS disimpan sebagai berkas di folder ini.">
          <p className="break-all rounded-xl bg-hitam px-4 py-3 font-mono text-[.85rem] text-emas-muda">{info.dataDir}</p>
          <div className="mt-4">
            <Pesan nada={dataDiatur ? 'info' : 'peringatan'}>
              {dataDiatur
                ? 'DATA_DIR diatur. Pastikan folder ini di luar folder aplikasi agar tidak ikut terhapus saat deploy ulang.'
                : 'DATA_DIR belum diatur, jadi data memakai folder bawaan di direktori home server. Atur DATA_DIR di hPanel atau berkas .env aplikasi ke folder di luar folder aplikasi, lalu unduh cadangan secara berkala.'}
            </Pesan>
          </div>
        </Kartu>

        <Kartu judul="Cadangan isi website" ket="Unduh cadangan secara berkala, terutama sebelum mengubah banyak hal. Cadangan berisi teks dan daftar media; berkas foto ada di folder media.">
          <div className="flex flex-wrap gap-3">
            <Tombol varian="utama" ikon="unduh" onClick={() => unduh('/cadangan', `cadangan-alfaomega-${new Date().toISOString().slice(0, 10)}.json`).catch((e) => beriTahu(e.message, 'galat'))}>Unduh cadangan</Tombol>
            <Tombol varian="garis" memuat={memulihkan} onClick={() => berkas.current?.click()}>Pulihkan dari berkas…</Tombol>
            <input ref={berkas} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => pulihkan(e.target.files?.[0])} />
          </div>
        </Kartu>
      </div>
    </>
  );
}
