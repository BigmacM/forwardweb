// {{price:key}} and {{from:key}} tokens, resolved from src/data/pricing.ts so copy never types a price.
// Used by (a) the remark plugin for Markdown notes and (b) the fillPrices() helper for data files.
// Kept as plain .mjs so astro.config.mjs can import it without a build step.
import { PRICES } from '../data/pricing.ts';

const nf = new Intl.NumberFormat('en-CA');
const long = (k) => {
  const p = PRICES[k];
  if (!p) throw new Error(`Unknown price key in copy: ${k}`);
  return `$${nf.format(p.amount)}${p.per ? ' per month' : ''}`;
};

/** Replace {{price:audit}} with "$1,500" and {{from:audit}} with "from $1,500". */
export function fillPrices(text) {
  return text.replace(/\{\{(price|from):([a-zA-Z]+)\}\}/g, (_, kind, key) => (kind === 'from' ? `from ${long(key)}` : long(key)));
}

/** Remark plugin: walk the tree and fill tokens in text, inline code-free nodes, link urls and html. */
export function remarkPrices() {
  const walk = (node) => {
    if (typeof node.value === 'string' && node.type !== 'code' && node.type !== 'inlineCode') node.value = fillPrices(node.value);
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}
