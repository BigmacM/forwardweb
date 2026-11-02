// UTM link builder with a naming guard: lowercase, no spaces, parameters in the right place,
// and a refusal to overwrite tags that are already on the address.
import { copyText } from './copy';

const FIELDS = ['source', 'medium', 'campaign', 'term', 'content'] as const;
type Field = (typeof FIELDS)[number];
const REQUIRED: Field[] = ['source', 'medium', 'campaign'];

/** The convention the guard enforces: lowercase, words joined by hyphens. Underscores are allowed and kept. */
export const tidy = (v: string): string =>
  v.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_.]/g, '').replace(/-+/g, '-').replace(/^[-_]+|[-_]+$/g, '');

document.querySelectorAll<HTMLElement>('[data-utm]').forEach((root) => {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const input = (f: string) => $<HTMLInputElement>(`[data-f="${f}"]`);
  const err = (f: string) => $(`[data-e="${f}"]`);
  const out = $('[data-out]');
  const state = $('[data-state]');
  const touched = new Set<string>();

  const problem = (f: Field, v: string): string => {
    if (!v) return REQUIRED.includes(f) ? `Enter a ${f}.` : '';
    if (/\s/.test(v)) return `Remove the spaces. Try "${tidy(v)}".`;
    if (v !== v.toLowerCase()) return `Use lowercase so reports do not split. Try "${tidy(v)}".`;
    if (/[^a-z0-9\-_.]/.test(v)) return `Use letters, numbers and hyphens only. Try "${tidy(v)}".`;
    return '';
  };

  const parseUrl = (v: string): { bad: string; url: URL | null } => {
    if (!v) return { bad: 'Enter the page address, starting with https://.', url: null };
    try {
      const u = new URL(v);
      if (!/^https?:$/.test(u.protocol)) throw new Error('protocol');
      const existing = [...u.searchParams.keys()].filter((k) => k.toLowerCase().startsWith('utm_'));
      if (existing.length) return { bad: `That address already has UTM tags (${existing.join(', ')}). Remove them first, so old and new tags do not mix.`, url: u };
      return { bad: '', url: u };
    } catch {
      return { bad: 'Start the address with https://, like https://yourbusiness.ca/offer/.', url: null };
    }
  };

  const update = () => {
    const raw = input('url').value.trim();
    const u = parseUrl(raw);
    err('url').textContent = touched.has('url') || u.bad.includes('already') ? u.bad : '';
    if (u.bad.includes('already')) input('url').setAttribute('aria-invalid', 'true');
    else if (!(touched.has('url') && u.bad)) input('url').removeAttribute('aria-invalid');
    let allOk = !u.bad;
    FIELDS.forEach((f) => {
      const p = problem(f, input(f).value.trim());
      err(f).textContent = touched.has(f) ? p : '';
      if (p) allOk = false;
      if (touched.has(f) && p) input(f).setAttribute('aria-invalid', 'true');
      else input(f).removeAttribute('aria-invalid');
    });
    if (!u.url || !allOk) {
      out.textContent = '';
      state.textContent = u.bad.includes('already') ? 'Remove the existing UTM tags from the address, then I will build the link.' : 'Add a page address, a source, a medium and a campaign.';
      return;
    }
    // Append to the address as typed, so existing parameters keep their exact encoding. Tags go before any #fragment.
    const hashAt = raw.indexOf('#');
    const base = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
    const hash = hashAt >= 0 ? raw.slice(hashAt) : '';
    const tags = FIELDS.filter((f) => input(f).value.trim()).map((f) => `utm_${f}=${encodeURIComponent(input(f).value.trim())}`);
    const joiner = base.includes('?') ? (/[?&]$/.test(base) ? '' : '&') : '?';
    out.textContent = `${base}${joiner}${tags.join('&')}${hash}`;
    state.textContent = 'Ready. Names are lowercase with no spaces.';
  };

  root.addEventListener('input', (e) => {
    const f = (e.target as HTMLElement).getAttribute('data-f');
    if (f) touched.add(f);
    update();
  });
  root.addEventListener(
    'blur',
    (e) => {
      const f = (e.target as HTMLElement).getAttribute?.('data-f');
      if (f) {
        touched.add(f);
        update();
      }
    },
    true,
  );
  $('[data-fix]').addEventListener('click', () => {
    FIELDS.forEach((f) => {
      input(f).value = tidy(input(f).value);
      touched.add(f);
    });
    update();
  });
  $('[data-copy]').addEventListener('click', async () => {
    if (!out.textContent) {
      state.textContent = 'Nothing to copy yet. Fill in the fields above.';
      return;
    }
    state.textContent = (await copyText(out.textContent)) ? 'Copied.' : 'Copy failed. Select the link and copy it by hand.';
  });
  update();
});
