import { getCollection, type CollectionEntry } from 'astro:content';

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
export async function publishedNotes(now = new Date()): Promise<Note[]> {
  const all = await getCollection('notes', (n) => !n.data.draft && n.data.publishedAt.getTime() <= now.getTime());
  return all.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export const readMinutes = (body: string | undefined): number => Math.max(1, Math.round((body ?? '').split(/\s+/).filter(Boolean).length / 220));

export const fmtDate = (d: Date): string => d.toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const fmtMonth = (d: Date): string => d.toLocaleDateString('en-CA', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
export const categorySlug = (name: string): string => name.toLowerCase();

export const PER_PAGE = 12;
