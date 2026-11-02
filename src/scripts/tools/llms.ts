// llms.txt generator. Writes the markdown shape the llms.txt proposal describes: an H1, a blockquote summary,
// optional detail, then a list of links. Runs in the browser and sends nothing.
import { copyText } from './copy';

document.querySelectorAll<HTMLElement>('[data-llms]').forEach((root) => {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const name = $<HTMLInputElement>('[data-name]');
  const sum = $<HTMLInputElement>('[data-sum]');
  const det = $<HTMLTextAreaElement>('[data-det]');
  const links = $<HTMLTextAreaElement>('[data-links]');
  const out = $('[data-out]');
  const err = $('[data-err]');
  const state = $('[data-state]');

  const build = (): { text: string; bad: string[] } => {
    const bad: string[] = [];
    const items: string[] = [];
    links.value.split(/\r?\n/).forEach((line, i) => {
      if (!line.trim()) return;
      const parts = line.split('|').map((s) => s.trim());
      const [title, url] = parts;
      const note = parts.slice(2).join(' | '); // a pipe inside the note stays in the note
      let ok = false;
      try {
        ok = !!url && !/\s/.test(url) && /^https?:$/.test(new URL(url).protocol);
      } catch {
        ok = false;
      }
      if (!title || !ok) {
        bad.push(`Line ${i + 1} needs a title and a full address, like: Services | https://yourbusiness.ca/services/`);
        return;
      }
      items.push(`- [${title}](${url})${note ? `: ${note}` : ''}`);
    });
    const parts = [`# ${name.value.trim() || 'Your site name'}`];
    if (sum.value.trim()) parts.push(`> ${sum.value.trim()}`);
    if (det.value.trim()) parts.push(det.value.trim());
    if (items.length) parts.push(`## Key pages\n\n${items.join('\n')}`);
    return { text: parts.join('\n\n') + '\n', bad };
  };

  const update = () => {
    const { text, bad } = build();
    out.textContent = text;
    err.textContent = bad.length ? `${bad[0]}${bad.length > 1 ? ` (${bad.length - 1} more line${bad.length > 2 ? 's' : ''} also skipped)` : ''}` : '';
  };

  [name, sum, det, links].forEach((el) => el.addEventListener('input', update));
  $('[data-copy]').addEventListener('click', async () => {
    state.textContent = (await copyText(out.textContent ?? '')) ? 'Copied.' : 'Copy failed. Select the text and copy it by hand.';
  });
  $('[data-download]').addEventListener('click', () => {
    const blob = new Blob([out.textContent ?? ''], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'llms.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    state.textContent = 'Downloaded llms.txt.';
  });
  update();
});
