#!/usr/bin/env node
// 綠幕去背：只從圖片邊緣往內找連通的亮綠色，物件本身的綠色不會被吃掉。
// 用法：node key-green.mjs input.png output.png
// 也可切表：node key-green.mjs sheet.png out-dir --grid 3x2 --names a,b,c,d,e,f [--size 320]
// 物件依重心分配到格子，高櫃跨過格線也不會被切斷。需要 Chrome。
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const [input, output, ...rest] = process.argv.slice(2); const flag = (k) => { const i = rest.indexOf('--' + k); return i < 0 ? null : rest[i + 1]; };
if (!input || !output) { console.log('用法：node key-green.mjs input.png output.png [--grid 3x2 --names a,b --size 320]'); process.exit(0); }
const [cols, rows] = (flag('grid') || '1x1').split('x').map(Number), names = (flag('names') || path.basename(output, path.extname(output))).split(','), size = Number(flag('size') || 0);
const b = await chromium.launch({ channel: 'chrome', headless: true }), p = await b.newPage(); await p.setContent('<!doctype html><body></body>');
const data = 'data:image/png;base64,' + fs.readFileSync(input).toString('base64');
const res = await p.evaluate(async ({ data, cols, rows, names, size }) => {
  const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = data; }); const W = img.naturalWidth, H = img.naturalHeight, N = W * H, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, W, H).data;
  const isBg = (k) => { const j = k * 4, m = Math.max(d[j], d[j + 2]); return d[j + 1] - m > 48 && d[j + 1] > 120; }, bg = new Uint8Array(N), lab = new Int32Array(N).fill(-1), q = new Int32Array(N); let t = 0;
  const push = (k) => { if (!bg[k] && isBg(k)) { bg[k] = 1; q[t++] = k; } }; for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  for (let h = 0; h < t; h++) { const k = q[h], x = k % W; if (x > 0) push(k - 1); if (x < W - 1) push(k + 1); if (k >= W) push(k - W); if (k < N - W) push(k + W); }
  const comps = []; for (let k0 = 0; k0 < N; k0++) { if (bg[k0] || lab[k0] >= 0) continue; const id = comps.length; let h = 0, e = 0, sx = 0, sy = 0, x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0; q[e++] = k0; lab[k0] = id; while (h < e) { const k = q[h++], x = k % W, y = k / W | 0; sx += x; sy += y; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); for (const n of [x > 0 ? k - 1 : -1, x < W - 1 ? k + 1 : -1, k - W, k + W]) if (n >= 0 && n < N && !bg[n] && lab[n] < 0) { lab[n] = id; q[e++] = n; } } comps.push({ n: e, cx: sx / e, cy: sy / e, x0, y0, x1, y1 }); }
  return names.map((name, idx) => { const keep = new Set(); let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0; comps.forEach((o, id) => { const cell = Math.min(cols - 1, o.cx / (W / cols) | 0) + cols * Math.min(rows - 1, o.cy / (H / rows) | 0); if (o.n < 80 || cell !== idx) return; keep.add(id); x0 = Math.min(x0, o.x0); y0 = Math.min(y0, o.y0); x1 = Math.max(x1, o.x1); y1 = Math.max(y1, o.y1); }); if (!keep.size) return { name, empty: true };
    const lay = document.createElement('canvas'); lay.width = W; lay.height = H; const lg = lay.getContext('2d'), li = lg.createImageData(W, H), ld = li.data; for (let k = 0; k < N; k++) { if (!keep.has(lab[k])) continue; const j = k * 4, m = Math.max(d[j], d[j + 2]), x = k % W; let near = false; for (const o of [x > 0 ? k - 1 : -1, x < W - 1 ? k + 1 : -1, k - W, k + W]) if (o >= 0 && o < N && bg[o]) near = true; ld[j] = d[j]; ld[j + 1] = near && d[j + 1] > m ? m : d[j + 1]; ld[j + 2] = d[j + 2]; ld[j + 3] = near ? 150 : 255; } lg.putImageData(li, 0, 0);
    const w = x1 - x0 + 1, h = y1 - y0 + 1, S = size || Math.max(w, h), o = document.createElement('canvas'); o.width = o.height = S; const u = o.getContext('2d'); u.imageSmoothingQuality = 'high'; const s = S * .98 / Math.max(w, h); u.drawImage(lay, x0, y0, w, h, S / 2 - w * s / 2, S - h * s, w * s, h * s); return { name, url: o.toDataURL('image/png'), w, h }; });
}, { data, cols, rows, names, size });
await b.close();
const multi = cols * rows > 1; if (multi) fs.mkdirSync(output, { recursive: true });
for (const r of res) { if (r.empty) { console.log('空格', r.name); continue; } const f = multi ? path.join(output, r.name + '.png') : output; fs.writeFileSync(f, Buffer.from(r.url.split(',')[1], 'base64')); console.log('saved', f, r.w + 'x' + r.h); }
