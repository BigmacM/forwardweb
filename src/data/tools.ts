import type { tool } from '../lib/ill';

export interface ToolPage {
  slug: string;
  name: string;
  thumb: keyof typeof tool;
  /** The plain question the page answers. It is the H1. */
  h1: string;
  title: string;
  description: string;
  deck: string;
  tag: string;
  checks: string;
  gotcha: string;
  cant: string;
  faq: { q: string; a: string }[];
}

export const TOOL_PAGES: ToolPage[] = [
  {
    slug: 'ai-visibility-check',
    name: 'AI visibility check',
    thumb: 'check',
    h1: 'Does an AI assistant know your business exists?',
    title: 'AI visibility check: free 8-question self-test | ForwardWeb',
    description:
      'Answer eight questions about your website and listings and get a score plus the three fixes I would make first. Free, runs in your browser, no email needed.',
    deck: 'Eight questions about your site and listings. You get a score and the three fixes I would make first, written the way I would say them.',
    tag: '90 seconds',
    checks:
      'Whether your homepage opener, crawler access, structured data, Google Business Profile, direct answers, authorship, listings and measurement are in place. Each one is something assistants lean on when they decide who to name.',
    gotcha:
      'It scores what you tell it. If you answer "not sure", it counts as no, because a thing you cannot confirm is a thing an assistant cannot confirm either.',
    cant: 'It is a self-check, not an audit. It cannot see your site, ask an assistant about you, or find the problems you do not know to look for.',
    faq: [
      { q: 'Is my answer sent anywhere?', a: 'No. The check runs entirely in your browser. If you then request the audit, your score is added to that form so I can see where you start, and only if you choose to send it.' },
      { q: 'What does the score mean?', a: 'Twelve or more out of sixteen is a strong base. Six to eleven means assistants can probably find you but have little reason to recommend you. Five or fewer means they likely cannot see you yet.' },
      { q: 'Does a high score mean ChatGPT will recommend me?', a: 'No. Nothing guarantees that. A high score means you have done the groundwork assistants rely on.' },
    ],
  },
  {
    slug: 'robots-txt-checker',
    name: 'AI crawler checker',
    thumb: 'robots',
    h1: 'Is your robots.txt blocking AI?',
    title: 'robots.txt checker for AI crawlers | ForwardWeb',
    description:
      'Paste your robots.txt and see which AI crawlers can read your site, using real group matching. Flags the rule that quietly re-opens paths you blocked. Free.',
    deck: "Paste your robots.txt. I'll show which AI crawlers can read your site, and flag the one mistake that quietly undoes your own rules.",
    tag: 'Paste only',
    checks:
      'Each major AI crawler against your rules, using the same group-matching logic crawlers use: a bot follows the group that names it, and falls back to the wildcard group only if none does.',
    gotcha:
      'A bot with its own group ignores your wildcard group completely. The common advice to add "Allow: GPTBot" can reopen the very paths you blocked for everyone else.',
    cant: 'It reads only what you paste. It cannot tell whether a bot actually visits, or whether your server blocks it some other way.',
    faq: [
      { q: 'Should I allow AI crawlers at all?', a: 'If you want to be recommended by AI assistants, they need to be able to read you. Blocking is a legitimate choice for publishers who do not want their work used for training, but for most small businesses it removes you from the answers.' },
      { q: 'What is the difference between training and search bots?', a: 'Some companies run separate crawlers for model training and for live answers or search. The table lists them separately so you can allow one and block the other. Check each company\'s own documentation for the current names.' },
      { q: 'Does robots.txt actually stop a bot?', a: 'It is a request, not a lock. Reputable crawlers honour it. Anything private needs real access control, such as a login, and not a line in a text file.' },
    ],
  },
  {
    slug: 'snippet-preview',
    name: 'Snippet preview',
    thumb: 'snippet',
    h1: 'How will your title and description look in search?',
    title: 'Title and meta description pixel checker | ForwardWeb',
    description:
      'Type or paste a title and description and see them measured in pixels against the typical display limits, with a search result preview. Free, runs in your browser.',
    deck: 'Your title and description as a search result, measured in pixels rather than guessed in characters.',
    tag: 'Runs in your browser',
    checks:
      'The pixel width of your title and description in a typical search-result font, against the usual limits of about 600 pixels for a title and about 920 for a description on desktop.',
    gotcha:
      'The limits are approximate and Google rewrites snippets when it thinks it can do better. Treat the bars as a guide to where text is likely to be cut, not a guarantee.',
    cant: 'It cannot see how Google will actually rewrite your snippet, and it measures in one font, so results on a device with a different font can differ a little.',
    faq: [
      { q: 'Why pixels and not characters?', a: 'Search results truncate by width. A title of capital Ws is far wider than the same number of lowercase i letters, so character counts mislead.' },
      { q: 'Will Google use my description?', a: 'Often not. Google picks text from the page when it matches the query better. A clear description still helps when it does use yours.' },
      { q: 'What is the AI answer preview?', a: 'A rough picture of how a page can appear as a cited source in an assistant answer: a title and a short line. It is an illustration, since each assistant formats citations differently.' },
    ],
  },
  {
    slug: 'schema-generator',
    name: 'Schema generator',
    thumb: 'schema',
    h1: 'How do you add LocalBusiness schema to your site?',
    title: 'LocalBusiness schema generator (JSON-LD) | ForwardWeb',
    description:
      'Fill in your business details and get valid LocalBusiness or Service JSON-LD to paste into your site, with checks as you type. Free, runs in your browser.',
    deck: 'Fill in your details and get JSON-LD you can paste into your site, checked as you type.',
    tag: 'Runs in your browser',
    checks:
      'That the fields a machine needs are present and well formed: name, URL, phone, address, and a sensible description. It then writes the JSON-LD for you.',
    gotcha:
      'Structured data helps machines confirm who you are, but it does not guarantee a rich result or a recommendation. It only has to match what is visible on the page.',
    cant: 'It does not test your live page or run Google\'s Rich Results Test. After you paste the code in, check the page with Google\'s own validator.',
    faq: [
      { q: 'Where do I paste the code?', a: 'Inside a script tag of type application/ld+json in the head or body of the page it describes. Most site builders have a place for custom code.' },
      { q: 'Does schema make me rank higher?', a: 'Not directly. It helps search engines and assistants understand and trust the facts on your page. That is useful, but it is not a ranking switch.' },
      { q: 'Is anything sent to a server?', a: 'No. The page builds the JSON in your browser and nothing you type leaves it.' },
    ],
  },
  {
    slug: 'llms-txt-generator',
    name: 'llms.txt generator',
    thumb: 'llms',
    h1: 'What is llms.txt, and should your site have one?',
    title: 'llms.txt generator and what it does | ForwardWeb',
    description:
      'Build an llms.txt file for your site in a minute. Free, runs in your browser. Plus an honest note: no major AI assistant has confirmed it uses the file.',
    deck: 'Build the file in a minute. My honest note: no major assistant has confirmed it uses the file.',
    tag: 'Runs in your browser',
    checks:
      'It takes your site name, a short summary and your key pages, and writes a plain markdown file in the shape the llms.txt proposal describes, ready to download.',
    gotcha:
      'As far as I know, no major AI assistant has confirmed that it reads llms.txt. The file is harmless and takes minutes, so I treat it as optional housekeeping, not a strategy.',
    cant: 'It cannot make an assistant read the file, and it does not check that your links work. It writes the text you give it.',
    faq: [
      { q: 'Will llms.txt get me recommended by ChatGPT?', a: 'I have no evidence that it will. No major assistant has said it uses the file. Clear pages, open crawler access and consistent facts do more.' },
      { q: 'Where does the file go?', a: 'At the root of your site, so it is reachable at yourdomain.com/llms.txt.' },
      { q: 'Is it worth making anyway?', a: 'It costs a few minutes and does no harm, and it forces you to write down what your site is about. That alone is a useful exercise.' },
    ],
  },
  {
    slug: 'utm-builder',
    name: 'UTM link builder',
    thumb: 'utm',
    h1: 'How do you build consistent UTM links?',
    title: 'UTM link builder with a naming guard | ForwardWeb',
    description:
      'Build campaign links with UTM parameters, plus a guard that catches uppercase and spaces so Facebook and facebook stop splitting your reports. Free.',
    deck: 'Consistent campaign links, with a guard so Facebook and facebook stop splitting your reports.',
    tag: 'Runs in your browser',
    checks:
      'It builds a tagged URL from your parts and flags the naming mistakes that fragment analytics: mixed case, spaces and parameters in the wrong place.',
    gotcha:
      'Consistency matters more than the tags themselves. Analytics treats "Facebook" and "facebook" as two different sources, so pick a convention and keep it.',
    cant: 'It does not track anything or store your links. It only builds text, so keep your own list of the names you have used.',
    faq: [
      { q: 'Which UTM parameters are required?', a: 'Source, medium and campaign are the usual three. Term and content are optional, for paid keywords and for telling similar links apart.' },
      { q: 'Should I tag my internal links?', a: 'No. Tagging links inside your own site starts a new session and overwrites where the visitor really came from.' },
      { q: 'Why lowercase?', a: 'Because reports are case sensitive. One lowercase convention keeps the same channel in one row.' },
    ],
  },
];
