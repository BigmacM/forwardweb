import type { PriceKey } from './pricing';
import type { glyph } from '../lib/ill';

export interface Service {
  id: string;
  name: string;
  glyph: keyof typeof glyph;
  price: PriceKey;
  /** Row copy on the home page and the services page. */
  summary: string;
  /** A dedicated landing page exists for this one. */
  page?: string;
  lead?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: 'ai-visibility',
    name: 'AI visibility',
    glyph: 'ai',
    price: 'audit',
    summary: "A fixed-price audit of how ChatGPT and Google's AI answers see you, then the fixes, done for you.",
    page: '/services/ai-visibility/',
    lead: true,
  },
  {
    id: 'seo',
    name: 'SEO',
    glyph: 'seo',
    price: 'retainer',
    summary: 'Technical, content and local, measured against leads rather than rankings.',
    page: '/services/seo/',
  },
  {
    id: 'websites',
    name: 'Websites',
    glyph: 'web',
    price: 'websites',
    summary: 'Fast, plain, hand-built to turn a visit into an enquiry.',
    page: '/services/websites/',
  },
  {
    id: 'web-apps',
    name: 'Web apps',
    glyph: 'app',
    price: 'webApps',
    summary: 'Booking, dispatch and ops software for businesses outgrowing spreadsheets.',
    page: '/services/web-apps/',
  },
  {
    id: 'dashboards',
    name: 'Dashboards',
    glyph: 'dash',
    price: 'dashboards',
    summary: 'One screen that answers whether it is working, from your own data.',
  },
  {
    id: 'automation',
    name: 'AI automation',
    glyph: 'auto',
    price: 'automation',
    summary: 'Agent workflows that take repeat marketing work off your plate, with you approving the output.',
  },
];
