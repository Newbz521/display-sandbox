import { PAGE_SEED } from '../data/contentSeed'
import { BLOG_SEED } from '../data/blogSeed'
import { MARGINS } from '../data/margins'
import { OWNER } from '../data/portfolio'
import { SITE } from './site'

/**
 * Curated SEO outlines: one H1 + lead, then H2 sections with descriptions.
 * Keep this aligned with PAGE_SEED / BLOG_SEED — it is the crawlable document shape.
 */

/** @typedef {{ title: string, description: string, body?: string[] }} SeoSection */
/** @typedef {{ h1: string, lead: string, sections: SeoSection[] }} SeoOutline */

/** @type {Record<string, SeoOutline>} */
export const FOCUS_OUTLINES = {
  about: {
    h1: `${OWNER.name} — Software Developer in New York`,
    lead: PAGE_SEED.about.content.lead,
    sections: [
      {
        title: 'From architecture to software',
        description: PAGE_SEED.about.content.body[0],
      },
      {
        title: 'How I like to work',
        description: PAGE_SEED.about.content.body[1],
      },
      {
        title: 'Education',
        description:
          'Architectural Technology at City Tech, then General Assembly — planning and making, in that order.',
        body: PAGE_SEED.about.content.education.map(
          (ed) => `${ed.title} — ${ed.org} (${ed.period})`,
        ),
      },
    ],
  },

  work: {
    h1: `Work experience — ${OWNER.name}`,
    lead: 'Where the hours went: legal platforms, generative design tools, games, nonprofits, and the architecture studio that came first.',
    sections: PAGE_SEED.work.content.items.map((item) => ({
      title: `${item.title} at ${item.org}`,
      description: `${item.period}. ${item.points[0]}`,
      body: item.points.slice(1),
    })),
  },

  projects: {
    h1: `Projects — ${OWNER.name}`,
    lead: 'Things I have built — legal ops platforms, generative design tools, multiplayer games, AI camera software, and nonprofit sites.',
    sections: PAGE_SEED.projects.content.items.map((item) => ({
      title: item.name,
      description: item.blurb,
      body: item.tags?.length ? [`Stack: ${item.tags.join(', ')}`] : undefined,
    })),
  },

  toolkit: {
    h1: `Toolkit — ${OWNER.name}`,
    lead: 'What I reach for when shipping: languages, frameworks, databases, and cloud — chosen for the job, not the résumé.',
    sections: PAGE_SEED.toolkit.content.items.map((group) => ({
      title: group.group,
      description: group.chips.join(', '),
    })),
  },

  playground: {
    h1: `Playground — side builds by ${OWNER.name}`,
    lead: 'Side builds, all live — 3D portfolios, kitchen layout tools, massing studies, and small browser games.',
    sections: PAGE_SEED.playground.content.items.map((item) => ({
      title: item.name,
      description: item.blurb,
      body: item.tags?.length ? [`Stack: ${item.tags.join(', ')}`] : undefined,
    })),
  },

  contact: {
    h1: `Contact ${OWNER.name}`,
    lead: PAGE_SEED.contact.content.lead,
    sections: [
      {
        title: 'Email and phone',
        description: 'Reach me directly for work, collaborations, or a look at a codebase.',
        body: PAGE_SEED.contact.content.items
          .filter((i) => i.label === 'Email' || i.label === 'Phone')
          .map((i) => `${i.label}: ${i.value}`),
      },
      {
        title: 'Elsewhere',
        description: 'Code, résumé, and professional profile.',
        body: PAGE_SEED.contact.content.items
          .filter((i) => i.label !== 'Email' && i.label !== 'Phone')
          .map((i) => `${i.label}: ${i.value}`),
      },
    ],
  },

  now: {
    h1: `Now — what ${OWNER.name} is focused on`,
    lead: MARGINS.find((m) => m.id === 'now').content.status,
    sections: MARGINS.find((m) => m.id === 'now').content.items.map((item) => ({
      title: item.label,
      description: item.value,
    })),
  },

  notes: {
    h1: `General notes — how ${OWNER.name} works`,
    lead: 'Working notes from someone who still thinks in plans, sections, and massing studies — even when the medium is software.',
    sections: MARGINS.find((m) => m.id === 'notes').content.items.map((item) => ({
      title: item.code,
      description: item.text,
    })),
  },

  legend: {
    h1: 'How to read this portfolio board',
    lead: 'Each block cluster is a section of the site. Hover to preview, click to open — the board is the navigation.',
    sections: MARGINS.find((m) => m.id === 'legend').content.items.map((item) => ({
      title: item.title,
      description: item.text,
    })),
  },

  detail: {
    h1: 'Detail callout — Dwellci AI',
    lead: 'Architects needed a single surface to generate, refine, and review design options — not another disconnected AI widget.',
    sections: [
      {
        title: 'Approach',
        description:
          'React Three Fiber for spatial design review, Firebase for auth and data, and GCP for the generative services behind the canvas.',
        body: [
          'React Three Fiber front end for spatial design review',
          'Firebase for auth, Firestore, and Cloud Functions',
          'GCP infrastructure for generative services behind the canvas',
        ],
      },
      {
        title: 'Outcomes',
        description:
          'Core platform infrastructure on GCP with an end-to-end flow from prompt to editable 3D massing — aimed at architects, not ML engineers.',
        body: [
          'Core platform infrastructure on GCP',
          'End-to-end flow from prompt to editable 3D massing',
          'Interface aimed at architects, not ML engineers',
        ],
      },
    ],
  },

  colophon: {
    h1: 'Colophon — sheet index for this portfolio',
    lead: 'Title block for Lawrence Yee’s drafting-board portfolio: sheet A-1, drawn August 2026.',
    sections: [
      {
        title: 'Sheet',
        description: 'A-1 / Site plan — 6 × 6 grid in world units.',
      },
      {
        title: 'Stack',
        description: 'React 19, Next.js, Framer Motion, and Tailwind CSS 4.',
      },
      {
        title: 'Credit',
        description: 'Designed and built by Lawrence Yee.',
      },
    ],
  },
}

