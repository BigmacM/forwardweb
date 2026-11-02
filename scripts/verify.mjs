// Headless verification against the built site. Usage: npm run build, then `node scripts/verify.mjs`.
// Serves dist/ itself (no dependency on astro preview), checks every route at phone width,
// drives each interactive tool, and writes screenshots to mockups/build/.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, extname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const puppeteer = require('../../node_modules/puppeteer');

const DIST = resolve('dist');
const SHOTS = resolve('mockups/build');
mkdirSync(SHOTS, { recursive: true });
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };

// A tiny static server that behaves like the host: directory index, real 404.html, and a stubbed lead endpoint.
let leadHits = [];
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/lead.php') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      leadHits.push(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Got it.' }));
    });
    return;
  }
  let p = join(DIST, decodeURIComponent(url.pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(readFileSync(join(DIST, '404.html')));
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(4399, r));
const BASE = 'http://localhost:4399';

const routes = [];
const walk = (d, rel = '') => {
  for (const f of readdirSync(d)) {
    const full = join(d, f);
    if (statSync(full).isDirectory()) walk(full, `${rel}/${f}`);
    else if (f === 'index.html') routes.push(rel ? `${rel}/` : '/');
  }
};
walk(DIST);
routes.push('/404-check-missing-page/');
routes.sort();

const results = [];
const ok = (name, pass, note = '') => {
  results.push({ name, pass, note });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${note ? '  ' + note : ''}`);
};

const browser = await puppeteer.launch({ headless: true });
const consoleProblems = [];
const newPage = async (w, h, scale = 1) => {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: scale });
  page.setDefaultTimeout(25000);
  page.setDefaultNavigationTimeout(25000);
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type()) && !(page.url().includes('missing-page') && /404/.test(m.text()))) consoleProblems.push(`${page.url()} ${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleProblems.push(`${page.url()} pageerror: ${e.message}`));
  page.on('requestfailed', (r) => consoleProblems.push(`${page.url()} requestfailed: ${r.url()}`));
  return page;
};

/* 1. Every route at 390: no horizontal overflow, 16px gutters, one left edge */
const phone = await newPage(390, 844, 2);
for (const r of routes) {
  const res = await phone.goto(BASE + r, { waitUntil: 'networkidle0' });
  const info = await phone.evaluate(() => {
    const de = document.documentElement;
    const wraps = [...document.querySelectorAll('.wrap')];
    const lefts = wraps.map((w) => Math.round(w.getBoundingClientRect().left + parseFloat(getComputedStyle(w).paddingLeft)));
    const pads = wraps.map((w) => parseFloat(getComputedStyle(w).paddingLeft));
    // anything that pokes out of the viewport
    const wide = [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1 && !el.closest('.scroll-x,pre,table,.code,.annot,.sheet')).slice(0, 3).map((e) => e.className || e.tagName);
    return { sw: de.scrollWidth, cw: de.clientWidth, minPad: Math.min(...pads, 99), leftSet: [...new Set(lefts)], wide };
  });
  const expected404 = r.includes('missing-page');
  ok(`390px ${r}${expected404 ? ' (404)' : ''}`, (expected404 ? res.status() === 404 : res.status() === 200) && info.sw === info.cw && info.minPad >= 16 && info.leftSet.length <= 1, `scroll ${info.sw}/${info.cw} pad>=${info.minPad} edges=${info.leftSet.join(',')}${info.wide.length ? ' wide=' + info.wide : ''}`);
}

/* 2. SEO basics on every real page */
const seoPage = await newPage(1280, 800);
const seen = { titles: new Set(), descs: new Set() };
for (const r of routes.filter((x) => !x.includes('missing') && x !== '/thanks/')) {
  await seoPage.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  const s = await seoPage.evaluate(() => {
    const m = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) ?? '';
    return {
      title: document.title, desc: m('meta[name=description]'), canon: m('link[rel=canonical]', 'href'),
      ogt: m('meta[property="og:title"]'), ogd: m('meta[property="og:description"]'), ogi: m('meta[property="og:image"]'), ogu: m('meta[property="og:url"]'),
      twc: m('meta[name="twitter:card"]'), twi: m('meta[name="twitter:image"]'), h1s: document.querySelectorAll('h1').length,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)['@type']; } catch { return 'INVALID'; } }),
      noindex: !!document.querySelector('meta[name=robots][content*=noindex]'),
    };
  });
  const dupe = seen.titles.has(s.title) || seen.descs.has(s.desc);
  seen.titles.add(s.title); seen.descs.add(s.desc);
  const fine = s.title && s.desc && s.canon.startsWith('https://forwardweb.ca') && s.ogt === s.title && s.ogd === s.desc && s.ogi.endsWith('.png') && s.ogu === s.canon && s.twc === 'summary_large_image' && s.twi && s.h1s === 1 && !s.ld.includes('INVALID') && !dupe;
  ok(`seo ${r}`, fine || (s.noindex && s.title), `${s.title.length}c title, ${s.desc.length}c desc, h1=${s.h1s}, ld=${s.ld.join('+')}${dupe ? ' DUPLICATE' : ''}`);
}

