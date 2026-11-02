// Illustration geometry. Ported from mockups/r5/ill.cjs, which stays the visual reference.
/* ForwardWeb illustration system: hand-built SVG, one language.
   Rules: stroke 2 (diagram) / 1.75 (glyph) / 1.25 dashed hairline; round caps and joins;
   one amber accent per graphic; serif italic annotations; nothing from an icon pack. */
const SVG = (vb: string, inner: string, label?: string, cls = ""): string => `<svg class="ill ${cls}" ${cls.includes("chartill") ? "data-ill " : ""}viewBox="${vb}" ${label ? `role="img" aria-label="${label}"` : "aria-hidden=\"true\" focusable=\"false\""}>${inner}</svg>`;
const rng = (seed: string | number) => { let h = 2166136261; for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; };
const D = (d: string, c = "", extra = "") => `<path class="${c}" d="${d}" ${extra}/>`;
const dr = (d: string, i = 0) => `<path class="draw" pathLength="1" style="--d:${i * 0.12}s" d="${d}"/>`;
const loop = (cx: number, cy: number, rx: number, ry: number, seed = 1) => { const r = rng(seed); const pts: string[] = []; const n = 28, sweep = 2 * Math.PI * 1.07, a0 = -0.5 + r() * 0.3; for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + sweep * t, k = 1 + 0.045 * Math.sin(t * 5 + seed) + t * 0.05; pts.push(`${(cx + rx * k * Math.cos(a)).toFixed(1)} ${(cy + ry * k * Math.sin(a)).toFixed(1)}`); } return 'M' + pts.join(' L'); };

/* ---- 1. How an assistant decides who to name: four small diagrams, one per step ---- */
const flow = {
  ask: SVG('0 0 260 150', `
    ${dr('M40 22h150a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14H92l-24 20v-20H40a14 14 0 0 1-14-14V36a14 14 0 0 1 14-14z', 0)}
    <path class="hl" d="M44 42h88M44 56h58"/><path class="acc" d="M108 56h2"/>
    <circle cx="198" cy="116" r="9"/><path d="M180 144c2-14 9-20 18-20s16 6 18 20"/>
    <path class="dash" d="M150 44l28 0"/>`, 'Step one: a person asks an assistant a question.'),
  crawl: SVG('0 0 260 150', `
    <circle cx="44" cy="76" r="10"/><path d="M34 70l-12-12M34 76H18M34 82l-12 12M54 70l12-12M54 82l12 12"/>
    ${dr('M104 24v40M104 90v36', 1)}<path d="M96 64h16M96 90h16"/>
    <path class="dash" d="M58 76h38M112 76h30"/>
    <rect x="148" y="26" width="48" height="34" rx="5"/><path class="hl" d="M156 38h24M156 47h32"/>
    <rect x="148" y="68" width="48" height="34" rx="5"/><path class="hl" d="M156 80h24M156 89h32"/>
    <rect x="148" y="110" width="48" height="26" rx="5" class="dashbox"/>
    <path d="M206 80l8 8 16-18"/>
    <text x="84" y="146" class="lb">robots.txt</text>`, 'Step two: a crawler can only read pages that robots.txt lets it into.'),
  weigh: SVG('0 0 260 150', `
    <rect x="30" y="18" width="150" height="30" rx="6"/><path class="hl" d="M42 33h60"/><path d="M152 33l7 7 12-14"/>
    <rect x="30" y="58" width="150" height="30" rx="6"/><path class="hl" d="M42 73h72"/><path d="M152 73l7 7 12-14"/>
    <rect x="30" y="98" width="150" height="30" rx="6" class="acc"/><path class="hl" d="M42 113h48"/><path class="acc" d="M152 113l7 7 12-14"/>
    <text x="190" y="38" class="lb">schema</text><text x="190" y="78" class="lb">reviews</text><text x="190" y="118" class="lb">your page</text>`, 'Step three: the assistant weighs sources it can verify: structured data, reviews and your own page.'),
  answer: SVG('0 0 260 150', `
    <rect x="26" y="16" width="190" height="82" rx="10"/>
    <path class="hl" d="M42 36h120M42 52h150M42 68h96"/>
    <rect x="40" y="108" width="34" height="22" rx="11" class="acc"/><text x="49" y="124" class="lb">[1]</text>
    <rect x="84" y="108" width="112" height="22" rx="11"/><text x="96" y="124" class="lb">yourbusiness.ca</text>
    <path class="dash" d="M57 98v10"/>`, 'Step four: the answer names the business it trusts and cites it.')
};

