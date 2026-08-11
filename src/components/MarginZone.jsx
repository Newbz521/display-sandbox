import { memo } from 'react'
import { motion } from 'framer-motion'
import { MARGIN_Z } from '../lib/layout'
import { scatterTransition } from '../lib/pieceTiers'

function MarginZone({ zone, phase, isSelected, isHovered, onSelect, onHover }) {
  const idle = phase === 'board'
  const scattered =
    (phase === 'zooming' || phase === 'detail' || phase === 'exiting') && !isSelected
  const returning = phase === 'returning'
  const inMotion = scattered || returning
  const lit = isHovered || isSelected

  return (
    <motion.button
      type="button"
      aria-label={`${zone.label} — ${zone.kicker}`}
      onClick={() => idle && onSelect(zone.id)}
      onPointerEnter={() => idle && onHover(zone.id)}
      onPointerLeave={() => idle && onHover(null)}
      onFocus={() => idle && onHover(zone.id)}
      onBlur={() => idle && onHover(null)}
      className="absolute text-left outline-none"
      style={{
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        transformStyle: 'preserve-3d',
        cursor: idle ? 'pointer' : 'default',
        isolation: 'isolate',
      }}
      animate={{
        z: MARGIN_Z,
        opacity: scattered ? 0 : 1,
        scale: inMotion ? 1 : isSelected ? 1.02 : lit && idle ? 1.01 : 1,
        y: inMotion ? 0 : lit && idle ? -4 : 0,
      }}
      transition={
        inMotion
          ? {
              ...scatterTransition(returning, zone.y, false),
              opacity: { duration: returning ? 0.35 : 0.28, ease: 'easeOut' },
            }
          : { type: 'spring', stiffness: 140, damping: 24 }
      }
    >
      <div
        className="margin-sheet absolute inset-0 rounded-sm border transition-colors duration-300"
        style={{
          borderColor: lit ? `${zone.color}88` : 'rgba(29, 41, 81, 0.16)',
          background: lit ? 'rgba(251, 249, 245, 0.98)' : 'rgba(251, 249, 245, 0.94)',
          boxShadow: lit
            ? `0 10px 28px ${zone.color}22, inset 0 0 0 1px ${zone.color}18`
            : '0 2px 10px rgba(29, 41, 81, 0.06)',
        }}
      >
        {/* masking tape — warm, slightly translucent, with a soft edge */}
        <span
          className="absolute -left-2 -top-2 h-5 w-9 -rotate-[26deg] rounded-[2px] border border-amber-900/10 shadow-[0_1px_3px_rgba(29,41,81,0.12)]"
          style={{
            background:
              'linear-gradient(160deg, rgba(235, 214, 168, 0.92) 0%, rgba(214, 186, 132, 0.88) 100%)',
          }}
        />
        <span
          className="absolute -right-2 -top-2 h-5 w-9 rotate-[22deg] rounded-[2px] border border-amber-900/10 shadow-[0_1px_3px_rgba(29,41,81,0.12)]"
          style={{
            background:
              'linear-gradient(160deg, rgba(235, 214, 168, 0.92) 0%, rgba(214, 186, 132, 0.88) 100%)',
          }}
        />
        <span
          className="absolute -bottom-2 -left-2 h-4 w-7 rotate-[18deg] rounded-[2px] border border-amber-900/8 shadow-[0_1px_2px_rgba(29,41,81,0.1)]"
          style={{
            background:
              'linear-gradient(160deg, rgba(235, 214, 168, 0.88) 0%, rgba(214, 186, 132, 0.84) 100%)',
          }}
        />

        <div className="flex h-full flex-col p-4 sm:p-5">
          <div
            className="text-base font-semibold uppercase tracking-[0.16em] sm:text-lg"
            style={{ color: zone.color }}
          >
            {zone.glyph}
          </div>
          <div className="mt-auto">
            <div className="text-xl font-semibold leading-tight text-ink/90 sm:text-2xl">
              {zone.label}
            </div>
            <div className="mt-2 text-lg leading-snug text-ink/55 sm:text-xl">{zone.kicker}</div>
          </div>
        </div>

        {/* ruled frame ticks */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <line x1="8" y1="0" x2="8" y2="6" stroke="rgba(29,41,81,0.12)" strokeWidth="0.75" />
          <line x1="0" y1="8" x2="6" y2="8" stroke="rgba(29,41,81,0.12)" strokeWidth="0.75" />
        </svg>
      </div>
    </motion.button>
  )
}

export default memo(MarginZone)
