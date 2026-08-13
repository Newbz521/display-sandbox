import { motion } from 'framer-motion'
import BackButton from './detail/BackButton'
import EditButton from './detail/EditButton'
import { PieceContent } from './detail/Content'

export default function CompactPanel({
  piece,
  onBack,
  exiting = false,
  canEdit = false,
  onEdit,
}) {
  return (
    <motion.div
      className={`absolute inset-0 z-30 flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-8${exiting ? ' pointer-events-none' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: exiting ? 0.2 : 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 z-0 bg-ink/12 backdrop-blur-[2px]"
        onClick={onBack}
      />

      <motion.div
        className="detail-scroll relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-ink/12 bg-card shadow-[0_24px_60px_rgba(29,41,81,0.14)]"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? 20 : 0, scale: exiting ? 0.98 : 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.28 } }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      >
        <div className="flex items-center gap-3 shrink-0 border-b border-ink/8 px-5 py-4">
          <BackButton color={piece.color} onBack={onBack} compact />
          {canEdit ? <EditButton color={piece.color} onEdit={onEdit} className="ml-auto" /> : null}
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-6">
          <div
            className="text-sm uppercase tracking-[0.24em] sm:text-xs"
            style={{ color: piece.color }}
          >
            {piece.kicker}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {piece.label}
          </h2>
          {piece.content.kind === 'contact' ? (
            <p className="mt-4 text-base leading-relaxed text-ink/65 sm:text-sm">
              {piece.content.lead}
            </p>
          ) : null}
          <div
            className="mt-5 mb-6 h-px w-full"
            style={{ background: `linear-gradient(90deg, ${piece.color}66, transparent)` }}
          />
          <PieceContent piece={piece} compact dense />
        </div>
      </motion.div>
    </motion.div>
  )
}
