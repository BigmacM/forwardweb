import { SITE } from '../data/site';
import { PRICES, type PriceKey } from '../data/pricing';

type Json = Record<string, unknown>;

export const abs = (path: string): string => new URL(path, SITE.url).toString();

export const ID = {
  business: `${SITE.url}/#business`,
  person: `${SITE.url}/#maksut-ozcan`,
  website: `${SITE.url}/#website`,
} as const;

export const person = (): Json => ({
  '@type': 'Person',
  '@id': ID.person,
  name: SITE.founder,
  jobTitle: 'Founder',
  url: abs('/about/'),
  worksFor: { '@id': ID.business },
  address: { '@type': 'PostalAddress', addressLocality: SITE.locality, addressRegion: SITE.region, addressCountry: SITE.country },
});

export const professionalService = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ID.business,
  name: SITE.name,
  description:
    'ForwardWeb builds web products and makes them findable by search engines and AI assistants, for a small number of businesses at a time.',
  url: `${SITE.url}/`,
  image: abs('/og/default.png'),
  email: SITE.email,
  telephone: SITE.phoneIntl,
  address: { '@type': 'PostalAddress', addressLocality: SITE.locality, addressRegion: SITE.region, addressCountry: SITE.country },
  geo: { '@type': 'GeoCoordinates', ...SITE.geo },
  areaServed: [
    { '@type': 'City', name: 'Vaughan' },
    { '@type': 'AdministrativeArea', name: 'York Region' },
    { '@type': 'AdministrativeArea', name: 'Ontario' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Continent', name: 'Europe' },
  ],
  knowsAbout: ['AI visibility', 'Search engine optimization', 'Web design', 'Web development', 'Web applications', 'Analytics dashboards'],
  founder: person(),
});

export const website = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': ID.website,
  url: `${SITE.url}/`,
  name: SITE.name,
  publisher: { '@id': ID.business },
  inLanguage: 'en-CA',
});

export const breadcrumbs = (crumbs: [string, string][]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

export const faqPage = (items: { q: string; a: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

/** A Service with its offer taken from pricing.ts, never typed here. */
export const service = (opts: { name: string; description: string; path: string; price: PriceKey; area?: string }): Json => {
  const p = PRICES[opts.price];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    provider: { '@type': 'ProfessionalService', '@id': ID.business, name: SITE.name, url: `${SITE.url}/` },
    areaServed: opts.area ? { '@type': 'AdministrativeArea', name: opts.area } : { '@type': 'Country', name: 'Canada' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD',
      price: p.amount,
      priceSpecification: {
        '@type': p.per ? 'UnitPriceSpecification' : 'PriceSpecification',
        minPrice: p.amount,
        priceCurrency: 'CAD',
        ...(p.per ? { unitText: 'MON' } : {}),
      },
    },
  };
};

export const blogPosting = (o: { title: string; description: string; path: string; published: Date; modified: Date; image: string }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: o.title,
  description: o.description,
  mainEntityOfPage: abs(o.path),
  url: abs(o.path),
  datePublished: o.published.toISOString().slice(0, 10),
  dateModified: o.modified.toISOString().slice(0, 10),
  image: abs(o.image),
  inLanguage: 'en-CA',
  author: person(),
  publisher: { '@id': ID.business },
});

export const webApplication = (o: { name: string; description: string; path: string }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: o.name,
  description: o.description,
  url: abs(o.path),
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'CAD' },
  author: { '@id': ID.person },
});

/** Safe to drop inside a script tag. */
export const ldString = (data: Json): string => JSON.stringify(data).replace(/</g, '\\u003c');
