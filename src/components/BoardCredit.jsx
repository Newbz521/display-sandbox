import { motion, useReducedMotion } from 'framer-motion'
import { CREDIT_Z } from '../lib/layout'
import { OWNER } from '../data/portfolio'

const ease = [0.16, 1, 0.3, 1]

export default function BoardCredit({ visible, layout, compact = false, owner = OWNER }) {
  const reduceMotion = useReducedMotion()
  const { x, y } = layout.credit

  return (
    <motion.div
      className="board-credit pointer-events-none absolute w-max max-w-[min(92vw,22rem)] select-none text-center sm:max-w-lg"
      style={{
        left: x,
        top: y,
        // Framer owns the transform — keep centering + board-plane lift here
        // so opacity/y animation does not wipe translateX / translateZ.
        x: '-50%',
        z: CREDIT_Z,
        transformStyle: 'preserve-3d',
      }}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : reduceMotion ? 0 : 14,
      }}
      transition={
        reduceMotion
          ? { duration: 0.15 }
          : {
              duration: visible ? 0.72 : 0.32,
              ease,
              delay: visible ? 0.06 : 0,
            }
      }
      aria-hidden
    >
      <div
        className={
          compact
            ? 'rounded-sm border border-ink/12 bg-card/95 px-5 py-4 shadow-[0_8px_28px_rgba(29,41,81,0.10)]'
            : undefined
        }
      >
        <div className="text-base font-semibold uppercase tracking-[0.2em] text-ink/70 sm:text-sm sm:tracking-[0.26em] sm:text-ink/65">
          Drawn by
        </div>
        <div className="mt-2 text-4xl font-bold tracking-tight text-ink sm:mt-2 sm:text-4xl">
          {owner.name}
        </div>
        <div className="mt-1.5 text-xl font-semibold text-ink/82 sm:mt-1.5 sm:text-xl">
          {owner.role}
        </div>
        {!compact ? (
          <div className="mt-3 text-lg leading-relaxed text-ink/68">{owner.tagline}</div>
        ) : null}
      </div>
    </motion.div>
  )
}
