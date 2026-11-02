import { PRICES } from './pricing';

export const SITE = {
  url: 'https://forwardweb.ca',
  name: 'ForwardWeb',
  tagline: 'Web products, made findable',
  founder: 'Maksut Ozcan',
  founderShort: 'Max Ozcan',
  email: 'info@forwardweb.ca',
  phone: '(647) 909-4565',
  phoneIntl: '+1-647-909-4565',
  locality: 'Vaughan',
  region: 'ON',
  country: 'CA',
  geo: { latitude: 43.8361, longitude: -79.4983 },
  /** One editable string. Change it when it stops being true. */
  availability: 'Taking projects now',
  replyTime: 'I reply within two working days.',
} as const;

export interface NavLink { label: string; href: string }

export const NAV: NavLink[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'In development', href: '/apps/' },
  { label: 'Free tools', href: '/tools/' },
  { label: 'Notes', href: '/notes/' },
  { label: 'About', href: '/about/' },
];

export const TOOLS = [
  { slug: 'ai-visibility-check', name: 'AI visibility check', thumb: 'check', short: 'Eight questions, a score, three fixes.' },
  { slug: 'robots-txt-checker', name: 'AI crawler checker', thumb: 'robots', short: 'Which AI crawlers can read your robots.txt.' },
  { slug: 'snippet-preview', name: 'Snippet preview', thumb: 'snippet', short: 'Your title and description, measured in pixels.' },
  { slug: 'schema-generator', name: 'Schema generator', thumb: 'schema', short: 'LocalBusiness and Service JSON-LD, checked as you type.' },
  { slug: 'llms-txt-generator', name: 'llms.txt generator', thumb: 'llms', short: 'Build the file in a minute, with an honest note on what it does.' },
  { slug: 'utm-builder', name: 'UTM link builder', thumb: 'utm', short: 'Consistent campaign links, with a naming guard.' },
] as const;

export const serviceOffers = (): { name: string; price: number; per: string }[] => [
  { name: 'AI visibility audit', price: PRICES.audit.amount, per: '' },
  { name: 'SEO and AI retainer', price: PRICES.retainer.amount, per: 'month' },
  { name: 'Website build', price: PRICES.websites.amount, per: '' },
  { name: 'Web app build', price: PRICES.webApps.amount, per: '' },
  { name: 'Dashboard build', price: PRICES.dashboards.amount, per: '' },
  { name: 'AI automation', price: PRICES.automation.amount, per: '' },
  { name: 'Care plan', price: PRICES.care.amount, per: 'month' },
];
