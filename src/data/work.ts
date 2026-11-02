import type { Annotation } from '../lib/ill';

/** Annotation rings on the GoTour captures. Coordinates are in the 160 x 100 capture space. Only things true of the page. */
export const AN: Record<'home' | 'tour' | 'blog', Annotation[]> = {
  home: [
    { cx: 78.5, cy: 57.5, rx: 14.5, ry: 29, nx: 34, ny: 91, note: 'booking path, above the fold' },
    { cx: 27, cy: 46, rx: 20, ry: 9.5, nx: 6, ny: 33, note: 'one plain promise' },
  ],
  tour: [{ cx: 50, cy: 87.5, rx: 46.5, ry: 6.5, nx: 26, ny: 69, note: "the buyer's questions, answered up top" }],
  blog: [
    { cx: 29, cy: 67.7, rx: 10.5, ry: 3.2, nx: 48, ny: 58, note: 'a named source and a date' },
    { cx: 50, cy: 80, rx: 29.5, ry: 7.5, nx: 54, ny: 71, note: 'direct answer first' },
  ],
};

export const SHOT_ALT = {
  home: 'Home page of gotourniagara.ca on desktop',
  tour: 'Private tour page on desktop',
  blog: 'Blog post on desktop',
} as const;

export const CAPTURE_DATE = '2 November 2026';
