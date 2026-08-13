import { motion } from 'framer-motion'
import { SANDBOX_PALETTE } from '../lib/sandbox'

const toolBtn =
  'cursor-pointer rounded-md border border-ink/15 bg-card px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40'
const toolBtnActive =
  'cursor-pointer rounded-md border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors'

const PLAY_INK = '#e8785c'

const HINTS = {
  stamp: 'Drag to paint. Click a piece to zoom. Type to label · arrows move · Esc zooms out.',
  raise: 'Click or drag to raise blocks. Or select a block and press +.',
  lower: 'Click or drag to lower blocks. Or select a block and press −.',
  erase: 'Click or drag to clear blocks. ⌫ also erases the selected block.',
}

/**
 * In-play drafting tray (screen-space). Entry into sandbox is the 3D Play block on the board.
 * viewOnly: shared /play/{id} — Done only, no tools.
 */
export default function SandboxTray({
  tool,
  color,
  onExit,
  onTool,
  onColor,
  onNewPiece,
  onScatter,
  onReset,
  onShare,
  shareBusy = false,
  shareMessage = '',
  shareError = '',
  scatterBusy = false,
  viewOnly = false,
}) {
  if (viewOnly) {
    return (
      <motion.div
        className="pointer-events-auto absolute bottom-0 left-0 z-20 mb-6 ml-6 max-w-[min(92vw,22rem)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl border border-ink/12 bg-card/92 px-3.5 py-3 shadow-[0_16px_40px_rgba(29,41,81,0.12)] backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink/40">Shared sandbox</div>
          <p className="mt-1 text-xs leading-snug text-ink/55">
            View only — this board expires an hour after it was shared.
          </p>
          <div className="mt-3 flex">
            <button
              type="button"
              className={`${toolBtn} ml-auto`}
              onClick={onExit}
              style={{ borderColor: `${PLAY_INK}44` }}
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="pointer-events-auto absolute bottom-0 left-0 z-20 mb-6 ml-6 hidden max-w-[min(92vw,22rem)] sm:block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="rounded-2xl border border-ink/12 bg-card/92 px-3.5 py-3 shadow-[0_16px_40px_rgba(29,41,81,0.12)] backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-[0.2em] text-ink/40">Sandbox</div>
        <p className="mt-1 text-xs leading-snug text-ink/55">{HINTS[tool] ?? HINTS.stamp}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SANDBOX_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Ink ${c}`}
              onClick={() => {
                onColor(c)
                onTool('stamp')
              }}
              className="h-7 w-7 cursor-pointer rounded-md border transition-transform hover:scale-105"
              style={{
                background: c,
                borderColor: color === c ? 'rgba(29,41,81,0.55)' : 'rgba(29,41,81,0.12)',
                boxShadow: color === c ? `0 0 0 2px ${c}66` : undefined,
              }}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            { id: 'stamp', label: 'Paint' },
            { id: 'raise', label: 'Raise' },
            { id: 'lower', label: 'Lower' },
            { id: 'erase', label: 'Erase' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTool(t.id)}
              className={tool === t.id ? toolBtnActive : toolBtn}
              style={
                tool === t.id
                  ? {
                      color: PLAY_INK,
                      borderColor: `${PLAY_INK}66`,
                      background: `${PLAY_INK}14`,
                    }
                  : undefined
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <button type="button" className={toolBtn} onClick={onNewPiece}>
            New piece
          </button>
          <button type="button" className={toolBtn} onClick={onScatter} disabled={scatterBusy}>
            {scatterBusy ? 'Scatter…' : 'Scatter'}
          </button>
          <button type="button" className={toolBtn} onClick={onReset}>
            Reset
          </button>
          <button
            type="button"
            className={toolBtn}
            onClick={onShare}
            disabled={shareBusy || scatterBusy}
            style={{ borderColor: `${PLAY_INK}44`, color: PLAY_INK }}
          >
            {shareBusy ? 'Saving…' : 'Save & share'}
          </button>
          <button
            type="button"
            className={`${toolBtn} ml-auto`}
            onClick={onExit}
            style={{ borderColor: `${PLAY_INK}44` }}
          >
            Done
          </button>
        </div>

        {(shareMessage || shareError) && (
          <p
            className={`mt-2 text-[11px] leading-snug ${shareError ? 'text-[#b4553c]' : 'text-ink/50'}`}
            role={shareError ? 'alert' : 'status'}
          >
            {shareError || shareMessage}
          </p>
        )}
      </div>
    </motion.div>
  )
}
