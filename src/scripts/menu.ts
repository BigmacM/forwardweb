// Phone menu: a native <details> sheet. Without JS it still opens and closes.
// With JS, while it is open: Escape closes it and returns focus to the Menu button, and the page behind
// it (main, footer, logo, header button) is inert, so Tab cannot wander under the overlay.
const menu = document.querySelector<HTMLDetailsElement>('.menu');
if (menu) {
  const summary = menu.querySelector<HTMLElement>('summary')!;
  const behind = () => [...document.querySelectorAll<HTMLElement>('main, footer, .skip, .nav .logo, .nav .call-sm')];

  const sync = () => behind().forEach((el) => (el.inert = menu.open));

  menu.addEventListener('toggle', sync);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      sync(); // the toggle event is asynchronous, so release the page now
      summary.focus();
    }
  });
  // Following a link inside the sheet, or the desktop layout returning, must not leave the page inert.
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) {
      menu.open = false;
      sync();
    }
  });
  matchMedia('(min-width: 861px)').addEventListener('change', (m) => {
    if (m.matches) {
      menu.open = false;
      sync();
    }
  });
  sync();
}
