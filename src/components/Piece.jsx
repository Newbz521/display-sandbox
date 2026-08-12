import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { BLOCK_GAP, BLOCK_LIFT, CELL, RIPPLE_SPEED, TOP_RADIUS } from '../lib/layout'
import { scatterTransition } from '../lib/pieceTiers'
import { darken, lighten, readableInk } from '../lib/color'

const SIZE = CELL - BLOCK_GAP

/**
 * One extruded block: a top face lifted by the block's own height, plus the two
 * side walls that face the viewer. The other two walls point away and are never
 * drawn.
 *
 * Height comes from the piece's `series`, so neighbouring blocks stand at
 * different heights instead of a uniform slab.
 *
 * Nothing here uses opacity or filter — both force `transform-style: flat` and
 * would collapse the extrusion.
 */
function Block({ block, color, lit, lift, delay, onEnter }) {
  const h = block.h
  const top = lit ? lighten(color, 0.16) : color

  return (
    <motion.div
      className="absolute"
      style={{
        left: block.x + BLOCK_GAP / 2,
        top: block.y + BLOCK_GAP / 2,
        width: SIZE,
        height: SIZE,
        transformStyle: 'preserve-3d',
      }}
      animate={{ z: lift }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
    >
      {/* south wall — the cut edge of the card, so only slightly darker */}
      <div
        className="absolute left-0 top-0"
        onPointerEnter={onEnter}
        style={{
          width: SIZE,
          height: h,
          transformOrigin: '0 0',
          transform: `translateY(${SIZE}px) rotateX(90deg)`,
          background: `linear-gradient(to bottom, ${darken(color, 0.42)}, ${darken(color, 0.22)})`,
          borderBottomLeftRadius: TOP_RADIUS * 0.5,
          borderBottomRightRadius: TOP_RADIUS * 0.5,
          pointerEvents: 'auto',
        }}
      />
      {/* east wall */}
      <div
        className="absolute left-0 top-0"
        onPointerEnter={onEnter}
        style={{
          width: h,
          height: SIZE,
          transformOrigin: '0 0',
          transform: `translateX(${SIZE}px) rotateY(-90deg)`,
          background: `linear-gradient(to right, ${darken(color, 0.34)}, ${darken(color, 0.1)})`,
          borderTopRightRadius: TOP_RADIUS * 0.5,
          borderBottomRightRadius: TOP_RADIUS * 0.5,
          pointerEvents: 'auto',
        }}
      />
      {/* top face — matte, barely graded. Paper, not plastic. */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          transform: `translateZ(${h}px)`,
          borderRadius: TOP_RADIUS,
          background: `linear-gradient(155deg, ${lighten(top, 0.06)} 0%, ${top} 60%, ${darken(top, 0.04)} 100%)`,
        }}
      >
        <span
          style={{
            fontSize: SIZE * 0.44,
            fontWeight: 600,
            lineHeight: 1,
            color: readableInk(color),
          }}
        >
          {block.char}
        </span>
      </div>

      {/*
        Hover target. The visible blocks are inset by BLOCK_GAP, so using them as
        the hit area leaves a seam between every pair of neighbours — dragging
        the cursor across a piece would fire leave/enter and make the hover
        flicker. This covers the block's whole cell, plus a unit of overlap, so
        the piece presents one continuous surface. Pieces are spread far enough
        apart that these never touch across a boundary.
      */}
      <div
        onPointerEnter={onEnter}
        className="absolute"
        style={{
          left: -BLOCK_GAP / 2 - 1,
          top: -BLOCK_GAP / 2 - 1,
          width: CELL + 2,
          height: CELL + 2,
          transform: `translateZ(${h + 0.5}px)`,
          pointerEvents: 'auto',
        }}
      />
    </motion.div>
  )
}

/**
 * A block's cast shadow. It is a sibling of the blocks rather than a child, so
 * that a rising block leaves it behind: the shadow stays put on the board and
 * only spreads and fades, the way a real one does as its object lifts away.
 * Taller bars throw it a little further — a cheap height cue.
 */
