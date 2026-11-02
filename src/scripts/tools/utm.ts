// UTM link builder with a naming guard: lowercase, no spaces, parameters in the right place.
import { copyText } from './copy';

const FIELDS = ['source', 'medium', 'campaign', 'term', 'content'] as const;
type Field = (typeof FIELDS)[number];
const REQUIRED: Field[] = ['source', 'medium', 'campaign'];

/** The convention the guard enforces: lowercase, words joined by hyphens. */
export const tidy = (v: string): string =>
  v.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9\-.]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

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

  const urlProblem = (v: string): { bad: string; url: URL | null } => {
    if (!v) return { bad: 'Enter the page address, starting with https://.', url: null };
    try {
      const u = new URL(v);
      if (!/^https?:$/.test(u.protocol)) throw new Error('protocol');
      return { bad: '', url: u };
    } catch {
      return { bad: 'Start the address with https://, like https://yourbusiness.ca/offer/.', url: null };
    }
  };

  const update = () => {
    const u = urlProblem(input('url').value.trim());
    err('url').textContent = touched.has('url') ? u.bad : '';
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
      state.textContent = 'Add a page address, a source, a medium and a campaign.';
      if (u.url && u.url.search && /utm_/.test(u.url.search)) state.textContent = 'That address already has UTM tags. Remove them first.';
      return;
    }
    const link = new URL(u.url.toString());
    FIELDS.forEach((f) => {
      const v = input(f).value.trim();
      if (v) link.searchParams.set(`utm_${f}`, v);
    });
    out.textContent = link.toString();
    state.textContent = 'Ready. Names are lowercase with no spaces.';
  };

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    const f = t.getAttribute('data-f');
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
