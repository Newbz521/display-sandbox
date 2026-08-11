import { motion } from 'framer-motion'

export default function BackButton({ color, onBack, compact = false }) {
  return (
    <motion.button
      onClick={onBack}
      className={`group inline-flex cursor-pointer items-center gap-2.5 text-base text-ink/55 transition-colors hover:text-ink sm:text-sm${compact ? '' : ''}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12 }}
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-lg border border-ink/20 transition-colors group-hover:border-ink/45"
        style={{ color }}
      >
        ←
      </span>
      Back to the square
      <kbd className="ml-1 hidden rounded border border-ink/12 px-1.5 py-0.5 text-[10px] text-ink/45 sm:inline">
        esc
      </kbd>
    </motion.button>
  )
}
