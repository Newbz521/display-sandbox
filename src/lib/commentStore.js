import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { ensureAnonymousAuth, firestoreWriteError, getFirebase } from './firebase'
import { censorProfanity } from './profanity'

export const COMMENT_COOLDOWN_MS = 90_000
export const COMMENT_MAX_PER_DAY = 8
export const COMMENT_BODY_MIN = 3
export const COMMENT_BODY_MAX = 500
export const COMMENT_NAME_MAX = 40

const LOCAL_KEY = 'homeDesign.commentGate'

function readLocalGate() {
  if (typeof window === 'undefined') return { lastAt: 0, dayKey: '', dayCount: 0 }
  try {
    return { lastAt: 0, dayKey: '', dayCount: 0, ...JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') }
  } catch {
    return { lastAt: 0, dayKey: '', dayCount: 0 }
  }
}

function writeLocalGate(gate) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(gate))
  } catch {
    // private mode / quota — server rules still apply
  }
}

function dayKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
}

export function localCommentWaitMs() {
  const gate = readLocalGate()
  const wait = COMMENT_COOLDOWN_MS - (Date.now() - (gate.lastAt || 0))
  return wait > 0 ? wait : 0
}

function assertClientLimits({ name, body, website }) {
  if (website) throw new Error('Could not post comment.')
  const trimmedName = (name ?? '').trim() || 'Anonymous'
  const trimmedBody = (body ?? '').trim()
  if (trimmedName.length > COMMENT_NAME_MAX) {
    throw new Error(`Name must be ${COMMENT_NAME_MAX} characters or fewer.`)
  }
  if (trimmedBody.length < COMMENT_BODY_MIN) {
    throw new Error('Write a little more before posting.')
  }
  if (trimmedBody.length > COMMENT_BODY_MAX) {
    throw new Error(`Comments are capped at ${COMMENT_BODY_MAX} characters.`)
  }

  const wait = localCommentWaitMs()
  if (wait > 0) {
    const secs = Math.ceil(wait / 1000)
    throw new Error(`Please wait ${secs}s before commenting again.`)
  }

  const gate = readLocalGate()
  const today = dayKey()
  const dayCount = gate.dayKey === today ? gate.dayCount || 0 : 0
  if (dayCount >= COMMENT_MAX_PER_DAY) {
    throw new Error(`That's enough for today — try again tomorrow (${COMMENT_MAX_PER_DAY} / day).`)
  }

  return {
    name: censorProfanity(trimmedName),
    body: censorProfanity(trimmedBody),
    dayCount,
    today,
  }
}

export function subscribeComments(postSlug, onChange, onError) {
  const { db } = getFirebase()
  if (!db || !postSlug) {
    onChange([])
    return () => {}
  }

  // No orderBy — pending serverTimestamp writes still appear immediately,
  // and we avoid needing a composite index. Sort on the client.
  return onSnapshot(
    collection(db, 'posts', postSlug, 'comments'),
    { includeMetadataChanges: true },
    (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          name: censorProfanity(data.name || 'Anonymous'),
          body: censorProfanity(data.body || ''),
          authorUid: data.authorUid || null,
          createdAt: data.createdAt?.toDate?.() ?? null,
          pending: d.metadata.hasPendingWrites,
        }
      })
      items.sort((a, b) => {
        const ta = a.createdAt?.getTime?.() ?? (a.pending ? Date.now() : 0)
        const tb = b.createdAt?.getTime?.() ?? (b.pending ? Date.now() : 0)
        return ta - tb
      })
      onChange(items)
    },
    (err) => onError?.(err),
  )
}

export async function postComment(postSlug, { name, body, website = '' }) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')
  if (!postSlug) throw new Error('Missing post.')

  const prepared = assertClientLimits({ name, body, website })

  let user
  try {
    user = await ensureAnonymousAuth()
  } catch (err) {
    throw firestoreWriteError(err)
  }

  const limitRef = doc(db, 'commentLimits', user.uid)
  const commentRef = doc(collection(db, 'posts', postSlug, 'comments'))

  try {
    await runTransaction(db, async (tx) => {
      const limitSnap = await tx.get(limitRef)
      const now = serverTimestamp()

      let dayCount = 1
      let dayStart = now

      if (limitSnap.exists()) {
        const prev = limitSnap.data()
        const lastAt = prev.lastAt?.toMillis?.() ?? 0
        if (Date.now() - lastAt < COMMENT_COOLDOWN_MS - 1000) {
          throw new Error('Please wait a minute before commenting again.')
        }
        const prevStart = prev.dayStart?.toMillis?.() ?? 0
        const sameDay = Date.now() - prevStart < 24 * 60 * 60 * 1000
        if (sameDay) {
          dayCount = (prev.dayCount || 0) + 1
          if (dayCount > COMMENT_MAX_PER_DAY) {
            throw new Error(`That's enough for today — try again tomorrow (${COMMENT_MAX_PER_DAY} / day).`)
          }
          dayStart = prev.dayStart
        }
      }

      tx.set(limitRef, {
        lastAt: now,
        dayCount,
        dayStart,
      })

      tx.set(commentRef, {
        name: prepared.name,
        body: prepared.body,
        authorUid: user.uid,
        createdAt: now,
        website: '',
      })
    })
  } catch (err) {
    if (err?.message?.includes('wait') || err?.message?.includes('enough for today')) throw err
    throw firestoreWriteError(err)
  }

  const gate = readLocalGate()
  const today = prepared.today
  writeLocalGate({
    lastAt: Date.now(),
    dayKey: today,
    dayCount: gate.dayKey === today ? (gate.dayCount || 0) + 1 : 1,
  })

  return commentRef.id
}

export async function deleteComment(postSlug, commentId) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')
  try {
    await deleteDoc(doc(db, 'posts', postSlug, 'comments', commentId))
  } catch (err) {
    throw firestoreWriteError(err)
  }
}
