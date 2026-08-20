/**
 * Path-based blog deep links:
 *   /blog              → open Blog piece (post list)
 *   /blog/{slug}       → open Blog piece + that article
 *   /write             → write desk
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

/** @returns {{ kind: 'home' } | { kind: 'write' } | { kind: 'blog', slug: string | null }} */
export function parseBlogRoute(locationOrPath) {
  let path = '/'
  if (typeof locationOrPath === 'string') {
    path = locationOrPath
  } else if (locationOrPath?.pathname) {
    path = locationOrPath.pathname
  } else if (typeof window !== 'undefined') {
    path = window.location.pathname
  } else {
    return { kind: 'home' }
  }

  path = (path || '/').replace(/\/+$/, '') || '/'

  if (path === '/write') return { kind: 'write' }

  if (path === '/blog' || path.startsWith('/blog/')) {
    const rest = path === '/blog' ? '' : path.slice('/blog/'.length)
    const slug = rest.split('/').filter(Boolean)[0] || null
    return { kind: 'blog', slug }
  }

  if (typeof locationOrPath !== 'string' && locationOrPath?.hash) {
    const hash = (locationOrPath.hash || '').replace(/^#/, '')
    const hashPath = hash.startsWith('/') ? hash.slice(1) : hash
    if (hashPath === 'write') return { kind: 'write' }
    if (hashPath === 'blog' || hashPath.startsWith('blog/')) {
      const rest = hashPath === 'blog' ? '' : hashPath.slice('blog/'.length)
      const slug = rest.split('/').filter(Boolean)[0] || null
      return { kind: 'blog', slug }
    }
  }

  return { kind: 'home' }
}

export function writeDeskPath() {
  return '/write'
}

export function blogListPath() {
  return '/blog'
}

export function blogArticlePath(slug) {
  return slug ? `/blog/${slug}` : '/blog'
}

function navigate(path, { replace = false, router } = {}) {
  if (router) {
    if (replace) router.replace(path)
    else router.push(path)
    return
  }
  if (typeof window === 'undefined') return
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (current === path || (path === '/' && (current === '/' || current === ''))) return
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', path)
}

export function writeBlogUrl(slug, opts = {}) {
  const next = slug === undefined ? '/' : blogArticlePath(slug)
  navigate(next, opts)
}

export function writeDeskUrl(opts = {}) {
  navigate(writeDeskPath(), opts)
}
