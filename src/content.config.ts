import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['How-to', 'Test', 'Buying', 'News']),
    author: z.string().default('Maksut Ozcan'),
    draft: z.boolean().default(false),
    /** The "short version" box at the top of the article: what an assistant would quote. */
    summary: z.array(z.string()).optional(),
    /** Standfirst under the headline. */
    standfirst: z.string().optional(),
    /** Shorter text for the browser tab and search result when the headline is long. */
    seoTitle: z.string().optional(),
    /** Cover illustration, one of COVER_MOTIFS in src/lib/ill.ts. Give each note its own. */
    cover: z.string().optional(),
  }),
});

export const collections = { notes };
