/**
 * Sandbox share deep links:
 *   /play/{uuid}       → view shared board
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
export function parsePlayRoute(locationOrPath) {
  let path = '/'
  let hash = ''
  if (typeof locationOrPath === 'string') {
    path = locationOrPath
  } else if (locationOrPath?.pathname) {
    path = locationOrPath.pathname
    hash = locationOrPath.hash || ''
  } else if (typeof window !== 'undefined') {
    path = window.location.pathname
    hash = window.location.hash || ''
  } else {
    return { kind: 'home' }
  }

  path = (path || '/').replace(/\/+$/, '') || '/'
  hash = hash.replace(/^#/, '')

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

export function writePlayUrl(id, { replace = false, router } = {}) {
  const next = id ? playPath(id) : '/'
  if (router) {
    if (replace) router.replace(next)
    else router.push(next)
    return
  }
  if (typeof window === 'undefined') return
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (current === next || (next === '/' && (current === '/' || current === ''))) return
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', next)
}
