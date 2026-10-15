"""Kit website (vektor & font): logo SVG, ikon, pola, ornamen, loader, avatar, font WOFF2, versi WebP.

Jalankan setelah `node tools/render.mjs web` (yang membuat file PNG/JPG):

    python3 tools/build_web.py
"""
import glob
import json
import os
import shutil

from fontTools import subset
from fontTools.ttLib import TTFont
from PIL import Image

T = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.join(T, "..", "brand")
WEB = os.path.join(BRAND, "web")
MARK = json.load(open(os.path.join(T, "mark.json")))
MW, MH, MD = MARK["w"], MARK["h"], MARK["d"]
EMAS, HITAM, GADING, ARANG = "#C89C4A", "#121212", "#F6F1E7", "#2A2826"
SINGA, RP = MARK["singa"], MARK["r_piringan"]
PREFIX = "kapernaum"
NAMA = "GBI Kapernaum Sorong"


def write(rel, text):
    path = os.path.join(WEB, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text.strip() + "\n")


GOLD_GRAD = ('<linearGradient id="emas" x1="0" y1="0" x2="1" y2="1">'
             '<stop offset="0" stop-color="#F0D99E"/><stop offset=".38" stop-color="#C89C4A"/>'
             '<stop offset=".7" stop-color="#A27A2E"/><stop offset="1" stop-color="#DDB86A"/></linearGradient>')


