// Zero-dependency static build: mirror the site into dist/.
// The repo IS the deployable site (flat files served from root). This build
// exists only so build-based deploy platforms (which expect an output dir)
// have one — `npm run build` -> dist/ with the exact same structure.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';

const OUT = 'dist';
const ITEMS = [
  'index.html', '404.html',
  'assets', 'about', 'contact', 'portfolio', 'services',
  'web-design-vaughan', 'web-design-woodbridge', 'web-design-maple',
  'web-design-thornhill', 'web-design-richmond-hill', 'web-design-markham',
  'robots.txt', 'sitemap.xml', 'site.webmanifest', '.htaccess',
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const item of ITEMS) {
  if (!existsSync(item)) { console.warn(`skip (missing): ${item}`); continue; }
  cpSync(item, `${OUT}/${item}`, { recursive: true });
}
console.log(`Built ${ITEMS.length} items into ${OUT}/`);
