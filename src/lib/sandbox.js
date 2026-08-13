import { GRID } from '../data/portfolio'
import {
  BAR_MIN,
  CELL,
  SPREAD,
  SPREAD_FIXED,
  barHeight,
} from './layout'

export const SANDBOX_SIZE = GRID

/** Craft palette — portfolio inks plus a couple of extras (no purple glow). */
export const SANDBOX_PALETTE = [
  '#6e86b8',
  '#1d2951',
  '#e8785c',
  '#7fbfa6',
  '#d9b98c',
  '#35786e',
  '#b4553c',
]

export const SANDBOX_MAX_PIECES = 7

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function emptySandboxGrid() {
  return Array.from({ length: SANDBOX_SIZE }, () =>
    Array.from({ length: SANDBOX_SIZE }, () => null),
  )
}

export function createSandboxState() {
  return {
    grid: emptySandboxGrid(),
    pieces: {},
    activePieceId: null,
    activeColor: SANDBOX_PALETTE[0],
    nextPieceNum: 1,
  }
}

function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)))
}

function nextChar(piece) {
  const i = piece.letterCount ?? 0
  return LETTERS[i % LETTERS.length]
}

/** Start a fresh piece with the current ink (or reuse active if same color). */
export function ensureActivePiece(state, { forceNew = false } = {}) {
  const { activePieceId, activeColor, pieces, nextPieceNum } = state
  if (
    !forceNew &&
    activePieceId &&
    pieces[activePieceId] &&
    pieces[activePieceId].color === activeColor
  ) {
    return state
  }

  if (Object.keys(pieces).length >= SANDBOX_MAX_PIECES && forceNew) {
    return state
  }

  // Reuse existing piece of this color if not forcing new and one exists
  if (!forceNew) {
    const existing = Object.entries(pieces).find(([, p]) => p.color === activeColor)
    if (existing) {
      return { ...state, activePieceId: existing[0] }
    }
  }

  if (Object.keys(pieces).length >= SANDBOX_MAX_PIECES) {
    // Cap reached — stick with active or first piece
    const fallback = activePieceId || Object.keys(pieces)[0]
    return fallback ? { ...state, activePieceId: fallback } : state
  }

  const id = `play-${nextPieceNum}`
  return {
    ...state,
    activePieceId: id,
    nextPieceNum: nextPieceNum + 1,
    pieces: {
      ...pieces,
      [id]: { color: activeColor, letterCount: 0, label: `Piece ${nextPieceNum}` },
    },
  }
}

export function setSandboxColor(state, color) {
  const next = { ...state, activeColor: color }
  return ensureActivePiece(next)
}

export function startNewPiece(state) {
  return ensureActivePiece(state, { forceNew: true })
}

export function stampCell(state, row, col) {
  if (row < 0 || col < 0 || row >= SANDBOX_SIZE || col >= SANDBOX_SIZE) return state

  let next = ensureActivePiece(state)
  const pieceId = next.activePieceId
  if (!pieceId || !next.pieces[pieceId]) return state

  const grid = cloneGrid(next.grid)
  const existing = grid[row][col]
  if (existing && existing.pieceId === pieceId) return state

  // Claiming a cell from another piece moves it
  const piece = { ...next.pieces[pieceId] }
  const char = nextChar(piece)
  piece.letterCount = (piece.letterCount ?? 0) + 1

  grid[row][col] = {
    pieceId,
    height: existing?.height ?? 0.5,
    char,
  }

  return {
    ...next,
    grid,
    pieces: { ...next.pieces, [pieceId]: piece },
  }
}

export function eraseCell(state, row, col) {
  if (row < 0 || col < 0 || row >= SANDBOX_SIZE || col >= SANDBOX_SIZE) return state
  if (!state.grid[row][col]) return state

  const grid = cloneGrid(state.grid)
  grid[row][col] = null

  // Drop empty piece defs
  const stillUsed = new Set()
  for (const rowCells of grid) {
    for (const cell of rowCells) {
      if (cell) stillUsed.add(cell.pieceId)
    }
  }

  const pieces = { ...state.pieces }
  for (const id of Object.keys(pieces)) {
    if (!stillUsed.has(id)) delete pieces[id]
  }

  let activePieceId = state.activePieceId
  if (activePieceId && !pieces[activePieceId]) {
    activePieceId = Object.keys(pieces)[0] ?? null
  }

  return {
    ...state,
    grid,
    pieces,
    activePieceId,
  }
}

