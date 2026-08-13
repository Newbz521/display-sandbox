import { motion } from 'framer-motion'

/**
 * Shown when a /play/{id} link is missing or past expireAt.
 */
export default function SandboxExpired({ onHome }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="paper-grid absolute inset-0 opacity-60" />
        <div className="paper-grain absolute inset-0" />
      </div>

      <div className="relative max-w-md rounded-2xl border border-ink/12 bg-card/95 px-8 py-10 text-center shadow-[0_20px_50px_rgba(29,41,81,0.14)] backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-[0.22em] text-ink/40">Sandbox</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">This page has expired</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/55">
          Shared boards only last an hour. Head back to the square and stamp a new one if you like.
        </p>
        <button
          type="button"
          onClick={onHome}
          className="mt-7 cursor-pointer rounded-md border border-ink/20 bg-ink px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-paper transition-opacity hover:opacity-90"
        >
          Back to the square
        </button>
      </div>
    </motion.div>
  )
}
