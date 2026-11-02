// Two playable demos. They save nothing and make no network calls.

/* Booking calendar */
document.querySelectorAll<HTMLElement>('[data-cal]').forEach((root) => {
  const grid = root.querySelector<HTMLElement>('[data-days]')!;
  const slots = root.querySelector<HTMLElement>('[data-slots]')!;
  const out = root.querySelector<HTMLElement>('[data-out]')!;
  const booked = new Set([3, 4, 10, 17, 18, 24]);
  let day: string | null = null;
  let slot: string | null = null;

  grid.innerHTML =
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => `<span aria-hidden="true">${d}</span>`).join('') +
    Array.from({ length: 28 }, (_, n) => n + 1)
      .map((d) => `<button type="button" data-d="${d}" aria-pressed="false" ${booked.has(d) ? `disabled aria-label="Day ${d}, full"` : ''}>${d}</button>`)
      .join('');
  ['09:00', '11:30', '14:00', '16:30'].forEach((t) =>
    slots.insertAdjacentHTML('beforeend', `<button type="button" data-t="${t}" aria-pressed="false">${t}</button>`),
  );

  const update = () => {
    out.textContent =
      day && slot ? `Demo only. Would hold day ${day} at ${slot}. Nothing is saved or sent.` : day ? 'Now pick a time.' : 'Pick a day. Struck-out days are full.';
  };
  const choose = (list: HTMLElement, btn: HTMLElement) =>
    list.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));

  grid.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-d]');
    if (!b || b.disabled) return;
    day = b.dataset.d ?? null;
    choose(grid, b);
    update();
  });
  slots.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b) return;
    slot = b.dataset.t ?? null;
    choose(slots, b);
    update();
  });
  update();
});

/* Dispatch board */
interface Trip { id: string; l: string; s: number; e: number }

document.querySelectorAll<HTMLElement>('[data-board]').forEach((root) => {
  const trips: Trip[] = [
    { id: 'T1', l: 'T1 08:00-13:00', s: 8, e: 13 },
    { id: 'T2', l: 'T2 12:00-17:00', s: 12, e: 17 },
    { id: 'T3', l: 'T3 14:00-19:00', s: 14, e: 19 },
  ];
  const lanes = ['Driver 1', 'Driver 2'];
  const at: Record<string, string> = {};
  let sel: string | null = null;
  const pool = root.querySelector<HTMLElement>('[data-pool]')!;
  const lanesEl = root.querySelector<HTMLElement>('[data-lanes]')!;
  const out = root.querySelector<HTMLElement>('[data-out]')!;

  const clash = (t: Trip, lane: string) => trips.some((o) => o.id !== t.id && at[o.id] === lane && o.s < t.e && t.s < o.e);

  const draw = () => {
    pool.innerHTML =
      trips
        .filter((t) => at[t.id] == null)
        .map((t) => `<button type="button" class="trip" data-id="${t.id}" aria-pressed="${sel === t.id}">${t.l}</button>`)
        .join('') || '<span class="dim">All trips assigned.</span>';
    lanesEl.innerHTML = lanes
      .map(
        (n) =>
          `<div class="lane"><b>${n}</b><button type="button" class="track ${sel ? 'hot' : ''}" data-lane="${n}" aria-label="Assign to ${n}">${trips
            .filter((t) => at[t.id] === n)
            .map((t) => `<span class="trip assigned">${t.l}</span>`)
            .join('')}</button></div>`,
      )
      .join('');
  };

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-reset]')) {
      for (const k of Object.keys(at)) delete at[k];
      sel = null;
      out.classList.remove('bad');
      out.textContent = 'Select a trip, then a driver.';
      draw();
      return;
    }
    const t = target.closest<HTMLElement>('.trip:not(.assigned)');
    const l = target.closest<HTMLElement>('.track');
    if (t) {
      sel = sel === t.dataset.id ? null : (t.dataset.id ?? null);
      out.classList.remove('bad');
      out.textContent = sel ? `${sel} selected. Choose a driver.` : 'Select a trip, then a driver.';
      draw();
      return;
    }
    if (l && sel) {
      const tr = trips.find((x) => x.id === sel)!;
      const lane = l.dataset.lane!;
      if (clash(tr, lane)) {
        out.textContent = `Blocked: ${lane} already has an overlapping trip. Pick another driver.`;
        out.classList.add('bad');
        return;
      }
      at[sel] = lane;
      out.classList.remove('bad');
      out.textContent = `${sel} assigned to ${lane}. Demo only, nothing is saved.`;
      sel = null;
      draw();
    }
  });
  draw();
});