/* 3. Interactive: home check + result carried into the apply form */
const d = await newPage(1440, 900);
await d.goto(BASE + '/', { waitUntil: 'networkidle0' });
await d.screenshot({ path: join(SHOTS, 'home-desktop-fold.png') });
for (let i = 0; i < 8; i++) {
  await d.click('[data-check] .opt[data-v="no"]');
  await new Promise((r) => setTimeout(r, 260));
}
const res1 = await d.evaluate(() => ({ on: document.querySelector('[data-result]').classList.contains('on'), score: document.querySelector('[data-score]').textContent, fixes: document.querySelectorAll('[data-fix] li').length, hidden: document.querySelector('#apply-form [name=score]').value, fixesField: document.querySelector('#apply-form [name=fixes]').value.length }));
ok('home check: result shows score, three fixes, and fills the apply form', res1.on && res1.fixes === 3 && res1.hidden.startsWith('0/16') && res1.fixesField > 20, JSON.stringify(res1));
await d.screenshot({ path: join(SHOTS, 'home-check-result.png') });
await d.screenshot({ path: join(SHOTS, 'home-desktop.png'), fullPage: true });

/* carried to /apply/ via sessionStorage */
await d.goto(BASE + '/apply/', { waitUntil: 'networkidle0' });
const carried = await d.evaluate(() => document.querySelector('#audit-form [name=score]').value);
ok('apply page picks up the check score from the same session', carried.startsWith('0/16'), carried);

/* 4. Form: validation, busy state, success in place */
await d.goto(BASE + '/apply/', { waitUntil: 'networkidle0' });
await d.evaluate(() => sessionStorage.clear());
await d.reload({ waitUntil: 'networkidle0' });
await d.click('#project-form [data-submit]');
const v1 = await d.evaluate(() => ({ err: document.querySelector('#project-form-url-e').textContent, focus: document.activeElement.id, invalid: document.querySelector('#project-form-url').getAttribute('aria-invalid') }));
ok('form: empty submit names the fix and focuses the first invalid field', v1.err.includes('yourbusiness.ca') && v1.focus === 'project-form-url' && v1.invalid === 'true', JSON.stringify(v1));
await d.type('#project-form-url', 'example.ca');
await d.type('#project-form-email', 'not-an-email');
await d.click('#project-form-msg');
const v2 = await d.evaluate(() => document.querySelector('#project-form-email-e').textContent);
ok('form: bad email shows an error on blur', v2.includes('name@company.com'), v2);
await d.$eval('#project-form-email', (e) => (e.value = ''));
await d.type('#project-form-email', 'max@example.ca');
leadHits = [];
await d.click('#project-form [data-submit]');
await d.waitForSelector('[data-sent]', { timeout: 4000 }).catch(() => {});
const sent = await d.evaluate(() => document.querySelector('#project-form')?.textContent ?? '');
ok('form: valid submit posts and shows success in place', sent.includes('Got it') && leadHits.length === 1 && leadHits[0].includes('example.ca'), `posts=${leadHits.length}`);
await d.screenshot({ path: join(SHOTS, 'apply-desktop.png'), fullPage: true });

