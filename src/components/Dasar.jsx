import Ikon from './Ikon.jsx';

// Teks dari konten.js yang boleh memuat <em> dan <br/> (isi ditulis tim gereja, bukan dari pengguna).
export function Teks({ as: Tag = 'span', html, className = '', ...rest }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}

// Tombol pil. varian: emas | gading | hitam | garis | garis-hitam
export function Tombol({ varian = 'emas', href = '#', ikon, className = '', children, ...rest }) {
  return (
    <a href={href} className={`tombol tombol-${varian} ${className}`} {...rest}>
      {ikon && <Ikon nama={ikon} className="w-[1.15em] h-[1.15em]" />}
      {children}
    </a>
  );
}

// Tautan kapital bergaris bawah dengan panah
export function Tautan({ href = '#', ikon = 'panah-kanan', terang = false, className = '', children, ...rest }) {
  return (
    <a href={href} className={`tautan ${terang ? 'text-emas' : ''} ${className}`} {...rest}>
      {children}
      <Ikon nama={ikon} className="w-[1.1em] h-[1.1em]" />
    </a>
  );
}

// Kepala bagian: judul besar (+ teks) dan aksi opsional di kanan
export function Kepala({ judul, teks, aksi, className = '' }) {
  return (
    <div className={`mb-10 flex flex-wrap items-end justify-between gap-8 ${className}`}>
      <div className="grid max-w-[620px] gap-3">
        <Teks as="h2" html={judul} className="judul" />
        {teks && <p className="text-batu-tua">{teks}</p>}
      </div>
      {aksi}
    </div>
  );
}
