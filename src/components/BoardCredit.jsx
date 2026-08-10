import { motion } from 'framer-motion'
import { CREDIT_Z } from '../lib/layout'
import { OWNER } from '../data/portfolio'

export default function BoardCredit({ visible, layout, compact = false }) {
  const { x, y } = layout.credit

  return (
    <motion.div
      className="board-credit pointer-events-none absolute w-max max-w-[min(92vw,22rem)] select-none text-center sm:max-w-lg"
      style={{
        left: x,
        top: y,
        transform: `translateX(-50%) translateZ(${CREDIT_Z}px)`,
        transformStyle: 'preserve-3d',
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
          {OWNER.name}
        </div>
        <div className="mt-1.5 text-xl font-semibold text-ink/82 sm:mt-1.5 sm:text-xl">{OWNER.role}</div>
        {!compact ? (
          <div className="mt-3 text-lg leading-relaxed text-ink/68">{OWNER.tagline}</div>
        ) : null}
      </div>
    </motion.div>
  )
}
