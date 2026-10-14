"""Hasilkan file turunan untuk aplikasi React dari sumber brand:

- src/components/ikon-paths.js     (dari ICONS di build_web.py)
- src/components/monogram-path.js  (dari mark.json)

    python3 tools/build_react_assets.py
Visual latar: node tools/render.mjs "public/img"
"""
import json
import os
import sys

T = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(T)
sys.path.insert(0, T)
from build_web import ICONS  # noqa: E402

mark = json.load(open(os.path.join(T, "mark.json")))
out = os.path.join(ROOT, "src", "components")
os.makedirs(out, exist_ok=True)
with open(os.path.join(out, "ikon-paths.js"), "w", encoding="utf-8") as f:
    f.write("// Dibuat oleh tools/build_react_assets.py dari tools/build_web.py (ICONS). Jangan diedit manual.\n")
    f.write("export const IKON = " + json.dumps(ICONS, ensure_ascii=False, indent=2) + ";\n")
with open(os.path.join(out, "monogram-path.js"), "w", encoding="utf-8") as f:
    f.write("// Dibuat oleh tools/build_react_assets.py dari tools/mark.json. Jangan diedit manual.\n")
    f.write(f"export const MONOGRAM = {{ w: {mark['w']}, h: {mark['h']}, d: {json.dumps(mark['d'])} }};\n")
print("src/components/ikon-paths.js, monogram-path.js")
