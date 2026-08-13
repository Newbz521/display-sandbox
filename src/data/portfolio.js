/**
 * The landing page is a 6x6 square partitioned into seven pieces — one per
 * page. Each piece has exactly as many blocks as its `short` code has letters,
 * so the word sets into the shape one letter per block, read row by row.
 *
 * Copy lives in contentSeed.js (fallback) and Firestore `pages` (live edits).
 * This file keeps layout: shape, colour, letters, and bar heights.
 */

import { PAGE_SEED, SITE_SEED } from './contentSeed'

export const GRID = 6

/** Lives in public/, so it is served from the site root. */
export const RESUME_URL = '/Lawrence%20Yee%20Resume%202026%20(1).pdf'

export const OWNER = {
  ...SITE_SEED,
  email: 'law.yee2133@gmail.com',
}

export const PIECES = [
  {
    id: 'about',
    short: 'ABOUT',
    label: 'About',
    color: '#6e86b8',
    series: [0.46, 0.54, 0.44, 0.58, 0.5],
    cells: [
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
    ],
    ...PAGE_SEED.about,
  },
  {
    id: 'work',
    short: 'WORK',
    label: 'Work',
    color: '#1d2951',
    series: [0.42, 0.58, 0.74, 0.9],
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    ...PAGE_SEED.work,
  },
  {
    id: 'projects',
    short: 'PROJECTS',
    label: 'Projects',
    color: '#e8785c',
    series: [0.55, 0.72, 0.88, 0.38, 0.5, 0.62, 0.79, 0.95],
    cells: [
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    ...PAGE_SEED.projects,
  },
  {
    id: 'toolkit',
    short: 'TOOLKIT',
    label: 'Toolkit',
    color: '#7fbfa6',
    series: [0.62, 0.55, 0.7, 0.48, 0.66, 0.58, 0.44],
    cells: [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
    ...PAGE_SEED.toolkit,
  },
  {
    id: 'blog',
    short: 'BLOG',
    label: 'Blog',
    color: '#a99be0',
    series: [0.35, 0.82, 0.46, 0.63],
    cells: [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
    ...PAGE_SEED.blog,
  },
  {
    id: 'playground',
    short: 'PLAY',
    label: 'Playground',
    color: '#d9b98c',
    series: [0.5, 0.66, 0.58, 0.78],
    cells: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    ...PAGE_SEED.playground,
  },
  {
    id: 'contact',
    short: 'MAIL',
    label: 'Contact',
    color: '#35786e',
    series: [0.3, 0.44, 0.36, 0.52],
    cells: [
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
    ],
    ...PAGE_SEED.contact,
  },
]
