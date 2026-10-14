"""Bangun semua file logo SVG (teks sudah di-outline, tidak butuh font).

    python3 tools/build_logos.py    # -> brand/logo/svg/*.svg
"""
import json
import os

from brandlib import COLORS, ROOT, mark_path, text_path

OUT = os.path.join(ROOT, "brand", "logo", "svg")
CINZEL = "Cinzel/Cinzel-Bold.ttf"
JAKARTA = "PlusJakartaSans/PlusJakartaSans-SemiBold.ttf"
CORMORANT_IT = "CormorantGaramond/CormorantGaramond-SemiBoldItalic.ttf"


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


def mark_only(c):
    m, w = mark_path(0, 0, 100)
    return w, 100, f'<g fill="{c["mark"]}">{m}</g>'


def horizontal(c):
    """Monogram | garis tipis | GEREJA / ALFA OMEGA."""
    m, mw = mark_path(0, 0, 100)
    gap = 24
    rule_x = mw + gap
    tx = rule_x + 1.4 + gap
    word, ww, _ = text_path(CINZEL, "ALFA OMEGA", 33, 0.06, tx, 77)
    small, sw, _ = text_path(JAKARTA, "GEREJA", 9.5, 0.42, tx + 1.5, 35.5)
    line_x0 = tx + 1.5 + sw + 12
    w = tx + ww
    body = (f'<g fill="{c["mark"]}">{m}<rect x="{rule_x:.2f}" y="16" width="1.4" height="76"/></g>'
            f'<g fill="{c["text"]}">{word}{small}'
            f'<rect x="{line_x0:.2f}" y="30.2" width="{w - line_x0:.2f}" height="1.1"/></g>')
    return w, 100, body


def horizontal_simple(c):
    """Monogram + ALFA OMEGA saja (untuk header website yang sempit)."""
    m, mw = mark_path(0, 0, 100)
    tx = mw + 26
    word, ww, _ = text_path(CINZEL, "ALFA OMEGA", 36, 0.06, tx, 72)
    w = tx + ww
    return w, 100, f'<g fill="{c["mark"]}">{m}</g><g fill="{c["text"]}">{word}</g>'


def stacked(c, tagline=False):
    word_d, ww, _ = text_path(CINZEL, "ALFA OMEGA", 26, 0.08, 0, 0)
    w = ww
    mh = 100
    mw = mh * 667.45 / 697.08
    m, _ = mark_path((w - mw) / 2, 0, mh)
    y_word = mh + 24 + 26
    word, _, _ = text_path(CINZEL, "ALFA OMEGA", 26, 0.08, 0, y_word)
    small_d, sw, _ = text_path(JAKARTA, "GEREJA", 7.5, 0.5, 0, 0)
    sx = (w - sw) / 2
    y_small = y_word + 12 + 7.5
    small, _, _ = text_path(JAKARTA, "GEREJA", 7.5, 0.5, sx, y_small)
    rule_y = y_small - 7.5 / 2 - 0.5
    l = sx - 12
    r = sx + sw + 12
    body = (f'<g fill="{c["mark"]}">{m}</g><g fill="{c["text"]}">{word}{small}'
            f'<rect x="0" y="{rule_y:.2f}" width="{l:.2f}" height="1"/>'
            f'<rect x="{r:.2f}" y="{rule_y:.2f}" width="{w - r:.2f}" height="1"/></g>')
    h = y_small
    if tagline:
        tag_d, tw, _ = text_path(CORMORANT_IT, "Yang Awal dan Yang Akhir", 9, 0.02, 0, 0)
        y_tag = h + 16 + 9
        tag, _, _ = text_path(CORMORANT_IT, "Yang Awal dan Yang Akhir", 9, 0.02, (w - tw) / 2, y_tag)
        body += f'<g fill="{c["accent"]}">{tag}</g>'
        h = y_tag + 3  # ruang untuk descender "g"
    return w, h, body


def wordmark(c):
    word, ww, _ = text_path(CINZEL, "ALFA OMEGA", 70, 0.06, 0, 70)
    return ww, 70, f'<g fill="{c["text"]}">{word}</g>'


VARIANTS = {
    "hitam": {"mark": COLORS["hitam"], "text": COLORS["hitam"], "accent": COLORS["emas-tua"]},
    "emas": {"mark": COLORS["emas"], "text": COLORS["emas"], "accent": COLORS["emas"]},
    "emas-gading": {"mark": COLORS["emas"], "text": COLORS["gading"], "accent": COLORS["emas"]},
    "putih": {"mark": COLORS["putih"], "text": COLORS["putih"], "accent": COLORS["putih"]},
}

LAYOUTS = {
    "monogram": (mark_only, "Monogram Alfa Omega"),
    "horizontal": (horizontal, "Gereja Alfa Omega"),
    "horizontal-ringkas": (horizontal_simple, "Alfa Omega"),
    "bertumpuk": (stacked, "Gereja Alfa Omega"),
    "bertumpuk-tagline": (lambda c: stacked(c, True), "Gereja Alfa Omega — Yang Awal dan Yang Akhir"),
    "wordmark": (wordmark, "Alfa Omega"),
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for lname, (fn, title) in LAYOUTS.items():
        for vname, c in VARIANTS.items():
            if lname == "monogram" and vname == "emas-gading":
                continue  # sama dengan "emas"
            w, h, body = fn(c)
            name = f"alfaomega-{lname}-{vname}"
            open(os.path.join(OUT, name + ".svg"), "w").write(svg(w, h, body, title))
            manifest[name] = {"w": round(w, 2), "h": round(h, 2), "variant": vname}
    json.dump(manifest, open(os.path.join(os.path.dirname(__file__), "logos.json"), "w"), indent=1)
    print(len(manifest), "logo SVG ->", os.path.relpath(OUT, ROOT))
