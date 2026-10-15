"""Bangun semua file logo SVG GBI Kapernaum Sorong (teks sudah di-outline, tidak butuh font).

Susunan mengikuti materi gereja: lambang singa di samping/atas tulisan KAPERNAUM (tebal)
dengan SORONG berjarak lebar di bawahnya, plus baris kecil GEREJA BETHEL INDONESIA.

    python3 tools/build_logos.py    # -> brand/logo/svg/kapernaum-*.svg + tools/logos.json
"""
import glob
import json
import os

from brandlib import COLORS, ROOT, badge_path, mark_path, text_path

OUT = os.path.join(ROOT, "brand", "logo", "svg")
PREFIX = "kapernaum"
NAMA = "GBI Kapernaum Sorong"
TEBAL = "PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf"
SEDANG = "PlusJakartaSans/PlusJakartaSans-SemiBold.ttf"


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


def kota(font, text, cap, x, baseline, lebar, tracking=0.42):
    """SORONG berjarak lebar lalu garis tipis sampai selebar `lebar` (sejajar ujung KAPERNAUM)."""
    d, w, _ = text_path(font, text, cap, tracking, x, baseline)
    gx = x + w + cap * 1.1
    tebal = max(0.8, cap * 0.11)
    garis = f'<rect x="{gx:.2f}" y="{baseline - cap / 2 - tebal / 2:.2f}" width="{x + lebar - gx:.2f}" height="{tebal:.2f}"/>'
    return d + garis


def lambang(c, x, y, h):
    """Lambang di (x, y) setinggi h. Varian berwarna memakai lencana (piringan hitam + singa emas)."""
    if c.get("disc"):
        return badge_path(x, y, h, c["disc"], c["mark"])
    m, w = mark_path(x, y, h)
    return f'<g fill="{c["mark"]}">{m}</g>', w


def mark_only(c):
    m, w = lambang(c, 0, 0, 100)
    return w, 100, m


def horizontal(c):
    """Lambang | garis tipis | GEREJA BETHEL INDONESIA / KAPERNAUM / SORONG."""
    m, mw = lambang(c, 0, 0, 100)
    gap = 22
    rule_x = mw + gap
    tx = rule_x + 1.4 + gap
    word, ww, _ = text_path(TEBAL, "KAPERNAUM", 31, 0.03, tx, 66)
    small, sw, _ = text_path(SEDANG, "GEREJA BETHEL INDONESIA", 7.2, 0.3, tx + 1, 26)
    k = kota(SEDANG, "SORONG", 9.6, tx + 1, 86, ww - 1)
    w = tx + max(ww, sw + 1)
    body = (f'{m}<rect x="{rule_x:.2f}" y="12" width="1.4" height="76" fill="{c["accent"]}"/>'
            f'<g fill="{c["text"]}">{word}</g><g fill="{c["accent"]}">{small}{k}</g>')
    return w, 100, body


def horizontal_simple(c):
    """Lambang + KAPERNAUM / SORONG (header website, avatar, ruang sempit)."""
    m, mw = lambang(c, 0, 0, 100)
    tx = mw + 22
    word, ww, _ = text_path(TEBAL, "KAPERNAUM", 30, 0.03, tx, 55)
    k = kota(SEDANG, "SORONG", 13, tx + 1, 82, ww - 1, tracking=0.34)
    return tx + ww, 100, f'{m}<g fill="{c["text"]}">{word}</g><g fill="{c["accent"]}">{k}</g>'


def stacked(c, lengkap=False):
    _, ww, _ = text_path(TEBAL, "KAPERNAUM", 24, 0.03, 0, 0)
    w = ww
    mh = 100
    m, mw = lambang(c, (w - mh) / 2, 0, mh)
    y_word = mh + 22 + 24
    word, _, _ = text_path(TEBAL, "KAPERNAUM", 24, 0.03, 0, y_word)
    small_d, sw, _ = text_path(SEDANG, "SORONG", 8, 0.5, 0, 0)
    sx = (w - sw) / 2
    y_small = y_word + 13 + 8
    small, _, _ = text_path(SEDANG, "SORONG", 8, 0.5, sx, y_small)
    rule_y = y_small - 8 / 2 - 0.5
    l = sx - 12
    r = sx + sw + 12 - 0.5 * 8 * 1.3  # tracking huruf terakhir tidak ikut dihitung
    body = (f'{m}<g fill="{c["text"]}">{word}</g><g fill="{c["accent"]}">{small}'
            f'<rect x="0" y="{rule_y:.2f}" width="{l:.2f}" height="1"/>'
            f'<rect x="{r:.2f}" y="{rule_y:.2f}" width="{w - r:.2f}" height="1"/></g>')
    h = y_small
    if lengkap:
        _, tw, _ = text_path(SEDANG, "GEREJA BETHEL INDONESIA", 5.6, 0.32, 0, 0)
        y_tag = h + 15 + 5.6
        tag, _, _ = text_path(SEDANG, "GEREJA BETHEL INDONESIA", 5.6, 0.32, (w - tw) / 2, y_tag)
        body += f'<g fill="{c["text"]}">{tag}</g>'
        h = y_tag
    return w, h, body


def wordmark(c):
    word, ww, _ = text_path(TEBAL, "KAPERNAUM", 70, 0.03, 0, 70)
    k = kota(SEDANG, "SORONG", 21, 2, 117, ww - 2)
    return ww, 117, f'<g fill="{c["text"]}">{word}</g><g fill="{c["accent"]}">{k}</g>'


H, E, G, P = COLORS["hitam"], COLORS["emas"], COLORS["gading"], COLORS["putih"]
VARIANTS = {
    # berwarna, untuk latar terang: lencana (piringan hitam + singa emas) + teks hitam, aksen emas tua
    "warna": {"disc": H, "mark": E, "text": H, "accent": COLORS["emas-tua"]},
    "hitam": {"mark": H, "text": H, "accent": H},           # satu warna (cetak 1 warna, stempel)
    "emas": {"mark": E, "text": E, "accent": E},
    "emas-gading": {"mark": E, "text": G, "accent": E},      # untuk latar gelap
    "putih": {"mark": P, "text": P, "accent": P},
}

LAYOUTS = {
    "lambang": (mark_only, f"Lambang {NAMA}"),
    "horizontal": (horizontal, NAMA),
    "horizontal-ringkas": (horizontal_simple, NAMA),
    "bertumpuk": (stacked, NAMA),
    "bertumpuk-lengkap": (lambda c: stacked(c, True), f"{NAMA} · Gereja Bethel Indonesia"),
    "wordmark": (wordmark, NAMA),
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for lama in glob.glob(os.path.join(OUT, "*.svg")):
        os.remove(lama)
    manifest = {}
    for lname, (fn, title) in LAYOUTS.items():
        for vname, c in VARIANTS.items():
            if lname == "lambang" and vname == "emas-gading":
                continue  # sama dengan "emas"
            if lname == "wordmark" and vname == "warna":
                continue  # wordmark tanpa lambang: pakai hitam / emas-gading
            w, h, body = fn(c)
            name = f"{PREFIX}-{lname}-{vname}"
            open(os.path.join(OUT, name + ".svg"), "w").write(svg(w, h, body, title))
            manifest[name] = {"w": round(w, 2), "h": round(h, 2), "variant": vname}
    json.dump(manifest, open(os.path.join(os.path.dirname(__file__), "logos.json"), "w"), indent=1)
    print(len(manifest), "logo SVG ->", os.path.relpath(OUT, ROOT))
