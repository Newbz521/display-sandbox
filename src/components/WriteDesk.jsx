import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { formatPostDate, publishPost } from '../lib/blogStore'
import { slugify } from '../lib/blogRoutes'
import { OWNER_EMAIL } from '../lib/firebase'
import { EDITABLE_PAGES, PAGE_SEED, SITE_SEED } from '../data/contentSeed'
import PageEditor, { SiteEditor } from './desk/PageEditor'

const BLOG_COLOR = '#a99be0'
const cardBtn =
  'cursor-pointer rounded-lg border border-ink/15 bg-card px-4 py-3 text-left transition-colors hover:border-ink/30'
const ghostBtn =
  'cursor-pointer text-xs uppercase tracking-[0.14em] text-ink/40 hover:text-ink/70'

function authMessage(err) {
  const code = err?.code ?? ''
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Email or password did not match.'
  }
  if (code === 'auth/too-many-requests') return 'Too many attempts. Wait a minute and try again.'
  return err?.message || 'Could not sign in.'
}

function LoginForm({ onClose }) {
  const { login, configured } = useAuth()
  const [email, setEmail] = useState(OWNER_EMAIL)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="max-w-md text-base leading-relaxed text-ink/70 sm:text-sm">
        {configured
          ? 'Private desk. Sign in with the account that belongs to this site — nobody else can publish.'
          : 'Firebase env vars are missing, so the desk cannot sign in yet. Add them to .env.local and restart.'}
      </p>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-ink/45">Email</span>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-base text-ink outline-none focus:border-ink/40 sm:text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-ink/45">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-base text-ink outline-none focus:border-ink/40 sm:text-sm"
        />
      </label>
      {error ? <p className="text-sm text-[#b4553c]">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy || !configured}
          className="cursor-pointer rounded-lg border border-ink/15 bg-card px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <button type="button" onClick={onClose} className={ghostBtn}>
          Back
        </button>
      </div>
    </form>
  )
}

function ComposeForm({ onPublished, onBack }) {
  const [title, setTitle] = useState('')
  const [blurb, setBlurb] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const slugPreview = slugify(title) || 'untitled'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !blurb.trim()) {
      setError('Title and body are both required.')
      return
    }
    setBusy(true)
    try {
      const slug = await publishPost({
        title,
        blurb,
        date: formatPostDate(),
      })
      onPublished(slug)
    } catch (err) {
      setError(err?.message || 'Could not publish.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-ink/45">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Slowing down"
          className="mt-2 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-base text-ink outline-none focus:border-ink/40 sm:text-sm"
        />
      </label>
      <div className="text-xs uppercase tracking-[0.16em] text-ink/35">
        URL · /blog/{slugPreview}
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-ink/45">Body</span>
        <textarea
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          rows={16}
          placeholder="Blank line between paragraphs."
          className="mt-2 w-full resize-y rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-base leading-relaxed text-ink outline-none focus:border-ink/40 sm:text-sm"
        />
      </label>
      {error ? <p className="text-sm text-[#b4553c]">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-lg border border-ink/15 bg-card px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Publishing…' : 'Publish'}
        </button>
        <button type="button" onClick={onBack} className={ghostBtn}>
          Back
        </button>
      </div>
    </form>
  )
}

function DeskHome({ onOpenPage, onNewPost, onOpenSite, onClose, onLogout }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.16em] text-ink/40">Pages</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {EDITABLE_PAGES.map((page) => (
            <button key={page.id} type="button" className={cardBtn} onClick={() => onOpenPage(page.id)}>
              <div className="text-sm font-medium text-ink">{page.label}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-ink/40">Edit copy</div>
            </button>
          ))}
          <button type="button" className={cardBtn} onClick={onOpenSite}>
            <div className="text-sm font-medium text-ink">Site credit</div>
            <div className="mt-1 text-xs uppercase tracking-[0.14em] text-ink/40">Name, role, tagline</div>
          </button>
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.16em] text-ink/40">Blog</div>
        <button type="button" className={`${cardBtn} mt-3 w-full`} onClick={onNewPost}>
          <div className="text-sm font-medium text-ink">New post</div>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-ink/40">Publish to /blog</div>
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onClose} className={ghostBtn}>
          Close
        </button>
        <button type="button" onClick={onLogout} className={`${ghostBtn} ml-auto`}>
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function WriteDesk({
  onClose,
  onBackToBoard,
  onPublished,
  initialView = 'home',
  livePages = {},
  liveSite = null,
}) {
  const { isOwner, ready, logout } = useAuth()
  const [view, setView] = useState(initialView)

  const title =
    view === 'post'
      ? 'New post'
      : view === 'site'
        ? 'Site credit'
        : view === 'home' || !isOwner
          ? 'Desk'
          : EDITABLE_PAGES.find((p) => p.id === view)?.label ?? 'Edit'

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 z-0 cursor-pointer bg-ink/12 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <motion.div
        className="detail-scroll relative z-10 flex max-h-[min(90vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-ink/12 bg-card shadow-[0_24px_60px_rgba(29,41,81,0.14)]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      >
        <div className="shrink-0 border-b border-ink/8 px-5 py-4">
          <button
            type="button"
            onClick={onBackToBoard ?? onClose}
            className="group inline-flex cursor-pointer items-center gap-2.5 text-base text-ink/55 transition-colors hover:text-ink sm:text-sm"
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-lg border border-ink/20 transition-colors group-hover:border-ink/45"
              style={{ color: BLOG_COLOR }}
            >
              ←
            </span>
            Back to the square
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-6">
          <div
            className="text-sm uppercase tracking-[0.24em] sm:text-xs"
            style={{ color: BLOG_COLOR }}
          >
            Private
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {title}
          </h2>
          <div
            className="mt-5 mb-6 h-px w-full"
            style={{ background: `linear-gradient(90deg, ${BLOG_COLOR}66, transparent)` }}
          />
          {!ready ? (
            <p className="text-sm text-ink/50">Checking the lock…</p>
          ) : !isOwner ? (
            <LoginForm onClose={onClose} />
          ) : view === 'home' ? (
            <DeskHome
              onOpenPage={setView}
              onNewPost={() => setView('post')}
              onOpenSite={() => setView('site')}
              onClose={onClose}
              onLogout={logout}
            />
          ) : view === 'post' ? (
            <ComposeForm onPublished={onPublished} onBack={() => setView('home')} />
          ) : view === 'site' ? (
            <SiteEditor
              initial={liveSite ?? SITE_SEED}
              onSaved={onClose}
              onCancel={() => setView('home')}
            />
          ) : (
            <PageEditor
              key={view}
              pageId={view}
              label={EDITABLE_PAGES.find((p) => p.id === view)?.label ?? view}
              initial={livePages[view] ?? PAGE_SEED[view]}
              onSaved={onClose}
              onCancel={() => setView('home')}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