/* 5. Tools */
await d.goto(BASE + '/tools/robots-txt-checker/', { waitUntil: 'networkidle0' });
const emptyState = await d.evaluate(() => ({ empty: !document.querySelector('[data-empty]').hidden, table: document.querySelector('[data-table]').hidden }));
ok('robots: empty state says paste to begin and shows no table', emptyState.empty && emptyState.table, JSON.stringify(emptyState));
await d.screenshot({ path: join(SHOTS, 'tool-robots-empty-desktop.png') });
await d.click('[data-example]');
const rb = await d.evaluate(() => {
  const rows = [...document.querySelectorAll('[data-rows] tr')].map((tr) => [...tr.children].map((c) => c.textContent.trim()));
  return { rows, gotcha: document.querySelector('[data-gotcha]').textContent };
});
const gpt = rb.rows.find((r) => r[0] === 'GPTBot'), cla = rb.rows.find((r) => r[0] === 'ClaudeBot'), per = rb.rows.find((r) => r[0] === 'PerplexityBot');
ok('robots: GPTBot own group re-opens /admin and is flagged', gpt[2] === 'Allowed' && gpt[3] === 'Reachable' && /GPTBot/.test(rb.gotcha) && /\/admin/.test(rb.gotcha), JSON.stringify(gpt));
ok('robots: ClaudeBot blocked, PerplexityBot follows * and /admin blocked', cla[2] === 'Blocked' && per[2] === 'Allowed' && per[3] === 'Blocked', JSON.stringify([cla, per]));
await d.$eval('[data-input]', (e) => (e.value = 'User-agent: *\nDisallow: /private/\nAllow: /private/public$\n\nUser-agent: GPTBot\nDisallow: /private/\nAllow: /'));
await d.$eval('[data-path]', (e) => (e.value = '/private/x'));
await d.evaluate(() => document.querySelector('[data-input]').dispatchEvent(new Event('input')));
const rb2 = await d.evaluate(() => ({ gotcha: document.querySelector('[data-gotcha]').textContent, gpt: [...document.querySelectorAll('[data-rows] tr')].find((tr) => tr.textContent.includes('GPTBot')).textContent }));
ok('robots: repeating the Disallow in the named group clears the warning', rb2.gotcha === '' && /Blocked/.test(rb2.gpt), rb2.gpt.replace(/\s+/g, ' '));
await d.click('[data-example]');
await d.screenshot({ path: join(SHOTS, 'tool-robots-desktop.png') });

await d.goto(BASE + '/tools/snippet-preview/', { waitUntil: 'networkidle0' });
await d.$eval('[data-title]', (e) => (e.value = 'W'.repeat(60)));
await d.evaluate(() => document.querySelector('[data-title]').dispatchEvent(new Event('input')));
const sn = await d.evaluate(() => ({ info: document.querySelector('[data-tinfo]').textContent, over: document.querySelector('[data-tbar]').classList.contains('over') }));
ok('snippet: 60 capital Ws measured in pixels and flagged as cut off', /pixels/.test(sn.info) && sn.over && /cut off/.test(sn.info), sn.info);
await d.screenshot({ path: join(SHOTS, 'tool-snippet-desktop.png') });

