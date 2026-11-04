import { getCollection, type CollectionEntry } from 'astro:content';
import { fillPrices } from './tokens.mjs';
import { COVER_MOTIFS } from './ill';

export type Note = CollectionEntry<'notes'>;

export const CATEGORIES = [
  { slug: 'how-to', name: 'How-to' as const, blurb: 'Step by step, with the method I actually use.' },
  { slug: 'test', name: 'Test' as const, blurb: 'Things I ran and measured, with what I found.' },
  { slug: 'buying', name: 'Buying' as const, blurb: 'Cost, choosing, and what to ask before you sign.' },
  { slug: 'news', name: 'News' as const, blurb: 'Dated and labelled. News goes stale, so check the date.' },
];

/**
 * Published notes, newest first. Drafts and posts with a future publishedAt are left out,
 * so publishing a scheduled post is just a rebuild on or after its date.
 */
// PREVIEW_NOTES=1 includes scheduled posts, for QA builds only (never deploy that build).
export async function publishedNotes(now = process.env.PREVIEW_NOTES ? new Date(8.64e15) : new Date()): Promise<Note[]> {
  const all = await getCollection('notes', (n) => !n.data.draft && n.data.publishedAt.getTime() <= now.getTime());
  // Max, 2026-11-03: covers must not repeat. Fail the build on a missing, unknown or shared motif.
  const all2 = await getCollection('notes', (n) => !n.data.draft);
  const seen = new Map<string, string>();
  for (const n of all2) {
    const c = n.data.cover;
    if (!c || !COVER_MOTIFS.includes(c)) throw new Error(`Note ${n.id} needs a cover: one of ${COVER_MOTIFS.join(', ')}`);
    if (seen.has(c)) throw new Error(`Notes ${seen.get(c)} and ${n.id} share the cover "${c}". Add a new motif in src/lib/ill.ts.`);
    seen.set(c, n.id);
  }
  return all.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export const readMinutes = (body: string | undefined): number => Math.max(1, Math.round((body ?? '').split(/\s+/).filter(Boolean).length / 220));

export const fmtDate = (d: Date): string => d.toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const fmtMonth = (d: Date): string => d.toLocaleDateString('en-CA', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
export const categorySlug = (name: string): string => name.toLowerCase();

export const PER_PAGE = 12;

/**
 * Q&As from a note's `## FAQ` section (each `### question` followed by its answer), as plain
 * text for FAQPage JSON-LD. Markdown links, emphasis and HTML are flattened; price tokens are
 * filled. Returns [] when the note has no FAQ section.
 */
export function faqFromBody(body: string | undefined): { q: string; a: string }[] {
  if (!body) return [];
  const m = body.match(/^## FAQ[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!m) return [];
  const plain = (s: string) =>
    fillPrices(s)
      .replace(/<[^>]+>/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/(\*\*|__|\*|_|`)/g, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  return m[1]
    .split(/^### /m)
    .slice(1)
    .map((chunk) => {
      const [q, ...rest] = chunk.split('\n');
      return { q: plain(q), a: plain(rest.join('\n')) };
    })
    .filter((f) => f.q && f.a);
}
