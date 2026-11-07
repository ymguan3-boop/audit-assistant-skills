#!/usr/bin/env node
// 用 Playwright 連到已登入的 Chrome，在 ChatGPT 網頁生成 PNG 或 GIF。全程不處理帳號密碼。
// 指令：chrome | status | make | gif-batch。說明見 ../SKILL.md
import { chromium } from 'playwright-core';
import { spawn, execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2), cmd = argv.shift();
const opt = {}; for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) { const k = argv[i].slice(2), v = argv[i + 1]; if (v === undefined || v.startsWith('--')) opt[k] = true; else { opt[k] = v; i++; } }
const PORT = opt.port || process.env.GPT_MEDIA_PORT || 9333, CDP = `http://127.0.0.1:${PORT}`, FFMPEG = opt.ffmpeg || process.env.FFMPEG || 'ffmpeg';
const PROFILE = opt.profile || process.env.GPT_MEDIA_PROFILE || path.join(os.homedir(), '.gpt-media-chrome');
const LOCK = path.join(os.tmpdir(), 'gpt-media.lock');
const TIMEOUT = Number(opt.timeout || 420) * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const die = (m) => { console.error(m); process.exit(1); };
/* 網址式路徑常帶 ?v=，瀏覽器讀得到但磁碟上沒有這個檔名 */
const cleanPath = (p) => path.resolve(String(p).split('?')[0]);
const need = (p) => { const f = cleanPath(p); if (!fs.existsSync(f)) die('找不到參考圖：' + f); return f; };
const SEND = '[data-testid="send-button"], button[aria-label="傳送"], button[aria-label="Send prompt"], button[aria-label="Send"]';
const INPUT = '#prompt-textarea, .ProseMirror';