/* ---- 2. Service glyphs (48 grid, 1.75 stroke) ---- */
const gl = (inner: string, label?: string) => SVG('0 0 48 48', inner, label, 'gl');
const glyph = {
  ai: gl(`<path d="M10 8h22a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5H21l-9 8v-8h-2a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z"/><path class="hl" d="M13 17h14M13 23h9"/><circle cx="38" cy="36" r="6" class="acc"/><path class="acc" d="M35 36l2 2 4-5"/>`),
  seo: gl(`<circle cx="20" cy="20" r="12"/><path d="M29 29l11 11"/><path class="hl" d="M13 15h12M13 20h8M13 25h10"/><circle cx="11" cy="15" r="1.6" class="accf"/>`),
  web: gl(`<rect x="4" y="9" width="40" height="30" rx="5"/><path d="M4 17h40"/><circle cx="9" cy="13" r=".9" class="accf"/><path class="hl" d="M10 24h16M10 29h10"/><rect x="29" y="24" width="11" height="8" rx="3" class="acc"/>`),
  app: gl(`<rect x="4" y="9" width="40" height="30" rx="5"/><path d="M17 9v30"/><path class="hl" d="M9 17h4M9 23h4M9 29h4"/><rect x="22" y="15" width="7" height="7" rx="1.5"/><rect x="32" y="15" width="7" height="7" rx="1.5" class="acc"/><rect x="22" y="26" width="7" height="7" rx="1.5"/><rect x="32" y="26" width="7" height="7" rx="1.5"/>`),
  dash: gl(`<path d="M6 40h36M6 8v32"/><rect x="11" y="27" width="7" height="13" rx="1.5"/><rect x="22" y="20" width="7" height="20" rx="1.5"/><rect x="33" y="12" width="7" height="28" rx="1.5"/><circle cx="36.5" cy="8" r="2.4" class="accf"/>`),
  auto: gl(`<circle cx="12" cy="14" r="6"/><rect x="28" y="28" width="14" height="12" rx="3"/><path d="M18 16c8 0 12 4 14 10"/><path d="M29 22l3 4 4-3"/><path class="dash" d="M12 21c0 10 6 14 14 14"/><circle cx="24" cy="20" r="2" class="accf"/>`)
};
/* process glyphs (64 grid) */
const pg = (inner: string) => SVG('0 0 64 64', inner, '', 'pgl');
const proc = {
  audit: pg(`<rect x="12" y="8" width="34" height="46" rx="5"/><path class="hl" d="M20 20h18M20 28h14M20 36h10"/><circle cx="44" cy="42" r="10" class="acc"/><path d="M51 49l9 9"/>`),
  plan: pg(`<path d="M10 52c10-4 8-18 20-18s12-14 22-18"/><circle cx="10" cy="52" r="3"/><path d="M52 16V6l12 4-12 4" class="acc"/><path class="dash" d="M30 34c0 8 8 10 14 10"/>`),
  build: pg(`<rect x="8" y="34" width="22" height="22" rx="4"/><rect x="34" y="34" width="22" height="22" rx="4"/><rect x="21" y="8" width="22" height="22" rx="4" class="acc"/>`),
  measure: pg(`<path d="M8 54h48M8 10v44"/><path d="M14 44l12-10 10 6 16-24"/><circle cx="52" cy="16" r="4" class="acc"/>`)
};

