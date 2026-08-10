/** How a piece opens once selected: full read, compact popover, or link dock. */
const TIERS = {
  about: 'detail',
  work: 'detail',
  projects: 'detail',
  toolkit: 'compact',
  contact: 'compact',
  playground: 'dock',
  blog: 'detail',
}

export function pieceTier(id) {
  return TIERS[id] ?? 'detail'
}

export function focusTier(kind, id) {
  if (kind === 'margin') return 'compact'
  return pieceTier(id)
}

export function detailPadding(tier) {
  if (tier === 'compact') return 0.8
  if (tier === 'dock') return 0.92
  return 0.68
}

export function zoomDelay(tier, reduceMotion) {
  if (reduceMotion) return 120
  if (tier === 'dock') return 360
  if (tier === 'compact') return 520
  return 760
}

/** Panel fade-out before the camera pulls back to the board. */
export function exitHoldMs(reduceMotion) {
  return reduceMotion ? 60 : 220
}

/** Board settle time after the camera starts returning. */
export function returnHoldMs(reduceMotion) {
  return reduceMotion ? 80 : 580
}

const CAMERA_SPRINGS = {
  board: { stiffness: 50, damping: 21, mass: 1.12 },
  zooming: { stiffness: 52, damping: 22, mass: 1.1 },
  detail: { stiffness: 54, damping: 21, mass: 1.12 },
  transition: { stiffness: 56, damping: 22, mass: 1.08 },
  reduced: { stiffness: 400, damping: 40 },
}

/** Tween beats spring when every piece animates at once — no per-frame physics solve. */
export function scatterTransition(returning, dist, reduceMotion) {
  if (reduceMotion) return { type: 'tween', duration: 0.2 }
  if (returning) {
    return {
      type: 'tween',
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.06 + Math.min(dist / 2600, 0.04),
    }
  }
  return {
    type: 'tween',
    duration: 0.52,
    ease: [0.4, 0, 0.2, 1],
    delay: Math.min(dist / 1600, 0.08),
  }
}

export function cameraSpring(phase, reduceMotion) {
  if (reduceMotion) return CAMERA_SPRINGS.reduced
  switch (phase) {
    case 'zooming':
      return CAMERA_SPRINGS.zooming
    case 'detail':
      return CAMERA_SPRINGS.detail
    case 'exiting':
    case 'returning':
      return CAMERA_SPRINGS.transition
    default:
      return CAMERA_SPRINGS.board
  }
}
