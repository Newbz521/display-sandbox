import { motion } from 'framer-motion'
import BackButton from './detail/BackButton'

function Now({ content, color }) {
  return (
    <div className="space-y-5">
      <div
        className="inline-flex rounded-full border px-3 py-1.5 text-sm uppercase tracking-[0.16em] sm:text-xs"
        style={{ borderColor: `${color}44`, color }}
      >
        {content.status}
      </div>
      <div className="space-y-4">
        {content.items.map((item) => (
          <div key={item.label}>
            <div className="text-xs uppercase tracking-[0.18em] text-ink/45 sm:text-[11px]">{item.label}</div>
            <p className="mt-1 text-base leading-relaxed text-ink/75 sm:text-sm">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10 pt-4 text-xs uppercase tracking-widest text-ink/40 sm:text-[11px]">
        Updated {content.updated}
      </div>
    </div>
  )
}

function Notes({ content, color }) {
  return (
    <div className="space-y-4">
      {content.items.map((item) => (
        <div key={item.code} className="flex gap-3">
          <span
            className="mt-0.5 shrink-0 text-sm font-medium tabular-nums sm:text-xs"
            style={{ color }}
          >
            {item.code}
          </span>
          <p className="text-base leading-relaxed text-ink/72 sm:text-sm">{item.text}</p>
        </div>
      ))}
    </div>
  )
}

function Legend({ content }) {
  return (
    <div className="space-y-4">
      {content.items.map((item) => (
        <div key={item.title}>
          <div className="text-base font-medium text-ink/88 sm:text-sm">{item.title}</div>
          <p className="mt-1 text-base leading-relaxed text-ink/60 sm:text-sm">{item.text}</p>
        </div>
      ))}
    </div>
  )
}

function Detail({ content, color }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium text-ink sm:text-lg">{content.title}</h3>
        <a
          href={content.link}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-base underline-offset-4 hover:underline sm:text-sm"
          style={{ color }}
        >
          {content.org} ↗
        </a>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink/45 sm:text-[11px]">Problem</div>
        <p className="mt-2 text-base leading-relaxed text-ink/72 sm:text-sm">{content.problem}</p>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink/45 sm:text-[11px]">Approach</div>
        <ul className="mt-2 space-y-2">
          {content.approach.map((line) => (
            <li key={line} className="flex gap-2 text-base leading-relaxed text-ink/70 sm:text-sm">
              <span className="mt-2 h-0.75 w-0.75 shrink-0 rounded-full" style={{ background: color }} />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ink/45 sm:text-[11px]">Outcomes</div>
        <ul className="mt-2 space-y-2">
          {content.outcomes.map((line) => (
            <li key={line} className="flex gap-2 text-base leading-relaxed text-ink/70 sm:text-sm">
              <span className="mt-2 h-0.75 w-0.75 shrink-0 rounded-full bg-ink/25" />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {content.tags.map((t) => (
          <span key={t} className="rounded-full border border-ink/12 px-2.5 py-1 text-xs text-ink/55 sm:text-[11px]">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Colophon({ content, color }) {
  return (
    <div className="space-y-5 font-mono text-base sm:text-sm">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-ink/70">
        <span className="text-ink/40">PROJECT</span>
        <span>{content.project}</span>
        <span className="text-ink/40">SHEET</span>
        <span>{content.sheet}</span>
        <span className="text-ink/40">SCALE</span>
        <span>{content.scale}</span>
        <span className="text-ink/40">DRAWN</span>
        <span>{content.drawn}</span>
      </div>
      <div className="border-t border-ink/10 pt-4">
        <div className="text-xs uppercase tracking-[0.18em] text-ink/45 sm:text-[11px]">Stack</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {content.stack.map((t) => (
            <span
              key={t}
              className="rounded border px-2 py-1 text-sm sm:text-xs"
              style={{ borderColor: `${color}33`, color }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="text-sm leading-relaxed text-ink/55 sm:text-xs">
        {content.credit}
        <br />
        <a
          href={content.repo}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block underline-offset-4 hover:underline"
          style={{ color }}
        >
          GitHub ↗
        </a>
      </div>
    </div>
  )
}

const RENDERERS = {
  now: Now,
  notes: Notes,
  legend: Legend,
  detail: Detail,
  colophon: Colophon,
}

export default function MarginPanel({ zone, onBack, exiting = false }) {
  const Body = RENDERERS[zone.content.kind]

  return (
    <motion.div
      className={`absolute inset-0 z-30 flex items-end justify-center p-4 sm:items-center sm:p-8${exiting ? ' pointer-events-none' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: exiting ? 0.2 : 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/10 backdrop-blur-[2px]"
        onClick={onBack}
      />

      <motion.div
        className="detail-scroll relative flex max-h-[min(88vh,760px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-ink/12 bg-card shadow-[0_24px_60px_rgba(29,41,81,0.14)]"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? 20 : 0, scale: exiting ? 0.98 : 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.28 } }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      >
        <div className="shrink-0 border-b border-ink/8 px-5 py-4">
          <BackButton color={zone.color} onBack={onBack} compact />
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-6">
          <div className="text-sm uppercase tracking-[0.24em] sm:text-xs" style={{ color: zone.color }}>
            {zone.kicker}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{zone.label}</h2>
          <div
            className="mt-5 mb-6 h-px w-full"
            style={{ background: `linear-gradient(90deg, ${zone.color}66, transparent)` }}
          />
          {Body ? <Body content={zone.content} color={zone.color} /> : null}
        </div>
      </motion.div>
    </motion.div>
  )
}