await d.goto(BASE + '/tools/schema-generator/', { waitUntil: 'networkidle0' });
const sc0 = await d.evaluate(() => document.querySelector('[data-out]').textContent);
await d.type('[name=name]', 'Example Plumbing');
await d.type('[name=url]', 'example.ca');
const sc1 = await d.evaluate(() => ({ out: document.querySelector('[data-out]').textContent, err: document.querySelector('[data-err=url]').textContent }));
await d.$eval('[name=url]', (e) => (e.value = ''));
await d.type('[name=url]', 'https://example.ca/');
await d.type('[name=telephone]', '+1-416-555-0100');
await d.type('[name=city]', 'Vaughan');
const sc2 = await d.evaluate(() => document.querySelector('[data-out]').textContent);
let parsed = null;
try { parsed = JSON.parse(sc2.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '')); } catch {}
ok('schema: empty until name and URL are valid, then emits parseable JSON-LD', sc0 === '' && sc1.err.includes('https://') && parsed?.['@type'] === 'LocalBusiness' && parsed.address?.addressLocality === 'Vaughan' && parsed.telephone, sc1.err);
await d.screenshot({ path: join(SHOTS, 'tool-schema-desktop.png') });

await d.goto(BASE + '/tools/llms-txt-generator/', { waitUntil: 'networkidle0' });
await d.type('[data-name]', 'Example Plumbing');
await d.type('[data-sum]', 'Licensed plumbers in Vaughan.');
await d.type('[data-links]', 'Services | https://example.ca/services/ | What we do\nBad line');
const ll = await d.evaluate(() => ({ out: document.querySelector('[data-out]').textContent, err: document.querySelector('[data-err]').textContent }));
ok('llms.txt: builds the file and flags a malformed link line', ll.out.startsWith('# Example Plumbing') && ll.out.includes('> Licensed plumbers') && ll.out.includes('- [Services](https://example.ca/services/): What we do') && ll.err.includes('Line 2'), ll.err);
await d.screenshot({ path: join(SHOTS, 'tool-llms-desktop.png') });

await d.goto(BASE + '/tools/utm-builder/', { waitUntil: 'networkidle0' });
await d.type('[data-f=url]', 'https://example.ca/offer/');
await d.type('[data-f=source]', 'Facebook Ads');
await d.type('[data-f=medium]', 'paid');
await d.type('[data-f=campaign]', 'spring-launch');
const u1 = await d.evaluate(() => ({ out: document.querySelector('[data-out]').textContent, err: document.querySelector('[data-e=source]').textContent }));
await d.click('[data-fix]');
const u2 = await d.evaluate(() => document.querySelector('[data-out]').textContent);
ok('utm: rejects "Facebook Ads", offers a fix, then builds a lowercase link', u1.out === '' && /lowercase|spaces/.test(u1.err) && u2 === 'https://example.ca/offer/?utm_source=facebook-ads&utm_medium=paid&utm_campaign=spring-launch', u2);
await d.screenshot({ path: join(SHOTS, 'tool-utm-desktop.png') });

await d.goto(BASE + '/tools/ai-visibility-check/', { waitUntil: 'networkidle0' });
await d.screenshot({ path: join(SHOTS, 'tool-check-desktop.png') });

/* 6. Demos */
await d.goto(BASE + '/apps/', { waitUntil: 'networkidle0' });
await d.click('[data-days] button[data-d="5"]');
await d.click('[data-slots] button[data-t="11:30"]');
const cal = await d.evaluate(() => ({ out: document.querySelector('[data-cal] [data-out]').textContent, full: document.querySelector('[data-days] button[data-d="3"]').disabled }));
ok('calendar demo: full day disabled, pick shows a Demo-only readout', cal.full && /Demo only.*day 5 at 11:30/.test(cal.out), cal.out);
await d.click('[data-board] [data-id="T1"]');
await d.click('[data-board] [data-lane="Driver 1"]');
await d.click('[data-board] [data-id="T2"]');
await d.click('[data-board] [data-lane="Driver 1"]');
const bd = await d.evaluate(() => ({ out: document.querySelector('[data-board] [data-out]').textContent, bad: document.querySelector('[data-board] [data-out]').classList.contains('bad') }));
ok('dispatch demo: double-booking is blocked with an explanation', bd.bad && /Blocked: Driver 1/.test(bd.out), bd.out);
await d.screenshot({ path: join(SHOTS, 'apps-desktop.png'), fullPage: true });

