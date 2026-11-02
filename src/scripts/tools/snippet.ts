// Snippet preview: measure title and description in pixels with a canvas, against approximate display limits.
// The limits are a guide. Google rewrites snippets and truncates by width, so character counts mislead.

const TITLE_LIMIT = 600; // px at 20px Arial, desktop
const DESC_LIMIT = 920; // px at 14px Arial, desktop

const ctx = document.createElement('canvas').getContext('2d')!;
const width = (text: string, font: string) => {
  ctx.font = font;
  return Math.round(ctx.measureText(text).width);
};

/** Trim to a pixel width, adding an ellipsis the way a results page would. */
const clip = (text: string, font: string, limit: number) => {
  if (width(text, font) <= limit) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (width(text.slice(0, mid).trimEnd() + '…', font) <= limit) lo = mid;
    else hi = mid - 1;
  }
  return text.slice(0, lo).trimEnd() + '…';
};

document.querySelectorAll<HTMLElement>('[data-snippet]').forEach((root) => {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const urlEl = $<HTMLInputElement>('[data-url]');
  const titleEl = $<HTMLInputElement>('[data-title]');
  const descEl = $<HTMLTextAreaElement>('[data-desc]');
  const TF = '20px Arial, Helvetica, sans-serif';
  const DF = '14px Arial, Helvetica, sans-serif';

  const status = (px: number, limit: number, chars: number, noun: string) => {
    if (!chars) return `Write a ${noun} to measure it.`;
    const over = px > limit;
    return `${px} of about ${limit} pixels, ${chars} characters. ${over ? `Likely cut off in search results.` : 'Should fit.'}`;
  };

  const update = () => {
    const title = titleEl.value.trim();
    const desc = descEl.value.trim();
    const tw = width(title, TF);
    const dw = width(desc, DF);
    const bar = (el: HTMLElement, px: number, limit: number) => {
      el.style.width = `${Math.min(100, Math.round((px / limit) * 100))}%`;
      el.classList.toggle('over', px > limit);
    };
    bar($('[data-tbar]'), tw, TITLE_LIMIT);
    bar($('[data-dbar]'), dw, DESC_LIMIT);
    $('[data-tinfo]').textContent = status(tw, TITLE_LIMIT, title.length, 'title');
    $('[data-dinfo]').textContent = status(dw, DESC_LIMIT, desc.length, 'description');

    let host = urlEl.value.trim();
    try {
      const u = new URL(/^https?:\/\//.test(host) ? host : `https://${host}`);
      host = `${u.hostname}${u.pathname === '/' ? '' : u.pathname.replace(/\/$/, '').split('/').filter(Boolean).map((s) => ` › ${s}`).join('')}`;
    } catch {
      /* show what was typed */
    }
    $('[data-surl]').textContent = host || 'yourbusiness.ca';
    $('[data-stitle]').textContent = clip(title, TF, TITLE_LIMIT) || 'Your title appears here';
    $('[data-sdesc]').textContent = clip(desc, DF, DESC_LIMIT) || 'Your description appears here.';
    $('[data-atitle]').textContent = title || 'Your title appears here';
    $('[data-aurl]').textContent = host || 'yourbusiness.ca';
  };

  [urlEl, titleEl, descEl].forEach((el) => el.addEventListener('input', update));
  update();
});
