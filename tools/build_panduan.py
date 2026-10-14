"""Bangun halaman panduan brand dari panduan-template.html.

    python3 tools/build_panduan.py
    -> brand/panduan-brand.html        (dokumen HTML lengkap, dibuka langsung dari folder brand/)
    -> tools/.cache/panduan-fragmen.html (versi tanpa <html>/<head> untuk dipublikasikan sebagai Artifact)
"""
import json
import os

T = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(T)
MARK = json.load(open(os.path.join(T, "mark.json")))

REFS = [
    dict(n=1, dir="A", name="Elevation Church", url="https://elevationchurch.org", country="Amerika Serikat", style="Sinematik, video hero",
         why="Navigasi dipangkas jadi 5–6 menu. Beranda dibuka dengan hero media besar (khotbah terbaru), tipografi tebal, dan ruang kosong lega. Setiap kampus punya halaman “First Time” dan ada panduan diskusi per khotbah.",
         take="Hero video dengan lapisan hitam 60–70% dan satu tombol emas. Halaman “Pertama Kali ke Sini?”. Ringkasan khotbah + pertanyaan diskusi untuk Komsel."),
    dict(n=3, dir="A", name="VOUS Church", url="https://www.vouschurch.com", country="Amerika Serikat", style="Editorial hitam-putih",
         why="Estetika monokrom yang tegas dan premium. Beranda memutar klip ibadah tanpa suara. Halaman “Visit” punya video pratinjau per lokasi serta alamat dan jam ibadah yang jelas.",
         take="Dasar monokrom dengan emas sebagai pengganti putih. Kartu jadwal ibadah dengan video pendek suasana ibadah. Halaman kampanye Paskah/Natal bergaya editorial."),
    dict(n=4, dir="A", name="Transformation Church", url="https://transformchurch.us", country="Amerika Serikat", style="Gelap & tebal, satu aksen hangat",
         why="Masuk daftar “50 Best Church Website Designs” ChurchCreation. Latar hampir hitam dengan aksen oranye-keemasan, grid artwork seri khotbah yang menonjol, tombol persembahan selalu terlihat.",
         take="Paling dekat dengan identitas hitam-emas Alfa Omega. Grid artwork seri khotbah. Tombol “Persembahan” tetap di header. Halaman kampanye doa & puasa."),
    dict(n=7, dir="A", name="Hillsong Church", url="https://hillsong.com", country="Australia", style="Minimalis gelap, multi-bahasa",
         why="Beranda gelap dan atmosferik dengan sangat sedikit teks. Ada pemilih wilayah, dan setiap kampus punya sub-halaman dengan foto kotanya sendiri.",
         take="Suasana gelap yang sinematik. Tombol bahasa ID/EN di header. Struktur halaman per cabang bila nanti ada cabang. Dipakai sebagai referensi tampilan saja."),
    dict(n=2, dir="B", name="Passion City Church", url="https://passioncitychurch.com", country="Amerika Serikat", style="Minimalis bersih",
         why="Nominasi Awwwards. Video latar layar penuh, ruang kosong lega, tipografi mudah dibaca, dan pengunjung langsung diarahkan ke dua tombol utama. Ada halaman “Start Here” untuk pendatang baru.",
         take="Kesan premium dari ruang kosong + judul besar, cocok dengan wordmark Cinzel. Satu halaman “Mulai di Sini” sebagai pintu masuk jemaat baru."),
    dict(n=8, dir="B", name="St Paul's Cathedral", url="https://www.stpauls.co.uk", country="Inggris", style="Klasik, liturgis, elegan",
         why="Identitas baru (Pentagram, 2026) memakai wordmark bergaya ukiran batu dan monogram dari huruf wordmark, dipasangkan dengan sans-serif bersih. Struktur jelas: Ibadah, Acara, Kunjungan. Identitas baru diterapkan bertahap, jadi cek tampilan situsnya saat ini.",
         take="Acuan paling relevan untuk wordmark serif + monogram. Pasangan serif display + sans bersih (sudah kita pakai). Jadwal ibadah dan kalender acara yang rapi."),
    dict(n=5, dir="C", name="Mariners Church", url="https://www.marinerschurch.org", country="Amerika Serikat", style="Hangat, foto jemaat asli",
         why="Foto baptisan asli di beranda membuat situs terasa hangat. Setiap kampus punya halaman “Plan a Visit” lengkap (jam, parkir, program anak) dan pendaftaran anak online sebelum datang.",
         take="Foto jemaat sendiri, bukan foto stok, dengan garis tipis emas. Tombol “Daftar Baptisan”. Formulir Sekolah Minggu. Penjelasan “apa yang akan Anda alami”."),
    dict(n=6, dir="C", name="Life.Church", url="https://www.life.church", country="Amerika Serikat", style="Seperti aplikasi, digital-first",
         why="Beranda hampir kosong dan hanya menyisakan satu langkah berikutnya. Hero video lebar dengan jam ibadah tepat di bawahnya, navigasi ringkas (Plan a Visit, Watch, Give, Groups).",
         take="Prinsip “satu halaman, satu ajakan utama”. Navigasi 4–5 menu. Kartu “Langkah Berikutnya” (Baptis, Komsel, Melayani, Kelas). Navigasi bawah ala aplikasi di ponsel."),
    dict(n=9, dir="C", name="City Harvest Church", url="https://www.chc.org.sg", country="Singapura", style="Megachurch Asia, multi-bahasa",
         why="Halaman “Plan a Visit” menampilkan jam ibadah per lokasi dan per bahasa. Ibadah live lewat situs, aplikasi, YouTube, dan Facebook. Formulir gabung cell group dengan banyak kategori.",
         take="Tabel jadwal per bahasa/lokasi. Formulir “Gabung Komsel” dengan pilihan kategori. Halaman khusus untuk acara besar (KKR, retreat)."),
    dict(n=10, dir="C", name="JPCC", url="https://www.jpcc.org", country="Indonesia", style="Acuan lokal, terhubung aplikasi",
         why="Salah satu ekosistem digital gereja paling matang di Indonesia: reservasi kursi ibadah, persembahan non-tunai, pendaftaran komunitas dan kelas, permohonan doa. Ada panduan cara mengikuti ibadah dan FAQ kunjungan pertama.",
         take="Panduan “Cara Mengikuti Ibadah” + FAQ jemaat baru. Persembahan QRIS, transfer, virtual account, e-wallet. Kontak WhatsApp. Bahasa Indonesia utama dengan tombol English."),
]