/* 6b. Regression checks from the QA round */
// B2: a double tap must not skip a question
await d.goto(BASE + '/tools/ai-visibility-check/', { waitUntil: 'networkidle0' });
await d.evaluate(() => sessionStorage.clear());
await d.reload({ waitUntil: 'networkidle0' });
await d.click('[data-check] .opt[data-v="yes"]', { count: 2, delay: 20 });
await new Promise((r) => setTimeout(r, 500));
const dt = await d.evaluate(() => ({ step: document.querySelector('[data-step]').textContent, run: document.querySelector('[data-run]').textContent }));
ok('check: double tap answers once and advances once (Question 2 of 8)', dt.step === 'Question 2 of 8' && dt.run === '2 of 2 so far', JSON.stringify(dt));
// same tick, so the 200 ms advance cannot fire between the two clicks
await d.evaluate(() => { document.querySelector('[data-check] .opt[data-v="no"]').click(); document.querySelector('[data-back]').click(); });
await new Promise((r) => setTimeout(r, 500));
const bk = await d.evaluate(() => document.querySelector('[data-step]').textContent);
ok('check: Back cancels the pending advance', bk === 'Question 1 of 8', bk);
for (let i = 0; i < 8; i++) { await d.click('[data-check] .opt[data-v="yes"]'); await new Promise((r) => setTimeout(r, 260)); }
const fin = await d.evaluate(() => ({ score: document.querySelector('[data-score]').textContent, stored: sessionStorage.getItem('fw-check') }));
ok('check: finishes once with the right score', fin.score.startsWith('16') && fin.stored.includes('16/16'), fin.score);
await d.click('[data-restart]');
const rs = await d.evaluate(() => ({ stored: sessionStorage.getItem('fw-check') }));
ok('check: Restart clears the stored result', rs.stored === null);
await d.goto(BASE + '/', { waitUntil: 'networkidle0' });
await d.evaluate(() => sessionStorage.clear());
await d.reload({ waitUntil: 'networkidle0' });
for (let i = 0; i < 8; i++) { await d.click('[data-check] .opt[data-v="no"]'); await new Promise((r) => setTimeout(r, 260)); }
await d.click('[data-restart]');
const hr = await d.evaluate(() => ({ score: document.querySelector('#apply-form [name=score]').value, fixes: document.querySelector('#apply-form [name=fixes]').value, note: document.querySelector('#apply-form [data-score-note]').hidden }));
ok('home: Restart clears the apply form hidden fields and note', hr.score === '' && hr.fixes === '' && hr.note, JSON.stringify(hr));

// S4 / S5: robots path normalisation and linear matching
await d.goto(BASE + '/tools/robots-txt-checker/', { waitUntil: 'networkidle0' });
await d.click('[data-example]');
await d.$eval('[data-path]', (e) => (e.value = 'https://example.ca/account?x=1'));
await d.evaluate(() => document.querySelector('[data-path]').dispatchEvent(new Event('input')));
const np = await d.evaluate(() => ({ head: document.querySelector('[data-pathhead]').textContent, cla: [...document.querySelectorAll('[data-rows] tr')].find((t) => t.textContent.includes('PerplexityBot')).children[3].textContent.trim() }));
ok('robots: a full URL is normalised to its path and tested', np.head === '/account?x=1' && np.cla === 'Blocked', JSON.stringify(np));
const t0 = Date.now();
await d.$eval('[data-input]', (e) => (e.value = 'User-agent: *\nDisallow: /*a*a*a*a*a*a*a*a*a*a*b\n'));
await d.$eval('[data-path]', (e) => (e.value = '/' + 'a'.repeat(40)));
await d.evaluate(() => document.querySelector('[data-input]').dispatchEvent(new Event('input')));
ok('robots: ten wildcards against a 40-char path answers in well under a second', Date.now() - t0 < 1000, `${Date.now() - t0}ms`);