function findChrome() {
  const list = process.platform === 'win32' ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe')] : process.platform === 'darwin' ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] : ['/usr/bin/google-chrome', '/usr/bin/chromium'];
  return opt.chrome || process.env.CHROME_PATH || list.find((f) => fs.existsSync(f)) || die('找不到 Chrome，請用 --chrome 指定路徑');
}
const connect = async () => { try { return await chromium.connectOverCDP(CDP); } catch { die(`連不到 ${CDP}。請先執行：node gpt-media.mjs chrome，並在開啟的視窗登入 ChatGPT`); } };
/* 同一個 Chrome 同時跑兩件工作會互相打字，所以一次只允許一個 */
function lock() { if (fs.existsSync(LOCK)) { const pid = Number(fs.readFileSync(LOCK, 'utf8')); let alive = false; try { process.kill(pid, 0); alive = true; } catch {} if (alive) die(`已有工作在執行（PID ${pid}），請等它結束`); } fs.writeFileSync(LOCK, String(process.pid)); process.on('exit', () => { try { fs.unlinkSync(LOCK); } catch {} }); }
async function openChat(browser) {
  const ctx = browser.contexts()[0] || die('Chrome 沒有可用的分頁環境'), page = await ctx.newPage();
  await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded' });
  await page.locator(INPUT).first().waitFor({ timeout: 60000 }); await sleep(2500);
  if (await page.locator('[data-testid="login-button"]').count()) { await page.close(); die('尚未登入 ChatGPT，請在 Chrome 視窗自行登入後再執行'); }
  return page;
}
/* ChatGPT 會把沒送出的文字與附件帶到新對話，一定要先清空 */
async function clearDraft(page) {
  await page.locator(INPUT).first().click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await sleep(500);
  for (let i = 0; i < 12; i++) { const b = page.locator('button[aria-label^="移除"], button[aria-label^="Remove"]').first(); if (!await b.count()) break; await b.click(); await sleep(400); }
}
async function ask(page, text, refs = []) {
  await clearDraft(page);
  if (refs.length) { const inputs = page.locator(refs.length > 1 ? 'input[type=file][multiple]' : 'input[type=file]'); await inputs.first().setInputFiles(refs); await page.locator('button[aria-label^="移除"], button[aria-label^="Remove"]').first().waitFor({ timeout: 60000 }); await sleep(4000); }
  await page.locator(INPUT).first().click(); await page.keyboard.insertText(text);
  const send = page.locator(SEND).first(); await send.waitFor({ timeout: 90000 }); for (let i = 0; i < 60 && await send.isDisabled(); i++) await sleep(1000);
  await send.click();
}
const media = (page, gif) => page.evaluate((gif) => [...document.images].filter((i) => i.naturalWidth >= 200 && !/使用者|uploaded|user/i.test(i.alt) && (gif ? /GIF/i.test(i.alt) : /產生|生成|Generated/i.test(i.alt))).map((i) => i.src), gif);
async function waitResult(page, gif, before = []) {
  const t0 = Date.now(); let last = '', same = 0;
  while (Date.now() - t0 < TIMEOUT) {
    await sleep(5000);
    const fresh = (await media(page, gif)).filter((x) => !before.includes(x)), busy = await page.evaluate(() => !!document.querySelector('[data-testid="stop-button"]') || /正在製作|Creating/.test(document.querySelector('main')?.innerText.slice(-400) || ''));
    if (!fresh.length || busy) { same = 0; continue; } const src = fresh.at(-1); same = src === last ? same + 1 : 0; last = src; if (same >= 1) return src;
  }
  throw Error('等不到結果：' + (await page.evaluate(() => document.querySelector('main')?.innerText.slice(-200) || '')).replace(/\s+/g, ' '));
}
async function save(page, src, out) {
  const r = await page.evaluate(async (s) => { const b = await fetch(s).then((v) => v.blob()); const u = await new Promise((ok) => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(b); }); return { type: b.type, u }; }, src);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(out, Buffer.from(r.u.split(',')[1], 'base64')); return r.type;
}
const ff = (...a) => execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...a]);
const imageSize = (f) => { const m = /(\d{2,5})x(\d{2,5})/.exec(spawnSync(FFMPEG, ['-hide_banner', '-i', f], { encoding: 'utf8' }).stderr || ''); return m ? [+m[1], +m[2]] : null; };
const gifFilter = (head) => `[0:v]format=rgba,${head},split[a][b];[a]palettegen=max_colors=128:reserve_transparent=1:stats_mode=full[p];[b][p]paletteuse=dither=none:alpha_threshold=128`;
function grid4(files, out) { const a = []; files.forEach((f) => a.push(...(f ? ['-i', f] : ['-f', 'lavfi', '-i', 'color=c=white:s=512x512']))); ff(...a, '-filter_complex', '[0:v]scale=512:512,format=rgb24[a];[1:v]scale=512:512,format=rgb24[b];[2:v]scale=512:512,format=rgb24[c];[3:v]scale=512:512,format=rgb24[d];[a][b][c][d]xstack=inputs=4:layout=0_0|512_0|0_512|512_512[o]', '-map', '[o]', '-frames:v', '1', out); }

