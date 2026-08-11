/**
 * Path-based blog deep links:
 *   /blog              → open Blog piece (post list)
 *   /blog/{slug}       → open Blog piece + that article
 *
 * Also accepts hash forms for hosts without SPA rewrites:
 *   /#/blog            → list
 *   /#/blog/{slug}     → article
 */

export function slugify(title) {
  return String(title ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function postSlug(item) {
  if (!item) return null
  return item.slug || slugify(item.title) || null
}

export function findPostBySlug(items, slug) {
  if (!slug || !items?.length) return null
  return items.find((item) => postSlug(item) === slug) ?? null
}

/** @returns {{ kind: 'home' } | { kind: 'blog', slug: string | null }} */
export function parseBlogRoute(location = typeof window === 'undefined' ? null : window.location) {
  if (!location) return { kind: 'home' }

  const path = (location.pathname || '/').replace(/\/+$/, '') || '/'
  const hash = (location.hash || '').replace(/^#/, '')

  // /blog or /blog/slug
  if (path === '/blog' || path.startsWith('/blog/')) {
    const rest = path === '/blog' ? '' : path.slice('/blog/'.length)
    const slug = rest.split('/').filter(Boolean)[0] || null
    return { kind: 'blog', slug }
  }

  // /#/blog or /#/blog/slug  (and bare #blog / #blog/slug)
  const hashPath = hash.startsWith('/') ? hash.slice(1) : hash
  if (hashPath === 'blog' || hashPath.startsWith('blog/')) {
    const rest = hashPath === 'blog' ? '' : hashPath.slice('blog/'.length)
    const slug = rest.split('/').filter(Boolean)[0] || null
    return { kind: 'blog', slug }
  }

  return { kind: 'home' }
}

export function blogListPath() {
  return '/blog'
}

export function blogArticlePath(slug) {
  return slug ? `/blog/${slug}` : '/blog'
}

export function writeBlogUrl(slug, { replace = false } = {}) {
  if (typeof window === 'undefined') return
  const next = slug === undefined ? '/' : blogArticlePath(slug)
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (current === next || (next === '/' && (current === '/' || current === ''))) return
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', next)
}
