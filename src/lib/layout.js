import { PIECES } from '../data/portfolio'
import { MARGINS } from '../data/margins'

/**
 * Everything is laid out in "world units" — a resolution-independent space. One
 * block is 100 units square and sits on a board that is tilted back and spun
 * slightly, so the blocks read as solid objects with thickness.
 *
 * The camera is a translate + scale applied to that whole tilted board, which
 * is what lets "zoom until this piece fills the viewport" stay exact.
 */
export const CELL = 100 // one block's footprint
export const BLOCK_GAP = 7 // air between neighbouring blocks
export const THICKNESS = 28 // how tall a block stands off the board
export const TOP_RADIUS = 9 // corner rounding on the top face

/**
 * Two-point perspective. The extrusion axis always projects straight up the
 * screen — `rotateZ` happens first and so never touches it — which keeps every
 * vertical edge vertical, the defining trait of a two-point view. The spin then
 * swings both horizontal axes off-screen-parallel so each runs to its own
 * vanishing point, and the short perspective distance makes that convergence
 * visible rather than theoretical.
 */
export const TILT_X = 41 // board tipped away from the viewer, degrees
export const SPIN_Z = 24 // ...and turned in its own plane
export const SCENE_DEPTH = 1900 // CSS perspective distance, px

/** Mobile camera — tuned via debug panel. */
export const TILT_X_MOBILE = 34
export const SPIN_Z_MOBILE = 0.5
export const SCENE_DEPTH_MOBILE = 2200
export const PERSPECTIVE_ORIGIN_MOBILE = '50% 18%'
export const MOBILE_CAMERA_PADDING = 0.8
export const MOBILE_CAMERA_SCALE = 1.2
export const MOBILE_CAMERA_VIEW_OFFSET_Y = -81
export const MOBILE_FOOTER_RESERVE = 95

// Pieces drift out of the perfect square by a fixed nudge plus a share of their
// distance from the centre, so they read as separate pieces loosely forming a
// square rather than one welded grid.
export const SPREAD = 0.035
export const SPREAD_FIXED = 21

// Hovering a piece ripples through its own blocks: the block under the cursor
// rises first, and the rest of that piece follows outward from it. Other pieces
// are untouched.
export const BLOCK_LIFT = 40 // how high a block rises, world units
export const RIPPLE_SPEED = 900 // world units per second the ripple travels

/** Board-plane layering — grid on the slab, margin sheets taped above it. */
export const GRID_Z = 0.5
export const MARGIN_Z = 14
export const CREDIT_Z = 32 // above margin sheets so the stamp stays legible on mobile

/** Vertical space reserved under the stamp before margin sheets on mobile. */
export const MOBILE_STAMP_CLEARANCE = 156

const rad = (d) => (d * Math.PI) / 180

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
 * Derive the whole scene from the `cells` arrays once, at module load.
 */
