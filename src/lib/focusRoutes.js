/**
 * Path map for board focus targets (pieces + margin sheets).
 * Blog, write, and play keep their own modules.
 */

export const FOCUS_PATHS = {
  about: '/about',
  work: '/work',
  projects: '/projects',
  toolkit: '/toolkit',
  playground: '/playground',
  contact: '/contact',
  now: '/now',
  notes: '/notes',
  legend: '/legend',
  detail: '/detail',
  colophon: '/colophon',
}

const PATH_TO_ID = Object.fromEntries(
  Object.entries(FOCUS_PATHS).map(([id, path]) => [path, id]),
)

export function focusPath(id) {
  if (!id) return '/'
  if (id === 'blog') return '/blog'
  return FOCUS_PATHS[id] || '/'
}

/** @returns {{ kind: 'home' } | { kind: 'focus', id: string } | null} */
export function parseFocusRoute(pathname) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/'
  if (path === '/') return { kind: 'home' }
  const id = PATH_TO_ID[path]
  if (id) return { kind: 'focus', id }
  return null
}

export function isFocusPath(pathname) {
  return parseFocusRoute(pathname)?.kind === 'focus'
}
