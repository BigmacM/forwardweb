---
title: "AI visibility checkers: what a free check can and cannot tell you"
description: "A free AI visibility check can show whether the groundwork is in place. It cannot show who an assistant actually names. What each type measures, and when to pay for more."
publishedAt: 2026-11-08
updatedAt: 2026-11-08
category: Buying
author: Maksut Ozcan
draft: false
seoTitle: "AI visibility checker: what a free check shows"
standfirst: "A free AI visibility checker can tell you whether your groundwork is in place. It cannot tell you whether ChatGPT or Gemini will name you, and anyone who says it can is selling something else."
summary:
  - "There are four kinds of check: a self-scored quiz, a single question to one assistant, a paid tracker that repeats prompts over time, and a human audit. They answer different questions."
  - "A free check measures readiness, meaning the things assistants lean on. Only repeated sampling of real questions measures outcome."
  - "Use a free check to find the cheap fixes. Pay for more only when you need the log, the technical layer checked, or a written plan."
---

People search for an "AI visibility checker" because they want a number. How visible am I to ChatGPT, Gemini and Google's AI answers, and is it good? That is a reasonable thing to want, and the tools that exist answer it in very different ways.

I built one of them, the [AI visibility check](/tools/ai-visibility-check/), so I will be plain about what it does and does not do. This note is also a buyer's guide, so you can judge any checker, mine included, before you trust its score.

## What kinds of AI visibility checker are there?

Every checker I have seen falls into one of four types. The names vary and the marketing is louder than the differences, but the method underneath is one of these.

| Type | Tells you | Cannot tell you |
|---|---|---|
| **Self-scored quiz:** you answer questions about your site and listings | Whether the groundwork is in place | Whether any assistant names you |
| **One-off prompt check:** one assistant, asked once | A single answer, today | Consistency, because one answer is one sample |
| **Paid tracker:** a prompt set run on a schedule across assistants | Direction over time, and who is named alongside you | Why, and what to fix |
| **Human audit:** a person runs the sample, checks the technical layer and writes a plan | Cause and priority | Anything beyond the day it was run |

<p class="tcap">My own grouping of the checker types I have looked at. It is a way to sort them, not a market survey.</p>

None of these is better in general. They are answers to different questions, and the mistake is buying one and reading it as another.

## What does a free check actually measure?

Mostly readiness. A free check, mine included, looks at the inputs assistants are known to lean on and asks whether you have them. It does not look at the output, which is what an assistant says when a customer asks.

That distinction matters. You can have every input in place and still not be named, because a competitor has more reviews or older, better-cited pages. You can also be named once by luck with weak inputs. Readiness raises the odds. It is not the result.

The [self-check](/tools/ai-visibility-check/) asks eight questions, scores you out of sixteen and gives you the three fixes I would make first. The eight cover:

- whether your homepage opener says what you do, where and for whom
- whether AI crawlers are allowed in your robots.txt
- whether your pages carry structured data for the business, services and FAQs
- whether your Google Business Profile is claimed, complete and recently reviewed
- whether key pages answer buyer questions directly
- whether you publish with a named author and a date
- whether your name, address and phone match on every directory
- whether you can see which visitors arrive from AI assistants

It runs in your browser and sends nothing unless you choose to request the audit. "Not sure" counts as no, on purpose, because a fact you cannot confirm is a fact an assistant cannot confirm either.

## What can't a free check tell you?

Four things, and a good checker will say so up front.

1. **Who gets named.** Assistants vary their answers from one run to the next, so a single reply is a sample of one. Measuring this takes repeated questions and a log. I wrote the do-it-yourself version in [how to check whether ChatGPT recommends your business](/notes/check-chatgpt-recommends-your-business/).
2. **What is happening on your server.** A quiz takes your word for it. It cannot see that a plugin rewrote your robots.txt last month. The [robots.txt checker](/tools/robots-txt-checker/) reads the actual file, and even that cannot see a firewall that blocks bots some other way.
3. **Whether the score matters to your customers.** A strong result on a question nobody types is not worth much. Only you know the questions your buyers ask.
4. **Whether it is working.** That needs measurement over weeks, in analytics, not a score on a day.

## When is a free check enough?

If you have never looked at any of this, start free. The cheap fixes, such as an unblocked crawler, a clear homepage opener and matching listings, cost little and a quiz will find them. The full set of fixes is laid out in the [guide to getting recommended by ChatGPT, Gemini and AI Overviews](/notes/get-recommended-by-chatgpt-gemini-ai-overviews/).

## When should you pay for more?

Pay when a free check has told you what it can and you are still stuck. In practice that is one of three situations.

- **You want to know where you stand against competitors.** That needs repeated sampling across assistants, which is what a tracker or an audit's sample does.
- **The groundwork looks fine and you are still not named.** Then the cause is somewhere a quiz cannot see, such as crawl access, rendering, conflicting facts or thin third-party coverage.
- **You want a plan, in order, that someone else has checked.**

If you go to a vendor, ask three things before you pay:

<div class="method">

1. **How many times is each question run, and on which assistants?** One run is not a measurement.
2. **Do the answers come from the real assistant or a different interface?** Replies from an API can differ from what a customer sees in the app, so ask how that is handled.
3. **Whose questions are used, and what do I get at the end?** They should be your customers' questions, and the output should be a list of fixes, not only a dashboard of mentions.

</div>

## What does my audit cover that the free check doesn't?

The fixed-price audit is the human version of the table's last row. I run the repeated sample on the questions your customers ask, check the technical layer underneath it, compare your listings and give you a written plan in priority order. You get the plan whether or not we work together. It starts at {{from:audit}} plus tax, and the details are on the [AI visibility service page](/services/ai-visibility/).

I do not run a tracker you subscribe to, and I would not tell most small businesses to buy one in their first month. Fix the basics first, take a baseline, then decide.

## FAQ

### Is there a free AI visibility checker that is actually accurate?

Free checkers are accurate about what they measure, which is usually readiness: crawler access, structured data, listings and clear answers. None can tell you with certainty whether an assistant will name you, because answers vary run to run.

### What is the difference between an AI visibility score and a ranking?

A search ranking is a position in a list. An AI answer is generated, may name several businesses or none, and can change on the next run. A visibility score is a summary of inputs or sampled mentions, not a position.

### Does a high score from the self-check mean ChatGPT will recommend me?

No. A high score means you have done the groundwork assistants rely on. Nothing guarantees a recommendation.

## Where to start

Run the [90-second self-check](/tools/ai-visibility-check/) and see which three fixes come first. If the result raises more questions than it answers, [request the audit](/apply/#audit), which starts at {{from:audit}} plus tax.
