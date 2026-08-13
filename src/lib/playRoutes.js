/**
 * Sandbox share deep links:
 *   /play/{uuid}       → view shared board
 *   /#/play/{uuid}     → hash fallback
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isPlayId(id) {
  return typeof id === 'string' && UUID_RE.test(id)
}

export function playPath(id) {
  return id ? `/play/${id}` : '/'
}

export function absolutePlayUrl(id) {
  if (typeof window === 'undefined') return playPath(id)
  return `${window.location.origin}${playPath(id)}`
}

/** @returns {{ kind: 'home' } | { kind: 'play', id: string }} */
export function parsePlayRoute(location = typeof window === 'undefined' ? null : window.location) {
  if (!location) return { kind: 'home' }

  const path = (location.pathname || '/').replace(/\/+$/, '') || '/'
  const hash = (location.hash || '').replace(/^#/, '')

  if (path.startsWith('/play/')) {
    const id = path.slice('/play/'.length).split('/').filter(Boolean)[0] || null
    if (isPlayId(id)) return { kind: 'play', id }
  }

  const hashPath = hash.startsWith('/') ? hash.slice(1) : hash
  if (hashPath.startsWith('play/')) {
    const id = hashPath.slice('play/'.length).split('/').filter(Boolean)[0] || null
    if (isPlayId(id)) return { kind: 'play', id }
  }

  return { kind: 'home' }
}

export function writePlayUrl(id, { replace = false } = {}) {
  if (typeof window === 'undefined') return
  const next = id ? playPath(id) : '/'
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (current === next || (next === '/' && (current === '/' || current === ''))) return
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', next)
}
