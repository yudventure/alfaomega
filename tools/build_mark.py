"""Rekonstruksi geometris monogram Alfa-Omega.

Logo asli (brand/logo/asli/logo-asli.png) diukur, lalu dibangun ulang dari
garis lurus + kurva superelips agar simetris dan tajam di ukuran berapa pun.
Bentuk dirender ke bitmap resolusi tinggi lalu di-trace (potrace) menjadi
satu path SVG.

    pip install numpy potracer
    python3 tools/build_mark.py      # -> tools/mark.json
"""
import json
import os
import sys

import numpy as np
import potrace

S = int(sys.argv[1]) if len(sys.argv) > 1 else 6  # supersampling untuk trace

# Kaki huruf A: kemiringan (dx/dy), puncak luar & puncak lubang dalam
s, yA, yAi = 0.47875, 4.32, 157.28
# Palang A (atas/bawah), dasar logo, dasar lubang kaki Omega
yc0, yc1, yB, yF = 413.4, 451.0, 701.4, 637.0
# Kontur Omega sebagai superelips: (lebar-setengah, pusat-y, tinggi atas, eksponen atas, tinggi bawah, eksponen bawah)
OUT = (296.14, 348.41, 271.61, 2.099, 273.72, 2.183)
INN = (192.15, 356.21, 249.36, 2.326, 241.19, 2.233)


def se(p, y):
    a, c, bt, nt, bb, nb = p
    top = y < c
    t = np.where(top, np.abs((y - c) / bt), np.abs((y - c) / bb))
    n = np.where(top, nt, nb)
    v = np.clip(1 - np.clip(t, 0, 1) ** n, 0, 1) ** (1 / n)
    return np.where(t <= 1, a * v, -1.0)


def si(y):  # tepi dalam batang kaki Omega
    return 63.03 - 0.128 * (y - 600)


def so(y):  # tepi luar batang kaki Omega
    return 100.77 - 0.128 * (y - 630)


halfw = s * (yB - yA)
pad = 4
x0, x1 = -halfw - pad, halfw + pad
y0, y1 = yA - pad, yB + pad
W, H = int((x1 - x0) * S), int((y1 - y0) * S)
X, Y = np.meshgrid(x0 + (np.arange(W) + 0.5) / S, y0 + (np.arange(H) + 0.5) / S)
d = np.abs(X)

A_out = (d <= s * (Y - yA)) & (Y >= yA) & (Y <= yB)
A_in = d < s * (Y - yAi)
A = A_out & (~A_in | ((Y >= yc0) & (Y <= yc1)))

yy = np.linspace(560, 640, 80001)
yJi = yy[np.argmin(np.abs(se(INN, yy) - si(yy)))]
yJo = yy[np.argmin(np.abs(se(OUT, yy) - so(yy)))]
stem = (d <= so(Y)) & (Y >= yJo) & (Y <= yB)
opening = (d < se(INN, Y)) | ((d < si(Y)) & (Y >= yJi))
omega = ((d <= se(OUT, Y)) | stem) & ~opening
foot = (Y >= yF) & (Y <= yB) & (d >= si(Y)) & (d <= s * (Y - yA))
black = A | omega | foot

# potracer menelusuri piksel False sebagai bentuk
path = potrace.Bitmap(~black).trace(
    turdsize=50, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
    alphamax=1.0, opticurve=True, opttolerance=0.2)


def f(v):
    return f"{v:.2f}".rstrip('0').rstrip('.')


def P(p):
    return f(p.x / S + x0 + halfw), f(p.y / S + y0 - yA)


parts = []
for curve in path:
    sx, sy = P(curve.start_point)
    dd = [f"M{sx} {sy}"]
    for seg in curve.segments:
        if seg.is_corner:
            a, b = P(seg.c), P(seg.end_point)
            dd.append(f"L{a[0]} {a[1]}L{b[0]} {b[1]}")
        else:
            a, b, e = P(seg.c1), P(seg.c2), P(seg.end_point)
            dd.append(f"C{a[0]} {a[1]} {b[0]} {b[1]} {e[0]} {e[1]}")
    dd.append("Z")
    parts.append("".join(dd))

out = {"w": round(2 * halfw, 2), "h": round(yB - yA, 2), "d": "".join(parts)}
json.dump(out, open(os.path.join(os.path.dirname(__file__), "mark.json"), "w"))
print(f"mark.json: {out['w']} x {out['h']}, {len(parts)} kontur")