export function adjustCellHeight(state, row, col, delta) {
  if (row < 0 || col < 0 || row >= SANDBOX_SIZE || col >= SANDBOX_SIZE) return state
  const cell = state.grid[row][col]
  if (!cell) return state

  const grid = cloneGrid(state.grid)
  const height = Math.min(1, Math.max(0.08, cell.height + delta))
  grid[row][col] = { ...cell, height }
  return { ...state, grid }
}

/** Set the letter on a filled cell (A–Z or 0–9). */
export function setCellChar(state, row, col, raw) {
  if (row < 0 || col < 0 || row >= SANDBOX_SIZE || col >= SANDBOX_SIZE) return state
  const cell = state.grid[row][col]
  if (!cell) return state

  const char = String(raw ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 1)
  if (!char) return state

  const grid = cloneGrid(state.grid)
  grid[row][col] = { ...cell, char }
  return { ...state, grid }
}

export function resetSandbox() {
  return createSandboxState()
}

function bounds(cells) {
  const rows = cells.map((c) => c[0])
  const cols = cells.map((c) => c[1])
  return {
    minRow: Math.min(...rows),
    maxRow: Math.max(...rows),
    minCol: Math.min(...cols),
    maxCol: Math.max(...cols),
  }
}

/**
 * Convert sandbox grid → scene shaped like layout.build() pieces (no margins).
 */
export function buildPlayScene(state) {
  const margin = CELL * 0.78
  const boardW = SANDBOX_SIZE * CELL
  const boardH = SANDBOX_SIZE * CELL
  const originX = margin
  const originY = margin

  const boardCenterX = originX + boardW / 2
  const boardCenterY = originY + boardH / 2

  const byPiece = new Map()
  for (let r = 0; r < SANDBOX_SIZE; r++) {
    for (let c = 0; c < SANDBOX_SIZE; c++) {
      const cell = state.grid[r][c]
      if (!cell) continue
      if (!byPiece.has(cell.pieceId)) byPiece.set(cell.pieceId, [])
      byPiece.get(cell.pieceId).push({ r, c, ...cell })
    }
  }

  const raw = []
  let index = 0
  for (const [pieceId, cells] of byPiece) {
    const def = state.pieces[pieceId] ?? { color: SANDBOX_PALETTE[0], label: pieceId }
    const coords = cells.map((c) => [c.r, c.c])
    const b = bounds(coords)
    const width = (b.maxCol - b.minCol + 1) * CELL
    const height = (b.maxRow - b.minRow + 1) * CELL

    const sorted = [...cells].sort((p, q) => p.r - q.r || p.c - q.c)
    const short = sorted.map((c) => c.char).join('')
    const series = sorted.map((c) => c.height)
    const blocks = sorted.map((cell) => ({
      x: (cell.c - b.minCol) * CELL,
      y: (cell.r - b.minRow) * CELL,
      char: cell.char,
      value: cell.height,
      h: barHeight(cell.height),
      row: cell.r,
      col: cell.c,
    }))

    const tightX = originX + b.minCol * CELL
    const tightY = originY + b.minRow * CELL
    const dx = tightX + width / 2 - boardCenterX
    const dy = tightY + height / 2 - boardCenterY
    const dist = Math.hypot(dx, dy) || 1

    raw.push({
      id: pieceId,
      short,
      label: def.label ?? pieceId,
      kicker: 'Sandbox',
      color: def.color,
      series,
      cells: coords,
      index,
      blocks,
      width,
      height,
      x: tightX + dx * SPREAD + (dx / dist) * SPREAD_FIXED,
      y: tightY + dy * SPREAD + (dy / dist) * SPREAD_FIXED,
      dir: { x: dx / dist, y: dy / dist },
      dist,
      kind: 'piece',
      tier: 'compact',
    })
    index += 1
  }

  const empties = []
  for (let r = 0; r < SANDBOX_SIZE; r++) {
    for (let c = 0; c < SANDBOX_SIZE; c++) {
      if (state.grid[r][c]) continue
      empties.push({
        row: r,
        col: c,
        x: originX + c * CELL,
        y: originY + r * CELL,
      })
    }
  }

  return {
    pieces: raw,
    empties,
    margins: [],
    world: {
      width: boardW + margin * 2,
      height: boardH + margin * 2,
    },
    board: {
      x: originX,
      y: originY,
      width: boardW,
      height: boardH,
    },
  }
}

