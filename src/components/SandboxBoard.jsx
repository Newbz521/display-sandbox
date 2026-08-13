import { useEffect, useRef } from 'react'
import { BLOCK_GAP, CELL, TOP_RADIUS } from '../lib/layout'
import { darken, lighten } from '../lib/color'
import { EMPTY_PAD_H } from '../lib/sandbox'
import Piece from './Piece'
import DraftingGrid from './DraftingGrid'

const SIZE = CELL - BLOCK_GAP
const PAD_COLOR = '#d4c8b4'

function EmptyPad({ pad, active, onPaintStart, onPaintEnter }) {
  const h = EMPTY_PAD_H
  const handlers = {
    onPointerDown: (e) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      onPaintStart?.(pad.row, pad.col)
    },
    onPointerEnter: (e) => {
      if (e.buttons !== 1) return
      e.stopPropagation()
      onPaintEnter?.(pad.row, pad.col)
    },
  }

  return (
    <div
      className="absolute"
      style={{
        left: pad.x + BLOCK_GAP / 2,
        top: pad.y + BLOCK_GAP / 2,
        width: SIZE,
        height: SIZE,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
      }}
    >
      <div
        className="absolute left-0 top-0"
        {...handlers}
        style={{
          width: SIZE,
          height: h,
          transformOrigin: '0 0',
          transform: `translateY(${SIZE}px) rotateX(90deg)`,
          background: `linear-gradient(to bottom, ${darken(PAD_COLOR, 0.28)}, ${darken(PAD_COLOR, 0.12)})`,
          borderBottomLeftRadius: TOP_RADIUS * 0.5,
          borderBottomRightRadius: TOP_RADIUS * 0.5,
          pointerEvents: 'auto',
          cursor: 'crosshair',
        }}
      />
      <div
        className="absolute left-0 top-0"
        {...handlers}
        style={{
          width: h,
          height: SIZE,
          transformOrigin: '0 0',
          transform: `translateX(${SIZE}px) rotateY(-90deg)`,
          background: `linear-gradient(to right, ${darken(PAD_COLOR, 0.22)}, ${darken(PAD_COLOR, 0.06)})`,
          borderTopRightRadius: TOP_RADIUS * 0.5,
          borderBottomRightRadius: TOP_RADIUS * 0.5,
          pointerEvents: 'auto',
          cursor: 'crosshair',
        }}
      />
      <div
        className="absolute inset-0"
        {...handlers}
        style={{
          transform: `translateZ(${h}px)`,
          borderRadius: TOP_RADIUS,
          background: active
            ? `linear-gradient(155deg, ${lighten(PAD_COLOR, 0.12)} 0%, ${PAD_COLOR} 100%)`
            : `linear-gradient(155deg, ${lighten(PAD_COLOR, 0.06)} 0%, ${PAD_COLOR} 70%, ${darken(PAD_COLOR, 0.04)} 100%)`,
          boxShadow: active ? `inset 0 0 0 2px ${darken(PAD_COLOR, 0.35)}` : undefined,
          pointerEvents: 'auto',
          cursor: 'crosshair',
        }}
      />
    </div>
  )
}

/**
 * Separate play board: empty pads + extruded pieces built from sandbox state.
 * Hold and drag to paint with the active tool.
 */
export default function SandboxBoard({
  scene,
  phase,
  tool,
  hoveredId,
  focusedCell = null,
  onHover,
  onPaintCell,
  reduceMotion,
  viewOnly = false,
}) {
  const painting = useRef(false)
  const lastKey = useRef('')

  useEffect(() => {
    const end = () => {
      painting.current = false
      lastKey.current = ''
    }
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [])

  const paint = (row, col, { start = false } = {}) => {
    if (viewOnly || phase !== 'board') return
    const key = `${row},${col}`
    if (start) {
      painting.current = true
      lastKey.current = key
      onPaintCell?.(row, col)
      return
    }
    if (!painting.current) return
    if (lastKey.current === key) return
    lastKey.current = key
    onPaintCell?.(row, col)
  }

  const focusRing =
    focusedCell && scene.board
      ? {
          left: scene.board.x + focusedCell.col * CELL,
          top: scene.board.y + focusedCell.row * CELL,
        }
      : null

  return (
    <>
      <DraftingGrid layout={scene} />

      <div
        className="absolute"
        style={{
          left: scene.board.x,
          top: scene.board.y,
          width: scene.board.width,
          height: scene.board.height,
          transform: 'translateZ(0px)',
          background: 'rgba(230, 220, 203, 0.35)',
          pointerEvents: 'none',
        }}
      />

      {!viewOnly &&
        scene.empties.map((pad) => (
          <EmptyPad
            key={`e-${pad.row}-${pad.col}`}
            pad={pad}
            active={tool === 'stamp' || tool === 'ink' || tool === 'type'}
            onPaintStart={(r, c) => paint(r, c, { start: true })}
            onPaintEnter={(r, c) => paint(r, c)}
          />
        ))}

      {scene.pieces.map((piece) => (
        <Piece
          key={piece.id}
          piece={piece}
          phase={phase}
          isSelected={false}
          isHovered={piece.id === hoveredId}
          onSelect={() => {}}
          onHover={onHover}
          allowFloat={phase === 'board'}
          reduceMotion={reduceMotion}
          onCellClick={
            !viewOnly && phase === 'board'
              ? (block, opts = {}) => {
                  if (opts.dragging) paint(block.row, block.col)
                  else paint(block.row, block.col, { start: true })
                }
              : null
          }
        />
      ))}

      {focusRing ? (
        <div
          className="pointer-events-none absolute"
          style={{
            left: focusRing.left + BLOCK_GAP / 2,
            top: focusRing.top + BLOCK_GAP / 2,
            width: SIZE,
            height: SIZE,
            transform: 'translateZ(96px)',
            borderRadius: TOP_RADIUS,
            boxShadow: 'inset 0 0 0 3px rgba(232, 120, 92, 0.9)',
          }}
        />
      ) : null}
    </>
  )
}
