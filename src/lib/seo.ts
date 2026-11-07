import { SITE } from '../data/site';
import { type PriceKey } from '../data/pricing';

type Json = Record<string, unknown>;

export const abs = (path: string): string => new URL(path, SITE.url).toString();

export const ID = {
  business: `${SITE.url}/#business`,
  person: `${SITE.url}/#maksut-ozcan`,
  website: `${SITE.url}/#website`,
  notes: `${SITE.url}/notes/#blog`,
} as const;

/** A short, self-contained reference to the business. Google resolves an `@id` only within the
 *  page it appears on, and the full ProfessionalService node is only on the home page, so every
 *  other page carries its name, url and logo instead of a bare `@id`. */
const businessRef = (): Json => ({
  '@type': 'Organization',
  '@id': ID.business,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: abs('/icon-512.png'),
});

export const person = (): Json => ({
  '@type': 'Person',
  '@id': ID.person,
  name: SITE.founder,
  jobTitle: 'Founder',
  url: abs('/about/'),
  worksFor: { '@type': 'Organization', '@id': ID.business, name: SITE.name, url: `${SITE.url}/` },
  address: { '@type': 'PostalAddress', addressLocality: SITE.locality, addressRegion: SITE.region, addressCountry: SITE.country },
});

export const professionalService = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ID.business,
  name: SITE.name,
  // The Google Business Profile is "Forward Web"; it used to be "Forward Web Design & Hosting".
  alternateName: ['Forward Web', 'Forward Web Design & Hosting'],
  description:
    'ForwardWeb builds web products and makes them findable by search engines and AI assistants, for a small number of businesses at a time.',
  url: `${SITE.url}/`,
  image: abs('/og/default.png'),
  logo: abs('/icon-512.png'),
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
  alternateName: 'Forward Web',
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

/** A Service. Deliberately NO Offer: the site shows no currency (Max, 2026-11-03; Canadian
 *  clients are quoted in CAD, US clients in USD), and an Offer requires one. `price` is kept
 *  in the signature so callers still name their PriceKey if that decision changes. */
export const service = (opts: { name: string; description: string; path: string; price: PriceKey; area?: string }): Json => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    provider: { ...businessRef(), '@type': 'ProfessionalService', telephone: SITE.phoneIntl, address: { '@type': 'PostalAddress', addressLocality: SITE.locality, addressRegion: SITE.region, addressCountry: SITE.country } },
    areaServed: opts.area ? { '@type': 'AdministrativeArea', name: opts.area } : { '@type': 'Country', name: 'Canada' },
  };
};

export const blogPosting = (o: { title: string; description: string; path: string; published: Date; modified: Date; image: string; section?: string; words?: number }): Json => ({
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
  ...(o.section ? { articleSection: o.section } : {}),
  ...(o.words ? { wordCount: o.words } : {}),
  isPartOf: { '@type': 'Blog', '@id': ID.notes, name: 'ForwardWeb Notes', url: abs('/notes/') },
  author: person(),
  publisher: businessRef(),
});

export const webApplication = (o: { name: string; description: string; path: string; image?: string }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: o.name,
  description: o.description,
  url: abs(o.path),
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  ...(o.image ? { image: abs(o.image) } : {}),
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'CAD' },
  author: person(),
  publisher: businessRef(),
});

/** Listing pages (notes, categories, tools, work, apps): the page plus the list it shows. */
export const collectionPage = (o: { name: string; description: string; path: string; items: { name: string; path: string }[] }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: o.name,
  description: o.description,
  url: abs(o.path),
  inLanguage: 'en-CA',
  isPartOf: { '@type': 'WebSite', '@id': ID.website, name: SITE.name, url: `${SITE.url}/` },
  publisher: businessRef(),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: o.items.length,
    itemListElement: o.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })),
  },
});

/** The case study: an Article by Max, about work he did. */
export const caseStudy = (o: { title: string; description: string; path: string; published: string; image: string; about: string }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: o.title,
  description: o.description,
  url: abs(o.path),
  mainEntityOfPage: abs(o.path),
  datePublished: o.published,
  image: abs(o.image),
  inLanguage: 'en-CA',
  genre: 'Case study',
  about: o.about,
  author: person(),
  publisher: businessRef(),
});

export const contactPage = (o: { name: string; description: string; path: string }): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: o.name,
  description: o.description,
  url: abs(o.path),
  inLanguage: 'en-CA',
  about: { ...businessRef(), email: SITE.email, telephone: SITE.phoneIntl },
});

/** Safe to drop inside a script tag. */
export const ldString = (data: Json): string => JSON.stringify(data).replace(/</g, '\\u003c');