/** @type {SeoOutline} */
export const HOME_OUTLINE = {
  h1: `${OWNER.name} — Architecture-minded software developer`,
  lead: `${OWNER.role} based in New York. ${OWNER.tagline} ${SITE.defaultDescription}`,
  sections: [
    {
      title: 'About',
      description: PAGE_SEED.about.content.lead,
    },
    {
      title: 'Work',
      description:
        'Legal platforms, generative design tools, multiplayer games, nonprofit sites, and the architecture practice that came before software.',
    },
    {
      title: 'Projects',
      description:
        'Shipped work across AWS, Firebase, React Three Fiber, Godot, and SEO-focused content systems.',
    },
    {
      title: 'Blog',
      description:
        'Notes on MCP design, architecture and AI, and slowing down when “AI can” is not the same as “AI should.”',
    },
    {
      title: 'Contact',
      description: PAGE_SEED.contact.content.lead,
    },
  ],
}

/** @type {SeoOutline} */
export const BLOG_INDEX_OUTLINE = {
  h1: `Blog — ${OWNER.name} on software, architecture, and AI`,
  lead: 'Thinking out loud: MCP tooling that does the reliable work in code, AI that supports architects instead of replacing them, and knowing when not to press the generate button.',
  sections: BLOG_SEED.map((post) => ({
    title: post.title,
    description: firstParagraph(post.blurb),
  })),
}

