import { focusTier } from './pieceTiers'

export function getFocusTarget(id, layout) {
  if (!id || !layout) return null
  const piece = layout.pieces.find((p) => p.id === id)
  if (piece) return { kind: 'piece', tier: focusTier('piece', piece.id), ...piece }
  const margin = layout.margins.find((m) => m.id === id)
  if (margin) return { kind: 'margin', tier: focusTier('margin', margin.id), ...margin }
  return null
}

export function focusRect(target) {
  if (!target) return null
  return { x: target.x, y: target.y, width: target.width, height: target.height }
}