/* ---- 5. Tool thumbnails (160 x 90) ---- */
const tth = (inner: string, label?: string) => SVG('0 0 160 90', inner, label, 'tth');
const tool = {
  robots: tth(`<circle cx="14" cy="16" r="5"/><circle cx="14" cy="34" r="5"/><circle cx="14" cy="52" r="5"/><circle cx="14" cy="70" r="5" class="acc"/>
    <path d="M78 8v26M78 52v30"/><path class="dash" d="M20 16h52M20 34h52M20 70h52"/><path d="M84 70h60" class="acc"/><path d="M150 70l-6-5M150 70l-6 5" class="acc"/><path class="hl" d="M22 52h54"/><path d="M60 46l-8 6 8 6"/>`, 'Diagram: robots.txt works like a filter. Some crawlers are turned back, one passes through its own door.'),
  snippet: tth(`<circle cx="14" cy="14" r="6"/><path class="hl" d="M26 12h46"/><path d="M14 34h110"/><path class="hl" d="M14 50h132M14 60h104"/><path class="dash" d="M14 78h130"/><path d="M14 74v8M144 74v8"/><path class="acc" d="M70 34h54"/>`, 'Diagram: a search result with a pixel ruler under the title.'),
  schema: tth(`<circle cx="80" cy="45" r="13" class="acc"/><circle cx="24" cy="18" r="8"/><circle cx="136" cy="18" r="8"/><circle cx="24" cy="72" r="8"/><circle cx="136" cy="72" r="8"/><path d="M32 22l37 15M128 22L91 37M32 68l37-15M128 68L91 53"/>`, 'Diagram: a business at the centre of a node graph with service, address and review nodes.'),
  utm: tth(`<rect x="4" y="8" width="152" height="28" rx="14"/><path class="hl" d="M18 22h30"/><path d="M56 22h2M68 22h2M96 22h2M122 22h2"/><path d="M6 46v6h48v-6M60 46v6h46v-6"/><path class="acc" d="M112 46v6h44v-6"/><text x="8" y="72" class="lb">source</text><text x="62" y="72" class="lb">medium</text><text x="114" y="72" class="lb">campaign</text>`, 'Diagram: a link broken into source, medium and campaign parts.'),
  check: tth(`<path d="M12 80V50M30 80V30M48 80V58M66 80V22M84 80V44M102 80V62M120 80V34" /><path class="acc" d="M138 80V12"/><path class="hl" d="M6 80h148"/>`, 'Diagram: eight meters of different heights, one highlighted.'),
  llms: tth(`<path d="M34 8h60l22 22v52H34z"/><path d="M94 8v22h22"/><path class="hl" d="M44 40h34M44 50h52M44 60h40"/><path class="acc" d="M44 72h28"/>`, 'Diagram: a plain text file with a heading and a list of links.')
};

/* ---- 7. Deterministic note covers: category + slug -> pattern (400 x 240) ---- */
function cover(cat: string, slug: string, tone: "dark" | "light"): string {
  const r = rng(cat + slug); const dark = tone === 'dark';
  const bg = dark ? 'var(--pine-2)' : 'var(--paper-2)'; const fg = dark ? 'var(--paper)' : 'var(--ink)';
  let g = '';
  if (cat === 'How-to') { const n = 4 + Math.floor(r() * 3); let d = 'M24 208'; let x = 24, y = 208; const w = (352 / n); for (let i = 0; i < n; i++) { const h = 16 + r() * 12; d += `h${w.toFixed(0)}v-${h.toFixed(0)}`; x += w; y -= h; } g = `<path d="${d}"/>`; g += `<path class="dash" d="M24 208L${x} ${Math.max(y, 40)}"/><circle cx="${(24 + w * (n - 1)).toFixed(0)}" cy="${Math.max(y, 40) + 0}" r="6" class="accf"/>`; }
  if (cat === 'Test') { const cols = 8, rows = 4, hit = Math.floor(r() * cols * rows); for (let i = 0; i < cols * rows; i++) { const cx = 40 + (i % cols) * 46, cy = 44 + Math.floor(i / cols) * 50; const on = r() > 0.55; g += i === hit ? `<circle cx="${cx}" cy="${cy}" r="11" class="accf"/>` : `<circle cx="${cx}" cy="${cy}" r="9" ${on ? `style="fill:currentColor"` : ''}/>`; } }
  if (cat === 'Buying') { g = `<path d="M24 150h352"/>`; for (let i = 0; i <= 22; i++) g += `<path class="hl" d="M${24 + i * 16} 150v${i % 5 === 0 ? 16 : 8}"/>`; const a = 60 + r() * 100, b = a + 80 + r() * 100; g += `<path d="M${a} 120v22M${b} 120v22M${a} 130h${(b - a).toFixed(0)}"/><circle cx="${((a + b) / 2).toFixed(0)}" cy="130" r="7" class="accf"/>`; g += `<path class="hl" d="M24 60h120M24 78h86M24 96h104"/>`; }
  if (cat === 'News') { for (let c = 0; c < 3; c++) { const x = 28 + c * 122; g += `<path d="M${x} 36h104"/>`; for (let l = 0; l < 7; l++) g += `<path class="hl" d="M${x} ${56 + l * 22}h${(60 + r() * 44).toFixed(0)}"/>`; } g += `<rect x="28" y="30" width="30" height="12" rx="3" class="accf"/>`; }
  return SVG('0 0 400 240', `<rect width="400" height="240" fill="${bg}" stroke="none"/><g style="color:${fg}">${g}</g>`, '', 'cover');
}

