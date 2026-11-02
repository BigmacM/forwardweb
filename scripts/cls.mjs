// Layout-shift check with the browser cache ENABLED (a disabled cache hides font-swap shifts).
// Serves dist/ with the same long cache headers the .htaccess sets, loads each page cold once to warm the cache,
// then measures CLS on 8 warm reloads per page and viewport. Usage: npm run build, then `node scripts/cls.mjs`.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, extname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const puppeteer = require('../../node_modules/puppeteer');
const DIST = resolve('dist');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = join(DIST, decodeURIComponent(url.pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  const ext = extname(p);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
  // Static assets cache for a year; html for an hour, like the host config.
  headers['Cache-Control'] = ext === '.html' ? 'public, max-age=3600' : 'public, max-age=31536000';
  res.writeHead(200, headers);
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(4396, r));

const routes = ['/', '/apps/', '/notes/small-business-website-cost-toronto-2026/', '/notes/check-chatgpt-recommends-your-business/', '/notes/robots-txt-blocking-ai-crawlers-exposes-admin/', '/services/', '/tools/', '/work/tour-operator/', '/about/', '/tools/robots-txt-checker/'];
const widths = [390, 1024, 1440];
const browser = await puppeteer.launch({ headless: true });
let worst = 0;
let bad = 0;
for (const w of widths) {
  const page = await browser.newPage(); // one page, cache enabled (the default)
  await page.setViewport({ width: w, height: 900 });
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  for (const r of routes) {
    await page.goto(`http://localhost:4396${r}`, { waitUntil: 'networkidle0' }); // warm the cache
    const runs = [];
    for (let i = 0; i < 8; i++) {
      await page.goto(`http://localhost:4396${r}`, { waitUntil: 'load' });
      await new Promise((x) => setTimeout(x, 900));
      runs.push(Math.round((await page.evaluate(() => window.__cls)) * 1000) / 1000);
    }
    const max = Math.max(...runs);
    worst = Math.max(worst, max);
    if (max > 0.05) bad++;
    console.log(`${max > 0.05 ? 'FAIL' : 'ok  '} ${w}px ${r} max CLS ${max} (${runs.join(', ')})`);
  }
  await page.close();
}

// Fallback fit: with the web fonts blocked, the page should be about as tall as with them, so the swap cannot move content.
const fit = await browser.newPage();
await fit.setViewport({ width: 1024, height: 900 });
await fit.setRequestInterception(true);
let block = false;
fit.on('request', (r) => (block && /.woff2?$/.test(r.url()) ? r.abort() : r.continue()));
let fitBad = 0;
for (const r of ['/', '/services/', '/notes/small-business-website-cost-toronto-2026/', '/notes/check-chatgpt-recommends-your-business/', '/notes/robots-txt-blocking-ai-crawlers-exposes-admin/', '/work/tour-operator/']) {
  const heights = [];
  for (const b of [false, true]) {
    block = b;
    await fit.goto(`http://localhost:4396${r}`, { waitUntil: 'networkidle0' });
    heights.push(await fit.evaluate(() => document.documentElement.scrollHeight));
  }
  const pct = Math.abs(heights[1] - heights[0]) / heights[0] * 100;
  if (pct > 2) fitBad++;
  console.log(`${pct > 2 ? 'FAIL' : 'ok  '} fallback fit ${r}: ${heights[0]}px with web fonts, ${heights[1]}px with the fallback (${pct.toFixed(1)}% apart)`);
}
await browser.close();
server.close();
console.log(`\nworst warm-cache CLS: ${worst}  pages over 0.05: ${bad}`);
process.exit(bad || fitBad ? 1 : 0);
