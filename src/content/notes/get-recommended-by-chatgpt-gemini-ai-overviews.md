---
title: "How a small business gets recommended by ChatGPT, Gemini and Google AI Overviews in 2026"
description: "How AI assistants pick which local businesses to name, and what I fix first: crawler access, consistent facts, direct answers, reviews, schema and measurement."
publishedAt: 2026-11-04
updatedAt: 2026-11-04
cover: answer
category: How-to
author: Maksut Ozcan
draft: false
seoTitle: "How to get recommended by ChatGPT, Gemini and AI Overviews"
standfirst: "You get named by an AI assistant the same way you get found in search: be readable, be consistent, answer the question plainly, and be mentioned by other sites. There is no switch, and no file, that does it for you."
summary:
  - "Assistants name businesses they can read, can identify and keep seeing described the same way. Open crawler access, identical facts everywhere and direct answers on the page do most of the work."
  - "Google says there are no extra requirements for AI Overviews or AI Mode beyond being indexed and eligible for a snippet. No special markup, no AI file."
  - "Measure it with a fixed set of customer questions asked twice on two assistants, plus the AI-assistant source in your analytics. Repeat monthly."
---

Ask three people how to get recommended by ChatGPT and you will get three different answers, most of them sold as secrets. The honest version is shorter and less exciting. An assistant names a business when it can reach the pages, work out what the business is, find the same facts repeated elsewhere, and quote a clear answer from it.

This is the pillar note for everything I write on the subject. It sets out how I think about it, the eight areas I check, what I have seen on my own client work, and what I would ignore. Each section links to the longer note or free tool that goes deeper. I checked the external sources below on 3 November 2026, and I say where something is a single report and not a settled fact.

## How do AI assistants decide which businesses to name?

They do not run one process. ChatGPT, Gemini and Google's AI Overviews each combine what the model already learned in training with pages fetched at the moment of the question. When the question is local or recent, the fetched part matters most.

Three things follow from that, and they shape everything else in this note.

1. **Fetched pages have to be reachable.** If a crawler cannot read your site, it cannot quote it. Often the block is one line in a file nobody has opened in years.
2. **The assistant has to work out who you are.** A name, an address, a category and a handful of facts, matched against other places that mention you. Where those disagree, it either hedges or names someone else.
3. **There has to be a sentence worth lifting.** Assistants reuse short, direct statements. A page that circles its subject for four paragraphs gives them nothing to quote.

