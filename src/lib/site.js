import { OWNER, RESUME_URL } from '../data/portfolio'

/** Canonical origin — set NEXT_PUBLIC_SITE_URL in production (no trailing slash). */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (explicit) return explicit
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export function absoluteUrl(path = '/') {
  const base = getSiteUrl()
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const SITE = {
  name: OWNER.name,
  role: OWNER.role,
  tagline: OWNER.tagline,
  email: OWNER.email,
  defaultTitle: `${OWNER.name} — Software Developer in New York`,
  defaultDescription:
    'Lawrence Yee is a New York software developer with a background in architecture. Explore work, projects, toolkit, and writing on software, design, and AI.',
  locale: 'en_US',
  resumePath: RESUME_URL,
  sameAs: [
    'https://github.com/Newbz521',
    'https://www.linkedin.com/in/lawrenceyee91/',
  ],
}
