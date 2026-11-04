---
title: "Ontario AODA and your website: what actually applies to a small business"
description: "The AODA website rule applies at 50 or more employees. Businesses with 20 or more file a compliance report by 2026-12-31. What applies to you, and a quick self-check."
publishedAt: 2026-11-11
updatedAt: 2026-11-11
category: Buying
author: Maksut Ozcan
draft: false
seoTitle: "AODA website compliance: what applies to small business"
standfirst: "Under Ontario's rules, the website accessibility requirement applies to organizations with 50 or more employees, while businesses with 20 or more employees must also file an accessibility compliance report by 2026-12-31."
summary:
  - "Per ontario.ca, the AODA website requirement applies to designated public sector organizations and to businesses and non-profits with 50 or more employees. The standard is WCAG 2.0 Level AA."
  - "A business with 20 to 49 employees has no website duty listed on ontario.ca, but must file an accessibility compliance report, and the deadline is 2026-12-31."
  - "Vendor summaries disagree on thresholds. Check your headcount against ontario.ca and the regulation, not against a sales page."
---

If you search for AODA website compliance, you will find a lot of agencies telling you your small business is about to be fined. Some of it is true for some organizations, and a lot of it is stretched. The rules depend on how many people you employ, and the vendor pages I found do not agree with each other on the thresholds.

So for this note I went to the source. I am a web developer, not a lawyer, and this is not legal advice. What follows is what ontario.ca says, what I could and could not confirm, and what I would do about it.

## What is the AODA, and does it cover my website?

