import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../lib/AuthContext'
import {
  COMMENT_BODY_MAX,
  COMMENT_NAME_MAX,
  deleteComment,
  localCommentWaitMs,
  postComment,
  subscribeComments,
} from '../../lib/commentStore'
import { postSlug } from '../../lib/blogRoutes'

const field =
  'w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-base text-ink outline-none focus:border-ink/40 sm:text-sm'

function formatWhen(date, pending) {
  if (pending || !date) return 'Just now'
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return ''
  }
}

const Comments = forwardRef(function Comments(
  { item, color, open = false, onOpenChange, onCountChange },
  ref,
) {
  const slug = postSlug(item)
  const { user, isOwner } = useAuth()
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [waitMs, setWaitMs] = useState(() => localCommentWaitMs())
  const [liveFlash, setLiveFlash] = useState(false)
  const rootRef = useRef(null)
  const onCountChangeRef = useRef(onCountChange)
  const prevCountRef = useRef(0)
  const seenIdsRef = useRef(new Set())
  onCountChangeRef.current = onCountChange

  useImperativeHandle(ref, () => ({
    scrollIntoView: () => {
      const node = rootRef.current
      if (!node) return
      const scroller = node.closest('.detail-scroll')
      if (scroller) {
        const top =
          node.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top +
          scroller.scrollTop -
          72
        scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      } else {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
  }))

  useEffect(() => {
    if (!slug) return undefined
    seenIdsRef.current = new Set()
    prevCountRef.current = 0
    return subscribeComments(
      slug,
      (next) => {
        const prev = prevCountRef.current
        setComments(next)
        onCountChangeRef.current?.(next.length)
        if (prev > 0 && next.length > prev) {
          setLiveFlash(true)
          window.setTimeout(() => setLiveFlash(false), 1600)
        }
        prevCountRef.current = next.length
        for (const c of next) seenIdsRef.current.add(c.id)
      },
      () => {
        setComments([])
        onCountChangeRef.current?.(0)
      },
    )
  }, [slug])

  useEffect(() => {
    if (waitMs <= 0) return undefined
    const t = setInterval(() => setWaitMs(localCommentWaitMs()), 500)
    return () => clearInterval(t)
  }, [waitMs])

  useEffect(() => {
    setError('')
    setBody('')
  }, [slug])

  if (!slug) return null

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await postComment(slug, { name, body, website })
      setBody('')
      setWaitMs(localCommentWaitMs())
      if (!open) onOpenChange?.(true)
    } catch (err) {
      setError(err?.message || 'Could not post.')
      setWaitMs(localCommentWaitMs())
    } finally {
      setBusy(false)
    }
  }

  const remove = async (commentId) => {
    try {
      await deleteComment(slug, commentId)
    } catch (err) {
      setError(err?.message || 'Could not delete.')
    }
  }

  const cooldownSec = Math.ceil(waitMs / 1000)
  const newestFirst = [...comments].reverse()

  return (
    <section ref={rootRef} className="pt-2">
      <div
        className="mb-4 h-px w-full"
        style={{ background: `linear-gradient(90deg, ${color}55, transparent)` }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenChange?.(!open)}
          className="group inline-flex cursor-pointer items-center gap-2.5 text-sm uppercase tracking-[0.2em] text-ink/45 transition-colors hover:text-ink sm:text-xs"
          aria-expanded={open}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-md border border-ink/15 text-[11px] transition-colors group-hover:border-ink/30"
            style={{ color }}
          >
            {open ? '−' : '+'}
          </span>
          {comments.length ? `Comments · ${comments.length}` : 'Comments'}
        </button>
        <span
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink/35"
          style={liveFlash ? { color } : undefined}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: color,
              opacity: liveFlash ? 1 : 0.55,
              boxShadow: liveFlash ? `0 0 0 3px ${color}33` : undefined,
            }}
          />
          Live
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="comments-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-xl pb-2 pt-4">
              <form onSubmit={submit} className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <input
                    className={`${field} sm:max-w-[9.5rem] sm:shrink-0`}
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, COMMENT_NAME_MAX))}
                    placeholder="Anonymous"
                    maxLength={COMMENT_NAME_MAX}
                    autoComplete="nickname"
                    aria-label="Name"
                  />
                  <textarea
                    className={`${field} min-h-[5rem] flex-1 resize-y`}
                    rows={3}
                    value={body}
                    onChange={(e) => setBody(e.target.value.slice(0, COMMENT_BODY_MAX))}
                    placeholder="Say something brief — no account needed."
                    maxLength={COMMENT_BODY_MAX}
                    required
                    aria-label="Comment"
                    autoFocus
                  />
                </div>

                <label
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <span>Website</span>
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>

                {error ? <p className="text-sm text-[#b4553c]">{error}</p> : null}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={busy || waitMs > 0}
                    className="cursor-pointer rounded-lg border border-ink/15 bg-card px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? 'Posting…' : waitMs > 0 ? `Wait ${cooldownSec}s` : 'Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChange?.(false)}
                    className="cursor-pointer text-xs uppercase tracking-[0.14em] text-ink/40 hover:text-ink/70"
                  >
                    Close
                  </button>
                  <span className="ml-auto text-[11px] text-ink/35">
                    {body.trim().length}/{COMMENT_BODY_MAX}
                  </span>
                </div>
              </form>

              <ul className="mt-5 divide-y divide-ink/10 border-t border-ink/8">
                {newestFirst.length === 0 ? (
                  <li className="py-3 text-sm text-ink/40">No comments yet.</li>
                ) : (
                  <AnimatePresence initial={false}>
                    {newestFirst.map((c) => {
                      const canDelete = isOwner || (user && c.authorUid === user.uid)
                      return (
                        <motion.li
                          key={c.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="py-3.5"
                        >
                          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                            <span className="text-sm font-medium text-ink">{c.name}</span>
                            <span className="text-[11px] uppercase tracking-[0.12em] text-ink/35">
                              {formatWhen(c.createdAt, c.pending)}
                            </span>
                            {canDelete ? (
                              <button
                                type="button"
                                onClick={() => remove(c.id)}
                                className="ml-auto cursor-pointer text-[11px] uppercase tracking-[0.12em] text-ink/35 transition-colors hover:text-[#b4553c]"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
                            {c.body}
                          </p>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                )}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
})

export default Comments
