// AI visibility check: eight meters, a running tally, three fixes in Max's voice.
// Self-check only. Nothing leaves the browser except what the visitor chooses to put in the apply form.
import { CHECK_QUESTIONS as Q } from '../data/check';

type Answer = 'yes' | 'partly' | 'no' | 'unsure';
const pts: Record<Answer, number> = { yes: 2, partly: 1, no: 0, unsure: 0 };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const STORE = 'fw-check';

document.querySelectorAll<HTMLElement>('[data-check]').forEach((root) => {
  const ans: (Answer | null)[] = Array(Q.length).fill(null);
  let i = 0;
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const qEl = $('[data-q]');
  const whyEl = $('[data-why]');
  const step = $('[data-step]');
  const back = $<HTMLButtonElement>('[data-back]');
  const opts = [...root.querySelectorAll<HTMLButtonElement>('.opt')];
  const form = $('[data-form]');
  const res = $('[data-result]');
  const meters = [...root.querySelectorAll<HTMLElement>('[data-meters]')];
  const run = $('[data-run]');
  const live = $('[data-live]');

  const total = () => ans.reduce<number>((a, v) => a + (v ? pts[v] : 0), 0);

  const paintMeters = () => {
    meters.forEach((list) =>
      [...list.children].forEach((m, k) => {
        (m as HTMLElement).dataset.v = ans[k] == null ? '' : String(pts[ans[k]!]);
        m.classList.toggle('cur', k === i);
      }),
    );
    const n = ans.filter(Boolean).length;
    run.textContent = n ? `${total()} of ${n * 2} so far` : 'Answer to start';
  };

  const paint = () => {
    qEl.textContent = Q[i].q;
    whyEl.textContent = Q[i].why;
    step.textContent = `Question ${i + 1} of ${Q.length}`;
    opts.forEach((o) => o.setAttribute('aria-pressed', String(ans[i] === o.dataset.v)));
    back.setAttribute('aria-disabled', String(i === 0));
    paintMeters();
  };

  const finish = () => {
    const sc = total();
    const max = Q.length * 2;
    const band = sc <= 5 ? 'Not visible to AI yet' : sc <= 11 ? 'Findable, not yet recommended' : 'A strong base';
    const worst = ans
      .map((v, k) => [pts[v as Answer], k] as const)
      .sort((a, b) => a[0] - b[0] || a[1] - b[1])
      .filter((x) => x[0] < 2)
      .slice(0, 3);
    $('[data-score]').innerHTML = `${sc}<small>/${max}</small>`;
    $('[data-band]').textContent = band;
    const fixes = worst.map((x) => Q[x[1]].fix);
    $('[data-fix]').innerHTML = fixes.length
      ? fixes.map((f) => `<li>${f}</li>`).join('')
      : '<li>Nothing obvious to fix from here. An audit would look at what you cannot see from outside.</li>';

    // Carry the result into the apply forms: hidden fields on this page now, and on /apply/ after navigation.
    const payload = { score: `${sc}/${max} (${band})`, fixes: fixes.join('\n') };
    try {
      sessionStorage.setItem(STORE, JSON.stringify(payload));
    } catch {
      /* private mode: the same-page event below still works */
    }
    window.dispatchEvent(new CustomEvent('fw:check', { detail: payload }));

    form.hidden = true;
    res.classList.add('on');
    i = Q.length;
    paintMeters();
    res.querySelector<HTMLElement>('h3')!.focus();
  };

  opts.forEach((o) =>
    o.addEventListener('click', () => {
      ans[i] = o.dataset.v as Answer;
      opts.forEach((x) => x.setAttribute('aria-pressed', String(x === o)));
      paintMeters();
      live.textContent = `Answered ${o.textContent}.`;
      setTimeout(() => {
        if (i < Q.length - 1) {
          i++;
          paint();
        } else finish();
      }, reduce ? 0 : 200);
    }),
  );

  back.addEventListener('click', () => {
    if (i > 0) {
      i--;
      paint();
    }
  });

  root.querySelector('[data-restart]')?.addEventListener('click', () => {
    ans.fill(null);
    i = 0;
    res.classList.remove('on');
    form.hidden = false;
    try {
      sessionStorage.removeItem(STORE);
    } catch {
      /* ignore */
    }
    paint();
  });

  paint();
});
