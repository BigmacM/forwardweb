---
title: "Impressions but no clicks in Search Console: what to fix and what to wait out"
description: "Our new site had 155 impressions and 0 clicks in its first 7 days. Why impressions without clicks usually means position, not a broken page, and what to do about it."
publishedAt: 2026-11-09
updatedAt: 2026-11-09
cover: impressions
category: How-to
author: Maksut Ozcan
draft: false
seoTitle: "Impressions but no clicks: fix or wait?"
standfirst: "Impressions without clicks usually mean your page is showing up too far down for anyone to reach it. My own site is the example, and most of what to do next is waiting."
summary:
  - "In our first 7 days forwardweb.ca had 155 impressions and 0 clicks, at average positions of roughly 45 to 80. That is a position problem, not a click-through problem."
  - "Check position before you touch titles. Below about the fifth page, nobody sees the result, so a better title cannot help yet."
  - "Fix what is yours to fix, such as titles, indexing and internal links. Wait out the rest, and watch the trend by week, not by day."
---

Seven days after forwardweb.ca went live, Google Search Console showed 155 impressions and no clicks at all. If I had seen that on a client's site, I would have asked one question first, and it was not about the titles.

This note walks through what impressions and clicks mean, why my own numbers look the way they do, and how to decide what to fix and what to leave alone. I will use my own site because it is a clean case. It has no history, no links to speak of and no traffic I could be confusing it with.

## What do 155 impressions and 0 clicks actually mean?

It means Google showed links to my pages 155 times and nobody clicked. The average positions on those impressions sat in a range of roughly 45 to 80.

Position 45 is about the fifth page of results if you count ten results per page, and 80 is around the eighth. Almost nobody scrolls there. Nobody clicking is the expected outcome, and it says very little about my titles or descriptions.

I am treating these as my own numbers from the first week, and I am not rounding them into a story. A week is a small sample. I will report the trend, not a verdict.

## What is the difference between position and click-through rate?

Position is where your link sat. Click-through rate (CTR) is clicks divided by impressions. Google defines both in its [Search Console performance report documentation](https://support.google.com/webmasters/answer/7042828) (checked 2026-11-03).

Two details of that definition catch people out.

- **Position is the topmost position your link held for a query, averaged across queries.** If a link showed at positions 2, 4 and 6 for one query, that query counts as position 2.
- **An impression counts when a link was seen, or could have been seen.** Google's wording is that the user sees, or could have seen, the link. A result on page six counts if the page loaded.

So an impression does not mean a person looked at you. At position 60 it mostly means you were technically listed. That is why impressions alone make a poor success measure for a new site.

## Why do I get impressions but no clicks?

There are four common reasons. Work down the list in order, because the cheap diagnosis comes first.

| Reason | What it looks like | Is it yours to fix? |
|---|---|---|
| Low position | Average position far below the first page | Slowly, through authority and content |
| Weak snippet | Position under 10, CTR far below its neighbours | Yes, the title and description |
| Wrong query | You rank for terms your page does not really answer | Yes, align the page or the target |
| Zero-click answer | An answer on the results page satisfies the searcher | Partly, by being the source quoted |

<p class="tcap">My own ordering of the common causes, from the way I triage sites. Not a published framework.</p>

For my site the answer is the first row. For most new sites it is too. It is rarer than people think to have a good position and a bad snippet.

## What counts as a good CTR?

I have no figure I can stand behind, and I would distrust a single one. CTR depends heavily on position, on the query, and on what else is on the page, such as ads, maps and AI answers. A branded search and a broad one are not comparable.

A better comparison is your own pages against each other. If two pages sit at similar positions and only one gets clicks, the quiet one has a snippet problem, and the [snippet preview tool](/tools/snippet-preview/) shows whether your title is cut off before the useful part.

## Are AI answers and zero-click results the reason?

Sometimes, but not in the first row of a new site.

Zero-click searches are real. SparkToro's [2024 study](https://sparktoro.com/blog/2024-zero-click-search-study-for-every-1000-us-google-searches-only-374-clicks-go-to-the-open-web-in-the-eu-its-360/) found about 58.5 percent of US searches and 59.7 percent of EU searches ended without a click to the open web. It used clickstream panel data from September 2022 to May 2024, covers the US and EU rather than Canada, and the page itself notes it may be out of date. Read it as a direction, not a Canadian number.

AI answers add a wrinkle in the report itself. Google says a click on an external link inside an AI Overview counts as a click, and that the whole Overview occupies a single position shared by all its links. So if you are cited in one, you may show a higher position than your blue link has. AI Overviews are also changing for brand searches this month, which I covered in [AI Overviews moving brand results to the right column](/notes/ai-overviews-brand-results-right-column/).

A different thing happens on the other side. People who do click through from an assistant behave differently. On a tour operator client's site, visitors referred from AI assistants converted at several times the rate of organic search visitors, and ChatGPT drove most of the bookings in one period. I am giving the pattern and not the numbers on purpose. The takeaway is that fewer clicks do not mean less value, which is a reason to care about being named and not only about being clicked. The [full guide to getting recommended by ChatGPT, Gemini and AI Overviews](/notes/get-recommended-by-chatgpt-gemini-ai-overviews/) covers how.

## What should I fix, and what should I wait out?

Split the list into what is in your hands and what is time.

<div class="method">

1. **Confirm the pages are indexed.** Use the URL Inspection tool on your key pages. Impressions on a handful of pages can hide that the rest are not indexed at all, which I cover in [what to check when only your homepage is indexed](/notes/only-homepage-indexed-google/).
2. **Match each page to one clear query.** If a page ranks for something it barely mentions, rewrite the page or let it go.
3. **Write the title and description for the searcher.** Put the answer or the distinctive detail first, and check the pixel width.
4. **Link to the page from your other pages.** Descriptive anchors tell Google what each page is about.
5. **Wait, and look weekly.** Compare the same weekday ranges. Day-to-day swings on a small site are noise.

</div>

What to wait out: authority. Moving from page six to page one is mostly about other sites referring to you and about your coverage of the topic being better than what is already there. That takes weeks to months, and no title change speeds it up.

On my own site, that means checking indexing first, then tightening the pages that already get impressions, and publishing notes that answer real questions.

## FAQ

### Is it bad to have impressions but no clicks?

Not on a new site. It usually means Google has found you and placed you low. Impressions are an early sign of discovery, and clicks follow position.

### How long until clicks start?

I cannot give a reliable timeline. It depends on competition, your links and how well each page answers its query. Judge by the weekly trend in position, not by a date.

### Could a Search Console click spike or drop be a bug?

Possibly. Search Engine Roundtable reported on 2026-11-03 that some sites saw unexplained click spikes, with no comment from Google yet ([Search Engine Roundtable's report](https://www.seroundtable.com/google-performance-reports-spike-clicks-42448.html)). Treat sudden jumps with suspicion until they repeat.

## What to do next

If you have impressions and the clicks are not coming, the quickest way to know whether it is position, snippet or indexing is to have someone look at the pages next to the data. That is what the fixed-price audit does. You can [request the audit here](/apply/#audit), starting {{from:audit}} plus tax, or see how [SEO measured on enquiries](/services/seo/) works.