The Accessibility for Ontarians with Disabilities Act (AODA) sets accessibility standards for organizations in Ontario. Websites are covered by the Information and Communications Standards, which sit in [Ontario Regulation 191/11, the Integrated Accessibility Standards Regulation](https://www.ontario.ca/laws/regulation/110191).

Whether the website part applies to you depends on who you are. According to Ontario's page on [how to make websites accessible](https://www.ontario.ca/page/how-make-websites-accessible) (updated 2026-09-21, checked 2026-11-03), the requirement to make public websites accessible applies if you are either:

- a designated public sector organization, or
- a business or non-profit with 50 or more employees.

The page says the organization that controls the website, directly or through a contract, is the one that has to meet the requirement. It also says the requirement applies to websites and web content published after January 1, 2012.

## What counts as a small business under the website rule?

Ontario's page for [accessibility rules for businesses and non-profits](https://www.ontario.ca/page/accessibility-rules-businesses-and-non-profits) (updated 2026-06-16, checked 2026-11-03) splits the guidance by size. For businesses with 1 to 49 employees it lists things like policies, training, accessible customer service and providing information in accessible formats on request. The website duty appears only in the 50-and-over section.

So, on ontario.ca's own wording:

| Your size | Website requirement listed | Compliance report |
|---|---|---|
| 1 to 19 employees | No | No |
| 20 to 49 employees | No | Yes, every three years |
| 50 or more employees | Yes, WCAG 2.0 Level AA | Yes |

<p class="tcap">Summarized from the two ontario.ca pages cited in this section, both checked 2026-11-03. Public sector organizations have separate rules.</p>

I could not open the text of section 14 of the regulation in a readable form while writing this, so the table rests on ontario.ca's plain-language pages, not the legal wording. If your decision depends on it, read the [regulation](https://www.ontario.ca/laws/regulation/110191) itself or ask a lawyer. Being under 50 employees also does not make accessibility irrelevant. It means the AODA does not list a website duty for you, and the Ontario Human Rights Code is a separate matter.

## When is the compliance report due?

Ontario's page on [completing your accessibility compliance report](https://www.ontario.ca/page/completing-your-accessibility-compliance-report) (updated 2026-02-19, checked 2026-11-03) says businesses and non-profits with 20 or more employees must file one. It states: "The reporting deadline is December 31, 2026." Businesses and non-profits file every three years. The page also warns that organizations that do not complete the report could face enforcement measures, which can include financial penalties. It does not give an amount, and I will not guess one.

The report is a filing about your organization's progress, not a website audit. If your business has 20 or more employees, put that date in your calendar whether or not you have a website duty.

Some older ontario.ca pages and PDFs still show earlier years. If you see a different date, check the page's own update date.

## What standard does the website have to meet?

If the website rule applies to you, the standard is WCAG 2.0 Level AA, except two success criteria. Ontario's page says the exceptions are 1.2.4 (live captions) and 1.2.5 (pre-recorded audio descriptions). The standard itself is the [W3C's Web Content Accessibility Guidelines 2.0](https://www.w3.org/TR/WCAG20/).

The page also says organizations generally do not have to meet the standard for intranets and extranets, which are internal sites.

## Can I check my own site in 20 minutes?

You can catch the most common failures without any tools. This is a self-check, not a compliance test, and passing it does not prove you meet Level AA.

<div class="method">

1. **Use the keyboard only.** Press Tab through the page. You should be able to reach every link, button and form field, see where you are, and never get stuck.
2. **Check the text contrast.** WCAG 2.0 AA asks for a contrast ratio of at least 4.5 to 1 for normal text. Light grey text on white is the usual failure. A free contrast checker will tell you in seconds.
3. **Look at the images.** Every image that carries meaning needs a text description (alt text). Decorative images should have an empty one.
4. **Label your forms.** Each field needs a visible label tied to it, and errors have to say what went wrong in words.
5. **Check the headings.** One main heading, then a sensible order. A screen reader user navigates by them.
6. **Zoom to 200 percent.** Nothing should overlap or disappear.
7. **Check video.** Pre-recorded video with sound needs captions. (Live captions and audio description are the two excluded criteria.)

</div>

An automated scanner will catch some of these. None of them catches all of it, and the keyboard test alone finds problems scanners miss.

## When should I fix the site and when should I rebuild it?

It depends on the cause, and most of the time a fix is enough.

- **Fix it** when the problems are content-level: missing alt text, low-contrast text, unlabeled fields, heading order. Those can be corrected without changing the design.
- **Rebuild it** when the problems are structural: a theme or page builder that traps keyboard focus, navigation that cannot be operated without a mouse, or a layout that breaks when text is enlarged. Patching a broken foundation costs more than it saves.

Planning for accessibility at the start of a build is cheaper than retrofitting it later. The same logic applies to every other site problem, and I walk through what drives a project's price in [what a small business website costs in Toronto](/notes/small-business-website-cost-toronto-2026/).

## How does this connect to the rest of your site?

Accessibility is one layer among several that make a site usable by people and machines. Clear headings, descriptive text and labelled forms help every visitor, and the full list of what I look at for visibility is in the [guide to getting recommended by ChatGPT, Gemini and AI Overviews](/notes/get-recommended-by-chatgpt-gemini-ai-overviews/). If you serve a local area, the order of work for the rest of your online presence is in [local SEO for a Markham or Richmond Hill business](/notes/local-seo-york-region-markham-richmond-hill/).

## FAQ

### Does the AODA website rule apply to a business with fewer than 50 employees?

According to ontario.ca, the website requirement is listed for designated public sector organizations and for businesses and non-profits with 50 or more employees. Smaller organizations have other AODA duties, such as policies and training.

### What is the AODA compliance report deadline?

Ontario's page for completing the report says the deadline for businesses and non-profits with 20 or more employees is December 31, 2026 (page updated 2026-02-19, checked 2026-11-03).

### Which WCAG level does Ontario require?

WCAG 2.0 Level AA, except success criteria 1.2.4 (live captions) and 1.2.5 (pre-recorded audio descriptions).

### Is an accessibility overlay a fix?

I would not rely on one. I have not tested any against this standard, so I can't vouch for them. Fixing the page itself is the route I can stand behind.

## Next step

If you have run the self-check and found problems, or you are not sure what applies to you, tell me about the site. I will say whether it needs fixes or a rebuild, and what each would involve. [Request a quote](/apply/), with websites starting {{from:websites}} plus tax.
