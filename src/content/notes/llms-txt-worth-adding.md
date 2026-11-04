---
title: "Is llms.txt worth adding to your website?"
description: "Google says it does not endorse llms.txt and needs no AI-specific files. What the file is, what I put in mine on forwardweb.ca, and why I treat it as housekeeping."
publishedAt: 2026-11-07
updatedAt: 2026-11-07
category: Test
author: Maksut Ozcan
draft: false
seoTitle: "Is llms.txt worth adding? What Google says"
standfirst: "It is cheap and harmless, so add one if you want to. But I have no evidence that any AI assistant reads it, and it will not get you recommended."
summary:
  - "llms.txt is a plain markdown file at the root of your site that summarises it for language models. It is a proposal, not a standard that search engines have adopted."
  - "Google's John Mueller said 'to be direct, no' when asked if Google's use of the file on some of its own sites is an endorsement. Google also says you do not need AI text files to appear in AI Overviews."
  - "I serve one on forwardweb.ca as housekeeping. I cannot show you an assistant reading it, so I do not count it as a ranking lever."
---

Everyone selling AI visibility has an opinion on llms.txt, and the opinions run from essential to useless. I run one on my own site, so I have a stake in saying plainly what I know and what I do not.

The short version is in the standfirst. The rest of this note is the reasoning, what the file contains, and how to decide whether to bother.

## What is llms.txt?

It is a plain text file, written in markdown, that sits at the root of a site, so that it loads at `yourdomain.com/llms.txt`. The idea, from a community proposal, is to give a language model a short, clean summary of the site and a list of the most useful pages, without the navigation, scripts and layout that make ordinary pages hard to read.

A typical file has a title, a one-paragraph description of what the site is, and sections of links with a short note on each. It is closer to a table of contents written for a machine than to a robots.txt. It does not allow or block anything. It only describes.

## What does Google say about llms.txt?

Google has been fairly direct. On 20 January 2026, Search Engine Roundtable [reported Mueller's answer](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html) when asked whether Google putting llms.txt files on some of its own properties counts as an endorsement. He replied, "to be direct, no." The same report says Google's Search team removed the file from its developer docs shortly after adding it, and that Mueller said the file had been added for other reasons. I checked that article on 3 November 2026.

Google's [guidance on AI features in Search](https://developers.google.com/search/docs/appearance/ai-features), checked the same day, says there are no additional requirements to appear in AI Overviews or AI Mode, and that you do not need to create new machine-readable files, AI text files or markup to appear in them. It does not mention llms.txt by name. The sentence about "AI text files" is as close as Google's own guidance gets.

One caution: that is Google's position about Google's products. It says nothing about what any other company's crawler does.

## Does any assistant read it?

I do not know, and that is the honest answer. As far as I can find, none of the major assistants has published a statement that its crawler uses llms.txt to choose or rank sources. OpenAI documents its crawlers, OAI-SearchBot, GPTBot and ChatGPT-User, in its [bots documentation](https://developers.openai.com/api/docs/bots), and I did not find it listed there as a crawler policy on 3 November 2026. Absence from the docs is not proof that nothing reads it. It does mean there is nothing to cite.

There is one way to find out on your own site, and I would rather you did it than trusted me. Your server's access log shows every request for `/llms.txt`, along with the user agent that made it. If a named assistant crawler asks for the file, you have evidence. If nothing but your own browser and the odd generic bot does, you have your answer. I cannot show you a log of an assistant fetching mine, so I do not claim one.

<p class="pull">No evidence is not the same as evidence of absence. It is still a bad reason to build a strategy.</p>

## What did I put in mine?

On forwardweb.ca the file is generated from the same data the site already uses, so it never drifts out of date. You can see it at [forwardweb.ca/llms.txt](/llms.txt). It contains:

- The site name and a short description of who I am and what I do.
- A line stating that audits and websites start at a price, pulled from the same source as the services page. If the price changes, the file changes with it.
- A short list of key pages: services, case study, products in development, about and apply.
- The free tools, with a one-line description of each.
- Every published note, with its title and description.

It rebuilds on every deploy, so a new note appears in it with no extra work. That is the real reason I have one: it costs nothing to maintain. The comment in the code that generates it calls it optional housekeeping, and that is how I think of it.

## Should you add one?

It depends on what you expect from it.

| If you want | Then |
|---|---|
| A ranking or recommendation boost | Do not expect one. No evidence supports it. |
| A tidy, current summary of your site | Yes, it is a reasonable use of ten minutes. |
| To fix a visibility problem | Spend the time on crawler access, consistent facts and direct answers first. |

<p class="tcap">My own reading, not a published benchmark. Checked against Google's guidance on 3 November 2026.</p>

If you add one, a few rules keep it from becoming a liability.

1. **Only list pages you would be happy for anyone to read.** The file is public.
2. **Keep it true.** A stale price or a link to a deleted page is worse than no file.
3. **Do not use it to hide things.** It does not block anything, and robots.txt is not security either. I explained the second point in [Is your robots.txt blocking AI crawlers?](/notes/robots-txt-blocking-ai-crawlers-exposes-admin/).

My free [llms.txt generator](/tools/llms-txt-generator/) builds a file from your site name, a summary and your key pages. It runs in your browser, nothing is sent anywhere, and it does not check that your links work.

## What should you spend the time on instead?

First, make sure AI crawlers can read your site at all, with the [robots.txt checker](/tools/robots-txt-checker/). Then make your facts identical everywhere, put a direct answer in the first paragraph of your key pages, and measure the result with the method in [How to check whether ChatGPT recommends your business](/notes/check-chatgpt-recommends-your-business/). The full list is in the pillar note, [How a small business gets recommended by ChatGPT, Gemini and Google AI Overviews](/notes/get-recommended-by-chatgpt-gemini-ai-overviews/).

## FAQ

### Is llms.txt the same as robots.txt?

No. robots.txt tells crawlers which paths they may fetch. llms.txt only describes your site and links to pages. It blocks and allows nothing.

### Will llms.txt hurt my SEO?

I have no reason to think so. It is a static text file. Just do not put anything in it that you would not want public.

### Where do I put the file?

At the root of your site, so it loads at `yourdomain.com/llms.txt`.

## Next step

If you want to know whether the bigger things are in place, take the [90-second AI visibility self-check](/tools/ai-visibility-check/). It scores the areas that assistants do lean on. If you would rather have someone read your site and give you a written plan in priority order, that is the fixed-price audit. It starts {{from:audit}} plus tax. You can [request the audit here](/apply/#audit).
