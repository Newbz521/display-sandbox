import { useState } from 'react'
import { motion } from 'framer-motion'

export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

/** Mobile-first type scale — larger on phones, tighter on desktop. */
const body = 'text-base leading-relaxed sm:text-sm'
const label = 'text-sm uppercase tracking-[0.2em] text-ink/45 sm:text-xs'
const meta = 'text-sm uppercase tracking-widest text-ink/45 sm:text-xs'

export function Section({ children, i }) {
  return (
    <motion.div variants={rise} initial="hidden" animate="show" custom={i}>
      {children}
    </motion.div>
  )
}

function Intro({ content, color }) {
  return (
    <div className="space-y-8">
      <Section i={0}>
        <p className="text-xl leading-relaxed text-ink/90 sm:text-2xl">{content.lead}</p>
      </Section>
      {content.body.map((p, i) => (
        <Section key={i} i={i + 1}>
          <p className={`max-w-2xl text-ink/70 ${body}`}>{p}</p>
        </Section>
      ))}
      <Section i={content.body.length + 1}>
        <div className="flex flex-wrap gap-10 pt-2">
          {content.stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-semibold tracking-tight sm:text-4xl" style={{ color }}>
                {s.value}
              </div>
              <div className={`mt-1 ${label}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {content.education?.length ? (
        <Section i={content.body.length + 2}>
          <div className="border-t border-ink/12 pt-8">
            <div className={label}>Education</div>
            <div className="mt-5 space-y-4">
              {content.education.map((item) => (
                <div key={item.title} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-xs" style={{ background: color }} />
                  <span className="text-base text-ink/90 sm:text-sm">{item.title}</span>
                  <span className="text-base sm:text-sm" style={{ color }}>
                    {item.org}
                  </span>
                  <span className={`ml-auto ${meta}`}>{item.period}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}
    </div>
  )
}

function Timeline({ content, color }) {
  return (
    <div className="space-y-10">
      {content.items.map((item, i) => (
        <Section key={item.title} i={i}>
          <div className="relative border-l border-ink/12 pl-6">
            <span
              className="absolute -left-1.25 top-2 h-2.25 w-2.25 rounded-sm"
              style={{ background: color }}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-xl font-medium text-ink sm:text-lg">{item.title}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base underline-offset-4 hover:underline sm:text-sm"
                  style={{ color }}
                >
                  {item.org} ↗
                </a>
              ) : (
                <span className="text-base sm:text-sm" style={{ color }}>
                  {item.org}
                </span>
              )}
              <span className={`ml-auto ${meta}`}>{item.period}</span>
            </div>
            <ul className="mt-3 space-y-2">
              {item.points.map((p, j) => (
                <li key={j} className={`flex gap-3 text-ink/70 ${body}`}>
                  <span className="mt-2 h-0.75 w-0.75 shrink-0 rounded-full bg-ink/30" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ))}
    </div>
  )
}

function Cards({ content, color, compact = false }) {
  return (
    <div className={`grid gap-4${compact ? '' : ' sm:grid-cols-2'}`}>
      {content.items.map((item, i) => {
        const linked = Boolean(item.link) && item.link !== '#'
        const Wrapper = linked ? 'a' : 'div'
        const linkProps = linked
          ? {
              href: item.link,
              ...(/^https?:/i.test(item.link) ? { target: '_blank', rel: 'noreferrer' } : {}),
            }
          : {}
        return (
          <Section key={item.name ?? item.title} i={i}>
            <Wrapper
              {...linkProps}
              className={`group block h-full rounded-2xl border border-ink/12 bg-card p-5 shadow-[0_2px_14px_rgba(29,41,81,0.06)] transition-colors duration-300${
                linked ? ' hover:border-ink/25 hover:shadow-[0_6px_20px_rgba(29,41,81,0.10)]' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-xs" style={{ background: color }} />
                <h3 className="text-lg font-medium text-ink sm:text-base">
                  {item.name ?? item.title}
                </h3>
                {linked ? (
                  <span className="ml-auto text-ink/35 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink/70">
                    →
                  </span>
                ) : null}
              </div>
              <p className={`mt-3 text-ink/65 ${body}`}>{item.blurb}</p>
              {item.tags ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-ink/12 px-2.5 py-1 text-xs text-ink/55 sm:text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Wrapper>
          </Section>
        )
      })}
    </div>
  )
}

function Groups({ content, color, dense = false }) {
  return (
    <div className={dense ? 'space-y-5' : 'space-y-7'}>
      {content.items.map((g, i) => (
        <Section key={g.group} i={i}>
          <div className={label}>{g.group}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {g.chips.map((c) => (
              <span
                key={c}
                className="rounded-lg border px-3 py-1.5 text-base text-ink/80 sm:text-sm"
                style={{ borderColor: `${color}33`, background: `${color}12` }}
              >
                {c}
              </span>
            ))}
          </div>
        </Section>
      ))}
    </div>
  )
}

function excerpt(text, max = 160) {
  const first = (text ?? '').split(/\n\n+/).filter(Boolean)[0] ?? ''
  if (first.length <= max) return first
  return `${first.slice(0, max).trim()}…`
}

function parsePostDate(dateStr) {
  const [month, day, year] = (dateStr ?? '').split('/').map(Number)
  if (!month || !day || !year) return 0
  return new Date(year, month - 1, day).getTime()
}