HIGHLIGHTS = ["ibadah", "renungan", "acara", "pemuda", "doa", "komsel", "info"]


def rays():
    s, out = 0.47875, []
    for i in range(10):
        y0 = 60 + i * 38
        op = 0.28 * (1 - i / 10)
        out.append(f'<polyline points="{200 - 900 * s:.1f},{y0 + 900} 200,{y0} {200 + 900 * s:.1f},{y0 + 900}" fill="none" stroke="#C8A25A" stroke-width="1" stroke-opacity="{op:.3f}"/>')
    return "".join(out)


def build():
    t = open(os.path.join(T, "panduan-template.html"), encoding="utf-8").read()
    hl = "\n        ".join(
        f'<figure><img class="shot" src="media-sosial/instagram/highlight-{n}.png" alt="Sampul sorotan {n}" loading="lazy"><figcaption><b>{n.capitalize()}</b></figcaption></figure>'
        for n in HIGHLIGHTS)
    t = (t.replace("{{MARK_D}}", MARK["d"]).replace("{{RAYS}}", rays()).replace("{{HIGHLIGHTS}}", hl)
          .replace("{{REFS_JSON}}", json.dumps(REFS, ensure_ascii=False)))
    os.makedirs(os.path.join(T, ".cache"), exist_ok=True)
    open(os.path.join(T, ".cache", "panduan-fragmen.html"), "w", encoding="utf-8").write(t)
    head, body = t.split('<svg width="0" height="0"', 1)
    full = ('<!doctype html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'{head}</head>\n<body>\n<svg width="0" height="0"{body}</body>\n</html>\n')
    open(os.path.join(ROOT, "brand", "panduan-brand.html"), "w", encoding="utf-8").write(full)
    print("brand/panduan-brand.html + tools/.cache/panduan-fragmen.html")


if __name__ == "__main__":
    build()
