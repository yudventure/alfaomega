"""Bangun halaman panduan brand dari panduan-template.html.

    python3 tools/build_panduan.py
    -> brand/panduan-brand.html        (dokumen HTML lengkap, dibuka langsung dari folder brand/)
    -> tools/.cache/panduan-fragmen.html (versi tanpa <html>/<head> untuk dipublikasikan sebagai Artifact)
"""
import glob
import json
import os

T = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(T)
MARK = json.load(open(os.path.join(T, "mark.json")))

KONTEN = json.load(open(os.path.join(T, "konten.json"), encoding="utf-8"))  # warna & referensi website

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
    t = (t.replace("{{MARK_D}}", MARK["d"]).replace("{{RAYS}}", rays()).replace("{{HIGHLIGHTS}}", hl).replace("{{N_IKON}}", str(len(glob.glob(os.path.join(ROOT, "brand", "web", "ikon", "*.svg"))) - 1))
          .replace("{{REFS_JSON}}", json.dumps(KONTEN["referensi"], ensure_ascii=False))
          .replace("{{COLORS_JSON}}", json.dumps(KONTEN["warna"], ensure_ascii=False)))
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
