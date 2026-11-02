import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedNotes } from '../lib/notes';

export async function GET(context: APIContext) {
  const notes = await publishedNotes();
  return rss({
    title: 'ForwardWeb notes',
    description: 'What I test on my own sites and clients\' sites, written up with dates.',
    site: context.site!,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: n.data.publishedAt,
      link: `/notes/${n.id}/`,
      categories: [n.data.category],
      author: `info@forwardweb.ca (${n.data.author})`,
    })),
    customData: '<language>en-ca</language>',
  });
}
