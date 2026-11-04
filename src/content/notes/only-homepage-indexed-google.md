---
title: "Only your homepage is indexed in Google? A 30-minute diagnostic"
description: "Google says 'crawled, currently not indexed' is common, and Mueller called a homepage-only index a general quality issue. A 30-minute check, from a week-old site."
publishedAt: 2026-11-06
updatedAt: 2026-11-06
category: How-to
author: Maksut Ozcan
draft: false
seoTitle: "Only homepage indexed? 30-minute Google diagnostic"
standfirst: "If Google has indexed your homepage and almost nothing else, work through five checks in order: the page itself, the sitemap, internal links, how much each page adds, and then patience. Most of the time it is not a crawl budget problem."
summary:
  - "John Mueller, in a reply reported on 3 November 2026, said a site with only its homepage indexed sounds like a general quality issue. That is a hint, not a diagnosis."
  - "Google rewrote its help text for 'Crawled - currently not indexed' to say it is common and does not necessarily indicate an issue."
  - "Check URL Inspection, the sitemap, internal links and page substance in that order. Crawl budget is not the cause for a small site."
---

Our own site is a week old. Search Console shows impressions on only a few of its URLs, which is normal for a new domain and is also exactly what a real problem looks like at the start. The two are hard to tell apart from the outside, so I wrote down the order I check things in.

This note is that order, with what Google has said this week about it. It takes about 30 minutes and uses only free tools.

## What did Google say this week?

Two reports appeared on 3 November 2026, both from Search Engine Roundtable.

First, John Mueller replied on Bluesky to a site owner whose site had only its homepage indexed after a hack. [As reported](https://www.seroundtable.com/google-quality-issues-home-page-indexed-42439.html), he said it was impossible to say without more information, and that it "sounds like a general quality issue that might be unrelated to the hack." The article does not give an exact date for the reply, and Mueller did not rule out other causes. It was one reply about one site, so read it as a direction to look in and not as a rule.

Second, Google changed its help text for the status "Crawled - currently not indexed". Schwartz [reported the rewrite](https://www.seroundtable.com/google-updates-crawled-currently-not-indexed-42450.html) and noted that the new wording says nothing about quality. I checked Google's [page indexing help](https://support.google.com/webmasters/answer/7440203) on 3 November 2026. It now says Google "doesn't index all pages across the web, so this is a common message for many sites and doesn't necessarily indicate an issue that needs attention." For important pages, it tells you to use URL Inspection and other tools to look for problems.

Put together: seeing that status on some pages is normal. Seeing it on nearly every page that matters is a signal worth working through.

## How do you check it in 30 minutes?

Work in this order. Each step is cheaper than the next, and each rules something out.

<div class="method">

1. **Inspect one important URL (5 minutes).** In Search Console, paste a page that should be indexed into URL Inspection. Read the verdict. "URL is not on Google" with a reason is better than a guess. Then run "Test live URL" to confirm Google can fetch it and that nothing blocks or noindexes it. Google notes the live test does not cover duplicate or canonical conditions, so also read the canonical Google chose.
2. **Check the page is allowed in (5 minutes).** Look for a noindex tag, a blocking rule in robots.txt, a login wall, or a canonical pointing somewhere else. These are the boring causes and the most common.
3. **Check the sitemap (5 minutes).** Is it submitted in Search Console, does it list the pages you care about, and does it list only canonical, working URLs? A sitemap helps Google discover URLs. Google's [sitemap overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) says plainly that it does not guarantee they are crawled and indexed.
4. **Check internal links (5 minutes).** Can you reach every important page by clicking from the homepage? A page linked from nowhere is hard to find and easy to treat as unimportant. Link to it from pages that already get visits, with descriptive anchor text.
5. **Check what each page adds (10 minutes).** Open the pages that are not indexed and ask whether they say something the indexed pages and the rest of the web do not. This is the step the Mueller comment points at.

</div>

## What does "crawled, currently not indexed" mean next to "discovered"?

The two statuses sound alike and mean different things.

| Status | What it means | Where to look first |
|---|---|---|
| Discovered, currently not indexed | Google knows the URL but has not fetched it yet | Sitemap, internal links, how new the site is |
| Crawled, currently not indexed | Google fetched the page and chose not to index it for now | Page substance, duplication, internal links |

<p class="tcap">Status wording from Google's page indexing help, checked 3 November 2026. The reading in the right column is mine.</p>

Google's help describes "discovered" as found but not crawled yet, sometimes because crawling was expected to overload the site.

## Is it a crawl budget problem?

Almost never, for a small site. Google's [crawl budget guide](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget) is written for sites with a million or more pages that change weekly, or ten thousand or more that change daily, and for sites with a large share of URLs in the "discovered" state. It says the numbers are rough. If your site has thirty pages, the crawl budget guide is not about you, and "improve crawl budget" advice sold to you is a red flag.

Repeatedly clicking "Request indexing" does not change whether Google decides a page is worth keeping.

## Is it a quality problem?

Sometimes, and this is the hard part. Mueller's comment suggests that when almost nothing but the homepage is indexed, the site-wide quality picture is worth examining. For a week-old site that is also just what "new" looks like, so be careful not to over-read it.

These are the signs I check on the pages that are not indexed.

- **Thin pages.** A page with a heading, one paragraph and a contact button.
- **Near-duplicates.** Twenty pages that differ only by a town name.
- **Pages with no unique contribution.** Content that restates what a dozen other sites already say, without first-hand detail.
- **Pages nothing links to,** which tells Google you do not value them either.

The fix for all four is the same: fewer, better pages. Merge the thin ones, add real detail from your work to the ones that matter, and link to them from your best pages. I do not publish a page unless it carries something I can stand behind: a test I ran, a number from a client, a process I can show.

<p class="pull">Indexing is Google's decision about whether a page is worth keeping. You cannot request your way past that.</p>

## When is the answer just to wait?

If the site is new, the technical checks pass and the pages are substantial, wait. A new domain has no history. Keep adding useful pages, earn a few real links, and look again in a few weeks. That is the stage I am in. I would rather say so than invent a cause.

Act sooner on a noindex, a robots.txt block or a server error. Those are fixable in an afternoon.

## FAQ

### How many pages should be indexed?

All the ones you want found, which is often fewer than you think. Google does not index every page it crawls, and Google says so in its own help.

### Does a hacked-site history hurt indexing?

It can, if the problem was in place for a long time, according to Mueller's reply. Clean up completely first, then judge the site on its quality.

### How long should I wait before worrying?

I will not invent a number. For a new site, judge by direction over several weeks: are more pages appearing in Search Console, and are impressions growing?

## Next step

If you have worked through the five steps and the cause is still unclear, that is what the fixed-price audit is for. I check the technical layer, read the pages the way Google would, and give you a written plan in priority order. It starts {{from:audit}} plus tax. You can [request the audit here](/apply/#audit). For the wider picture of how assistants find your site, start with [How a small business gets recommended by ChatGPT, Gemini and Google AI Overviews](/notes/get-recommended-by-chatgpt-gemini-ai-overviews/), and test that crawlers can reach you with the free [robots.txt checker](/tools/robots-txt-checker/).