/** Flat pad height — readable as empty slot without looking like data. */
export const EMPTY_PAD_H = Math.max(6, BAR_MIN * 0.4)

export function sandboxFilledCount(state) {
  let n = 0
  for (const row of state?.grid ?? []) {
    for (const cell of row) {
      if (cell) n += 1
    }
  }
  return n
}

/** Payload for Firestore — flat 36-cell grid (Firestore forbids nested arrays). */
export function serializeSandbox(state) {
  const pieces = {}
  for (const [id, p] of Object.entries(state.pieces ?? {})) {
    pieces[id] = {
      color: String(p.color ?? SANDBOX_PALETTE[0]).slice(0, 20),
      label: String(p.label ?? id).slice(0, 40),
      letterCount: Math.min(36, Math.max(0, Math.floor(Number(p.letterCount) || 0))),
    }
  }

  const source = state.grid ?? emptySandboxGrid()
  const cells = []
  for (let r = 0; r < SANDBOX_SIZE; r++) {
    const row = source[r] ?? []
    for (let c = 0; c < SANDBOX_SIZE; c++) {
      const cell = row[c]
      if (!cell) {
        cells.push(null)
        continue
      }
      const char = String(cell.char ?? '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 1)
      cells.push({
        pieceId: String(cell.pieceId ?? '').slice(0, 40),
        height: Math.min(1, Math.max(0.08, Number(cell.height) || 0.5)),
        char: char || 'A',
      })
    }
  }

  return {
    version: 1,
    cells,
    pieces,
    activeColor: String(state.activeColor ?? SANDBOX_PALETTE[0]).slice(0, 20),
  }
}

/** Rebuild local sandbox state from a saved document. */
export function hydrateSandbox(data) {
  const base = createSandboxState()
  if (!data || data.version !== 1) return base

  const pieces = {}
  let maxNum = 0
  for (const [id, p] of Object.entries(data.pieces ?? {})) {
    if (!p || typeof p !== 'object') continue
    pieces[id] = {
      color: String(p.color ?? SANDBOX_PALETTE[0]).slice(0, 20),
      label: String(p.label ?? id).slice(0, 40),
      letterCount: Math.min(36, Math.max(0, Math.floor(Number(p.letterCount) || 0))),
    }
    const m = /^play-(\d+)$/.exec(id)
    if (m) maxNum = Math.max(maxNum, Number(m[1]))
  }

  const grid = emptySandboxGrid()
  const cells = Array.isArray(data.cells) ? data.cells : null

  if (cells && cells.length === SANDBOX_SIZE * SANDBOX_SIZE) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (!cell || typeof cell !== 'object') continue
      const r = Math.floor(i / SANDBOX_SIZE)
      const c = i % SANDBOX_SIZE
      const pieceId = String(cell.pieceId ?? '')
      if (!pieceId || !pieces[pieceId]) continue
      const char = String(cell.char ?? '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 1)
      grid[r][c] = {
        pieceId,
        height: Math.min(1, Math.max(0.08, Number(cell.height) || 0.5)),
        char: char || 'A',
      }
    }
  }

  // Drop piece defs that never appear on the grid
  const used = new Set()
  for (const row of grid) {
    for (const cell of row) {
      if (cell) used.add(cell.pieceId)
    }
  }
  for (const id of Object.keys(pieces)) {
    if (!used.has(id)) delete pieces[id]
  }

  const pieceIds = Object.keys(pieces)
  const activeColor =
    typeof data.activeColor === 'string' && data.activeColor
      ? data.activeColor.slice(0, 20)
      : SANDBOX_PALETTE[0]

  return {
    grid,
    pieces,
    activePieceId: pieceIds[0] ?? null,
    activeColor,
    nextPieceNum: maxNum + 1,
  }
}