if (cmd === 'chrome') {
  fs.mkdirSync(PROFILE, { recursive: true });
  const c = spawn(findChrome(), [`--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--no-first-run', 'https://chatgpt.com/'], { detached: true, stdio: 'ignore' }); c.unref();
  console.log(`Chrome 已啟動（專用資料夾 ${PROFILE}）。請在視窗內自行登入 ChatGPT。`); process.exit(0);
}
if (cmd === 'status') {
  const b = await connect(), pages = b.contexts().flatMap((c) => c.pages()), p = pages.find((x) => x.url().includes('chatgpt.com'));
  if (!p) console.log('已連上 Chrome，但沒有開啟 ChatGPT 分頁'); else console.log(await p.locator('[data-testid="login-button"]').count() ? '尚未登入' : '已登入', pages.length, '個分頁');
  await b.close(); process.exit(0);
}
if (cmd === 'make') {
  if (!opt.out) die('需要 --out 輸出檔'); const gif = opt.type === 'gif' || /\.gif$/i.test(opt.out), text = opt['prompt-file'] ? fs.readFileSync(opt['prompt-file'], 'utf8').trim() : opt.prompt; if (!text) die('需要 --prompt 或 --prompt-file');
  const refs = opt.ref ? String(opt.ref).split(',').map(need) : []; lock();
  const b = await connect(), page = await openChat(b);
  await ask(page, gif ? `請直接製作一個 GIF 檔（不要 PNG）。${text}` : text, refs);
  const src = await waitResult(page, gif), type = await save(page, src, opt.out);
  console.log('saved', opt.out, type, fs.statSync(opt.out).size >> 10, 'KB', imageSize(opt.out)?.join('x') || '', page.url());
  if (!opt.keep) await page.close(); await b.close(); process.exit(0);
}
if (cmd === 'gif-batch') {
  /* --list 是 JSON 陣列：[{ "id":"cat", "name":"小貓", "ref":"path" }]。每 4 個拼成 2×2 參考圖，產出一個 2×2 GIF 再切開 */
  if (!opt.list || !opt['out-dir']) die('需要 --list 與 --out-dir'); const items = JSON.parse(fs.readFileSync(opt.list, 'utf8')), dir = path.resolve(opt['out-dir']), size = Number(opt.size || 160), style = opt.style || '可愛 Q 版、手繪粗輪廓 2D 遊戲風格，輕輕上下彈動並眨眼的待機循環'; fs.mkdirSync(path.join(dir, '_raw'), { recursive: true });
  const todo = items.filter((x) => !fs.existsSync(path.join(dir, x.id + '.gif'))); todo.forEach((x) => need(x.ref)); const pos = ['左上', '右上', '左下', '右下']; lock(); const b = await connect(); let fails = 0, done = 0; console.log('todo', todo.length);
  for (let i = 0; i < todo.length; i += 4) {
    const g = todo.slice(i, i + 4), tag = g[0].id, ref = path.join(dir, '_raw', tag + '-ref.png'), raw = path.join(dir, '_raw', tag + '.gif'); const files = g.map((x) => cleanPath(x.ref)); while (files.length < 4) files.push(null); grid4(files, ref);
    let page; try {
      page = await openChat(b);
      await ask(page, `附圖是 2×2 四格角色（${g.map((x, k) => `${pos[k]}＝${x.name || x.id}`).join('；')}）。請直接製作一個 GIF 檔（不要 PNG）：同一個 GIF 維持 2×2 四格，每個角色留在自己那格正中央，全身完整，不超出格子。${style}。造型配色與附圖相同，去掉背景場景，整張正方形、背景透明，${g.length < 4 ? '空格保持全空，' : ''}不要文字、不要格線。`, [ref]);
      await save(page, await waitResult(page, true), raw);
      g.forEach((x, k) => { ff('-i', raw, '-filter_complex', gifFilter(`crop=iw/2:ih/2:${k % 2 ? 'iw/2' : '0'}:${k > 1 ? 'ih/2' : '0'},scale=${size}:${size}:flags=lanczos`), '-gifflags', '0', '-loop', '0', path.join(dir, x.id + '.gif')); done++; console.log('ok', x.id); });
      fails = 0; await page.close(); await sleep(3000);
    } catch (e) { console.log('FAIL', tag, String(e.message).slice(0, 200)); if (page) await page.close().catch(() => {}); if (++fails >= 2) { console.log('連續失敗，已停止；重跑會從未完成的繼續'); break; } await sleep(15000); }
  }
  console.log('END', done, 'new'); await b.close(); process.exit(0);
}
console.log('用法：node gpt-media.mjs chrome | status | make --out a.png --prompt "..." [--ref a.png,b.png] | gif-batch --list items.json --out-dir dir [--size 160]');
