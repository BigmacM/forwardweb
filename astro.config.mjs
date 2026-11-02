import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkPrices } from './src/lib/tokens.mjs';

export default defineConfig({
  site: 'https://forwardweb.ca',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Prices in Markdown are {{price:key}} tokens resolved from src/data/pricing.ts.
  markdown: { processor: unified({ remarkPlugins: [remarkPrices] }) },
  integrations: [
    sitemap({
      // /thanks/ is a post-submit page, not something to index.
      filter: (page) => !page.endsWith('/thanks/'),
    }),
  ],
});
