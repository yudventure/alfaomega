import { gereja, siapaKami } from '../data/isi.js';
import Lambang from './Lambang.jsx';
import Reveal from './Reveal.jsx';
import { Tautan, Teks } from './Dasar.jsx';
import { aset } from '../aset.js';

// Halaman Siapa Kami: arti nama Kapernaum & lambang singa (kartu ayat + teks + foto)
export default function SiapaKami() {
  return (
    <section className="bagian" id="tentang">
      <div className="isi grid gap-5 md:grid-cols-[1fr_1.9fr]">
        {/* kartu ayat (padanan kartu "angka" di referensi) */}
        <Reveal gaya="kiri" className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-kartu bg-[linear-gradient(145deg,#2A2418_0%,#161412_60%,#121212_100%)] p-7 text-gading">
          <p className="label text-emas-muda">Lambang Kami</p>
          <Lambang garis className="absolute -right-[16%] -top-[10%] w-[78%] text-emas/30" />
          <div className="relative mt-16 grid gap-2">
            <Lambang piringan="#121212" className="mb-3 h-16 w-16 text-emas" />
            <div className="font-judul text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none">
              Singa dari <em className="text-emas-muda">Yehuda</em>
            </div>
            <p className="max-w-[30ch] font-judul text-[1.15rem] italic font-medium leading-[1.4]">{gereja.ayat}</p>
            <p className="label text-[.68rem] tracking-[.28em] text-emas-muda">{gereja.ayatRujukan}</p>
          </div>
        </Reveal>

        <Reveal gaya="kanan" tunda={120} className="kartu grid overflow-hidden md:grid-cols-[1fr_.95fr]">
          <div className="grid content-center gap-4 p-[clamp(1.6rem,3vw,2.6rem)]">
            <Teks as="h2" html={siapaKami.judul} className="judul" />
            {siapaKami.paragraf.map((p) => <p key={p} className="max-w-[46ch] text-batu-tua">{p}</p>)}
            <Tautan href={siapaKami.tautan.href} className="mt-1 justify-self-start">{siapaKami.tautan.label}</Tautan>
          </div>
          <figure className="foto-setengah relative mx-4 mb-4 min-h-[240px] overflow-hidden md:my-4 md:ml-0 md:min-h-[300px]">
            <img src={aset(siapaKami.gambar)} alt={`Kebersamaan jemaat ${gereja.nama}`} width="1200" height="900" loading="lazy" className="gambar-muncul absolute inset-0 h-full w-full object-cover" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
