/**
 * Margin annotations live off the 6×6 piece square — title block, pin-ups,
 * general notes, legend, and detail callouts. Positions are assigned in layout.js.
 */

export const MARGINS = [
  {
    id: 'now',
    glyph: 'NOW',
    label: 'Now',
    kicker: 'Pinned to the table',
    color: '#c49a6c',
    content: {
      kind: 'now',
      status: 'Open to interesting work',
      items: [
        {
          label: 'Day job',
          value: 'SKYZ US — internal legal platforms, AWS, conversion funnels',
        },
        {
          label: 'Building',
          value: 'This portfolio — spatial UI, camera choreography, paper-craft 3D',
        },
        {
          label: 'Learning',
          value: 'Neo4j, graph modelling for relational product data',
        },
        {
          label: 'Based in',
          value: 'New York',
        },
      ],
      updated: 'Aug 2026',
    },
  },
  {
    id: 'notes',
    glyph: 'G',
    label: 'General Notes',
    kicker: 'How I work',
    color: '#6e86b8',
    content: {
      kind: 'notes',
      items: [
        {
          code: 'G1',
          text: 'Draw it before you build it. I came through architecture — plans, sections, and massing studies still shape how I scope software.',
        },
        {
          code: 'G2',
          text: 'Interfaces for people doing precise work: legal teams, architects, operators who need the tool to match the job, not the other way around.',
        },
        {
          code: 'G3',
          text: 'Prefer small, legible surfaces over clever abstractions. Code should read like a set of working drawings.',
        },
        {
          code: 'G4',
          text: '3D and geometry are strengths, not detours — spatial problems get spatial tools.',
        },
        {
          code: 'G5',
          text: 'Ship, measure, refine. Campaigns, load times, and ticket throughput matter as much as the initial design.',
        },
      ],
    },
  },
  {
    id: 'legend',
    glyph: '?',
    label: 'Legend',
    kicker: 'How to read the board',
    color: '#a99be0',
    content: {
      kind: 'legend',
      items: [
        {
          title: 'Pick a piece',
          text: 'Each block cluster is a section — hover to preview, click to open.',
        },
        {
          title: 'Deep sections',
          text: 'About, Work, and Projects open full reading panels with scroll.',
        },
        {
          title: 'Quick sections',
          text: 'Toolkit and Contact open compact cards; the board stays visible behind them.',
        },
        {
          title: 'Live links',
          text: 'Playground opens a bottom dock of live demos. Blog opens a full post list you can read in place.',
        },
        {
          title: 'Margin sheets',
          text: 'Annotations around the square — Now, Notes, Legend, Detail, and the title block.',
        },
        {
          title: 'Return',
          text: 'Esc, or “Back to the square”, returns to the full board.',
        },
      ],
    },
  },
  {
    id: 'detail',
    glyph: '1:10',
    label: 'Detail',
    kicker: 'Dwellci AI — enlarged',
    color: '#e8785c',
    content: {
      kind: 'detail',
      title: 'Dwellci AI',
      org: 'Generative design for architects',
      link: 'https://www.dwellci.com/',
      problem:
        'Architects needed a single surface to generate, refine, and review design options — not another disconnected AI widget.',
      approach: [
        'React Three Fiber front end for spatial design review',
        'Firebase for auth, Firestore, and Cloud Functions',
        'GCP infrastructure for generative services behind the canvas',
      ],
      outcomes: [
        'Core platform infrastructure on GCP',
        'End-to-end flow from prompt to editable 3D massing',
        'Interface aimed at architects, not ML engineers',
      ],
      tags: ['React Three Fiber', 'Firebase', 'GCP'],
    },
  },
  {
    id: 'colophon',
    glyph: 'A-1',
    label: 'Title Block',
    kicker: 'Sheet index & colophon',
    color: '#1d2951',
    content: {
      kind: 'colophon',
      project: 'Lawrence Yee — Portfolio',
      sheet: 'A-1 / Site plan',
      scale: '6 × 6 grid, world units',
      drawn: 'Aug 2026',
      stack: ['React 19', 'Vite', 'Framer Motion', 'Tailwind CSS 4'],
      credit: 'Designed & built by Lawrence Yee',
      repo: 'https://github.com/Newbz521',
    },
  },
]
