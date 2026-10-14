"""Gabungkan favicon 16/32/48 px jadi brand/web/favicon.ico (dipanggil render.mjs)."""
import os

from PIL import Image

WEB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "brand", "web")
imgs = [Image.open(os.path.join(WEB, f"favicon-{s}.png")) for s in (48, 32, 16)]
imgs[0].save(os.path.join(WEB, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[1:])