/** Hand-structured outlines for seed posts — H1 lead + thematic H2s. */
const BLOG_POST_OUTLINES = {
  'mcp-design': {
    h1: 'Thoughts on the future of MCP design',
    lead: 'In the age of AI, a lot of MCP design is already heading in the wrong direction — giving models more tools is not the same as making them more capable.',
    sections: [
      {
        title: 'More tools is not more capability',
        description:
          "Giving an LLM access to 50 tools doesn't automatically make it more capable. If every tool dumps raw data back into the context and expects the model to calculate, filter, sort, validate, and figure out what matters, you're just moving backend work onto the LLM.",
      },
      {
        title: 'Do the reliable work before the model sees it',
        description:
          'If something can be calculated or determined reliably with code, it probably should be. The MCP layer should do that work before the result ever reaches the model — trends, deduplication, ranking, and known API shapes included.',
      },
      {
        title: 'Boring tools, better judgment',
        description:
          'The best MCP tools will feel boring: narrow responsibilities, predictable inputs, strong validation, and exactly what the model needs for the next decision. Code handles precision; the LLM handles ambiguity, reasoning, and judgment.',
      },
    ],
  },
  'architecture-and-ai': {
    h1: 'Architecture and AI',
    lead: 'AI has the potential to push architecture back toward what architects are supposed to do: design — not drown in compliance paperwork.',
    sections: [
      {
        title: 'What school promised vs what practice demands',
        description:
          'Design studio felt like exploring space, form, materials, context, and experience. Firm life was code, zoning, compliance, documentation, coordination, revisions, and calculations — necessary work that can consume the job.',
      },
      {
        title: 'AI in the background, architect in control',
        description:
          'The goal is not AI designing buildings. It is AI constantly checking zoning, code, accessibility, egress, calculations, and technical constraints while the architect designs — and still owns the decisions.',
      },
      {
        title: 'Closing the gap between studio and practice',
        description:
          'Maybe the biggest opportunity for AI is not replacing architects at all. Maybe it is closing the gap between the architecture people fall in love with in school and the architecture they are actually able to practice.',
      },
    ],
  },
  'slowing-down': {
    h1: 'Slowing down',
    lead: 'There is a difference between understanding how to use AI and simply being excited that AI can do something.',
    sections: [
      {
        title: 'A conversation overheard in SoHo',
        description:
          'An animator spent over a year finishing assets. An executive wanted them replaced with an AI-generated model — and when the style did not match, the answer was to regenerate the whole scene.',
      },
      {
        title: '“AI can” is not the same as “AI should”',
        description:
          'There is a huge difference between understanding what AI can generate and understanding the craft you are trying to replace. Excitement is not a substitute for judgment.',
      },
      {
        title: 'Amplify craft, do not discard it',
        description:
          'Good AI adoption amplifies people who already understand the work — faster iteration, less repetition, more range for a small team. Scrapping finished craft because a generate button exists is not innovation.',
      },
    ],
  },
}

export function homeOutline() {
  return HOME_OUTLINE
}

export function blogIndexOutline(posts = BLOG_SEED) {
  if (!posts?.length || posts === BLOG_SEED) return BLOG_INDEX_OUTLINE
  return {
    h1: BLOG_INDEX_OUTLINE.h1,
    lead: BLOG_INDEX_OUTLINE.lead,
    sections: posts.map((post) => ({
      title: post.title,
      description: firstParagraph(post.blurb),
    })),
  }
}

