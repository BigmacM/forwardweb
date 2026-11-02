import type { PriceKey } from './pricing';
import { fillPrices } from '../lib/tokens.mjs';

export interface ServicePageData {
  slug: string;
  name: string;
  glyph: 'ai' | 'seo' | 'web' | 'app';
  price: PriceKey;
  title: string;
  description: string;
  h1: string;
  deck: string;
  /** The plain answer: what it is, who it is for, what it costs. */
  answer: string[];
  includes: { b: string; t: string }[];
  evidence: { label: string; href: string; text: string }[];
  faq: { q: string; a: string }[];
  cta: { label: string; href: string };
}

const RAW: ServicePageData[] = [
  {
    slug: 'ai-visibility',
    name: 'AI visibility audit',
    glyph: 'ai',
    price: 'audit',
    title: 'AI visibility audit, fixed price | ForwardWeb',
    description:
      'A fixed-price audit of whether ChatGPT and Google AI answers can read, understand and name your business, with a written plan you keep. By Max Ozcan, Vaughan.',
    h1: 'An AI visibility audit with a price on it.',
    deck: 'I find out whether ChatGPT, Google and other assistants can read, understand and name your business, then give you the fixes in order.',
    answer: [
      "People now ask an assistant who to hire before they ever open a search result. An AI visibility audit checks whether your business is part of that answer, and if it isn't, why not.",
      'It is for businesses that win customers on trust and local knowledge: trades, clinics, studios, tour operators, professional practices. It is not a promise that an assistant will recommend you. Nobody can sell you that. It is a written list of what is in your control, in the order I would fix it.',
      'The audit is a fixed price, and you keep the written plan whether or not we work together.',
    ],
    includes: [
      { b: 'Crawler access', t: 'Whether your robots.txt lets AI crawlers in, and whether a rule is quietly undoing another.' },
      { b: 'Structured data', t: 'Whether your pages tell a machine who you are, what you sell and where.' },
      { b: 'Direct answers', t: 'Whether your key pages answer price, process and timing in plain sentences an assistant can quote.' },
      { b: 'Listings and reviews', t: 'Whether your name, address and phone match everywhere, and your Google Business Profile is complete.' },
      { b: 'A sample of real questions', t: 'The questions a customer would type, asked repeatedly, with who gets named and what is said.' },
      { b: 'Measurement', t: 'Whether you can see visitors who arrive from assistants, as their own source.' },
    ],
    evidence: [
      { label: 'Case study', href: '/work/tour-operator/', text: 'A site I built and grew, where AI assistants became a top source of bookings.' },
      { label: 'Free check', href: '/tools/ai-visibility-check/', text: 'Eight questions and three fixes, in ninety seconds. The audit goes deeper.' },
      { label: 'Free tool', href: '/tools/robots-txt-checker/', text: 'Paste your robots.txt and see which AI crawlers can read you.' },
    ],
    faq: [
      { q: 'Can you guarantee ChatGPT will recommend my business?', a: 'No, and be wary of anyone who says they can. Assistants weigh sources differently and change over time. I fix what is in your control, check the result with repeated real questions, and tell you what moved.' },
      { q: 'What do I get at the end?', a: 'A written plan in priority order, with what to fix, why it matters and what it costs to fix. It is yours to keep. You can hand it to your own developer or ask me to do the work.' },
      { q: 'Do I have to hire you to do the fixes?', a: 'No. The audit stands on its own. If you want me to do the fixes, I quote them separately and fixed, before any work starts.' },
      { q: 'How is this different from SEO?', a: 'SEO is about ranking in search results. This is about being read and named in an assistant answer. They share a lot of groundwork, such as clean pages and structured data, but the checks are different.' },
    ],
    cta: { label: 'Request the audit', href: '/apply/#audit' },
  },
  {
    slug: 'seo',
    name: 'SEO',
    glyph: 'seo',
    price: 'retainer',
    title: 'SEO for small businesses, measured on leads | ForwardWeb',
    description:
      'Technical, content and local SEO for small businesses, measured against enquiries rather than rankings. A monthly retainer from Max Ozcan in Vaughan, Ontario.',
    h1: 'SEO measured on enquiries, not rankings.',
    deck: 'Technical, content and local work, run monthly by the person who does it, with a report that says what moved and what did not.',
    answer: [
      'SEO is the ongoing work of making a site easy to find, easy to trust and easy to act on. For a small business that means three layers: the technical base, content that answers what buyers ask, and the local signals Google uses for nearby searches.',
      'I work on a monthly retainer, and I measure it against enquiries and bookings rather than ranking screenshots. Where something did not work, the report says so.',
      'I built and grew my own booking site this way, and I run the search and measurement on it today. That is the work I would be doing for you.',
    ],
    includes: [
      { b: 'Technical base', t: 'Crawlability, speed, structure, canonicals and a real sitemap, so nothing blocks the rest.' },
      { b: 'Content on a schedule', t: 'Pages and articles built around the questions buyers type before they choose.' },
      { b: 'Local signals', t: 'Google Business Profile, consistent listings and review requests that follow the rules.' },
      { b: 'Measurement', t: 'GA4 and Search Console set up first, so every change can be traced to a result.' },
      { b: 'A monthly report', t: 'What moved, what did not, and what I will do next.' },
    ],
    evidence: [
      { label: 'Case study', href: '/work/tour-operator/', text: 'From almost no traffic to a top source of bookings, in four stages.' },
      { label: 'Notes', href: '/notes/', text: 'What I test on my own sites, written up with dates.' },
    ],
    faq: [
      { q: 'How long until I see results?', a: 'It depends on where the site starts, how competitive the search is and how much needs fixing. I will not promise a date. Measurement goes in first so you can see the direction of travel from the first month.' },
      { q: 'Why a monthly retainer?', a: 'SEO is steady work, not a switch. A retainer keeps content, fixes and reporting moving. If you would rather start with a single deliverable, begin with the audit.' },
      { q: 'Do you build links?', a: 'I do outreach that a human would be happy to receive, and I do not buy links. Links are a small part of the work for most local businesses.' },
      { q: 'Can I start with the audit?', a: 'Yes, and most people should. The audit gives you a written plan and tells us both whether a retainer is worth it.' },
    ],
    cta: { label: 'Book a call', href: '/apply/' },
  },
  {
    slug: 'websites',
    name: 'Websites',
    glyph: 'web',
    price: 'websites',
    title: 'Custom website design and build | ForwardWeb',
    description:
      'Fast, plain, hand-built websites that turn visits into enquiries, built and optimized for search and AI visibility by one person. From {{price:websites}} CAD plus HST.',
    h1: 'A website built to turn a visit into an enquiry.',
    deck: 'Hand-built, fast and plain. One person designs it, builds it and sets it up to be found.',
    answer: [
      'I build websites for businesses that want customers to find them, understand them and get in touch without friction. That means a clear first screen, a short path to the next step, and pages that load quickly on a phone.',
      'Every site is built search-ready and assistant-ready from the start: clean structure, structured data, direct answers on the pages that matter and measurement in place on launch day.',
      'You get a fixed quote before work starts. You own the code, the content and the accounts.',
    ],
    includes: [
      { b: 'Design and build', t: 'Designed around your customers and your brand, written in plain code that stays fast.' },
      { b: 'Search-ready from day one', t: 'Structure, speed, schema and a sitemap are part of the build, not an add-on.' },
      { b: 'Assistant-ready', t: 'Crawler access, direct answers and consistent facts so AI assistants can read and quote you.' },
      { b: 'Measurement', t: 'Analytics set up so you can see where enquiries come from, including assistants.' },
      { b: 'Ownership', t: 'The code, the content and the accounts are yours.' },
    ],
    evidence: [
      { label: 'Case study', href: '/work/tour-operator/', text: 'The site I built and grew, with the pages shown and annotated.' },
      { label: 'Free tool', href: '/tools/snippet-preview/', text: 'Check how your title and description will look in search.' },
    ],
    faq: [
      { q: 'How much does a website cost?', a: 'Websites start from {{price:websites}} CAD plus HST. The quote depends on the number of pages and what they need to do, and it is fixed before work begins. My note on Toronto market pricing is in the Notes section.' },
      { q: 'What happens after launch?', a: 'You can look after it yourself, or take the care plan at {{price:care}}. I put exactly what the plan covers in the written quote, so there is nothing to guess.' },
      { q: 'Do you use templates or page builders?', a: 'I build by hand. That is why the sites are light and why I can control the structure that search and assistants read.' },
      { q: 'Can you redesign my existing site without losing my rankings?', a: 'Yes. A redesign starts with a list of the pages that earn traffic and enquiries today, and the redirects that protect them.' },
    ],
    cta: { label: 'Book a call', href: '/apply/' },
  },
  {
    slug: 'web-apps',
    name: 'Web apps',
    glyph: 'app',
    price: 'webApps',
    title: 'Custom web apps for booking, dispatch and ops | ForwardWeb',
    description:
      'Custom booking, dispatch and operations software for businesses outgrowing spreadsheets, built by one developer. From {{price:webApps}} CAD plus HST, fixed quote first.',
    h1: 'Software for the part of your business that lives in a spreadsheet.',
    deck: 'Booking, dispatch and operations tools, built around how your business runs and priced before I start.',
    answer: [
      'When a business outgrows spreadsheets, off-the-shelf software often fits badly: you pay for features you do not use and work around the ones you need. I build the smaller thing that fits.',
      "I am building two products of this kind right now, a booking platform for studios and a dispatch system for tour operators, and you can try small demos of both on the In development page. They are private products, and I don't name the businesses.",
      'Web apps start from {{price:webApps}} CAD plus HST. The quote is fixed once we have agreed what version one does.',
    ],
    includes: [
      { b: 'Booking', t: 'Availability, holds and confirmations that block a double-booking instead of discovering it later.' },
      { b: 'Dispatch', t: 'Assign work to people and vehicles with conflicts caught before they happen.' },
      { b: 'Back office', t: 'Simple internal tools for the jobs your team does by hand today.' },
      { b: 'Dashboards', t: 'A single screen from your own data, so you can tell whether it is working.' },
    ],
    evidence: [
      { label: 'In development', href: '/apps/', text: 'Two playable demos of the logic, and what is still under NDA.' },
      { label: 'Dashboards', href: '/services/#dashboards', text: 'Smaller reporting builds, from {{price:dashboards}} CAD plus HST.' },
    ],
    faq: [
      { q: 'Why from {{price:webApps}}?', a: 'Because software that handles bookings, payments or dispatch has to be right. The price covers design, build, testing and handover for a first version that does one job properly.' },
      { q: 'Do I own the software?', a: 'Yes. The code and the accounts are yours, whether or not we keep working together.' },
      { q: 'Can you integrate with the tools I already use?', a: 'Often, yes. It depends on whether those tools have an API. I check that before I quote.' },
      { q: 'Can I see something first?', a: 'You can try the two demos on the In development page. They are small pieces of the real logic, and nothing in them is saved.' },
    ],
    cta: { label: 'Book a call', href: '/apply/' },
  },
];

/** Prices in the copy are {{price:key}} tokens, resolved here from pricing.ts. */
export const SERVICE_PAGES: ServicePageData[] = JSON.parse(fillPrices(JSON.stringify(RAW)));