On the first point, Google is explicit. Its [guidance on AI features in Search](https://developers.google.com/search/docs/appearance/ai-features) says a page must be indexed and eligible to be shown in Search with a snippet to appear in AI Overviews or AI Mode, and that there are no additional requirements. It also says there is no special schema.org markup you need, and that you do not need to create new machine-readable files or AI text files. That was checked on 3 November 2026. It is Google's own account, so it describes eligibility and not how often anyone is chosen, but it removes a whole category of paid "AI optimization" from the list of things you must do.

<p class="pull">There is no AI switch. There is a site that machines can read and a business that is described the same way everywhere.</p>

## Can the AI crawlers actually reach your site?

This is the cheapest check and the one with the worst downside, so it comes first.

OpenAI documents three separate bots in its [crawler documentation](https://developers.openai.com/api/docs/bots), checked 3 November 2026. OAI-SearchBot is used to surface sites in ChatGPT's search features, and OpenAI says sites opted out of it will not be shown in ChatGPT search answers. GPTBot collects content that may be used to train models, and disallowing it opts you out of training. ChatGPT-User visits a page when a person asks about it, and OpenAI notes that robots.txt rules may not apply to those user-initiated visits.

The practical reading: if you block OAI-SearchBot, you have chosen to be left out of ChatGPT's search answers. Some publishers want that. A plumber in Vaughan almost certainly does not.

Two failure modes are common.

- **Blocking everything by accident.** A site template, a security plugin or a host's default can ship a `Disallow: /` or a long list of blocked bots. Nobody notices, because the site works fine for humans.
- **Naming a bot and re-opening your private paths.** A crawler follows the group that names it and ignores the `*` group completely, so a well-meant `Allow: /` for one bot can expose `/admin`. I wrote that up with a worked example in [Is your robots.txt blocking AI crawlers? The mistake that also exposes /admin](/notes/robots-txt-blocking-ai-crawlers-exposes-admin/).

You can test your own file in a minute with the free [robots.txt checker for AI crawlers](/tools/robots-txt-checker/). It reads only what you paste, so it cannot tell you whether a bot actually visits, but it will tell you what your rules say to each one.

Also check the basics Google lists: the page is indexed, it is not marked noindex, and it can show a snippet. If Google has not indexed a page, no AI feature built on Google's index can use it.

## Are your facts identical everywhere?

Assistants resolve a business the way a person would: they look for the same name, address, phone number and category in several places. When the places agree, the business is easy to identify. When they do not, you get hedged answers, wrong hours or a competitor.

The usual sources of disagreement are boring.

- An old address left on a directory after a move.
- A trading name on your site and a legal name on your Google Business Profile.
- A phone number that changed and survives on three listings.
- A category on your profile that does not match what the homepage says you do.

The fix is a single reference sheet. Write down the one correct version of your name, address, phone, hours, categories and a two-sentence description, then make your site, your Google Business Profile and every directory match it exactly. It is tedious and it works better than almost anything clever.

There is a caution here. In December 2025, Search Engine Roundtable [reported that ChatGPT had added local knowledge panels](https://www.seroundtable.com/openai-adds-local-knowledge-panel-to-chatgpt-results-40635.html), and quoted one person's claim that the panel mirrors a Google Business Profile. That is a single anecdote. The same article notes the author's own panel showed a former office address, and the data source was not confirmed. I would not build a strategy on "ChatGPT copies your GBP". I would make sure the GBP is correct, because Google Search and Maps use it regardless.

## Does your page answer the question in the first sentence?

Assistants quote direct statements. The easiest way to give them one is to write the answer first and the explanation second.

For a homepage, that means the first paragraph says what you do, where, and for whom, in two plain sentences. Not a slogan. For a service page, it means a heading phrased as the question a customer asks, followed by a short, direct answer, followed by the detail.

Here is the pattern I use.

| Instead of | Write |
|---|---|
| "Solutions tailored to your needs" | "We repair burst pipes and flooded basements across Vaughan, Woodbridge and Maple, usually the same day." |
| "Pricing" with a contact button | "A standard drain clearing starts at $X plus tax. Call-outs after 6 pm cost more." |
| "Our process" as a graphic | "Three steps: a free visit, a written quote within a day, and the work booked for the next available slot." |

<p class="tcap">Illustrative rewrites. Use your own real prices and terms, and keep them current.</p>

Price, process and timing are the three questions customers ask most and websites answer least. A page that states them plainly is the page an assistant can quote, and it is also the page a human actually wants.

A few further habits help.

- **Put a named author and a date on what you publish.** An anonymous, undated page is a weaker source than one a person stands behind.
- **Keep one topic per page.** A page that answers one question clearly beats a page that mentions twelve.

## Do other sites say you exist?

A business that only describes itself is a weak signal. Assistants lean on independent mentions: reviews, directories, local news, supplier and partner pages, industry associations.

I would work on these in this order.

1. **Reviews on the platforms your customers already use.** Google first for local work. Ask every happy customer, and reply to every review in plain language. Never buy reviews, and do not filter who you ask, because review gating breaks Google's rules and puts the profile at risk.
2. **The directories your industry actually uses.** Not the 200 generic ones. The five or six that rank for your category and city.
3. **Mentions that name what you do and where.** A supplier's "where to buy" page, a partner's listing, a local association's member list, a sponsorship page. One accurate line on a real site beats a hundred anonymous ones.
4. **Your own owned profiles.** LinkedIn, Facebook and the rest, set up with the same facts as the reference sheet.

On my own client work I have seen this pattern show up in the data. GoTourNiagara, a tour operator I built a site for, tracks AI-assistant visits as their own source. In one period, ChatGPT drove most of the bookings that came in, and visitors from AI assistants converted at several times the rate of organic search visitors. I am giving the direction and not the exact figures, because it is one client in one season, I cannot prove which of the changes caused it, and I do not want it quoted as a benchmark. You can read how that site was built in the [tour operator case study](/work/tour-operator/).

## Does structured data help?

A little, and only for what it is actually for. Structured data is a machine-readable label on facts that are already visible on the page: your name, address, phone, opening hours, services, and so on. It helps a crawler confirm who you are. It does not guarantee a rich result, and Google says there is no special schema you need for AI features. Its own advice is to make sure the structured data matches the visible text.

So the rule is simple. Add `LocalBusiness` or `Service` markup that matches your page, and nothing the page does not say. My free [schema generator](/tools/schema-generator/) writes it for you with checks as you type, then test the page with Google's Rich Results Test, which my tool does not replace.

Do not add markup for facts you cannot show. Review ratings in schema that do not match real reviews on the page break Google's guidelines and are easy for anyone to check.

## How do you measure whether it is working?

Most owners have no way to know. That is the real reason this feels like guesswork. There are two measurements, and both are free.

**1. A fixed question set, asked twice on two assistants.** Write five questions a customer would type before they know your name. Ask each twice, on two assistants, in a private window. Log whether you are named, in what position, and what was said. I wrote the full method as [How to check whether ChatGPT recommends your business](/notes/check-chatgpt-recommends-your-business/). Repeat it monthly. One snapshot is a baseline, two are a direction.

**2. A source for AI traffic in your analytics.** In Google Analytics 4, visits from AI assistants arrive as their own referral sources, such as chatgpt.com. Build a saved report or filter for them. Tag your own campaign links consistently, and the [UTM link builder](/tools/utm-builder/) will stop "Facebook" and "facebook" splitting your reports. If you cannot see AI traffic, you cannot tell whether any of this is working.

One more caution about measurement: assistants give different answers on different runs, so a single appearance proves little. Count across a sample and look at the pattern.

If you want a quick score before you start, the [90-second AI visibility self-check](/tools/ai-visibility-check/) covers the main areas in eight questions and gives you the three fixes I would make first.

## What is changing in Google's own AI results?

Google keeps moving the furniture, so a plan should not depend on one layout. On 2 November 2026, Search Engine Roundtable [reported that AI Overviews for many brand searches had moved to the right-hand column](https://www.seroundtable.com/google-ai-overviews-brands-right-42440.html), in the space where a Knowledge Panel used to sit. The source is a set of screenshots and posts from SEO practitioners, not a Google announcement.

The lesson is not about that layout. It is that when someone searches your business name, an AI-written description can now appear beside the results, and you did not write it. The best defence is the same list: accurate facts everywhere, a clear opener on your homepage, and a profile you control.

## What doesn't work?

Some things are promoted heavily and do not earn their place on the list.

- **llms.txt as a ranking lever.** The file is a proposal. In January 2026, Search Engine Roundtable [reported John Mueller of Google answering "to be direct, no"](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html) when asked whether Google's use of the file on some of its own properties is an endorsement. I serve one on forwardweb.ca because it costs nothing, and I have no evidence that any assistant reads it. Treat it as housekeeping. My [llms.txt generator](/tools/llms-txt-generator/) will build one in a minute if you want it.
- **Mass-produced AI content.** Hundreds of thin pages written to catch every query give an assistant nothing to quote and give Google a reason to distrust the whole site. [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies) set out what it treats as abuse.
- **Fake or bought reviews and invented mentions.** They are against platform rules, and an assistant that cross-checks sources is more likely to expose them than reward them.
- **Any promise of a guaranteed placement.** Nobody controls what an assistant says. If a vendor guarantees it, walk away.

## What would I do in the first month?

If I were starting from nothing on a local business, this is the order. It takes a few focused days and costs little.

| Week | Do this | Time |
|---|---|---|
| 1 | Run the crawler check. Fix robots.txt and any noindex. Confirm key pages are indexed. | 1 to 2 hours |
| 1 | Write the reference sheet. Fix your Google Business Profile first. | 2 hours |
| 2 | Correct the top directories and social profiles to match the sheet. | 3 to 4 hours |
| 2 | Rewrite the homepage opener and add direct answers on price, process and timing. | 3 hours |
| 3 | Add matching LocalBusiness markup. Set up the AI-source view in analytics. | 2 hours |
| 3 | Start asking every customer for a Google review. | ongoing |
| 4 | Run the question set on two assistants and log the baseline. | 1 hour |

<p class="tcap">My own sequence from client work, not a published benchmark. Times are rough and depend on the size of the site.</p>

Then repeat the question set in a month and compare. If the rewrites in week 2 include your title tags, the [search snippet preview](/tools/snippet-preview/) shows how each page will look before you publish, and if the first month turns up more than a few days of work, my note on [what a small business website costs in Toronto](/notes/small-business-website-cost-toronto-2026/) sets out the price bands.

## FAQ

### Can I pay to be recommended by ChatGPT?

Not as far as OpenAI documents: there is no published way to buy a place inside an answer's recommendations. You influence them by being readable, consistent and mentioned elsewhere. Be careful of anyone selling a guaranteed mention.

### Do I need llms.txt to appear in AI answers?

No. Google's own guidance says you do not need new machine-readable files or AI text files to appear in AI Overviews or AI Mode, and I have no evidence any assistant relies on llms.txt. It is harmless and quick to add, but it is not a lever.

### Should I block AI crawlers?

Only if you do not want to be named. Blocking OAI-SearchBot removes you from ChatGPT's search answers, and blocking GPTBot opts you out of training only. Those are separate decisions, and OpenAI documents them separately. Most local businesses want to be named.

### How long does it take to show up?

I cannot give you an honest number. Crawler changes can take effect within about a day for OpenAI, according to its documentation, but being named depends on all the other signals too. Measure monthly and judge by direction.

### Is this different from normal SEO?

Mostly it is the same foundation: crawlable pages, clear content, consistent local facts and real reviews. The differences are the extra crawlers to check and the habit of writing quotable direct answers. If your SEO basics are weak, fix those first.

## Where to start

Do the free parts first. Take the [90-second self-check](/tools/ai-visibility-check/), run the [robots.txt checker](/tools/robots-txt-checker/), and log your baseline using the method above. If the picture is unclear, or you would rather someone else run the checks and give you a written plan in priority order, that is the fixed-price audit. It starts {{from:audit}} plus tax, and you keep the plan whether or not we work together. You can [request the audit here](/apply/#audit), or read what it covers on the [AI visibility service page](/services/ai-visibility/).
