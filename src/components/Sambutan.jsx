import { sambutan } from '../data/isi.js';
import Monogram from './Monogram.jsx';
import Reveal from './Reveal.jsx';
import VideoYouTube from './VideoYouTube.jsx';
import { Tautan, Teks } from './Dasar.jsx';

// Beranda: video sambutan dari pimpinan gereja (YouTube)
export default function Sambutan() {
  return (
    <section className="bagian" id="sambutan">
      <div className="isi grid gap-5 md:grid-cols-[1fr_1.9fr]">
        {/* di ponsel video tampil lebih dulu; di layar lebar video di kanan, setinggi kartu teks */}
        <Reveal className="relative overflow-hidden rounded-kartu shadow-kartu md:col-start-2 md:row-start-1 md:min-h-[24rem]">
          <VideoYouTube
            sumber={sambutan.video}
            poster={sambutan.poster}
            judul={`Sambutan ${sambutan.nama}`}
            keterangan={`Sambutan · ${sambutan.nama}`}
            className="md:absolute md:inset-0 md:aspect-auto"
          />
        </Reveal>

        <Reveal className="kartu flex flex-col justify-between gap-8 p-[clamp(1.6rem,3vw,2.4rem)] md:col-start-1 md:row-start-1">
          <div className="grid gap-4">
            <p className="label">{sambutan.label}</p>
            <Teks as="h2" html={sambutan.judul} className="judul" />
            <p className="text-batu-tua">{sambutan.teks}</p>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center gap-4 border-t border-garis pt-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hitam text-emas" aria-hidden="true">
                <Monogram className="h-6 w-auto" />
              </span>
              <div>
                <p className="font-logo text-[1rem] font-bold leading-snug tracking-[.03em]">{sambutan.nama}</p>
                <p className="text-[.9rem] text-batu-tua">{sambutan.jabatan}</p>
              </div>
            </div>
            <Tautan href={sambutan.tautan.href} className="justify-self-start">{sambutan.tautan.label}</Tautan>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
