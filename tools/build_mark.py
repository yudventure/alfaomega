"""Vektorisasi lambang singa GBI Kapernaum Sorong.

Logo asli (brand/logo/asli/logo-asli.png: singa emas bertekstur glitter di piringan hitam
dengan cincin emas) diubah menjadi vektor bersih:

* cincin & piringan dibangun ulang sebagai lingkaran sempurna (pusat & jari-jari diukur
  dari foto: lingkaran di-fit ke piksel emas cincin),
* singa di-trace (potrace) dari peta "keemasan" yang dihaluskan secukupnya agar butiran
  glitter hilang tetapi garis surai, telinga, mata, dan hidung tetap tajam.

Koordinat mark.json: kotak 100 × 100 = diameter luar cincin, titik (0,0) di kiri atas.

    pip install numpy scipy pillow potracer
    python3 tools/build_mark.py      # -> tools/mark.json
"""
import json
import os

import numpy as np
import potrace
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ASLI = os.path.join(ROOT, "brand", "logo", "asli", "logo-asli.png")
ZOOM = 4  # pembesaran sebelum trace, supaya kurva halus

a = np.asarray(Image.open(ASLI).convert("RGB")).astype(float)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
lum = 0.3 * r + 0.59 * g + 0.11 * b
# 0 = hitam/abu, 1 = emas (terang DAN kekuningan)
emas = np.clip((lum - 45) / 90, 0, 1) * np.clip((r - b - 20) / 60, 0, 1)
H, W = emas.shape
yy, xx = np.mgrid[0:H, 0:W]

# --- cincin: komponen emas terbesar (bounding box), lalu fit lingkaran kuadrat-terkecil ---
kasar = nd.gaussian_filter(emas, 4) > 0.35
lab, n = nd.label(kasar)
kotak = nd.find_objects(lab)
i_cincin = max(range(n), key=lambda i: (kotak[i][0].stop - kotak[i][0].start) * (kotak[i][1].stop - kotak[i][1].start))
ys, xs = np.nonzero(lab == i_cincin + 1)
A = np.c_[2 * xs, 2 * ys, np.ones(len(xs))]
cx, cy, c = np.linalg.lstsq(A, xs ** 2 + ys ** 2, rcond=None)[0]
r_fit = np.sqrt(c + cx ** 2 + cy ** 2)
d = np.hypot(xx - cx, yy - cy)
# tepi cincin: pita emas yang bersambung di sekitar r_fit (bagian dalam berisi singa, jangan ikut)
jari = np.arange(int(r_fit) - 60, int(r_fit) + 60)
profil = np.array([emas[(d >= k) & (d < k + 1)].mean() for k in jari])
tengah = int(np.argmin(np.abs(jari - r_fit)))
lo = hi = tengah
while lo > 0 and profil[lo - 1] > 0.45:
    lo -= 1
while hi < len(jari) - 1 and profil[hi + 1] > 0.45:
    hi += 1
r_dalam, r_luar = jari[lo] - 0.5, jari[hi] + 1.0
# piringan hitam: titik terang naik tajam di luar piringan (latar foto lebih terang)
lum_profil = np.array([lum[(d >= k) & (d < k + 1)].mean() for k in range(int(r_luar) + 5, 460)])
r_piringan = int(r_luar) + 5 + int(np.argmax(np.diff(lum_profil))) + 0.5

# --- singa: hanya di dalam cincin ---
m = int(r_dalam) - 6
x0, y0 = int(round(cx)) - m, int(round(cy)) - m
s = emas[y0:y0 + 2 * m, x0:x0 + 2 * m]
dd = np.hypot(np.mgrid[0:2 * m, 0:2 * m][1] + x0 - cx, np.mgrid[0:2 * m, 0:2 * m][0] + y0 - cy)
s = np.where(dd < r_dalam - 10, s, 0)
s = nd.zoom(nd.gaussian_filter(s, 1.4), ZOOM, order=3)
bw = s > 0.40


def bersihkan(bw, pulau, lubang):
    lab, n = nd.label(bw)
    bw = np.isin(lab, 1 + np.nonzero(nd.sum(bw, lab, range(1, n + 1)) >= pulau)[0])
    lab, n = nd.label(~bw)
    return bw | np.isin(lab, 1 + np.nonzero(nd.sum(~bw, lab, range(1, n + 1)) < lubang)[0])


bw = bersihkan(bw, 2500, 1800)                                 # buang bintik glitter
bw = bersihkan(nd.gaussian_filter(bw.astype(float), 5) > 0.5, 3000, 2500)  # tepi halus

# potracer menelusuri piksel False sebagai bentuk
jalur = potrace.Bitmap(~bw).trace(
    turdsize=200, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
    alphamax=1.15, opticurve=True, opttolerance=0.35)

k = 50 / r_luar  # px foto -> satuan mark (jari-jari luar cincin = 50)


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def P(p):  # titik hasil trace (piksel zoom) -> satuan mark, (0,0) = kiri atas cincin
    return f((p.x / ZOOM + x0 - cx) * k + 50), f((p.y / ZOOM + y0 - cy) * k + 50)


bagian = []
for kurva in jalur:
    sx, sy = P(kurva.start_point)
    dd_ = [f"M{sx} {sy}"]
    for seg in kurva.segments:
        if seg.is_corner:
            p1, p2 = P(seg.c), P(seg.end_point)
            dd_.append(f"L{p1[0]} {p1[1]}L{p2[0]} {p2[1]}")
        else:
            p1, p2, p3 = P(seg.c1), P(seg.c2), P(seg.end_point)
            dd_.append(f"C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p3[0]} {p3[1]}")
    dd_.append("Z")
    bagian.append("".join(dd_))
singa = "".join(bagian)


def lingkaran(rr):  # path lingkaran berpusat (50,50) dari dua busur
    rr = f(rr)
    return f"M{f(50 - float(rr))} 50a{rr} {rr} 0 1 0 {f(2 * float(rr))} 0a{rr} {rr} 0 1 0 -{f(2 * float(rr))} 0Z"


rd = r_dalam * k
cincin = lingkaran(50) + lingkaran(rd)
out = {
    "w": 100, "h": 100,
    "d": cincin + singa,        # cincin + singa, satu warna (fill-rule evenodd)
    "singa": singa,             # singa saja (untuk ornamen / ukuran sangat kecil)
    "cincin": cincin,
    "r_dalam": round(rd, 3),
    "r_piringan": round(r_piringan * k, 3),  # piringan hitam lencana, berpusat (50,50)
}
json.dump(out, open(os.path.join(os.path.dirname(__file__), "mark.json"), "w"))
print(f"mark.json: pusat foto ({cx:.1f}, {cy:.1f}), cincin r {r_dalam:.1f}-{r_luar:.1f}px, "
      f"piringan r {r_piringan:.1f}px, singa {len(bagian)} kontur")
