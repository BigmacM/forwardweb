// Screenshot helper: node scripts/shots.mjs <label> <width> [path ...]
// Serves dist/ and writes mockups/build/r6/<label>-<name>-<width>.png (full page).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, extname, resolve } from 'node:path';

const [label, widthArg, ...paths] = process.argv.slice(2);
const width = Number(widthArg);
const require = createRequire(import.meta.url);
const puppeteer = require('../../node_modules/puppeteer');
const DIST = resolve('dist');
const OUT = resolve('mockups/build/r6');
mkdirSync(OUT, { recursive: true });
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  let p = join(DIST, decodeURIComponent(u.pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': T[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(4392);
const list = paths.length ? paths : ['/', '/apps/', '/about/', '/notes/check-chatgpt-recommends-your-business/'];
const browser = await puppeteer.launch({ headless: true, protocolTimeout: 120000 });
const page = await browser.newPage();
await page.setViewport({ width, height: 1000 });
for (const p of list) {
  await page.goto(`http://localhost:4392${p}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-ill]').forEach((e) => e.classList.add('in')));
  await new Promise((r) => setTimeout(r, 400));
  const name = p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-').slice(0, 40);
  await page.screenshot({ path: join(OUT, `${label}-${name}-${width}.png`), fullPage: true });
  console.log('wrote', `${label}-${name}-${width}.png`);
}
await browser.close();
server.close();
