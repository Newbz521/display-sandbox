import { useState } from 'react'
import { savePage, saveSite } from '../../lib/contentStore'

const field =
  'mt-2 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-base text-ink outline-none focus:border-ink/40 sm:text-sm'
const labelCls = 'text-xs uppercase tracking-[0.16em] text-ink/45'
const ghostBtn =
  'cursor-pointer text-xs uppercase tracking-[0.14em] text-ink/40 hover:text-ink/70'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  )
}

function splitLines(text) {
  return String(text ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function splitList(text) {
  return String(text ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function Remove({ onClick, label = 'Remove' }) {
  return (
    <button type="button" onClick={onClick} className={`${ghostBtn} hover:text-[#b4553c]`}>
      {label}
    </button>
  )
}

function IntroFields({ content, onChange }) {
  const set = (patch) => onChange({ ...content, ...patch })

  return (
    <div className="space-y-5">
      <Field label="Lead">
        <textarea
          className={field}
          rows={3}
          value={content.lead ?? ''}
          onChange={(e) => set({ lead: e.target.value })}
        />
      </Field>
      {(content.body ?? []).map((p, i) => (
        <div key={i} className="space-y-2">
          <Field label={`Paragraph ${i + 1}`}>
            <textarea
              className={field}
              rows={5}
              value={p}
              onChange={(e) => {
                const body = [...content.body]
                body[i] = e.target.value
                set({ body })
              }}
            />
          </Field>
          <Remove
            onClick={() => set({ body: content.body.filter((_, j) => j !== i) })}
            label="Remove paragraph"
          />
        </div>
      ))}
      <button
        type="button"
        className={ghostBtn}
        onClick={() => set({ body: [...(content.body ?? []), ''] })}
      >
        Add paragraph
      </button>
      <div className="space-y-3">
        <div className={labelCls}>Stats</div>
        {(content.stats ?? []).map((s, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[8rem_1fr_auto]">
            <input
              className={field}
              value={s.value ?? ''}
              placeholder="2022"
              onChange={(e) => {
                const stats = [...content.stats]
                stats[i] = { ...s, value: e.target.value }
                set({ stats })
              }}
            />
            <input
              className={field}
              value={s.label ?? ''}
              placeholder="Moved into software"
              onChange={(e) => {
                const stats = [...content.stats]
                stats[i] = { ...s, label: e.target.value }
                set({ stats })
              }}
            />
            <Remove onClick={() => set({ stats: content.stats.filter((_, j) => j !== i) })} />
          </div>
        ))}
        <button
          type="button"
          className={ghostBtn}
          onClick={() => set({ stats: [...(content.stats ?? []), { value: '', label: '' }] })}
        >
          Add stat
        </button>
      </div>
      <div className="space-y-3">
        <div className={labelCls}>Education</div>
        {(content.education ?? []).map((ed, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-ink/10 p-3">
            <input
              className={field}
              value={ed.title ?? ''}
              placeholder="Degree"
              onChange={(e) => {
                const education = [...content.education]
                education[i] = { ...ed, title: e.target.value }
                set({ education })
              }}
            />
            <input
              className={field}
              value={ed.org ?? ''}
              placeholder="School"
              onChange={(e) => {
                const education = [...content.education]
                education[i] = { ...ed, org: e.target.value }
                set({ education })
              }}
            />
            <input
              className={field}
              value={ed.period ?? ''}
              placeholder="Year"
              onChange={(e) => {
                const education = [...content.education]
                education[i] = { ...ed, period: e.target.value }
                set({ education })
              }}
            />
            <Remove
              onClick={() => set({ education: content.education.filter((_, j) => j !== i) })}
            />
          </div>
        ))}
        <button
          type="button"
          className={ghostBtn}
          onClick={() =>
            set({ education: [...(content.education ?? []), { title: '', org: '', period: '' }] })
          }
        >
          Add education
        </button>
      </div>
    </div>
  )
}

function TimelineFields({ content, onChange }) {
  const items = content.items ?? []
  const setItems = (next) => onChange({ ...content, items: next })

  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-ink/10 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className={field}
              value={item.title ?? ''}
              placeholder="Title"
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, title: e.target.value }
                setItems(next)
              }}
            />
            <input
              className={field}
              value={item.org ?? ''}
              placeholder="Org"
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, org: e.target.value }
                setItems(next)
              }}
            />
            <input
              className={field}
              value={item.period ?? ''}
              placeholder="Period"
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, period: e.target.value }
                setItems(next)
              }}
            />
            <input
              className={field}
              value={item.link ?? ''}
              placeholder="Link (optional)"
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, link: e.target.value }
                setItems(next)
              }}
            />
          </div>
          <textarea
            className={field}
            rows={6}
            value={(item.points ?? []).join('\n')}
            placeholder="One point per line"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, points: splitLines(e.target.value) }
              setItems(next)
            }}
          />
          <Remove onClick={() => setItems(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button
        type="button"
        className={ghostBtn}
        onClick={() =>
          setItems([...items, { title: '', org: '', period: '', link: '', points: [] }])
        }
      >
        Add role
      </button>
    </div>
  )
}