function postsNewestFirst(items) {
  return [...items].sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date))
}

function articleParagraphs(item) {
  const raw = item.body ?? item.blurb ?? ''
  return raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function ArticleView({ item, color, onBack }) {
  const paragraphs = articleParagraphs(item)

  return (
    <div className="space-y-8">
      <motion.button
        type="button"
        onClick={onBack}
        className="group inline-flex items-center gap-2.5 text-base text-ink/55 transition-colors hover:text-ink sm:text-sm"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink/20 text-base transition-colors group-hover:border-ink/45 sm:h-8 sm:w-8"
          style={{ color }}
        >
          ←
        </span>
        All posts
      </motion.button>

      <Section i={0}>
        <div className={`${label} tracking-[0.28em]`}>{item.date}</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {item.title}
        </h2>
        <div
          className="mt-8 h-px w-full"
          style={{ background: `linear-gradient(90deg, ${color}88, transparent)` }}
        />
      </Section>

      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <Section key={i} i={i + 1}>
            <p className="max-w-2xl text-[1.0625rem] leading-[1.7] text-ink/80 sm:text-lg sm:leading-relaxed">
              {p}
            </p>
          </Section>
        ))}
      </div>
    </div>
  )
}

function List({ content, color, compact = false }) {
  const [article, setArticle] = useState(null)

  if (article) {
    return <ArticleView item={article} color={color} onBack={() => setArticle(null)} />
  }

  const titleClass =
    'text-xl font-medium text-ink/90 transition-colors group-hover:text-ink sm:text-lg'
  const items = postsNewestFirst(content.items)

  return (
    <div className="divide-y divide-ink/10">
      {items.map((item, i) => {
        const readable = !item.link || item.link === '#'
        const preview = excerpt(item.blurb)

        if (readable) {
          return (
            <Section key={item.title} i={i}>
              <button
                type="button"
                onClick={() => setArticle(item)}
                className="group block w-full py-5 text-left sm:py-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className={titleClass}>{item.title}</h3>
                  <span className={`shrink-0 ${meta}`}>{item.date}</span>
                </div>
                {preview ? <p className={`mt-2 max-w-2xl text-ink/60 ${body}`}>{preview}</p> : null}
                <span
                  className="mt-3 inline-flex items-center gap-1.5 text-sm uppercase tracking-[0.16em] sm:text-xs"
                  style={{ color }}
                >
                  Read post
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </button>
            </Section>
          )
        }

        return (
          <Section key={item.title} i={i}>
            <a href={item.link} target="_blank" rel="noreferrer" className="group block py-5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className={titleClass}>{item.title}</h3>
                <span className={`shrink-0 ${meta}`}>{item.date}</span>
              </div>
              {!compact || preview ? (
                <>
                  <p className={`mt-2 max-w-2xl text-ink/60 ${body}`}>{preview}</p>
                  <span
                    className="mt-3 inline-block text-sm opacity-100 sm:text-xs sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                    style={{ color }}
                  >
                    Read →
                  </span>
                </>
              ) : null}
            </a>
          </Section>
        )
      })}
    </div>
  )
}

function Gallery({ content, color }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {content.items.map((item, i) => (
        <Section key={item.title} i={i}>
          <div className="rounded-2xl border border-ink/12 p-5">
            <div
              className="mb-4 h-24 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${color}33, transparent 70%)`,
                border: `1px solid ${color}22`,
              }}
            />
            <h3 className="text-lg text-ink/90 sm:text-base">{item.title}</h3>
            <p className={`mt-1.5 text-ink/60 ${body}`}>{item.note}</p>
          </div>
        </Section>
      ))}
    </div>
  )
}

function Contact({ content, color, compact = false }) {
  return (
    <div className={compact ? 'space-y-5' : 'space-y-8'}>
      <Section i={0}>
        <p
          className={`max-w-2xl text-ink/85 ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} leading-relaxed`}
        >
          {content.lead}
        </p>
      </Section>
      <div className={`grid gap-3${compact ? '' : ' sm:grid-cols-2'}`}>
        {content.items.map((item, i) => (
          <Section key={item.label} i={i + 1}>
            <a
              href={item.link}
              {...(item.download ? { download: '' } : {})}
              {...(/^https?:/i.test(item.link) ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex items-center gap-4 rounded-xl border border-ink/12 px-5 py-4 transition-colors hover:border-ink/25 hover:bg-card"
            >
              <span className="text-sm uppercase tracking-[0.18em] text-ink/45 sm:text-xs">
                {item.label}
              </span>
              <span className="ml-auto text-base text-ink/85 sm:text-sm" style={{ color }}>
                {item.value}
              </span>
            </a>
          </Section>
        ))}
      </div>
    </div>
  )
}

export const RENDERERS = {
  intro: Intro,
  timeline: Timeline,
  cards: Cards,
  groups: Groups,
  list: List,
  gallery: Gallery,
  contact: Contact,
}

export function PieceContent({ piece, compact = false, dense = false }) {
  const Body = RENDERERS[piece.content.kind]
  if (!Body) return null

  const extra =
    piece.content.kind === 'groups'
      ? { dense }
      : piece.content.kind === 'contact' ||
          piece.content.kind === 'list' ||
          piece.content.kind === 'cards'
        ? { compact }
        : {}

  return <Body content={piece.content} color={piece.color} {...extra} />
}
