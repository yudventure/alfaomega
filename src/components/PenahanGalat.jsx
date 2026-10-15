import { Component } from 'react';

// Bila satu bagian gagal ditampilkan (mis. isi CMS tidak lengkap), tampilkan pesan, bukan halaman kosong.
export default class PenahanGalat extends Component {
  constructor(props) {
    super(props);
    this.state = { galat: null };
  }

  static getDerivedStateFromError(galat) {
    return { galat };
  }

  componentDidCatch(galat) {
    console.error('Halaman gagal ditampilkan:', galat);
  }

  render() {
    if (!this.state.galat) return this.props.children;
    return (
      <main id="utama" className="isi grid min-h-[60vh] place-content-center justify-items-center gap-4 py-24 text-center">
        <p className="label">Terjadi kendala</p>
        <h1 className="judul">Halaman belum dapat ditampilkan</h1>
        <p className="max-w-[46ch] text-batu-tua">Coba muat ulang halaman. Bila masih terjadi, hubungi sekretariat gereja.</p>
        <a href="/" className="tombol tombol-hitam mt-2" onClick={(e) => { e.preventDefault(); window.location.assign('/'); }}>Kembali ke beranda</a>
      </main>
    );
  }
}
