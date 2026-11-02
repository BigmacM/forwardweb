import { SITE } from '../data/site';
import { TOOL_PAGES } from '../data/tools';
import { publishedNotes } from '../lib/notes';
import { fromPrice } from '../data/pricing';
import { abs } from '../lib/seo';

// Optional housekeeping: no major assistant has confirmed it reads this file. It costs nothing and keeps the site description in one place.
export async function GET() {
  const notes = await publishedNotes();
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.name} is a one-person studio in ${SITE.locality}, ${SITE.region}, run by ${SITE.founder}. I build web products and make them findable by search engines and AI assistants. ${SITE.availability}.`,
    '',
    `Audits start ${fromPrice('audit')} CAD plus HST. Websites start ${fromPrice('websites')}. Every project starts with a fixed quote.`,
    '',
    '## Key pages',
    '',
    `- [Services and prices](${abs('/services/')}): what I do and what it costs`,
    `- [Case study](${abs('/work/tour-operator/')}): a site built from almost nothing to a top source of bookings`,
    `- [In development](${abs('/apps/')}): booking and dispatch products with playable demos`,
    `- [About](${abs('/about/')}): who I am and how I work`,
    `- [Apply](${abs('/apply/')}): request the audit or start a project`,
    '',
    '## Free tools',
    '',
    ...TOOL_PAGES.map((t) => `- [${t.name}](${abs(`/tools/${t.slug}/`)}): ${t.deck}`),
    '',
    '## Notes',
    '',
    ...notes.map((n) => `- [${n.data.title}](${abs(`/notes/${n.id}/`)}): ${n.data.description}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