function build() {
    const all = PIECES.flatMap((p) => p.cells)
    const board = bounds(all)
    const boardCenterX = ((board.minCol + board.maxCol + 1) / 2) * CELL
    const boardCenterY = ((board.minRow + board.maxRow + 1) / 2) * CELL

    const raw = PIECES.map((piece, index) => {
        const b = bounds(piece.cells)
        const width = (b.maxCol - b.minCol + 1) * CELL
        const height = (b.maxRow - b.minRow + 1) * CELL

        // A piece has exactly as many blocks as its code has letters, so the word
        // sets into the shape one letter per block, in row-major reading order.
        const blocks = [...piece.cells]
            .sort((p, q) => p[0] - q[0] || p[1] - q[1])
            .map(([r, c], i) => ({
                x: (c - b.minCol) * CELL,
                y: (r - b.minRow) * CELL,
                char: (piece.short ?? '')[i] ?? '',
            }))

        const tightX = b.minCol * CELL
        const tightY = b.minRow * CELL
        const dx = tightX + width / 2 - boardCenterX
        const dy = tightY + height / 2 - boardCenterY
        const dist = Math.hypot(dx, dy) || 1

        return {
            ...piece,
            index,
            blocks,
            width,
            height,
            x: tightX + dx * SPREAD + (dx / dist) * SPREAD_FIXED,
            y: tightY + dy * SPREAD + (dy / dist) * SPREAD_FIXED,
            dir: { x: dx / dist, y: dy / dist },
            dist,
        }
    })

    // Normalise so the composition starts at (0, 0). The margin doubles as the
    // slab's border, since the slab fills the world rect.
    const margin = CELL * 0.78
    const minX = Math.min(...raw.map((p) => p.x)) - margin
    const minY = Math.min(...raw.map((p) => p.y)) - margin
    const maxX = Math.max(...raw.map((p) => p.x + p.width)) + margin
    const maxY = Math.max(...raw.map((p) => p.y + p.height)) + margin

    const pieces = raw.map((p) => ({...p, x: p.x - minX, y: p.y - minY }))

    const pMaxX = Math.max(...pieces.map((p) => p.x + p.width))
    const pMaxY = Math.max(...pieces.map((p) => p.y + p.height))
    const pMidY = (Math.min(...pieces.map((p) => p.y)) + pMaxY) / 2

    const marginDefs = {
        now: { x: -200, y: 48, width: 212, height: 224 },
        notes: { x: -218, y: pMidY - 130, width: 228, height: 340 },
        legend: { x: pMaxX + 36, y: 36, width: 224, height: 204 },
        detail: { x: pMaxX + 36, y: pMidY - 100, width: 284, height: 304 },
        colophon: { x: pMaxX - 64, y: pMaxY + 32, width: 304, height: 184 },
    }

    const margins = MARGINS.map((m) => ({
        ...m,
        ...marginDefs[m.id],
    }))

    const pad = CELL * 0.42
    const globalMinX = Math.min(0, ...margins.map((m) => m.x)) - pad
    const globalMinY = Math.min(0, ...margins.map((m) => m.y)) - pad
    const globalMaxX = Math.max(pMaxX, ...margins.map((m) => m.x + m.width)) + pad
    const globalMaxY = Math.max(pMaxY, ...margins.map((m) => m.y + m.height)) + pad

    const shiftX = -globalMinX
    const shiftY = -globalMinY

    const shiftedMargins = margins.map((m) => ({...m, x: m.x + shiftX, y: m.y + shiftY }))
    const shiftedPieces = pieces.map((p) => ({...p, x: p.x + shiftX, y: p.y + shiftY }))

    const worldWidth = globalMaxX + shiftX
    const worldHeight = globalMaxY + shiftY

    return {
        pieces: shiftedPieces,
        margins: shiftedMargins,
        world: { width: worldWidth, height: worldHeight },
        credit: {
            x: worldWidth / 2,
            y: pMaxY + shiftY + 68,
        },
    }
}

function buildMobile(desktop) {
    const pieces = desktop.pieces
    const pMinX = Math.min(...pieces.map((p) => p.x))
    const pMaxX = Math.max(...pieces.map((p) => p.x + p.width))
    const pMaxY = Math.max(...pieces.map((p) => p.y + p.height))
    const centerX = (pMinX + pMaxX) / 2
    const contentW = pMaxX - pMinX
    const gap = 14

    let y = pMaxY + 28
    const creditY = y
    y += MOBILE_STAMP_CLEARANCE

    const colW = (contentW - gap) / 2
    const marginDefs = {
        now: { x: pMinX, y, width: colW, height: 162 },
        notes: { x: pMinX + colW + gap, y, width: colW, height: 162 },
    }
    y += 162 + gap
    marginDefs.legend = { x: pMinX, y, width: colW, height: 148 }
    marginDefs.detail = { x: pMinX + colW + gap, y, width: colW, height: 148 }
    y += 148 + gap
    marginDefs.colophon = { x: pMinX, y, width: contentW, height: 140 }
    y += 140

    const margins = MARGINS.map((m) => ({...m, ...marginDefs[m.id] }))
    const credit = { x: centerX, y: creditY }

    const contentMinX = pMinX
    const contentMaxX = Math.max(pMaxX, ...margins.map((m) => m.x + m.width))
    const contentMinY = Math.min(...pieces.map((p) => p.y))
    const contentMaxY = Math.max(y, credit.y + MOBILE_STAMP_CLEARANCE)
    const contentWidth = contentMaxX - contentMinX
    const contentHeight = contentMaxY - contentMinY

    const pad = CELL * 0.32
    const worldW = contentWidth + pad * 2
    const worldH = contentHeight + pad * 2
    const shiftX = (worldW - contentWidth) / 2 - contentMinX
    const shiftY = (worldH - contentHeight) / 2 - contentMinY
    const nudge = (item) => ({...item, x: item.x + shiftX, y: item.y + shiftY })

    return {
        pieces: pieces.map(nudge),
        margins: margins.map(nudge),
        credit: { x: credit.x + shiftX, y: credit.y + shiftY },
        world: { width: worldW, height: worldH },
    }
}

