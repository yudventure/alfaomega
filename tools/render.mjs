// Render semua aset raster (PNG/JPG) dari template HTML/SVG memakai Chromium (Playwright).
//
//   node tools/render.mjs            # semua aset
//   node tools/render.mjs "youtube"  # hanya aset yang path-nya cocok dengan regex
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { BRAND, TOOLS } from './lib.mjs';
import { execFileSync } from 'child_process';
import logoWeb, { faviconSvg } from './assets-logo-web.mjs';
import social from './assets-social.mjs';
import mockups from './assets-mockup.mjs';
import webKit from './assets-web-kit.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const filter = process.argv[2];
const assets = [...logoWeb(), ...webKit(), ...social(), ...mockups()].filter(a => !filter || new RegExp(filter).test(a.out));

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const pg = await ctx.newPage();
for (const a of assets) {
  const scale = a.scale || 1;
  await pg.setViewportSize({ width: Math.round(a.w / scale), height: Math.round(a.h / scale) });
  if (scale !== 1) {
    // render CSS-px kecil dengan faktor skala: dipakai untuk ekspor resolusi tinggi
    const p2 = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: Math.round(a.w / scale), height: Math.round(a.h / scale) } });
    await shoot(p2, a); await p2.close();
  } else {
    await shoot(pg, a);
  }
}
await browser.close();

if (assets.some(a => a.out.startsWith('web/favicon'))) {
  fs.writeFileSync(path.join(BRAND, 'web', 'favicon.svg'), faviconSvg(64) + '\n');
  execFileSync('python3', [path.join(TOOLS, 'make_ico.py')], { stdio: 'inherit' });
  console.log('web/favicon.svg + web/favicon.ico');
}

async function shoot(p, a) {
  if (a.before) a.before();
  await p.setContent(typeof a.html === 'function' ? a.html() : a.html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const out = path.join(BRAND, a.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const jpeg = out.endsWith('.jpg');
  await p.screenshot({ path: out, omitBackground: !!a.transparent, type: jpeg ? 'jpeg' : 'png', quality: jpeg ? 90 : undefined });
  console.log(`${path.relative(BRAND, out)}  ${a.w}x${a.h}`);
}