// S6: UTM refuses to overwrite existing tags and keeps other params' encoding
await d.goto(BASE + '/tools/utm-builder/', { waitUntil: 'networkidle0' });
await d.type('[data-f=url]', 'https://example.ca/o/?c=a%20b&utm_source=old');
await d.type('[data-f=source]', 'news'); await d.type('[data-f=medium]', 'email'); await d.type('[data-f=campaign]', 'x');
const uo = await d.evaluate(() => ({ out: document.querySelector('[data-out]').textContent, err: document.querySelector('[data-e=url]').textContent }));
ok('utm: existing UTM tags are flagged and nothing is overwritten', uo.out === '' && /already has UTM/.test(uo.err), uo.err);
await d.$eval('[data-f=url]', (e) => (e.value = 'https://example.ca/o/?c=a%20b#top'));
await d.evaluate(() => document.querySelector('[data-f=url]').dispatchEvent(new Event('input', { bubbles: true })));
const ue = await d.evaluate(() => document.querySelector('[data-out]').textContent);
ok('utm: other params keep their encoding and tags land before the fragment', ue === 'https://example.ca/o/?c=a%20b&utm_source=news&utm_medium=email&utm_campaign=x#top', ue);

// S7: schema output cannot end its own script tag, and bad numbers are refused
await d.goto(BASE + '/tools/schema-generator/', { waitUntil: 'networkidle0' });
await d.type('[name=name]', 'Acme </script><script>alert(1)</script>');
await d.type('[name=url]', 'https://example.ca/');
const sx = await d.evaluate(() => document.querySelector('[data-out]').textContent);
const closers = (sx.match(/<\/script>/g) || []).length;
ok('schema: a typed closing script tag is escaped in the output', closers === 1 && sx.includes('<\\/script>'), `${closers} real closers`);
const sx2 = await d.evaluate(() => document.querySelector('[data-state]').textContent);
ok('schema: name and URL alone is a draft, not "Looks valid"', /Draft only/.test(sx2), sx2);
await d.click('input[name="sc-mode"][value="service"]');
await d.type('[name=price]', '1e999');
const pr = await d.evaluate(() => ({ err: document.querySelector('[data-err=price]').textContent, out: document.querySelector('[data-out]').textContent.includes('minPrice') }));
ok('schema: 1e999 is rejected and emits no price', /plain number/.test(pr.err) && !pr.out, pr.err);

// S1: phone menu
const mp = await newPage(390, 844, 1);
await mp.goto(BASE + '/', { waitUntil: 'networkidle0' });
await mp.click('.menu summary');
await new Promise((r) => setTimeout(r, 150)); // the details toggle event is asynchronous
const inert = await mp.evaluate(() => document.querySelector('main').inert);
await mp.keyboard.press('Escape');
const closed = await mp.evaluate(() => ({ open: document.querySelector('.menu').open, inert: document.querySelector('main').inert, focus: document.activeElement.tagName }));
ok('menu: open makes the page inert; Escape closes, releases it and refocuses Menu', inert === true && closed.open === false && closed.inert === false && closed.focus === 'SUMMARY', JSON.stringify(closed));

// heading order and title length on every real page
for (const r of routes.filter((x) => !x.includes('missing'))) {
  await seoPage.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  const h = await seoPage.evaluate(() => { const lv = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((e) => +e.tagName[1]); let bad = null; lv.forEach((l, i) => { if (i && l > lv[i - 1] + 1 && !bad) bad = `h${lv[i - 1]} to h${l}`; }); return { bad, t: document.title.length }; });
  ok(`headings and title ${r}`, !h.bad && h.t <= 62, h.bad ?? `${h.t}c`);
}

