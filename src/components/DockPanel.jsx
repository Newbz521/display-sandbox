import { motion } from 'framer-motion'
import BackButton from './detail/BackButton'

function DockLink({ item, color }) {
  const linked = Boolean(item.link) && item.link !== '#'
  const Wrapper = linked ? 'a' : 'div'
  const linkProps = linked
    ? {
        href: item.link,
        ...(/^https?:/i.test(item.link) ? { target: '_blank', rel: 'noreferrer' } : {}),
      }
    : {}

  const title = item.name ?? item.title
  const meta = item.date ?? item.tags?.[0]

  return (
    <Wrapper
      {...linkProps}
      className={`group flex min-w-55 max-w-70 shrink-0 flex-col rounded-xl border border-ink/12 bg-paper/80 px-4 py-3.5 transition-colors${
        linked ? ' hover:border-ink/25 hover:bg-card' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-xs" style={{ background: color }} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-base text-ink sm:text-sm">{title}</div>
          {meta ? (
            <div className="mt-0.5 truncate text-xs uppercase tracking-wider text-ink/45 sm:text-[11px]">
              {meta}
            </div>
          ) : null}
        </div>
        {linked ? (
          <span className="shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-ink/60">
            →
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60 sm:text-xs">{item.blurb}</p>
    </Wrapper>
  )
}

export default function DockPanel({ piece, onBack, exiting = false }) {
  const items = piece.content.items ?? []

  return (
    <motion.div
      className={`absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6${exiting ? ' pointer-events-none' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: exiting ? 0.2 : 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 bg-ink/8"
        onClick={onBack}
      />

      <motion.div
        className="relative mx-auto max-w-6xl rounded-2xl border border-ink/12 bg-card/94 p-4 shadow-[0_16px_48px_rgba(29,41,81,0.12)] backdrop-blur-md sm:p-5"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? 24 : 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.26 } }}
        transition={{ type: 'spring', stiffness: 250, damping: 30 }}
      >
        <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-ink/8 pb-4">
          <BackButton color={piece.color} onBack={onBack} compact />
          <div className="ml-auto text-right">
            <div className="text-xs uppercase tracking-[0.22em] sm:text-[11px]" style={{ color: piece.color }}>
              {piece.kicker}
            </div>
            <div className="text-lg font-medium text-ink">{piece.label}</div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map((item) => (
            <DockLink key={item.name ?? item.title} item={item} color={piece.color} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
