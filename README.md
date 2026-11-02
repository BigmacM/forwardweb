# ForwardWeb

Astro static site for forwardweb.ca. Branch `astro-rebuild`; the live site is still the old static files on `master`.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 22.23.4 or newer). |
| `npm run dev` | Dev server. The lead form posts to `/api/lead.php`, which only runs on the PHP host, so expect that one request to fail locally. |
| `npm run build` | Writes the site to `dist/`. |
| `npm run check` | Type-check Astro and TypeScript files. |
| `node scripts/verify.mjs` | After a build: serves `dist/`, checks every route at 390px, SEO tags, every tool and demo, no-JS fallbacks, and writes screenshots to `mockups/build/`. Needs Puppeteer from `workspace/node_modules`. |
| `node scripts/cls.mjs` | After a build: layout-shift check with the browser cache enabled (warm loads, three widths), plus a fallback-fit check that the page is the same height with the web fonts blocked. |
| `npm run og` | Regenerates the 1200x630 images in `public/og/`. Only needed when a title changes. |

## Add a note

1. Create `src/content/notes/your-slug.md`. The filename is the URL: `/notes/your-slug/`.
2. Frontmatter:

```yaml
---
title: "The headline"
description: "Under 170 characters. Becomes the meta description."
publishedAt: 2026-11-10
updatedAt: 2026-11-10        # optional
category: How-to              # How-to | Test | Buying | News
author: Maksut Ozcan
draft: false
standfirst: "Optional line under the headline."
seoTitle: "Optional shorter tab and search title"
summary:                      # optional "short version" box
  - "A point an assistant could quote."
---
```

3. Write in Markdown. For a pull quote use `<p class="pull">...</p>`.
4. A post with a future `publishedAt`, or `draft: true`, is left out of the build. To publish a scheduled post, rebuild on or after its date. The cover art is generated from the category and the filename, so every post gets a stable one.
5. Never type a price in a post. Use `{{price:audit}}` for "$1,500" or `{{from:audit}}` for "from $1,500".

## Change prices

Edit `src/data/pricing.ts`. Pages, JSON-LD, forms and Markdown tokens all read from it, so that is the only place. Prices are CAD plus HST, "from" prices. The availability line ("Taking projects now") is one string in `src/data/site.ts`.

## Forms

The apply and audit forms post to `public/api/lead.php`, which becomes `/api/lead.php`. It mails maksut890@gmail.com from info@forwardweb.ca with Reply-To set to the visitor, validates on the server, has a honeypot, and limits each IP to 5 sends an hour (file in the system temp directory). No secrets are stored in it. Without JS the form posts normally and redirects to `/thanks/`.

## Build and deploy

Build locally or in CI with `npm run build`, then serve the contents of `dist/` from the Hostinger web root. `dist/.htaccess` carries HTTPS, the 301s from the old suburb pages, caching and the 404 page. Deploy is TBD by d0t. Do not push `master` or upload until it is agreed: the site takes real enquiries.

## Notes for whoever edits this

- Tailwind is not used. Styles are three layers in `src/styles/` (`global.css`, `pages.css`, `site.css`) ported from the approved mockups, so a few rules override earlier ones on purpose.
- Illustrations are drawn in code in `src/lib/ill.ts` and wrapped by `Glyph`, `Cover`, `ToolThumb`, `Annotate` and `Ill` components. No icon packs.
- GoTour screenshots live in `src/assets/shots/`. Re-shoot and re-annotate (`src/data/work.ts`) after any redesign of that site.
- robots.txt must not name individual AI bots: naming a bot opts it out of the `*` rules.

## Fonts and layout shift

Fonts are self-hosted from Fontsource and the six used above the fold are preloaded. `src/styles/site.css` also declares metric-matched fallback faces ("Schibsted Grotesk Fallback", "Source Serif 4 Fallback") that scale Arial and Georgia so text wraps the same before and after the web font arrives. If you change a font or a weight, re-measure the width ratios and run `node scripts/cls.mjs`. Test layout shift with the cache enabled: a disabled cache hides font-swap shifts.
