"""Buat salinan gambar yang lebih ringan untuk PDF (dipanggil build_pdf.mjs).

Gambar asli resolusi penuh tetap di brand/; PDF memakai JPG berukuran sedang
supaya file PDF tetap kecil untuk dikirim lewat WhatsApp/email.
"""
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
BRAND = os.path.join(ROOT, "brand")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".cache", "pdf-img")

for rel in sys.argv[1:]:
    src = os.path.join(BRAND, rel)
    dst = os.path.join(OUT, os.path.splitext(rel)[0] + ".jpg")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (18, 18, 18))
        bg.paste(im, mask=im.split()[3])
        im = bg
    else:
        im = im.convert("RGB")
    im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(dst, "JPEG", quality=86, optimize=True, progressive=True)
