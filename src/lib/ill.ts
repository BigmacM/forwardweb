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
    <path d="M84 6v56M84 78v6"/><path class="dash" d="M20 16h56M20 34h56M20 52h56"/><path class="hl" d="M74 12l6 8M80 12l-6 8M74 30l6 8M80 30l-6 8M74 48l6 8M80 48l-6 8"/>
    <path class="acc" d="M20 70h100"/><path class="acc" d="M120 70l-6-5M120 70l-6 5"/>
    <rect x="128" y="48" width="28" height="36" rx="4"/><path class="hl" d="M134 58h16M134 66h12M134 74h14"/>`, 'Diagram: robots.txt works like a wall. Three crawlers are stopped, one passes through the gap and reaches your page.'),
  snippet: tth(`<circle cx="14" cy="14" r="6"/><path class="hl" d="M26 12h46"/><path d="M14 34h110"/><path class="hl" d="M14 50h132M14 60h104"/><path class="dash" d="M14 78h130"/><path d="M14 74v8M144 74v8"/><path class="acc" d="M70 34h54"/>`, 'Diagram: a search result with a pixel ruler under the title.'),
  schema: tth(`<circle cx="80" cy="45" r="13" class="acc"/><circle cx="24" cy="18" r="8"/><circle cx="136" cy="18" r="8"/><circle cx="24" cy="72" r="8"/><circle cx="136" cy="72" r="8"/><path d="M32 22l37 15M128 22L91 37M32 68l37-15M128 68L91 53"/>`, 'Diagram: a business at the centre of a node graph with service, address and review nodes.'),
  utm: tth(`<rect x="4" y="8" width="152" height="28" rx="14"/><path class="hl" d="M18 22h30"/><path d="M56 22h2M68 22h2M96 22h2M122 22h2"/><path d="M6 46v6h48v-6M60 46v6h46v-6"/><path class="acc" d="M112 46v6h44v-6"/><g text-anchor="middle" style="font-size:10px"><text x="30" y="70" class="lb" style="font-size:10px">source</text><text x="83" y="70" class="lb" style="font-size:10px">medium</text><text x="134" y="70" class="lb" style="font-size:10px">campaign</text></g>`, 'Diagram: a link broken into source, medium and campaign parts.'),
  check: tth(`<path d="M24 80a56 56 0 0 1 112 0"/>
    <path class="hl" d="M18 80h-6M80 18v-6M36.2 36.2l-4.3-4.3M123.8 36.2l4.3-4.3M142 80h6"/>
    <path class="acc" d="M24 80a56 56 0 0 1 89 -45.3"/><path d="M80 80l22-30"/><circle cx="80" cy="80" r="6" class="accf"/>`, 'Diagram: a score gauge with the needle past the halfway mark.'),
  llms: tth(`<path d="M34 8h60l22 22v52H34z"/><path d="M94 8v22h22"/><path class="hl" d="M44 40h34M44 50h52M44 60h40"/><path class="acc" d="M44 72h28"/>`, 'Diagram: a plain text file with a heading and a list of links.')
};

/* ---- 7. Note covers (400 x 240). Each note names its own motif in frontmatter (cover:),
   so no two posts share a picture; the four category patterns remain as the fallback. ---- */
const MOTIFS: Record<string, (r: () => number) => string> = {
  steps: (r) => { const n = 4 + Math.floor(r() * 3); let d = 'M24 208'; let x = 24, y = 208; const w = 352 / n; for (let i = 0; i < n; i++) { const h = 16 + r() * 12; d += `h${w.toFixed(0)}v-${h.toFixed(0)}`; x += w; y -= h; } return `<path d="${d}"/><path class="dash" d="M24 208L${x} ${Math.max(y, 40)}"/><circle cx="${(24 + w * (n - 1)).toFixed(0)}" cy="${Math.max(y, 40)}" r="6" class="accf"/>`; },
  dots: (r) => { let g = ''; const cols = 8, rows = 4, hit = Math.floor(r() * cols * rows); for (let i = 0; i < cols * rows; i++) { const cx = 40 + (i % cols) * 46, cy = 44 + Math.floor(i / cols) * 50; const on = r() > 0.55; g += i === hit ? `<circle cx="${cx}" cy="${cy}" r="11" class="accf"/>` : `<circle cx="${cx}" cy="${cy}" r="9" ${on ? `style="fill:currentColor"` : ''}/>`; } return g; },
  ruler: (r) => { let g = `<path d="M24 150h352"/>`; for (let i = 0; i <= 22; i++) g += `<path class="hl" d="M${24 + i * 16} 150v${i % 5 === 0 ? 16 : 8}"/>`; const a = 60 + r() * 100, b = a + 80 + r() * 100; g += `<path d="M${a} 120v22M${b} 120v22M${a} 130h${(b - a).toFixed(0)}"/><circle cx="${((a + b) / 2).toFixed(0)}" cy="130" r="7" class="accf"/>`; return g + `<path class="hl" d="M24 60h120M24 78h86M24 96h104"/>`; },
  columns: (r) => { let g = ''; for (let c = 0; c < 3; c++) { const x = 28 + c * 122; g += `<path d="M${x} 36h104"/>`; for (let l = 0; l < 7; l++) g += `<path class="hl" d="M${x} ${56 + l * 22}h${(60 + r() * 44).toFixed(0)}"/>`; } return g + `<rect x="28" y="30" width="30" height="12" rx="3" class="accf"/>`; },
  // a chat answer that names one business and cites it
  answer: () => `<path d="M64 36h244a16 16 0 0 1 16 16v86a16 16 0 0 1-16 16H136l-34 28v-28H64a16 16 0 0 1-16-16V52a16 16 0 0 1 16-16z"/><path class="hl" d="M76 66h170M76 86h200M76 106h110"/><rect x="200" y="96" width="96" height="22" rx="11"/><circle cx="212" cy="107" r="5" class="accf"/><path class="hl" d="M224 107h58"/><path class="dash" d="M248 118v54"/><rect x="214" y="172" width="122" height="34" rx="8"/><path class="hl" d="M228 189h70"/>`,
  // a results page with the right-hand column lit
  serp: () => `<rect x="24" y="22" width="352" height="196" rx="10"/><rect x="40" y="38" width="190" height="20" rx="10"/><path class="hl" d="M40 84h120M40 98h176M40 106h150M40 136h110M40 150h176M40 158h140M40 188h120M40 202h160"/><rect x="250" y="76" width="110" height="128" rx="8" class="acc"/><path class="hl" d="M262 96h70M262 112h86M262 128h60M262 144h80"/><circle cx="270" cy="178" r="6" class="accf"/><path class="hl" d="M284 178h54"/>`,
  // a site tree where only the root page made it into the index
  tree: () => `<rect x="172" y="28" width="56" height="36" rx="6" class="acc"/><path d="M200 64v28M64 92h272M64 92v24M155 92v24M245 92v24M336 92v24"/><rect x="40" y="116" width="48" height="30" rx="5" class="dashbox"/><rect x="131" y="116" width="48" height="30" rx="5" class="dashbox"/><rect x="221" y="116" width="48" height="30" rx="5" class="dashbox"/><rect x="312" y="116" width="48" height="30" rx="5" class="dashbox"/><path class="dash" d="M64 146v26M155 146v26M245 146v26M336 146v26"/><rect x="48" y="172" width="32" height="22" rx="4" class="dashbox"/><rect x="139" y="172" width="32" height="22" rx="4" class="dashbox"/><rect x="229" y="172" width="32" height="22" rx="4" class="dashbox"/><rect x="320" y="172" width="32" height="22" rx="4" class="dashbox"/><circle cx="228" cy="30" r="7" class="accf"/>`,
  // a plain text file: a heading and a list of links
  textfile: () => `<path d="M120 22h120l40 40v158H120z"/><path d="M240 22v40h40"/><path d="M140 82h80"/><path class="hl" d="M140 108h60M140 126h110M140 144h90M140 162h104M140 180h70"/><path class="hl" d="M132 126h2M132 144h2M132 162h2M132 180h2"/><path class="acc" d="M140 200h52"/>`,
  // a score gauge with the needle past halfway
  gauge: () => `<path d="M80 196a120 120 0 0 1 240 0"/><path class="hl" d="M68 196h-12M200 76V62M115 111l-9-9M285 111l9-9M332 196h12"/><path class="acc" d="M80 196a120 120 0 0 1 190.7-97"/><path d="M200 196l46-64"/><circle cx="200" cy="196" r="9" class="accf"/>`,
  // many impressions, one click
  impressions: (r) => { let g = `<path d="M24 196h352"/>`; for (let i = 0; i < 13; i++) { const h = 50 + r() * 110; g += `<rect x="${34 + i * 24}" y="${(196 - h).toFixed(0)}" width="14" height="${h.toFixed(0)}" rx="3"/>`; } return g + `<circle cx="353" cy="196" r="7" class="accf"/><path d="M340 40l14 34 5-14 14-5z"/>`; },
  // streets and pins, one of them yours
  pins: () => `<path class="hl" d="M24 70h352M24 150h352M110 22v196M262 22v196"/><path class="dash" d="M24 210L376 34"/><path d="M70 120c0-13 10-22 22-22s22 9 22 22c0 18-22 36-22 36s-22-18-22-36z"/><path d="M290 96c0-11 9-19 19-19s19 8 19 19c0 15-19 31-19 31s-19-16-19-31z"/><path d="M168 168c0-17 13-28 28-28s28 11 28 28c0 23-28 46-28 46s-28-23-28-46z" class="acc"/><circle cx="196" cy="168" r="8" class="accf"/>`,
  // a form field in a focus ring, and a large type sample
  access: () => `<rect x="40" y="34" width="190" height="34" rx="6"/><rect x="33" y="27" width="204" height="48" rx="10" class="acc"/><path class="hl" d="M52 51h90"/><rect x="40" y="96" width="190" height="34" rx="6"/><path class="hl" d="M52 113h70"/><rect x="40" y="158" width="96" height="36" rx="18"/><path class="hl" d="M62 176h52"/><text x="266" y="130" style="font:700 72px var(--sans);font-style:normal">Aa</text><path d="M268 156h84"/><circle cx="352" cy="194" r="7" class="accf"/><path class="hl" d="M268 194h70"/>`,
  // a wall with one gap: robots.txt
  wall: () => `<circle cx="52" cy="58" r="12"/><circle cx="52" cy="120" r="12"/><circle cx="52" cy="182" r="12" class="acc"/><path d="M210 24v130M210 196v20"/><path class="dash" d="M66 58h130M66 120h130"/><path class="hl" d="M190 50l14 16M204 50l-14 16M190 112l14 16M204 112l-14 16"/><path class="acc" d="M66 182h236"/><path class="acc" d="M302 182l-12-9M302 182l-12 9"/><rect x="314" y="140" width="62" height="78" rx="6"/><path class="hl" d="M326 160h36M326 176h28M326 192h32"/>`,
};
const BY_CATEGORY: Record<string, string> = { 'How-to': 'steps', Test: 'dots', Buying: 'ruler', News: 'columns' };
export const COVER_MOTIFS = Object.keys(MOTIFS);

function cover(cat: string, slug: string, tone: "dark" | "light", motif?: string): string {
  const r = rng(cat + slug); const dark = tone === 'dark';
  const bg = dark ? 'var(--pine-2)' : 'var(--paper-2)'; const fg = dark ? 'var(--paper)' : 'var(--ink)';
  const draw = MOTIFS[motif ?? ''] ?? MOTIFS[BY_CATEGORY[cat] ?? 'steps'];
  return SVG('0 0 400 240', `<rect width="400" height="240" fill="${bg}" stroke="none"/><g style="color:${fg}">${draw(r)}</g>`, '', 'cover');
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
