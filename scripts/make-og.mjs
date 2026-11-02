// Generates the static 1200x630 Open Graph images into public/og/.
// Run by hand when a title changes: `npm run og`. The PNGs are committed, so a normal build never needs a browser.
// Uses the self-hosted Fontsource files, so nothing is fetched from the network.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { TOOL_PAGES } from '../src/data/tools.ts';

const require = createRequire(import.meta.url);
// Puppeteer lives in the monorepo's workspace/node_modules, not in this project.
const puppeteer = require('../../node_modules/puppeteer');

const font = (pkg, file) => readFileSync(new URL(`../node_modules/@fontsource/${pkg}/files/${file}.woff2`, import.meta.url)).toString('base64');
const sans600 = font('schibsted-grotesk', 'schibsted-grotesk-latin-600-normal');
const sans700 = font('schibsted-grotesk', 'schibsted-grotesk-latin-700-normal');
const serifI = font('source-serif-4', 'source-serif-4-latin-400-italic');
const serif600i = font('source-serif-4', 'source-serif-4-latin-600-italic');

const card = ({ kicker, title, deck }) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:S;font-weight:600;src:url(data:font/woff2;base64,${sans600})}
@font-face{font-family:S;font-weight:700;src:url(data:font/woff2;base64,${sans700})}
@font-face{font-family:F;font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${serifI})}
@font-face{font-family:F;font-style:italic;font-weight:600;src:url(data:font/woff2;base64,${serif600i})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0F3A2D;color:#F3EFE6;font-family:S;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.logo{font:700 40px S;letter-spacing:-.015em}.logo span{font:italic 600 43px F;color:#F1B542;margin-left:2px}
.kick{font:600 26px S;color:#B6CBC1;margin-bottom:18px}
h1{font:600 76px/1.04 S;letter-spacing:-.022em;max-width:980px}
.deck{font:italic 400 34px/1.4 F;color:#B6CBC1;margin-top:24px;max-width:900px}
.foot{display:flex;justify-content:space-between;align-items:center;font:600 26px S;color:#B6CBC1}
.bar{width:64px;height:6px;background:#F1B542;border-radius:3px}
</style><body><div class="logo">Forward<span>web</span></div><div><div class="kick">${kicker}</div><h1>${title}</h1>${deck ? `<p class="deck">${deck}</p>` : ''}</div><div class="foot"><div class="bar"></div><div>forwardweb.ca</div></div></body>`;

const base = {
  default: { kicker: 'Web products, made findable', title: 'Found on Google. Named by ChatGPT.', deck: 'Websites, search and AI visibility from Vaughan, Ontario.' },
  services: { kicker: 'Services', title: 'Six services. One person. Prices up front.' },
  work: { kicker: 'Work', title: 'Proof, in three kinds.', deck: 'A case study, apps in development and free tools.' },
  case: { kicker: 'Case study', title: 'From almost no traffic to a top source of bookings', deck: 'Found by Google and by AI assistants.' },
  tools: { kicker: 'Free tools', title: 'Free tools. No signup. Nothing sent.', deck: 'Everything runs in your browser.' },
  notes: { kicker: 'Notes', title: 'Notes from the bench.', deck: 'What I test on my own sites, with dates.' },
  about: { kicker: 'About', title: 'One person, accountable for the result.', deck: 'Maksut Ozcan, Vaughan, Ontario.' },
  'note-how-to': { kicker: 'Notes / How-to', title: 'Step by step, with the method I use.' },
  'note-test': { kicker: 'Notes / Test', title: 'Things I ran and measured.' },
  'note-buying': { kicker: 'Notes / Buying', title: 'Cost, choosing, and what to ask.' },
  'note-news': { kicker: 'Notes / News', title: 'Dated and labelled.' },
};
for (const t of TOOL_PAGES) base[`tool-${t.slug}`] = { kicker: `Free tool / ${t.name}`, title: t.h1, deck: t.tag };

mkdirSync(new URL('../public/og/', import.meta.url), { recursive: true });
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
for (const [name, c] of Object.entries(base)) {
  await page.setContent(card(c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  writeFileSync(new URL(`../public/og/${name}.png`, import.meta.url), png);
}
await browser.close();
console.log('wrote', Object.keys(base).length, 'images to public/og/', pathToFileURL('public/og/').href);
