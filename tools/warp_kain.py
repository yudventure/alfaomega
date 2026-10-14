"""Lengkungkan artwork datar (bendera & umbul-umbul) jadi kain berkibar.

Input : tools/.cache/kain/<nama>.png      (dirender datar oleh render.mjs)
Output: tools/.cache/kain/<nama>-kibar.png

Gelombang kain disimulasikan sebagai permukaan z(x, y); gambar digeser mengikuti
gelombang dan diberi bayangan/kilau dari kemiringan permukaan. Sisi yang terikat
tiang (kiri untuk bendera, atas untuk umbul-umbul) dibuat diam.
"""
import glob
import os

import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

D = os.path.join(os.path.dirname(__file__), ".cache", "kain")


def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def warp(src, z, dx, dy, pad, sheen=0.16, shadow=0.42, k=1.0):
    """src RGBA (H,W,4) float; z/dx/dy di grid output (H+2p, W+2p)."""
    H, W = src.shape[:2]
    Ho, Wo = z.shape
    yy, xx = np.mgrid[0:Ho, 0:Wo].astype(float)
    sx = xx - pad - dx
    sy = yy - pad - dy
    a = src[..., 3:4] / 255.0
    pre = np.concatenate([src[..., :3] * a, src[..., 3:4]], axis=2)
    out = np.stack([map_coordinates(pre[..., c], [sy, sx], order=1, mode="constant", cval=0) for c in range(4)], axis=2)
    alpha = out[..., 3:4] / 255.0
    rgb = np.where(alpha > 0, out[..., :3] / np.maximum(alpha, 1e-6), 0)
    gy, gx = np.gradient(z)
    s = (gx * 0.8 - gy * 0.35) * k  # cahaya dari kiri-atas
    s = s / (np.abs(s).max() + 1e-6)
    lit = rgb * (1 - shadow * np.clip(-s, 0, 1))[..., None] + 255 * sheen * (np.clip(s, 0, 1) ** 1.6)[..., None]
    lit = np.clip(lit, 0, 255)
    return np.concatenate([lit, alpha * 255], axis=2).astype(np.uint8)


def bendera(path):
    src = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    H, W = src.shape[:2]
    pad = 90
    yy, xx = np.mgrid[0:H + 2 * pad, 0:W + 2 * pad].astype(float)
    x = (xx - pad) / W
    y = (yy - pad) / H
    amp = smooth(x / 0.25) * (0.6 + 0.4 * x)  # diam di tiang
    ph = 2 * np.pi * (x * 2.15) - y * 0.9
    z = amp * (np.sin(ph) + 0.35 * np.sin(2 * np.pi * x * 4.3 + 1.3 - y * 1.6))
    dy = 30 * z + 18 * amp * (y - 0.5) * np.cos(ph)  # tepi atas/bawah bergelombang
    dx = -10 * amp * np.cos(ph) - 22 * np.clip(x, 0, None) ** 1.5   # ujung bebas sedikit tertarik ke tiang
    return warp(src, z * 60, dx, dy, pad, sheen=0.17, shadow=0.45)


def umbul(path, seed):
    src = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    H, W = src.shape[:2]
    pad = 70
    rng = np.random.default_rng(seed)
    p1, p2, p3 = rng.uniform(0, 2 * np.pi, 3)
    yy, xx = np.mgrid[0:H + 2 * pad, 0:W + 2 * pad].astype(float)
    x = (xx - pad) / W
    y = (yy - pad) / H
    amp = smooth(y / 0.12) * (0.55 + 0.45 * y)  # diam di palang atas
    z = amp * (np.sin(2 * np.pi * x * 1.6 + p1 + y * 2.2) + 0.4 * np.sin(2 * np.pi * x * 3.1 + p2 - y * 3.0))
    dx = amp * (26 * np.sin(2 * np.pi * y * 0.9 + p3) + 9 * np.cos(2 * np.pi * x * 1.6 + p1 + y * 2.2))
    dy = 8 * amp * np.sin(2 * np.pi * x * 1.6 + p1)
    return warp(src, z * 30, dx, dy, pad, sheen=0.15, shadow=0.4)


if __name__ == "__main__":
    for i, p in enumerate(sorted(glob.glob(os.path.join(D, "*.png")))):
        if p.endswith("-kibar.png"):
            continue
        name = os.path.basename(p)[:-4]
        img = bendera(p) if name.startswith("bendera") else umbul(p, seed=i * 7 + 3)
        Image.fromarray(img).save(os.path.join(D, f"{name}-kibar.png"))
        print(f"{name}-kibar.png", img.shape[1], "x", img.shape[0])
