// robots.txt checker for AI crawlers. Paste only: it never fetches anything.
// Matching follows RFC 9309: a crawler uses the group(s) naming it, and only falls back to "*" if none does;
// within the chosen rules the longest matching path wins, and Allow wins a tie.

type Directive = [kind: 'allow' | 'disallow', path: string];
interface Group { agents: string[]; rules: Directive[] }

const BOTS: [name: string, company: string][] = [
  ['GPTBot', 'OpenAI'],
  ['OAI-SearchBot', 'OpenAI'],
  ['ChatGPT-User', 'OpenAI'],
  ['ClaudeBot', 'Anthropic'],
  ['PerplexityBot', 'Perplexity'],
  ['Google-Extended', 'Google'],
  ['Applebot-Extended', 'Apple'],
  ['CCBot', 'Common Crawl'],
];

const EXAMPLE = `User-agent: *
Disallow: /admin
Disallow: /account

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Disallow: /

Sitemap: https://example.ca/sitemap.xml`;

export function parse(text: string): Group[] {
  const groups: Group[] = [];
  let cur: Group | null = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === 'user-agent') {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], rules: [] };
        groups.push(cur);
      }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else if (key === 'allow' || key === 'disallow') {
      if (cur) cur.rules.push([key, val]);
      lastWasAgent = false;
    }
  }
  return groups;
}

/**
 * Does a robots.txt pattern match this path? Supports * and a trailing $, and matches as a prefix otherwise.
 * Iterative with a single backtrack point, so it is linear-ish and cannot blow up the way a regex with many
 * wildcards can (a pasted file with ten * in one rule used to freeze the tab).
 */
export function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith('$');
  const pat = anchored ? pattern.slice(0, -1) : pattern;
  let p = 0;
  let s = 0;
  let star = -1;
  let mark = 0;
  while (s < path.length) {
    if (p >= pat.length && !anchored) return true; // pattern fully matched as a prefix
    if (p < pat.length && pat[p] === '*') {
      star = p++;
      mark = s;
    } else if (p < pat.length && pat[p] === path[s]) {
      p++;
      s++;
    } else if (star >= 0) {
      p = star + 1;
      s = ++mark;
    } else {
      return false;
    }
  }
  while (p < pat.length && pat[p] === '*') p++;
  return p === pat.length;
}

/** Turn whatever was typed into a path to test: a full URL, a path with a query, or a bare word. */
export function normalisePath(input: string): string {
  let v = input.trim();
  if (!v) return '/';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(v) || v.startsWith('//')) {
    try {
      const u = new URL(v.startsWith('//') ? 'https:' + v : v);
      v = u.pathname + u.search;
    } catch {
      /* fall through with what was typed */
    }
  }
  v = v.replace(/#.*/, '');
  return '/' + v.replace(/^\/+/, '');
}

export function allowed(rules: Directive[], path: string): boolean {
  let best: Directive | null = null;
  for (const r of rules) {
    const [kind, p] = r;
    if (p === '') continue; // an empty Disallow allows everything and an empty Allow changes nothing
    if (!matches(p, path)) continue;
    if (!best || p.length > best[1].length || (p.length === best[1].length && kind === 'allow')) best = r;
  }
  return !best || best[0] === 'allow';
}

type Source = 'own' | 'wildcard' | 'none';

export function rulesFor(groups: Group[], bot: string): { rules: Directive[]; source: Source } {
  const own = groups.filter((g) => g.agents.includes(bot.toLowerCase()));
  if (own.length) return { rules: own.flatMap((g) => g.rules), source: 'own' };
  const wild = groups.filter((g) => g.agents.includes('*'));
  return { rules: wild.flatMap((g) => g.rules), source: wild.length ? 'wildcard' : 'none' };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

document.querySelectorAll<HTMLElement>('[data-robots]').forEach((root) => {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const input = $<HTMLTextAreaElement>('[data-input]');
  const pathEl = $<HTMLInputElement>('[data-path]');
  const rows = $('[data-rows]');
  const summary = $('[data-summary]');
  const gotcha = $('[data-gotcha]');
  const empty = $('[data-empty]');
  const table = $('[data-table]');
  const pathHead = $('[data-pathhead]');

  const run = () => {
    const text = input.value;
    const groups = parse(text);
    if (!text.trim() || !groups.length) {
      table.hidden = true;
      gotcha.innerHTML = '';
      empty.hidden = false;
      empty.textContent = text.trim()
        ? 'I could not find any User-agent groups in that text. Check that you pasted the contents of your robots.txt file.'
        : 'Paste your robots.txt to begin. The table fills in as soon as there is something to read.';
      summary.textContent = '';
      return;
    }
    empty.hidden = true;
    table.hidden = false;
    const path = normalisePath(pathEl.value);
    pathHead.textContent = path;

    // Paths the wildcard group blocks for everyone: the ones a named bot's own group may quietly re-open.
    const wildBlocked = groups
      .filter((g) => g.agents.includes('*'))
      .flatMap((g) => g.rules)
      .filter((r) => r[0] === 'disallow' && r[1] !== '')
      .map((r) => r[1]);

    let blocked = 0;
    const exposed: [string, string[]][] = [];

    rows.innerHTML = BOTS.map(([bot, company]) => {
      const { rules, source } = rulesFor(groups, bot);
      const home = allowed(rules, '/');
      const test = allowed(rules, path);
      if (!home) blocked++;
      const reopened = source === 'own' ? wildBlocked.filter((p) => allowed(rules, p.replace(/\*|\$/g, ''))) : [];
      if (reopened.length) exposed.push([bot, reopened]);
      const why = source === 'own' ? 'Has its own group' : source === 'wildcard' ? 'Follows the * group' : 'No rules, so allowed';
      const pathCell = !test
        ? '<span class="pill no">Blocked</span>'
        : reopened.length
          ? '<span class="pill warn">Reachable</span>'
          : '<span class="pill ok">Reachable</span>';
      return `<tr><td><b>${esc(bot)}</b></td><td>${esc(company)}</td><td><span class="pill ${home ? 'ok' : 'no'}">${home ? 'Allowed' : 'Blocked'}</span></td><td>${pathCell}</td><td>${why}</td></tr>`;
    }).join('');

    summary.textContent = `${BOTS.length - blocked} of ${BOTS.length} can read your home page`;
    gotcha.innerHTML = exposed.length
      ? `<div class="gotcha" role="alert"><b>Your wildcard rules don't apply to ${esc(exposed.map((e) => e[0]).join(', '))}.</b><p>You blocked ${esc(
          [...new Set(exposed.flatMap((e) => e[1]))].join(', '),
        )} for everyone, but naming a bot gives it its own group, and it ignores the * group. Repeat the Disallow lines inside that bot's group.</p></div>`
      : '';
  };

  $('[data-run]').addEventListener('click', run);
  $('[data-example]').addEventListener('click', () => {
    input.value = EXAMPLE;
    run();
  });
  $('[data-clear]').addEventListener('click', () => {
    input.value = '';
    run();
    input.focus();
  });
  input.addEventListener('input', run);
  pathEl.addEventListener('input', run);
  run();
});
