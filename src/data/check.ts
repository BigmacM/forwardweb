/** The eight questions of the AI visibility check, shared by the island and the no-JS list. */
export const CHECK_QUESTIONS: { q: string; why: string; fix: string }[] = [
  { q: 'Does your homepage say what you do, where, and for whom in the first paragraph?', why: 'Assistants quote the opening lines. Vague openers get skipped.', fix: "I'd rewrite your homepage opener so it says what you do, where, and for whom, in two sentences." },
  { q: 'Are AI crawlers allowed in your robots.txt?', why: 'A blanket block means ChatGPT and Google AI cannot read you at all.', fix: "I'd check your robots.txt first. If AI crawlers are blocked, nothing else you do will matter yet." },
  { q: 'Do your pages carry structured data for your business, services and FAQs?', why: 'It is how a machine confirms who you are and what you sell.', fix: "I'd add business, service and FAQ schema so machines can confirm who you are." },
  { q: 'Is your Google Business Profile claimed, complete and recently reviewed?', why: 'Local answers lean on it heavily.', fix: "I'd finish and verify your Google Business Profile, then ask recent customers for reviews." },
  { q: 'Do your key pages answer buyer questions directly: price, process, timing?', why: 'Short, specific answers are what gets quoted.', fix: "I'd add direct answers on price, process and timing to your key pages." },
  { q: 'Do you publish with a named author and a date?', why: 'Anonymous, undated pages are weaker sources.', fix: "I'd put a named author and a date on everything you publish." },
  { q: 'Is your name, address and phone identical on every directory?', why: 'Conflicting details make assistants hedge, or leave you out.', fix: "I'd make your name, address and phone identical on every listing." },
  { q: 'Can you see which visitors arrive from AI assistants?', why: 'If you cannot measure it, you cannot tell whether anything works.', fix: "I'd set up GA4 so AI assistants show up as their own source." },
];