export function blogPostOutline(post) {
  if (!post) return null
  const curated = BLOG_POST_OUTLINES[post.slug]
  if (curated) return curated

  const paragraphs = String(post.blurb || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  const lead = paragraphs[0] || `${post.title} — a note by ${OWNER.name}.`
  const rest = paragraphs.slice(1)

  return {
    h1: post.title,
    lead,
    sections: rest.length
      ? rest.map((para, i) => ({
          title: headingFromParagraph(para, i),
          description: para,
        }))
      : [
          {
            title: 'Full note',
            description: lead,
          },
        ],
  }
}

export function focusOutline(focusId) {
  return FOCUS_OUTLINES[focusId] || null
}

/**
 * Browser / OG meta tags — shorter than on-page H1s, written from real page copy.
 * `title` is the segment before “— Lawrence Yee” (unless it already includes the name).
 * `description` should be one or two complete sentences (~150–160 chars).
 */
/** @typedef {{ title: string, description: string }} PageMeta */

/** @type {PageMeta} */
export const HOME_META = {
  title: `${OWNER.name} — Software Developer in New York`,
  description:
    'Lawrence Yee is a New York software developer with a background in architecture. Explore work, projects, toolkit, and writing on software, design, and AI.',
}

/** @type {Record<string, PageMeta>} */
export const FOCUS_META = {
  about: {
    title: `About ${OWNER.name}`,
    description:
      'Meet Lawrence Yee, a New York software developer who moved from Architectural Technology and General Assembly into building legal tools, generative design products, games, and nonprofit sites.',
  },
  work: {
    title: `Work experience — ${OWNER.name}`,
    description:
      'Work history for Lawrence Yee: Software Developer at SKYZ US and Dwellci AI, fullstack work for New York Auto Museum and EzML, game development at ROTRK, and earlier architecture design at DJ Associates.',
  },
  projects: {
    title: `Projects — ${OWNER.name}`,
    description:
      'Selected projects by Lawrence Yee, including a legal operations platform, Dwellci AI generative design, a multiplayer Godot title, EzML’s AI camera platform, and the New York Auto Museum site.',
  },
  toolkit: {
    title: `Toolkit — ${OWNER.name}`,
    description:
      'Languages, frameworks, databases, and cloud tools Lawrence Yee uses day to day — from JavaScript, React, and React Three Fiber to Neo4j, Firebase, AWS, and GCP.',
  },
  playground: {
    title: `Playground — ${OWNER.name}`,
    description:
      'Live side builds by Lawrence Yee: immersive 3D portfolios, the Kitchan kitchen layout tool, Cube massing studies, Beacon Defender, and a browser DDR remake.',
  },
  contact: {
    title: `Contact ${OWNER.name}`,
    description:
      'Get in touch with Lawrence Yee by email or phone, or find GitHub, LinkedIn, and a downloadable résumé. Open to interesting problems and collaborations.',
  },
  now: {
    title: `Now — ${OWNER.name}`,
    description:
      'What Lawrence Yee is focused on now: legal platforms and AWS at SKYZ US, building this spatial portfolio, learning Neo4j, and based in New York. Open to interesting work.',
  },
  notes: {
    title: `How ${OWNER.name} works`,
    description:
      'Working principles from Lawrence Yee: draw it before you build it, design for precise work, keep code legible, use spatial tools for spatial problems, and ship, measure, refine.',
  },
  legend: {
    title: 'How to read this portfolio',
    description:
      'How to use this drafting-board portfolio: each block cluster is a section — hover to preview, click to open, and press Esc or Back to return to the full board.',
  },
  detail: {
    title: 'Dwellci AI — project detail',
    description:
      'A closer look at Dwellci AI: generative design for architects with React Three Fiber, Firebase, and GCP — from prompt to editable 3D massing on one surface.',
  },
  colophon: {
    title: 'Colophon — portfolio sheet index',
    description:
      'Colophon for Lawrence Yee’s portfolio: sheet A-1 on a 6×6 drafting grid, built with React, Next.js, Framer Motion, and Tailwind CSS.',
  },
}

/** @type {PageMeta} */
export const BLOG_INDEX_META = {
  title: `Blog — ${OWNER.name}`,
  description:
    'Essays by Lawrence Yee on MCP tool design, architecture and AI, and slowing down when excitement about AI outruns judgment about craft.',
}

/** @type {Record<string, PageMeta>} */
export const BLOG_POST_META = {
  'mcp-design': {
    title: 'Thoughts on the future of MCP design',
    description:
      'Why MCP design should do reliable work in code before the model sees it — narrow, boring tools beat dumping raw data and decisions onto the LLM.',
  },
  'architecture-and-ai': {
    title: 'Architecture and AI',
    description:
      'How AI could return architects to design by handling zoning, code, and calculations in the background — without replacing the architect’s judgment.',
  },
  'slowing-down': {
    title: 'Slowing down',
    description:
      'A SoHo conversation about scrapping a year of animation for AI generation — and why “AI can” is not the same as “AI should.” Amplify craft; don’t discard it.',
  },
}

export function homeMeta() {
  return HOME_META
}

export function focusMeta(focusId) {
  return FOCUS_META[focusId] || null
}

export function blogIndexMeta() {
  return BLOG_INDEX_META
}

export function blogPostMeta(post) {
  if (!post) return null
  const curated = BLOG_POST_META[post.slug]
  if (curated) return curated
  return {
    title: post.title,
    description: firstParagraph(post.blurb),
  }
}

function firstParagraph(text) {
  return (
    String(text || '')
      .split(/\n\n+/)
      .map((p) => p.trim())
      .find(Boolean) || ''
  )
}

function headingFromParagraph(para, index) {
  const sentence = para.split(/(?<=[.!?])\s+/)[0] || para
  const clipped = sentence.length > 72 ? `${sentence.slice(0, 69).trim()}…` : sentence
  return clipped || `Section ${index + 1}`
}
