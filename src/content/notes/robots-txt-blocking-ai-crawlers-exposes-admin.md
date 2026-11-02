---
title: "Is your robots.txt blocking AI crawlers? The mistake that also exposes /admin"
description: "Naming an AI bot in robots.txt gives it its own group, and it then ignores your * rules. How that quietly re-opens paths you blocked, and how to fix it."
publishedAt: 2026-11-02
updatedAt: 2026-11-02
category: Test
author: Maksut Ozcan
draft: false
seoTitle: "Is your robots.txt blocking AI crawlers?"
standfirst: "There are two ways to get robots.txt wrong for AI. One keeps assistants out entirely. The other lets one bot into the paths you blocked for everyone else."
summary:
  - "A crawler follows the group that names it and ignores the * group completely. Rules are not merged."
  - "So adding a group for GPTBot with Allow: / can re-open /admin and anything else you blocked under *."
  - "Repeat your Disallow lines inside any group you add, then test the result."
---

When I opened GoTourNiagara up to AI crawlers, I did what most guides tell you to do. I added a short group naming the crawler I wanted to let in. Then I stopped and checked how that group interacted with the rules that were already there, and found the trap this note is about.

It is easy to miss, it looks harmless, and the common advice walks you straight into it. If you have ever added `Allow: /` for GPTBot, it is worth five minutes of your time.

## How robots.txt groups actually work

A robots.txt file is a list of groups. Each group starts with one or more `User-agent` lines and is followed by the rules that apply to those crawlers. The standard that defines this is [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), and it is short and readable.

The rule that matters here is this: a crawler finds the group that matches its own name most specifically and obeys only that group. If no group names it, it falls back to the group for `*`, which means everyone else. It does not combine the two.

Read that last sentence again, because everything below follows from it. A named group does not add to the `*` group. It replaces it.

## The mistake

Here is a file that looks reasonable.

```
User-agent: *
Disallow: /admin
Disallow: /account

User-agent: GPTBot
Allow: /
```

The intent is clear: keep everyone out of `/admin` and `/account`, and welcome GPTBot. What actually happens is different. GPTBot has a group that names it, so it uses that group and nothing else. That group says `Allow: /`. So GPTBot is allowed into `/admin` and `/account` as well.

You blocked those paths for everyone, and then you opened them for one bot by naming it.

The same thing happens in reverse for a block. If you write `User-agent: ClaudeBot` followed by `Disallow: /`, that bot is blocked from everything, and your more careful `*` rules do not matter to it either way.

## The fix

Any group you add has to carry the rules you still want. Repeat the Disallow lines inside it.

```
User-agent: *
Disallow: /admin
Disallow: /account

User-agent: GPTBot
Disallow: /admin
Disallow: /account
Allow: /
```

Now GPTBot can read the public site, and the two private paths stay blocked for it as well. If a bot does not need special treatment, the better move is often to give it none. Leave it out of the file and it follows `*`.

The other practical rule is to keep the file short. Every group you add is another place for the paths to drift out of sync, and a long robots.txt is where this mistake lives.

## Test it, don't trust it

Reading a file and predicting what each crawler will do is exactly the kind of thing people get wrong, so I built a small [robots.txt checker for AI crawlers](/tools/robots-txt-checker/). You paste your file in, and it matches each crawler against your rules using the grouping logic above. If a named bot's group re-opens something your `*` group blocks, it says so in plain words.

It reads only what you paste. It does not fetch your site, and nothing leaves your browser. That also means it cannot tell you whether a bot actually visits you, or whether your server blocks it some other way.

## The names to know

Crawler names change, so check each company's own documentation before you rely on a list. As of this writing, the ones I test for are:

- **GPTBot, OAI-SearchBot and ChatGPT-User**, all from OpenAI. OpenAI documents them as separate crawlers for different purposes, which means you can treat training and search differently.
- **ClaudeBot**, from Anthropic.
- **PerplexityBot**, from Perplexity.
- **Google-Extended**, which Google documents as a control for whether its AI products can use your content. It is a robots.txt token, and it is separate from the crawler that builds Google Search.
- **Applebot-Extended**, from Apple, and **CCBot**, from Common Crawl.

Whether you want each of them in is your call. Blocking is a legitimate choice for a publisher who does not want its writing used for training. For a small local business that depends on being recommended, blocking mostly removes you from the answers.

## robots.txt is not security

One more thing, and it matters for the `/admin` example. robots.txt is a polite request to well-behaved crawlers. It does not lock anything. A bot that ignores it, or a person who types the address, can still reach the page.

It is also public. Anyone can read yours at `/robots.txt`, so a `Disallow: /admin` line is a signpost to your admin area as much as a fence around it. The real protection for a private path is a login, and ideally one that does not live at a guessable address.

So if you have been relying on a Disallow line to protect something, treat that as a bug in itself. Fix the access control first. Then use robots.txt for what it is good at, which is telling crawlers where not to waste their time.

## A five-minute checklist

1. Open `yourdomain.com/robots.txt` and read it.
2. Look for any `User-agent` line other than `*`. Each one starts a new group.
3. For every named group, check whether it repeats the Disallow lines from `*` that you still want.
4. Paste the file into the [checker](/tools/robots-txt-checker/) and read the table.
5. Make sure anything private is behind a login, whatever robots.txt says.

If the answer to step three is no, you have the mistake. It takes one edit to fix and nothing else on your site needs to change.

## Where this fits

A robots.txt that lets the right crawlers in is the first link in the chain, and it is the cheapest to check. It is not the whole story: assistants also weigh structured data, consistent listings and clear answers on your pages. If you want to see where you stand on all of it, the [90-second self-check](/tools/ai-visibility-check/) is free, and the [fixed-price audit](/apply/#audit) covers what no tool can see.