/* ---- annotation on screenshots (viewBox 160x100 = the 16:10 capture) ---- */
function annot(list: Annotation[]): string {
  let s = '', chips = '';
  list.forEach((a, i) => {
    const d = loop(a.cx * 1.6, a.cy, a.rx * 1.6, a.ry, i + a.cx);
    s += `<path d="${d}" class="under"/><path d="${d}" class="ring"/>`;
    const px = a.nx * 1.6, py = a.ny, dx = px - a.cx * 1.6, dy = py - a.cy; const k = 1 / Math.hypot(dx / (a.rx * 1.6 * 1.08), dy / (a.ry * 1.08));
    const ex = a.cx * 1.6 + dx * k, ey = a.cy + dy * k;
    s += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} Q${((px + ex) / 2 + 4).toFixed(1)} ${((py + ey) / 2 - 4).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" class="lead"/>`;
    chips += `<span class="chip" style="left:${a.nx}%;top:${a.ny}%">${a.note}</span>`;
  });
  return `<svg class="annot" viewBox="0 0 160 100" aria-hidden="true" focusable="false">${s}</svg>${chips}`;
}

/* ---- case chart v5: hatch area, annotated stages ---- */
const chart = (an = true): string => SVG('0 0 640 330', `
  <defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v7" stroke="#0F3A2D" stroke-width="1" opacity=".38"/></pattern></defs>
  <g class="hl" stroke="#17201C" opacity=".22"><path d="M44 28H620M44 88H620M44 148H620M44 208H620"/></g><path d="M44 268H620" stroke-width="1.5"/><path d="M44 20V268" stroke-width="1.5"/>
  <g class="ax"><text x="0" y="272">1&times;</text><text x="0" y="212">5&times;</text><text x="0" y="152">10&times;</text><text x="0" y="92">15&times;</text><text x="0" y="32">20&times;</text><text x="44" y="296" class="ax2">start</text><text x="568" y="296" class="ax2">now</text></g>
  <path class="area" fill="url(#hatch)" stroke="none" d="M44 266 C140 264 204 258 284 244 S 404 208 464 158 S 564 58 620 28 V268 H44Z"/>
  <path class="line draw" pathLength="1" d="M44 266 C140 264 204 258 284 244 S 404 208 464 158 S 564 58 620 28"/>
  <circle class="mkk" cx="44" cy="266" r="7"/><circle class="mkk" cx="284" cy="244" r="7"/><circle class="mkk" cx="464" cy="158" r="7"/><circle class="mkk" cx="620" cy="28" r="7"/>
  ${an ? `<g class="an"><path class="lead" d="M60 250c6-26 14-34 30-40"/><text x="76" y="202">measurement set up first</text>
  <path class="lead" d="M284 230c-4-26-2-44 6-56"/><text x="222" y="160">technical fixes shipped</text>
  <path class="lead" d="M464 144c-8-26-10-40-8-52"/><text x="340" y="82">content on a schedule</text>
  <path class="lead" d="M318 40C400 44 520 40 606 30"/><text x="72" y="44">AI crawlers opened, referrals tracked</text></g>` : ''}`, 'Line chart on a relative scale: organic traffic rises more than twenty times across four stages.', 'chartill');

/* ---- 404 delight: an empty search result ---- */
const empty404 = SVG('0 0 520 300', `
  <circle cx="64" cy="56" r="10"/><path class="hl" d="M90 52h120"/><path d="M40 98h300"/><path class="hl" d="M40 124h400M40 142h340"/>
  <rect x="40" y="176" width="440" height="92" rx="12" class="dashbox"/><text x="62" y="228" class="an big">a page was meant to be here</text>
  <circle cx="430" cy="226" r="18"/><path d="M443 239l16 16"/><path class="acc" d="M424 220c0-8 12-8 12 0 0 6-6 5-6 11"/><circle cx="430" cy="236" r="1.6" class="accf"/>
  <text x="352" y="62" class="lb">0 results</text>`, 'An empty search result: no page was found.', 'big404');

export { SVG, rng, flow, glyph, proc, tool, cover, annot, chart, empty404, loop, D, dr };

/** One hand-circled area on a 160 x 100 screenshot capture, with its serif note. */
export interface Annotation { cx: number; cy: number; rx: number; ry: number; nx: number; ny: number; note: string }