function CardsFields({ content, onChange }) {
  const items = content.items ?? []
  const setItems = (next) => onChange({ ...content, items: next })

  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-ink/10 p-3">
          <input
            className={field}
            value={item.name ?? item.title ?? ''}
            placeholder="Name"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, name: e.target.value }
              setItems(next)
            }}
          />
          <textarea
            className={field}
            rows={3}
            value={item.blurb ?? ''}
            placeholder="Blurb"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, blurb: e.target.value }
              setItems(next)
            }}
          />
          <input
            className={field}
            value={(item.tags ?? []).join(', ')}
            placeholder="Tags, comma separated"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, tags: splitList(e.target.value) }
              setItems(next)
            }}
          />
          <input
            className={field}
            value={item.link ?? ''}
            placeholder="Link (optional)"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, link: e.target.value }
              setItems(next)
            }}
          />
          <Remove onClick={() => setItems(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button
        type="button"
        className={ghostBtn}
        onClick={() => setItems([...items, { name: '', blurb: '', tags: [], link: '' }])}
      >
        Add card
      </button>
    </div>
  )
}

function GroupsFields({ content, onChange }) {
  const items = content.items ?? []
  const setItems = (next) => onChange({ ...content, items: next })

  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-ink/10 p-3">
          <input
            className={field}
            value={item.group ?? ''}
            placeholder="Group"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, group: e.target.value }
              setItems(next)
            }}
          />
          <textarea
            className={field}
            rows={3}
            value={(item.chips ?? []).join(', ')}
            placeholder="Chips, comma separated"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, chips: splitList(e.target.value) }
              setItems(next)
            }}
          />
          <Remove onClick={() => setItems(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button
        type="button"
        className={ghostBtn}
        onClick={() => setItems([...items, { group: '', chips: [] }])}
      >
        Add group
      </button>
    </div>
  )
}

function ContactFields({ content, onChange }) {
  const items = content.items ?? []
  const set = (patch) => onChange({ ...content, ...patch })

  return (
    <div className="space-y-5">
      <Field label="Lead">
        <textarea
          className={field}
          rows={3}
          value={content.lead ?? ''}
          onChange={(e) => set({ lead: e.target.value })}
        />
      </Field>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-ink/10 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className={field}
              value={item.label ?? ''}
              placeholder="Label"
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, label: e.target.value }
                set({ items: next })
              }}
            />
            <input
              className={field}
              value={item.value ?? ''}
              placeholder="Value"
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, value: e.target.value }
                set({ items: next })
              }}
            />
          </div>
          <input
            className={field}
            value={item.link ?? ''}
            placeholder="Link"
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...item, link: e.target.value }
              set({ items: next })
            }}
          />
          <label className="flex items-center gap-2 text-sm text-ink/60">
            <input
              type="checkbox"
              checked={Boolean(item.download)}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...item, download: e.target.checked }
                set({ items: next })
              }}
            />
            Download link
          </label>
          <Remove onClick={() => set({ items: items.filter((_, j) => j !== i) })} />
        </div>
      ))}
      <button
        type="button"
        className={ghostBtn}
        onClick={() => set({ items: [...items, { label: '', value: '', link: '' }] })}
      >
        Add contact row
      </button>
    </div>
  )
}

function ListKickerOnly() {
  return (
    <p className="text-sm leading-relaxed text-ink/60">
      Blog posts are edited separately. This page only stores the kicker line under the title.
    </p>
  )
}

const KIND_FIELDS = {
  intro: IntroFields,
  timeline: TimelineFields,
  cards: CardsFields,
  groups: GroupsFields,
  contact: ContactFields,
  list: ListKickerOnly,
}

export default function PageEditor({ pageId, label, initial, onSaved, onCancel }) {
  const [kicker, setKicker] = useState(initial.kicker ?? '')
  const [content, setContent] = useState(initial.content ?? { kind: 'intro' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const Fields = KIND_FIELDS[content.kind] ?? ListKickerOnly

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await savePage(pageId, { kicker, content })
      onSaved?.()
    } catch (err) {
      setError(err?.message || 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Kicker">
        <input className={field} value={kicker} onChange={(e) => setKicker(e.target.value)} />
      </Field>
      <Fields content={content} onChange={setContent} />
      {error ? <p className="text-sm text-[#b4553c]">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-lg border border-ink/15 bg-card px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Saving…' : `Save ${label}`}
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn}>
          Back
        </button>
      </div>
    </form>
  )
}

export function SiteEditor({ initial, onSaved, onCancel }) {
  const [name, setName] = useState(initial.name ?? '')
  const [role, setRole] = useState(initial.role ?? '')
  const [tagline, setTagline] = useState(initial.tagline ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await saveSite({ name, role, tagline })
      onSaved?.()
    } catch (err) {
      setError(err?.message || 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Name">
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Role">
        <input className={field} value={role} onChange={(e) => setRole(e.target.value)} />
      </Field>
      <Field label="Tagline">
        <textarea
          className={field}
          rows={2}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
      </Field>
      {error ? <p className="text-sm text-[#b4553c]">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-lg border border-ink/15 bg-card px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save site'}
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn}>
          Back
        </button>
      </div>
    </form>
  )
}
