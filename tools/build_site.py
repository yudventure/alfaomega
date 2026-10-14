"""Susun folder website siap unggah: site/

- Salin aset dari kit (brand/web): font, favicon, logo, gambar share
- Sisipkan sprite ikon + monogram ke index.html
- Tulis css/style.css dan js/main.js

    node tools/render.mjs "site/img"   # visual latar (sekali, atau bila diubah)
    python3 tools/build_site.py
"""
import json
import os
import shutil
import sys

T = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(T)
WEB = os.path.join(ROOT, "brand", "web")
SITE = os.path.join(ROOT, "site")
sys.path.insert(0, T)
from build_web import ICONS, STROKE  # noqa: E402

MARK = json.load(open(os.path.join(T, "mark.json")))


def copy(rel_src, rel_dst=None):
    src = os.path.join(WEB, rel_src)
    dst = os.path.join(SITE, rel_dst or rel_src)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy(src, dst)


def build():
    os.makedirs(SITE, exist_ok=True)
    for d in ("css", "js", "fonts", "logo", "og"):
        os.makedirs(os.path.join(SITE, d), exist_ok=True)

    # aset dari kit
    for f in ("favicon.ico", "favicon.svg", "favicon-16.png", "favicon-32.png", "favicon-48.png", "apple-touch-icon.png",
              "icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "site.webmanifest",
              "css/fonts.css", "logo/logo-header-terang.svg", "logo/logo-header-gelap.svg", "logo/logo-footer-gelap.svg",
              "logo/monogram-gradien.svg", "og/og-beranda.jpg"):
        copy(f)
    for f in os.listdir(os.path.join(WEB, "fonts")):
        copy(f"fonts/{f}")

    # css & js
    shutil.copy(os.path.join(T, "site-style.css"), os.path.join(SITE, "css", "style.css"))
    shutil.copy(os.path.join(T, "site-main.js"), os.path.join(SITE, "js", "main.js"))

    # sprite: ikon garis + monogram (isi & garis)
    symbols = "".join(f'<symbol id="ikon-{n}" viewBox="0 0 24 24">{b}</symbol>' for n, b in ICONS.items())
    symbols += (f'<symbol id="ao" viewBox="0 0 667.45 697.08"><path fill-rule="evenodd" d="{MARK["d"]}"/></symbol>'
                f'<symbol id="ao-garis" viewBox="0 0 667.45 697.08"><path fill="none" fill-rule="evenodd" d="{MARK["d"]}"/></symbol>')
    sprite = f'<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">{symbols}</svg>'

    t = open(os.path.join(T, "site-template.html"), encoding="utf-8").read().replace("{{SPRITE}}", sprite)
    open(os.path.join(SITE, "index.html"), "w", encoding="utf-8").write(t)

    # fragmen untuk pratinjau Artifact (tanpa doctype/html/head/body)
    head_start = t.index("<title>")
    head_end = t.index("</head>")
    body = t[t.index("<body>") + len("<body>"):t.rindex("</body>")]
    head = t[head_start:head_end]
    # CSS & JS disematkan; path aset relatif terhadap halaman (bukan folder css/)
    css = (open(os.path.join(T, "site-style.css"), encoding="utf-8").read() + "\n" +
           open(os.path.join(WEB, "css", "fonts.css"), encoding="utf-8").read()).replace("../fonts/", "fonts/").replace("../img/", "img/")
    js = open(os.path.join(T, "site-main.js"), encoding="utf-8").read()
    head = head.replace('<link rel="stylesheet" href="css/fonts.css">\n<link rel="stylesheet" href="css/style.css">', f"<style>{css}</style>")
    body = body.replace('<script src="js/main.js" defer></script>', f"<script>{js}</script>")
    os.makedirs(os.path.join(T, ".cache"), exist_ok=True)
    open(os.path.join(T, ".cache", "site-fragmen.html"), "w", encoding="utf-8").write(head + body)

    n = sum(len(f) for _, _, f in os.walk(SITE))
    print(f"site/: {n} file")


if __name__ == "__main__":
    build()
