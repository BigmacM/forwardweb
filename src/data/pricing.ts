/**
 * The only place prices live. Everything a visitor reads (pages, JSON-LD, forms)
 * imports from here. All figures are CAD, plus HST, and are "from" prices.
 * Confirmed by Max on 2026-11-02.
 */
export type PriceKey = 'audit' | 'websites' | 'webApps' | 'dashboards' | 'automation' | 'retainer' | 'care';

export interface Price {
  /** Whole dollars. */
  amount: number;
  /** Billing period suffix, empty for a one-off fixed price. */
  per: '' | 'month';
}

export const PRICES: Record<PriceKey, Price> = {
  audit: { amount: 1500, per: '' },
  websites: { amount: 5000, per: '' },
  webApps: { amount: 12000, per: '' },
  dashboards: { amount: 2500, per: '' },
  automation: { amount: 3000, per: '' },
  retainer: { amount: 1500, per: 'month' },
  care: { amount: 300, per: 'month' },
};

export const CURRENCY = 'CAD';
export const TAX_NOTE = 'CAD plus HST';

const nf = new Intl.NumberFormat('en-CA');

/** "$1,500" */
export const money = (key: PriceKey): string => `$${nf.format(PRICES[key].amount)}`;

/** "$1,500" or "$1,500/mo", the compact form used in service rows. */
export const moneyShort = (key: PriceKey): string => `${money(key)}${PRICES[key].per ? '/mo' : ''}`;

/** "$1,500 per month" or "$1,500", for running copy. */
export const moneyLong = (key: PriceKey): string => `${money(key)}${PRICES[key].per ? ' per month' : ''}`;

/** "from $1,500" or "from $1,500 per month". */
export const fromPrice = (key: PriceKey): string => `from ${moneyLong(key)}`;