# ---------- logo ----------
def logos():
    src = os.path.join(BRAND, "logo", "svg")
    pairs = {
        "logo-header-terang": "horizontal-ringkas-warna", "logo-header-gelap": "horizontal-ringkas-emas-gading",
        "logo-lengkap-terang": "horizontal-warna", "logo-lengkap-gelap": "horizontal-emas-gading",
        "logo-footer-terang": "bertumpuk-lengkap-warna", "logo-footer-gelap": "bertumpuk-lengkap-emas-gading",
        "lambang-warna": "lambang-warna", "lambang-hitam": "lambang-hitam", "lambang-emas": "lambang-emas", "lambang-putih": "lambang-putih",
    }
    d = os.path.join(WEB, "logo")
    os.makedirs(d, exist_ok=True)
    for lama in glob.glob(os.path.join(d, "monogram-*")):  # logo lama Alfa Omega
        os.remove(lama)
    for dst, s in pairs.items():
        shutil.copy(os.path.join(src, f"{PREFIX}-{s}.svg"), os.path.join(d, f"{dst}.svg"))
    write("logo/lambang-gradien.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {MW} {MH}" width="{MW:.0f}" height="{MH:.0f}" role="img" aria-label="Lambang {NAMA}">'
          f'<defs>{GOLD_GRAD}</defs><path fill="url(#emas)" fill-rule="evenodd" d="{MD}"/></svg>')
    write("logo/lencana-gradien.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{50 - RP} {50 - RP} {2 * RP} {2 * RP}" width="{2 * RP:.0f}" height="{2 * RP:.0f}" role="img" aria-label="Lambang {NAMA}">'
          f'<defs>{GOLD_GRAD}</defs><circle cx="50" cy="50" r="{RP}" fill="{HITAM}"/><path fill="url(#emas)" fill-rule="evenodd" d="{MD}"/></svg>')
    # Safari pinned tab: satu warna, tanpa ukuran
    write("safari-pinned-tab.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {MW} {MH}"><path fill-rule="evenodd" d="{MD}"/></svg>')


# ---------- ikon garis 24 × 24 ----------
ICONS = {
    "ibadah": '<path d="M12 3v18M7 8h10"/>',
    "alkitab": '<path d="M12 6.5C10.2 5.2 7.4 4.8 4 5.3v13c3.4-.5 6.2-.1 8 1.2 1.8-1.3 4.6-1.7 8-1.2v-13c-3.4-.5-6.2-.1-8 1.2Z"/><path d="M12 6.5v13"/>',
    "renungan": '<path d="M3 17.5h18M6.5 17.5a5.5 5.5 0 0 1 11 0M12 4v3.5M4.6 9.3l2 1.6M19.4 9.3l-2 1.6M8 20.5h8"/>',
    "khotbah": '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    "pujian": '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    "doa": '<path d="M9.5 11h5v9.5h-5zM7 20.5h10"/><path d="M12 3c1.6 1.9 2.4 3 2.4 4.1A2.4 2.4 0 0 1 12 9.5a2.4 2.4 0 0 1-2.4-2.4C9.6 6 10.4 4.9 12 3Z"/>',
    "baptisan": '<path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    "persembahan": '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
    "komsel": '<circle cx="12" cy="8" r="3"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="5" cy="10.5" r="2.2"/><path d="M1.8 18.5a3.6 3.6 0 0 1 4.6-3.4"/><circle cx="19" cy="10.5" r="2.2"/><path d="M22.2 18.5a3.6 3.6 0 0 0-4.6-3.4"/>',
    "pemuda": '<path d="M12 3c.9 3.8 5.5 6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.7 1.7-4.3 2.7-6 .4 2.1 1.4 3.2 2.6 3.6 1-2.2 1.1-5.4.2-8.6Z"/>',
    "anak": '<circle cx="8" cy="6.5" r="2.5"/><path d="M4 21v-6a4 4 0 0 1 8 0v6"/><circle cx="16.5" cy="10" r="2"/><path d="M13.5 21v-4a3 3 0 0 1 6 0v4"/>',
    "acara": '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" stroke-width="2.4"/>',
    "jam": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "lokasi": '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.4"/>',
    "live": '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5Z"/>',
    "galeri": '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-8 8.5"/>',
    "telepon": '<path d="M6.6 3.5h3l1.5 4.2-2 1.4a11 11 0 0 0 5.8 5.8l1.4-2 4.2 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
    "email": '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    "pesan": '<path d="M20.5 12a8.5 8 0 0 1-12.3 7.2L3.5 20.5l1.4-4.2A8 8 0 0 1 3.5 12a8.5 8 0 0 1 17 0Z"/>',
    "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>',
    "pengguna": '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    "cari": '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "tutup": '<path d="M6 6l12 12M18 6 6 18"/>',
    "panah-kanan": '<path d="M4 12h16M14 6l6 6-6 6"/>',
    "panah-bawah": '<path d="m6 9 6 6 6-6"/>',
    "unduh": '<path d="M12 3.5v12M7 10.5l5 5 5-5M4.5 20.5h15"/>',
    "bagikan": '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
    "tautan-luar": '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6H10"/>',
}
STROKE = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'


def icons():
    d = os.path.join(WEB, "ikon")
    shutil.rmtree(d, ignore_errors=True)
    for name, body in ICONS.items():
        write(f"ikon/{name}.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {STROKE}>{body}</svg>')
    symbols = "\n".join(f'  <symbol id="ikon-{n}" viewBox="0 0 24 24" {STROKE}>{b}</symbol>' for n, b in ICONS.items())
    write("ikon/ikon-sprite.svg", f'<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n{symbols}\n</svg>')


# ---------- pola & ornamen ----------
def gema(cx, cy, r0, count, step, color, width, op, fade=True):
    """Pola "Gema Cincin": lingkaran sepusat yang memantulkan cincin lambang, makin jauh makin pudar."""
    out = []
    for i in range(count):
        o = op * (1 - i / count) if fade else op
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r0 + i * step:.1f}" stroke="{color}" stroke-opacity="{o:.3f}" stroke-width="{width}"/>')
    return "".join(out)


def patterns():
    d = os.path.join(WEB, "pola")
    shutil.rmtree(d, ignore_errors=True)  # buang pola lama
    for tone, color in (("emas", EMAS), ("hitam", HITAM)):
        write(f"pola/pola-gema-cincin-{tone}.svg",
              f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none">'
              f'{gema(800, 450, 150, 14, 64, color, 1.5, 0.35 if tone == "emas" else 0.18)}</svg>')
        # ubin berulang: cincin kecil berselang, seperti butiran pada cincin lambang
        t = 40
        write(f"pola/pola-ubin-{tone}.svg",
              f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {t} {t}" width="{t}" height="{t}" fill="none">'
              f'<circle cx="{t / 2}" cy="{t / 2}" r="7" stroke="{color}" stroke-opacity="{0.28 if tone == "emas" else 0.12}" stroke-width="1"/>'
              f'<circle cx="0" cy="0" r="1.6" fill="{color}" fill-opacity="{0.28 if tone == "emas" else 0.12}"/>'
              f'<circle cx="{t}" cy="{t}" r="1.6" fill="{color}" fill-opacity="{0.28 if tone == "emas" else 0.12}"/></svg>')
        k = 22 / MH
        write(f"pola/ornamen-pembatas-{tone}.svg",
              f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 24" width="360" height="24">'
              f'<rect x="0" y="11.4" width="150" height="1.2" fill="{color}"/><rect x="210" y="11.4" width="150" height="1.2" fill="{color}"/>'
              f'<path transform="translate({180 - MW * k / 2:.2f} 1) scale({k:.6f})" fill="{color}" fill-rule="evenodd" d="{MD}"/></svg>')


# ---------- loader & avatar ----------
def loader():
    write("loader/loader-emas.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 {MW + 12} {MH + 12}" width="100" height="100" role="img" aria-label="Memuat">'
          '<defs><linearGradient id="kilau" gradientUnits="userSpaceOnUse" x1="-100" y1="0" x2="0" y2="0">'
          '<stop offset="0" stop-color="#C89C4A"/><stop offset=".5" stop-color="#F6E6B8"/><stop offset="1" stop-color="#C89C4A"/>'
          '<animate attributeName="x1" values="-100;100" dur="1.6s" repeatCount="indefinite"/>'
          '<animate attributeName="x2" values="0;200" dur="1.6s" repeatCount="indefinite"/></linearGradient></defs>'
          f'<path fill="url(#kilau)" fill-rule="evenodd" d="{MD}">'
          '<animate attributeName="opacity" values=".55;1;.55" dur="1.6s" repeatCount="indefinite"/></path></svg>')
    for tone, bg, fg in (("gelap", ARANG, EMAS), ("terang", "#E9E1D0", "#94702B")):
        k = 64 / MH
        write(f"placeholder/avatar-{tone}.svg",
              f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Foto belum tersedia">'
              f'<circle cx="60" cy="60" r="60" fill="{bg}"/>'
              f'<path transform="translate({60 - MW * k / 2:.2f} {60 - MH * k / 2:.2f}) scale({k:.6f})" fill="{fg}" fill-rule="evenodd" d="{SINGA}"/></svg>')


# ---------- font WOFF2 ----------
FONTS = [
    ("Cormorant Garamond", "CormorantGaramond/CormorantGaramond-Medium.ttf", 500, "normal", "cormorant-garamond-500"),
    ("Cormorant Garamond", "CormorantGaramond/CormorantGaramond-SemiBold.ttf", 600, "normal", "cormorant-garamond-600"),
    ("Cormorant Garamond", "CormorantGaramond/CormorantGaramond-MediumItalic.ttf", 500, "italic", "cormorant-garamond-500-italic"),
    ("Cormorant Garamond", "CormorantGaramond/CormorantGaramond-SemiBoldItalic.ttf", 600, "italic", "cormorant-garamond-600-italic"),
    ("Plus Jakarta Sans", "PlusJakartaSans/PlusJakartaSans-Regular.ttf", 400, "normal", "plus-jakarta-sans-400"),
    ("Plus Jakarta Sans", "PlusJakartaSans/PlusJakartaSans-Italic.ttf", 400, "italic", "plus-jakarta-sans-400-italic"),
    ("Plus Jakarta Sans", "PlusJakartaSans/PlusJakartaSans-Medium.ttf", 500, "normal", "plus-jakarta-sans-500"),
    ("Plus Jakarta Sans", "PlusJakartaSans/PlusJakartaSans-SemiBold.ttf", 600, "normal", "plus-jakarta-sans-600"),
    ("Plus Jakarta Sans", "PlusJakartaSans/PlusJakartaSans-Bold.ttf", 700, "normal", "plus-jakarta-sans-700"),
    ("Plus Jakarta Sans", "PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf", 800, "normal", "plus-jakarta-sans-800"),
]
# Latin + Latin Extended (cukup untuk bahasa Indonesia & Inggris, tanda kutip, simbol mata uang)
UNICODES = "U+0000-024F,U+0259,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+2215,U+FEFF,U+FFFD"


def fonts():
    out = os.path.join(WEB, "fonts")
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    faces = []
    for fam, src, weight, style, name in FONTS:
        dst = os.path.join(out, f"{name}.woff2")
        subset.main([os.path.join(BRAND, "fonts", src), f"--unicodes={UNICODES}", "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk,onum,lnum,tnum",
                     "--flavor=woff2", f"--output-file={dst}", "--no-hinting", "--desubroutinize"])
        faces.append(f"@font-face {{\n  font-family: '{fam}';\n  font-style: {style};\n  font-weight: {weight};\n  font-display: swap;\n"
                     f"  src: url('../fonts/{name}.woff2') format('woff2');\n}}")
    for lic in ("CormorantGaramond", "PlusJakartaSans"):
        shutil.copy(os.path.join(BRAND, "fonts", lic, "OFL.txt"), os.path.join(out, f"OFL-{lic}.txt"))
    write("css/fonts.css", "/* Font brand GBI Kapernaum Sorong, di-host sendiri (WOFF2, subset Latin). Lisensi: SIL OFL 1.1, lihat fonts/OFL-*.txt */\n\n" + "\n\n".join(faces))


# ---------- halaman contoh ----------
def contoh():
    import base64
    t = open(os.path.join(T, "contoh-template.html"), encoding="utf-8").read()
    faces = []
    for fam, _, weight, style, name in FONTS:
        b64 = base64.b64encode(open(os.path.join(WEB, "fonts", f"{name}.woff2"), "rb").read()).decode()
        faces.append(f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{weight};font-display:swap;src:url(data:font/woff2;base64,{b64}) format('woff2')}}")
    symbols = "".join(f'<symbol id="ikon-{n}" viewBox="0 0 24 24" {STROKE}>{b}</symbol>' for n, b in ICONS.items())
    grid = "".join(f'<div><svg class="kp-ikon"><use href="#ikon-{n}"/></svg>{n}</div>' for n in ICONS)
    t = (t.replace("{{FONTS}}", "\n".join(faces)).replace("{{SPRITE}}", f'<svg xmlns="http://www.w3.org/2000/svg" style="display:none">{symbols}</svg>')
          .replace("{{IKON_GRID}}", grid).replace("{{N_IKON}}", str(len(ICONS))))
    write("contoh.html", t)


# ---------- WebP ----------
def webp():
    for jpg in glob.glob(os.path.join(WEB, "hero", "*.jpg")) + glob.glob(os.path.join(WEB, "placeholder", "*.jpg")):
        Image.open(jpg).save(jpg[:-4] + ".webp", "WEBP", quality=82, method=6)


if __name__ == "__main__":
    logos()
    icons()
    patterns()
    loader()
    fonts()
    webp()
    contoh()
    for stale in ("logo-header-terang.svg", "logo-header-gelap.svg", "og-image-1200x630.png"):
        p = os.path.join(WEB, stale)
        if os.path.exists(p):
            os.remove(p)
    n = sum(len(f) for _, _, f in os.walk(WEB))
    print(f"brand/web: {n} file")