export const LAYOUT = build()
export const LAYOUT_MOBILE = buildMobile(LAYOUT)

/** Tight framing rect for the mobile board — pieces, stamp, and sheets. */
export function mobileBoardFocus(layout) {
    const pad = 8
    const minX = Math.min(
        ...layout.pieces.map((p) => p.x),
        ...layout.margins.map((m) => m.x),
    )
    const maxX = Math.max(
        ...layout.pieces.map((p) => p.x + p.width),
        ...layout.margins.map((m) => m.x + m.width),
    )
    const minY = Math.min(...layout.pieces.map((p) => p.y))
    const maxY = Math.max(
        ...layout.margins.map((m) => m.y + m.height),
        layout.credit.y + MOBILE_STAMP_CLEARANCE,
    )
    return {
        x: Math.max(0, minX - pad),
        y: Math.max(0, minY - pad),
        width: maxX - minX + pad * 2,
        height: maxY - minY + pad * 2,
    }
}

/**
 * Rotate a board-space point (given relative to the board's centre) into view
 * space, matching the CSS `rotateX(TILT_X) rotateZ(SPIN_Z)` on the board.
 * CSS applies the rightmost rotation first, so the spin happens before the tilt.
 * `z` is height above the board, toward the viewer.
 */
function rotate({ x, y, z = 0 }, tiltX = TILT_X, spinZ = SPIN_Z) {
    const cz = Math.cos(rad(spinZ))
    const sz = Math.sin(rad(spinZ))
    const cx = Math.cos(rad(tiltX))
    const sx = Math.sin(rad(tiltX))
    const sx1 = x * cz - y * sz
    const sy1 = x * sz + y * cz
    return { x: sx1, y: sy1 * cx - z * sx, z: sy1 * sx + z * cx }
}

/**
 * Solve for the camera that frames `focus` (a world-space rect) in a vw x vh
 * viewport.
 *
 * The board's transform is `translate3d(x, y, 0) scale(s) rotateX() rotateZ()`,
 * so a point lands at `s * rotate(p).xy + t`, and the parent's `perspective`
 * then divides by depth. Scale is 2D, so depth is *not* scaled — the maths below
 * mirrors that exactly.
 *
 * Putting the focus centre at the viewport centre is easy: pre-divide it sits at
 * the origin, and the perspective divide leaves the origin alone. The scale that
 * makes the piece fill the frame is coupled to that divide, so it is solved by a
 * few rounds of refinement rather than in closed form.
 */
export function cameraFor(
    focus,
    vw,
    vh, {
        padding = 0.82,
        maxScale = 12,
        zRange = [0, THICKNESS],
        layout = LAYOUT,
        tiltX = TILT_X,
        spinZ = SPIN_Z,
        viewOffsetY = 0,
        scaleMultiplier = 1,
    } = {},
) {
    const cx = layout.world.width / 2
    const cy = layout.world.height / 2

    // The z range matters as much as the footprint: the slab hangs below z = 0 and
    // the blocks stand above it, and under a tilt both project onto the screen.
    const corners = []
    for (const x of[focus.x, focus.x + focus.width]) {
        for (const y of[focus.y, focus.y + focus.height]) {
            for (const z of zRange) {
                corners.push(rotate({ x: x - cx, y: y - cy, z }, tiltX, spinZ))
            }
        }
    }
    const center = rotate({
            x: focus.x + focus.width / 2 - cx,
            y: focus.y + focus.height / 2 - cy,
            z: THICKNESS / 2,
        },
        tiltX,
        spinZ,
    )

    let scale = 1
    for (let pass = 0; pass < 5; pass++) {
        const tx = -scale * center.x
        const ty = -scale * center.y
        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        for (const c of corners) {
            const depth = SCENE_DEPTH / Math.max(SCENE_DEPTH - c.z, 1)
            const px = (scale * c.x + tx) * depth
            const py = (scale * c.y + ty) * depth
            if (px < minX) minX = px
            if (px > maxX) maxX = px
            if (py < minY) minY = py
            if (py > maxY) maxY = py
        }
        const correction = Math.min(
            (vw * padding) / (maxX - minX),
            (vh * padding) / (maxY - minY),
        )
        scale = Math.min(scale * correction, maxScale)
    }

    return {
        scale: scale * scaleMultiplier,
        x: -scale * scaleMultiplier * center.x,
        y: -scale * scaleMultiplier * center.y + viewOffsetY,
    }
}