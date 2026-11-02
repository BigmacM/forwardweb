// LocalBusiness / Service JSON-LD generator with basic validity checks. Runs in the browser, sends nothing.
import { copyText } from './copy';

type Mode = 'business' | 'service';

document.querySelectorAll<HTMLElement>('[data-schema]').forEach((root) => {
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const val = (name: string) => (root.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? '').trim();
  const out = $('[data-out]');
  const state = $('[data-state]');
  const touched = new Set<string>();

  const mode = (): Mode => (root.querySelector<HTMLInputElement>('input[name="sc-mode"]:checked')?.value as Mode) ?? 'business';

  const validUrl = (v: string) => {
    try {
      const u = new URL(v);
      return u.protocol === 'https:' || u.protocol === 'http:';
    } catch {
      return false;
    }
  };

  const errors = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!val('name')) e.name = 'Enter the name customers know you by.';
    if (!val('url')) e.url = 'Enter your website address, starting with https://.';
    else if (!validUrl(val('url'))) e.url = 'Start the address with https://, like https://yourbusiness.ca/.';
    if (val('description').length > 0 && val('description').length < 20) e.description = 'Say a little more, one or two sentences work well.';
    if (mode() === 'business') {
      if (val('telephone') && !/^\+?[0-9][0-9\s().-]{6,}$/.test(val('telephone'))) e.telephone = 'Use digits, like +1-416-555-0100.';
      if (val('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email'))) e.email = 'Enter an email like name@company.com.';
      if (val('country') && !/^[A-Za-z]{2}$/.test(val('country'))) e.country = 'Use a two-letter country code, like CA.';
    } else if (val('price') && !(Number(val('price')) >= 0)) e.price = 'Enter a number, like 1500.';
    return e;
  };

  const build = (): Record<string, unknown> => {
    const base: Record<string, unknown> = { '@context': 'https://schema.org' };
    if (mode() === 'business') {
      base['@type'] = val('type') || 'LocalBusiness';
      base.name = val('name');
      base.url = val('url');
      if (val('description')) base.description = val('description');
      if (val('telephone')) base.telephone = val('telephone');
      if (val('email')) base.email = val('email');
      const addr: Record<string, string> = {};
      if (val('street')) addr.streetAddress = val('street');
      if (val('city')) addr.addressLocality = val('city');
      if (val('region')) addr.addressRegion = val('region');
      if (val('postal')) addr.postalCode = val('postal');
      if (val('country')) addr.addressCountry = val('country').toUpperCase();
      if (Object.keys(addr).length) base.address = { '@type': 'PostalAddress', ...addr };
    } else {
      base['@type'] = 'Service';
      base.name = val('name');
      base.url = val('url');
      if (val('description')) base.description = val('description');
      if (val('provider')) base.provider = { '@type': 'Organization', name: val('provider') };
      if (val('area')) base.areaServed = val('area');
      if (val('price') && Number(val('price')) >= 0) {
        base.offers = {
          '@type': 'Offer',
          priceCurrency: (val('currency') || 'CAD').toUpperCase(),
          priceSpecification: { '@type': 'PriceSpecification', minPrice: Number(val('price')), priceCurrency: (val('currency') || 'CAD').toUpperCase() },
        };
      }
    }
    return base;
  };

  const update = () => {
    root.querySelectorAll<HTMLElement>('[data-for]').forEach((el) => (el.hidden = el.dataset.for !== mode()));
    const errs = errors();
    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]').forEach((el) => {
      const msg = errs[el.name];
      const slot = root.querySelector<HTMLElement>(`[data-err="${el.name}"]`);
      if (!slot) return;
      const show = !!msg && touched.has(el.name);
      slot.textContent = show ? msg : '';
      if (show) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
    const blocking = Object.keys(errs).filter((k) => k === 'name' || k === 'url');
    if (blocking.length) {
      out.textContent = '';
      state.textContent = 'Add a name and a website address to see your code.';
      return;
    }
    const others = Object.keys(errs).length;
    state.textContent = others ? `Code is ready, but ${others} field${others > 1 ? 's' : ''} above need${others > 1 ? '' : 's'} a fix before you paste it in.` : 'Looks valid. Paste it into a script tag of type application/ld+json.';
    const json = JSON.stringify(build(), null, 2);
    out.textContent = `<script type="application/ld+json">\n${json}\n<\/script>`;
  };

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name) touched.add(t.name);
    update();
  });
  root.addEventListener('change', update);
  root.addEventListener(
    'blur',
    (e) => {
      const t = e.target as HTMLInputElement;
      if (t.name) {
        touched.add(t.name);
        update();
      }
    },
    true,
  );
  $('[data-copy]').addEventListener('click', async () => {
    const ok = out.textContent ? await copyText(out.textContent) : false;
    $('[data-copystate]').textContent = ok ? 'Copied.' : out.textContent ? 'Copy failed. Select the code and copy it by hand.' : 'Nothing to copy yet.';
  });
  update();
});
