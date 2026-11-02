// LocalBusiness / Service JSON-LD generator with validity checks. Runs in the browser, sends nothing.
import { copyText } from './copy';

type Mode = 'business' | 'service';

/** Make JSON safe inside a script block: a typed "</script>" or "<!--" must not end or confuse the tag. */
export const safeForScript = (json: string): string => json.replace(/<\//g, '<\\/').replace(/<!--/g, '<\\u0021--');

const MAX_PRICE = 10_000_000;

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

  /** Everything wrong or missing, keyed by field name. */
  const errors = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!val('name')) e.name = 'Enter the name customers know you by.';
    if (!val('url')) e.url = 'Enter your website address, starting with https://.';
    else if (!validUrl(val('url'))) e.url = 'Start the address with https://, like https://yourbusiness.ca/.';
    if (!val('description')) e.description = 'Add a sentence or two about what you do.';
    else if (val('description').length < 20) e.description = 'Say a little more, one or two sentences work well.';
    if (mode() === 'business') {
      if (!val('telephone')) e.telephone = 'Add a phone number, like +1-416-555-0100.';
      else if (!/^\+?[0-9][0-9\s().-]{6,}$/.test(val('telephone'))) e.telephone = 'Use digits, like +1-416-555-0100.';
      if (val('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email'))) e.email = 'Enter an email like name@company.com.';
      if (!val('street')) e.street = 'Add the street address. Search engines expect a full address for a local business.';
      if (!val('city')) e.city = 'Add the city.';
      if (!val('region')) e.region = 'Add the province or state.';
      if (!val('postal')) e.postal = 'Add the postal code.';
      if (!val('country')) e.country = 'Add a two-letter country code, like CA.';
      else if (!/^[A-Za-z]{2}$/.test(val('country'))) e.country = 'Use a two-letter country code, like CA.';
    } else {
      if (!val('provider')) e.provider = 'Add your business name as the provider.';
      if (val('price')) {
        if (!/^\d+(\.\d{1,2})?$/.test(val('price'))) e.price = 'Enter a plain number, like 1500.';
        else if (Number(val('price')) > MAX_PRICE) e.price = 'That price is too large to be real. Check the number.';
      }
      if (val('currency') && !/^[A-Za-z]{3}$/.test(val('currency'))) e.currency = 'Use a three-letter currency code, like CAD.';
    }
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
      if (/^[A-Za-z]{2}$/.test(val('country'))) addr.addressCountry = val('country').toUpperCase();
      if (Object.keys(addr).length) base.address = { '@type': 'PostalAddress', ...addr };
    } else {
      base['@type'] = 'Service';
      base.name = val('name');
      base.url = val('url');
      if (val('description')) base.description = val('description');
      if (val('provider')) base.provider = { '@type': 'Organization', name: val('provider') };
      if (val('area')) base.areaServed = val('area');
      const price = val('price');
      if (/^\d+(\.\d{1,2})?$/.test(price) && Number(price) <= MAX_PRICE) {
        const cur = /^[A-Za-z]{3}$/.test(val('currency')) ? val('currency').toUpperCase() : 'CAD';
        base.offers = {
          '@type': 'Offer',
          priceCurrency: cur,
          priceSpecification: { '@type': 'PriceSpecification', minPrice: Number(price), priceCurrency: cur },
        };
      }
    }
    return base;
  };

  const update = () => {
    root.querySelectorAll<HTMLElement>('[data-for]').forEach((el) => (el.hidden = el.dataset.for !== mode()));
    const errs = errors();
    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]').forEach((el) => {
      const slot = root.querySelector<HTMLElement>(`[data-err="${el.name}"]`);
      if (!slot) return;
      const show = !!errs[el.name] && touched.has(el.name);
      slot.textContent = show ? errs[el.name] : '';
      if (show) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
    if (errs.name || errs.url) {
      out.textContent = '';
      state.textContent = errs.name && errs.url ? 'Add a name and a website address to see your code.' : errs.name ?? errs.url;
      return;
    }
    const open = Object.keys(errs).length;
    state.textContent = open
      ? `Draft only: ${open} field${open > 1 ? 's' : ''} still missing or wrong. Fill ${open > 1 ? 'them' : 'it'} in before you paste this into your site.`
      : 'Looks valid. Paste it into your page, then test the page with Google\'s Rich Results Test.';
    out.textContent = `<script type="application/ld+json">\n${safeForScript(JSON.stringify(build(), null, 2))}\n<\/script>`;
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