/* 7. Screenshots of key pages */
const shot = async (page, path, name, full = true) => {
  console.log('shot', path);
  await page.goto(BASE + path, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { document.querySelectorAll('[data-ill]').forEach((e) => e.classList.add('in')); window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 250)); window.scrollTo(0, 0); });
  await new Promise((r) => setTimeout(r, 1300));
  await page.screenshot({ path: join(SHOTS, name), fullPage: full });
};
const pages = [['/services/', 'services'], ['/services/ai-visibility/', 'service-ai-visibility'], ['/work/', 'work'], ['/work/tour-operator/', 'case'], ['/tools/', 'tools'], ['/notes/', 'notes'], ['/notes/robots-txt-blocking-ai-crawlers-exposes-admin/', 'article'], ['/about/', 'about'], ['/web-design-vaughan/', 'web-design-vaughan'], ['/web-design-york-region/', 'web-design-york-region'], ['/404-check-missing-page/', '404']];
for (const [p, n] of pages) await shot(d, p, `${n}-desktop.png`);
await d.goto(BASE + '/tools/ai-visibility-check/', { waitUntil: 'networkidle0' });
const ph = await newPage(390, 844, 2);
await shot(ph, '/', 'home-phone.png');
await ph.goto(BASE + '/', { waitUntil: 'networkidle0' });
await ph.screenshot({ path: join(SHOTS, 'home-phone-fold.png') });
await ph.click('.menu summary');
await new Promise((r) => setTimeout(r, 300));
await ph.screenshot({ path: join(SHOTS, 'home-phone-menu.png') });
for (const [p, n] of [['/services/', 'services'], ['/work/tour-operator/', 'case'], ['/tools/', 'tools'], ['/tools/robots-txt-checker/', 'tool-robots'], ['/notes/robots-txt-blocking-ai-crawlers-exposes-admin/', 'article'], ['/about/', 'about'], ['/apply/', 'apply'], ['/404-check-missing-page/', '404']]) await shot(ph, p, `${n}-phone.png`);

/* 8. JS off: tools and the check say so instead of showing a broken widget */
const nojs = await newPage(1280, 800);
await nojs.setJavaScriptEnabled(false);
await nojs.goto(BASE + '/tools/robots-txt-checker/', { waitUntil: 'networkidle0' });
const nj = await nojs.evaluate(() => ({ msg: getComputedStyle(document.querySelector('.nojs-msg')).display, panel: getComputedStyle(document.querySelector('.needs-js')).display, text: document.querySelector('.nojs-msg').textContent.trim().slice(0, 60) }));
ok('no-JS: tool page shows a clear message, not the broken widget', nj.msg !== 'none' && nj.panel === 'none', nj.text);
await nojs.screenshot({ path: join(SHOTS, 'tool-robots-nojs.png') });
await nojs.goto(BASE + '/', { waitUntil: 'networkidle0' });
const nj2 = await nojs.evaluate(() => document.querySelectorAll('.nojs-msg ol li').length);
ok('no-JS: home check falls back to the eight questions', nj2 === 8, String(nj2));
await nojs.screenshot({ path: join(SHOTS, 'home-nojs.png') });
const flow = await nojs.evaluate(() => { const p = document.querySelector('.flow .draw'); return p ? getComputedStyle(p).strokeDashoffset : 'none'; });
ok('no-JS: illustrations are fully drawn', flow === '0px' || flow === 'none' || flow === '0', flow);

/* 9. Static assets the SEO plan promises */
for (const [path, needle] of [['/robots.txt', 'Allow: /'], ['/llms.txt', '# ForwardWeb'], ['/rss.xml', '<rss'], ['/sitemap-index.xml', 'sitemap'], ['/api/lead.php', '']]) {
  const r = await fetch(BASE + path, { method: path.includes('lead') ? 'POST' : 'GET' });
  const t = await r.text();
  ok(`asset ${path}`, r.ok && t.includes(needle));
}
const robots = await (await fetch(BASE + '/robots.txt')).text();
ok('robots.txt names no individual AI bot', !/GPTBot|ClaudeBot|PerplexityBot|Google-Extended|CCBot/i.test(robots));

await browser.close();
server.close();
console.log('\nconsole/network problems:', consoleProblems.length ? '\n' + consoleProblems.join('\n') : 'none');
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length || consoleProblems.length ? 1 : 0);
