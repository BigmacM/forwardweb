// Case study enhancement. Everything is readable without this: it only highlights the active stage,
// turns the matching chart dot amber, and fills the conversion bars on first view.
const steps = [...document.querySelectorAll<HTMLElement>('.step')];
const dots = [...document.querySelectorAll<SVGElement>('.mkk')];
const label = document.querySelector<HTMLElement>('[data-stage]');

const activate = (i: number) => {
  steps.forEach((s, k) => s.classList.toggle('on', k === i));
  dots.forEach((d, k) => d.classList.toggle('on', k === i));
  if (label) label.textContent = steps[i]?.dataset.n ?? 'All four stages';
};

if ('IntersectionObserver' in window) {
  steps.forEach((s) =>
    new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) activate(Number((e.target as HTMLElement).dataset.i));
        }),
      { rootMargin: '-40% 0px -50% 0px' },
    ).observe(s),
  );
  const bars = document.getElementById('bars');
  if (bars) {
    new IntersectionObserver((entries, o) => {
      if (entries.some((e) => e.isIntersecting)) {
        bars.classList.add('go');
        o.disconnect();
      }
    }).observe(bars);
  }
}
