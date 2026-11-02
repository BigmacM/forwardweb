// Lead forms: validate on blur, re-validate on input once invalid, focus the first invalid field on submit,
// post in place, and fall back to a normal POST (the server redirects to /thanks/) when JS is off.

type Rule = (v: string) => true | string;

const rules: Record<string, Rule> = {
  url: (v) => /^(https?:\/\/)?[^\s.\/:]+(\.[^\s.\/:]+)+(:\d{1,5})?(\/\S*)?$/.test(v.trim()) || 'Enter your website address, like yourbusiness.ca.',
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && !v.includes('..')) || 'Enter an email I can reply to, like name@company.com.',
};

interface CheckPayload { score: string; fixes: string }
const STORE = 'fw-check';

const readCheck = (): CheckPayload | null => {
  try {
    const raw = sessionStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as CheckPayload) : null;
  } catch {
    return null;
  }
};

const applyCheck = (form: HTMLFormElement, c: CheckPayload | null) => {
  if (!c) return;
  const set = (name: string, value: string) => {
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLInputElement) el.value = value;
  };
  set('score', c.score);
  set('fixes', c.fixes);
  const note = form.querySelector<HTMLElement>('[data-score-note]');
  if (note) {
    note.textContent = `I'll include your check result (${c.score}) so I can see where you start.`;
    note.hidden = false;
  }
};

const clearCheck = (form: HTMLFormElement) => {
  for (const name of ['score', 'fixes']) {
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLInputElement) el.value = '';
  }
  const note = form.querySelector<HTMLElement>('[data-score-note]');
  if (note) {
    note.textContent = '';
    note.hidden = true;
  }
};

const RETRY = "Try again, or email info@forwardweb.ca and I'll reply from there.";
const ALSO_EMAIL = "You can also email info@forwardweb.ca and I'll reply from there.";

document.querySelectorAll<HTMLFormElement>('form[data-lead]').forEach((form) => {
  applyCheck(form, readCheck());
  window.addEventListener('fw:check', (e) => applyCheck(form, (e as CustomEvent<CheckPayload>).detail));
  window.addEventListener('fw:check-reset', () => clearCheck(form));

  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const label = submit.textContent ?? 'Send';
  let busy = false;

  const check = (el: HTMLInputElement): boolean => {
    const rule = rules[el.dataset.rule ?? ''];
    if (!rule) return true;
    const result = rule(el.value);
    const err = el.parentElement?.querySelector<HTMLElement>('.err');
    if (result !== true && (el.value !== '' || el.dataset.touched)) {
      el.setAttribute('aria-invalid', 'true');
      if (err) err.textContent = result;
      return false;
    }
    el.removeAttribute('aria-invalid');
    if (err) err.textContent = '';
    return result === true;
  };

  form.querySelectorAll<HTMLInputElement>('[data-rule]').forEach((el) => {
    el.addEventListener('blur', () => {
      el.dataset.touched = '1';
      check(el);
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid')) check(el);
    });
  });

  const setBusy = (on: boolean) => {
    busy = on;
    // aria-disabled, not disabled: the button keeps focus and the live region announces the state.
    submit.setAttribute('aria-disabled', String(on));
    submit.textContent = on ? 'Sending...' : label;
    form.setAttribute('aria-busy', String(on));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    let first: HTMLInputElement | null = null;
    form.querySelectorAll<HTMLInputElement>('[data-rule]').forEach((el) => {
      el.dataset.touched = '1';
      if (!check(el) && !first) first = el;
    });
    if (first) {
      (first as HTMLInputElement).focus();
      status.classList.remove('bad');
      status.textContent = 'Fix the highlighted field and send again.';
      return;
    }
    setBusy(true);
    status.classList.remove('bad');
    status.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        form.innerHTML =
          '<div class="sent" tabindex="-1" data-sent><h3 class="h-m">Got it.</h3><p>I\'ll reply within two working days, with a yes, a no, or a better idea.</p></div>';
        form.querySelector<HTMLElement>('[data-sent]')?.focus();
        return;
      }
      setBusy(false);
      status.classList.add('bad');
      status.textContent = data.message ? `${data.message} ${ALSO_EMAIL}` : `That didn't send. ${RETRY}`;
    } catch {
      setBusy(false);
      status.classList.add('bad');
      status.textContent = `That didn't send. ${RETRY}`;
    }
  });
});
