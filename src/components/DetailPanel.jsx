import { motion } from 'framer-motion'
import BackButton from './detail/BackButton'
import { PieceContent, rise } from './detail/Content'

export default function DetailPanel({
  piece,
  onBack,
  exiting = false,
  openSlug = null,
  onOpenSlug,
}) {
  return (
    <motion.div
      className={`detail-scroll absolute inset-0 z-30 overflow-y-auto overscroll-contain${exiting ? ' pointer-events-none' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: exiting ? 0.22 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none fixed inset-0 bg-linear-to-b from-paper/87 via-paper/93 to-paper/98" />

      <div className="relative mx-auto min-h-full w-full max-w-4xl px-6 sm:px-10">
        <div className="sticky top-0 z-40 -mx-6 border-b border-ink/8 bg-paper/88 px-6 py-4 backdrop-blur-sm sm:-mx-10 sm:px-10">
          <BackButton color={piece.color} onBack={onBack} />
        </div>

        <div className="py-12 sm:py-14">
          <motion.div variants={rise} initial="hidden" animate="show">
            <div
              className="text-sm uppercase tracking-[0.28em] sm:text-xs"
              style={{ color: piece.color }}
            >
              {piece.kicker}
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-7xl">
              {piece.label}
            </h1>
            <div
              className="mt-8 mb-12 h-px w-full"
              style={{ background: `linear-gradient(90deg, ${piece.color}88, transparent)` }}
            />
          </motion.div>

          <PieceContent piece={piece} openSlug={openSlug} onOpenSlug={onOpenSlug} />

          <div className="h-16" />
        </div>
      </div>
    </motion.div>
  )
}