function Shadow({ block, lifted, delay }) {
  const reach = block.h * 0.22

  return (
    <motion.div
      className="absolute"
      style={{
        left: block.x + BLOCK_GAP / 2 + reach * 0.72,
        top: block.y + BLOCK_GAP / 2 + reach,
        width: SIZE,
        height: SIZE,
        borderRadius: TOP_RADIUS,
        // Navy-tinted rather than black: on warm paper a neutral shadow reads
        // as dirt, a cool one reads as light.
        background: 'rgba(29, 41, 81, 0.20)',
        // Safe to blur: this is a leaf, so flattening it costs nothing.
        filter: 'blur(9px)',
        z: 0.5,
      }}
      // Scaling about its own centre keeps the shadow stationary while it grows,
      // and scaling the blur along with it does the softening for free.
      animate={{ scale: lifted ? 1.3 : 1, opacity: lifted ? 0.55 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
    />
  )
}

/**
 * A piece: its blocks move as one, float on their own loop, and lift toward the
 * viewer on hover. On selection every other piece is flung clear of the frame.
 */
function Piece({
  piece,
  phase,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  reduceMotion,
  allowFloat = true,
}) {
  const idle = phase === 'board'
  const floating = phase === 'board' && allowFloat
  const scattered =
    (phase === 'zooming' || phase === 'detail' || phase === 'exiting') && !isSelected
  const returning = phase === 'returning'
  const settling = phase === 'board' && !allowFloat
  const inMotion = scattered || returning || settling
  const lit = isHovered || isSelected

  // Which block the cursor came in on. It anchors the ripple, and is held until
  // the pointer leaves the piece so that crossing between blocks does not
  // re-trigger it — and so the blocks settle back in the order they rose.
  const [originIndex, setOriginIndex] = useState(0)
  const enterBlock = (i) => {
    if (!isHovered) setOriginIndex(i)
  }

  const origin = piece.blocks[originIndex] ?? piece.blocks[0]
  const rippleFor = (block) => {
    const d = Math.hypot(block.x - origin.x, block.y - origin.y)
    return { lift: isHovered && idle ? BLOCK_LIFT : 0, delay: d / RIPPLE_SPEED }
  }

  // Scattered pieces leave the frame entirely rather than fading — animating
  // opacity would flatten their 3D and visibly collapse the thickness.
  const away = {
    x: scattered ? piece.dir.x * 1100 : 0,
    y: scattered ? piece.dir.y * 1100 : 0,
    z: scattered ? 260 : 0,
    scale: scattered ? 0.75 : 1,
  }

  return (
    <motion.div
      role="button"
      tabIndex={idle ? 0 : -1}
      aria-label={`${piece.label} — ${piece.kicker}`}
      onClick={() => idle && onSelect(piece.id)}
      onPointerEnter={() => idle && onHover(piece.id)}
      onPointerLeave={() => idle && onHover(null)}
      onFocus={() => idle && onHover(piece.id)}
      onBlur={() => idle && onHover(null)}
      onKeyDown={(e) => {
        if (idle && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect(piece.id)
        }
      }}
      className="absolute outline-none"
      style={{
        left: piece.x,
        top: piece.y,
        width: piece.width,
        height: piece.height,
        transformStyle: 'preserve-3d',
        // Only the block faces are clickable, so the gaps between blocks — and
        // the notches in a piece's bounding box — stay inert.
        pointerEvents: 'none',
        cursor: idle ? 'pointer' : 'default',
      }}
      animate={away}
      transition={
        inMotion
          ? scatterTransition(returning, piece.dist, reduceMotion)
          : { type: 'spring', stiffness: 120, damping: 22 }
      }
    >
      {/* the float, kept on its own layer so it never fights the scatter */}
      <motion.div
        className="h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={floating && !reduceMotion ? { z: [0, 16, 0, -10, 0] } : { z: 0 }}
        transition={
          floating && !reduceMotion
            ? {
                duration: 9 + (piece.index % 5) * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                // Pause float briefly after pieces settle so nothing snaps on return.
                delay: 0.38 + piece.index * 0.14,
              }
            : { type: 'spring', stiffness: 70, damping: 26 }
        }
      >
        {/* Blurred shadows are expensive during bulk scatter/return — skip until settled. */}
        {!inMotion &&
          piece.blocks.map((block, i) => {
            const { lift, delay } = rippleFor(block)
            return <Shadow key={`s${i}`} block={block} lifted={lift > 0} delay={delay} />
          })}
        {piece.blocks.map((block, i) => {
          const { lift, delay } = rippleFor(block)
          return (
            <Block
              key={i}
              block={block}
              color={piece.color}
              lit={lit}
              lift={lift}
              delay={delay}
              onEnter={() => enterBlock(i)}
            />
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default memo(Piece)
