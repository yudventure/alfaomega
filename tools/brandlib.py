"""Konstanta brand + utilitas teks-ke-outline (dipakai build_logos.py)."""
import json
import os

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FONTS = os.path.join(ROOT, "brand", "fonts")

COLORS = {
    "hitam": "#121212",       # Hitam Malam (piringan lambang)
    "emas": "#C89C4A",        # Emas Singa (diambil dari logo asli)
    "emas-tua": "#94702B",    # Emas Tua
    "emas-muda": "#E8CB86",   # Emas Muda
    "gading": "#F6F1E7",      # Putih Gading
    "putih": "#FFFFFF",
    "arang": "#2A2826",       # Arang
    "batu": "#8A8378",        # Abu Batu
    "anggur": "#6E1E2A",      # Merah Anggur
}

MARK = json.load(open(os.path.join(os.path.dirname(__file__), "mark.json")))

_faces = {}


def _face(rel):
    if rel not in _faces:
        path = os.path.join(FONTS, rel)
        blob = hb.Blob.from_file_path(path)
        _faces[rel] = (TTFont(path), hb.Font(hb.Face(blob)))
    return _faces[rel]


def text_path(font, text, cap_height, tracking=0.0, x=0.0, baseline=0.0):
    """Bentuk teks jadi path SVG. Ukuran ditentukan lewat tinggi huruf kapital.

    tracking dalam em. Mengembalikan (elemen <path>, lebar, ukuran-font).
    """
    tt, hbfont = _face(font)
    upm = tt["head"].unitsPerEm
    cap = tt["OS/2"].sCapHeight
    size = cap_height * upm / cap
    k = size / upm
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": True})
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    pen_x = 0.0
    ds = []
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        name = order[info.codepoint]
        sp = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        tp = TransformPen(sp, (k, 0, 0, -k, x + (pen_x + pos.x_offset) * k, baseline - pos.y_offset * k))
        gs[name].draw(tp)
        ds.append(sp.getCommands())
        pen_x += pos.x_advance
        if i < n - 1:
            pen_x += tracking * upm
    return f'<path d="{"".join(ds)}"/>', pen_x * k, size


def mark_path(x, y, height, kunci="d"):
    """<path> lambang (cincin + singa; kunci="singa" untuk singa saja) di (x, y) dengan tinggi tertentu, tanpa fill."""
    k = height / MARK["h"]
    return (f'<path transform="translate({x:.2f} {y:.2f}) scale({k:.6f})" '
            f'fill-rule="evenodd" d="{MARK[kunci]}"/>'), MARK["w"] * k


def badge_path(x, y, height, disc, mark):
    """Lencana berwarna: piringan `disc` + cincin & singa `mark`. (x, y) = kiri atas piringan, height = diameter piringan."""
    rp = MARK["r_piringan"]
    k = height / (2 * rp)
    off = rp - MARK["w"] / 2  # piringan lebih besar dari kotak cincin
    t = f'translate({x + off * k:.2f} {y + off * k:.2f}) scale({k:.6f})'
    return (f'<g transform="{t}"><circle cx="50" cy="50" r="{rp}" fill="{disc}"/>'
            f'<path fill="{mark}" fill-rule="evenodd" d="{MARK["d"]}"/></g>'), height
