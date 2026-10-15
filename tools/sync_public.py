"""Salin aset brand yang dipakai website dari brand/web ke public/ (favicon, ikon aplikasi, logo, gambar share, font).

Jalankan setelah render.mjs & build_web.py:

    python3 tools/sync_public.py
"""
import glob
import os
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WEB = os.path.join(ROOT, "brand", "web")
PUB = os.path.join(ROOT, "public")

FILES = {
    # favicon & ikon aplikasi
    "favicon.ico": "favicon.ico", "favicon.svg": "favicon.svg",
    "favicon-16.png": "favicon-16.png", "favicon-32.png": "favicon-32.png", "favicon-48.png": "favicon-48.png",
    "apple-touch-icon.png": "apple-touch-icon.png",
    "icon-192.png": "icon-192.png", "icon-512.png": "icon-512.png",
    "icon-maskable-192.png": "icon-maskable-192.png", "icon-maskable-512.png": "icon-maskable-512.png",
    # logo (header terang = lencana berwarna; gelap = emas-gading)
    "logo/logo-header-terang.svg": "logo/logo-header-terang.svg",
    "logo/logo-header-gelap.svg": "logo/logo-header-gelap.svg",
    "logo/logo-footer-gelap.svg": "logo/logo-footer-gelap.svg",
    "logo/logo-footer-terang.svg": "logo/logo-footer-terang.svg",
    "logo/lambang-gradien.svg": "logo/lambang-gradien.svg",
    "logo/lencana-gradien.svg": "logo/lencana-gradien.svg",
    # gambar share bawaan (1200 x 630)
    "og/og-beranda.jpg": "og/og-beranda.jpg",
}

if __name__ == "__main__":
    # buang aset lama yang tidak lagi dibuat (mis. monogram & font Cinzel)
    for lama in ["logo/monogram-gradien.svg", "fonts/OFL-Cinzel.txt", *glob.glob(os.path.join(PUB, "fonts", "cinzel-*"))]:
        p = lama if os.path.isabs(lama) else os.path.join(PUB, lama)
        if os.path.exists(p):
            os.remove(p)
    for src, dst in FILES.items():
        out = os.path.join(PUB, dst)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        shutil.copy(os.path.join(WEB, src), out)
    os.makedirs(os.path.join(PUB, "fonts"), exist_ok=True)
    for f in glob.glob(os.path.join(WEB, "fonts", "*")):
        shutil.copy(f, os.path.join(PUB, "fonts", os.path.basename(f)))
    print(f"public/: {len(FILES)} aset + {len(glob.glob(os.path.join(WEB, 'fonts', '*')))} file font")
