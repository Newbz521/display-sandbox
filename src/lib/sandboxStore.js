import {
  Timestamp,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { ensureAnonymousAuth, firestoreWriteError, getFirebase } from './firebase'
import { absolutePlayUrl } from './playRoutes'
import {
  hydrateSandbox,
  sandboxFilledCount,
  serializeSandbox,
} from './sandbox'

export const SANDBOX_TTL_MS = 60 * 60 * 1000
export const SANDBOX_COOLDOWN_MS = 60_000
export const SANDBOX_MAX_PER_DAY = 5

const LOCAL_KEY = 'homeDesign.sandboxShareGate'

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

export function localSandboxWaitMs() {
  const gate = readLocalGate()
  const wait = SANDBOX_COOLDOWN_MS - (Date.now() - (gate.lastAt || 0))
  return wait > 0 ? wait : 0
}

function assertClientLimits() {
  const wait = localSandboxWaitMs()
  if (wait > 0) {
    const secs = Math.ceil(wait / 1000)
    throw new Error(`Please wait ${secs}s before sharing again.`)
  }

  const gate = readLocalGate()
  const today = dayKey()
  const dayCount = gate.dayKey === today ? gate.dayCount || 0 : 0
  if (dayCount >= SANDBOX_MAX_PER_DAY) {
    throw new Error(
      `That's enough shares for today — try again tomorrow (${SANDBOX_MAX_PER_DAY} / day).`,
    )
  }

  return { dayCount, today }
}

/**
 * @returns {Promise<{ id: string, url: string }>}
 */
export async function saveSandbox(state) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')

  if (sandboxFilledCount(state) === 0) {
    throw new Error('Stamp something on the board before sharing.')
  }

  const prepared = assertClientLimits()
  const payload = serializeSandbox(state)

  let user
  try {
    user = await ensureAnonymousAuth()
  } catch (err) {
    throw firestoreWriteError(err)
  }

  const id = crypto.randomUUID()
  const sandboxRef = doc(db, 'sandboxes', id)
  const limitRef = doc(db, 'sandboxLimits', user.uid)
  const expireAt = Timestamp.fromMillis(Date.now() + SANDBOX_TTL_MS)

  try {
    await runTransaction(db, async (tx) => {
      const limitSnap = await tx.get(limitRef)
      const now = serverTimestamp()

      let dayCount = 1
      let dayStart = now

      if (limitSnap.exists()) {
        const prev = limitSnap.data()
        const lastAt = prev.lastAt?.toMillis?.() ?? 0
        if (Date.now() - lastAt < SANDBOX_COOLDOWN_MS - 1000) {
          throw new Error('Please wait before sharing again.')
        }
        const prevStart = prev.dayStart?.toMillis?.() ?? 0
        const sameDay = Date.now() - prevStart < 24 * 60 * 60 * 1000
        if (sameDay) {
          dayCount = (prev.dayCount || 0) + 1
          if (dayCount > SANDBOX_MAX_PER_DAY) {
            throw new Error(
              `That's enough shares for today — try again tomorrow (${SANDBOX_MAX_PER_DAY} / day).`,
            )
          }
          dayStart = prev.dayStart
        }
      }

      tx.set(limitRef, {
        lastAt: now,
        dayCount,
        dayStart,
      })

      tx.set(sandboxRef, {
        ...payload,
        authorUid: user.uid,
        createdAt: now,
        expireAt,
      })
    })
  } catch (err) {
    if (
      err?.message?.includes('wait') ||
      err?.message?.includes('enough shares') ||
      err?.message?.includes('Stamp something')
    ) {
      throw err
    }
    throw firestoreWriteError(err)
  }

  const gate = readLocalGate()
  writeLocalGate({
    lastAt: Date.now(),
    dayKey: prepared.today,
    dayCount: gate.dayKey === prepared.today ? (gate.dayCount || 0) + 1 : 1,
  })

  return { id, url: absolutePlayUrl(id) }
}

/**
 * @returns {Promise<{ status: 'ok', state: object, expireAt: Date } | { status: 'expired' }>}
 */
export async function loadSandbox(id) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')
  if (!id) return { status: 'expired' }

  try {
    const snap = await getDoc(doc(db, 'sandboxes', id))
    if (!snap.exists()) return { status: 'expired' }

    const data = snap.data()
    const expireAt = data.expireAt?.toDate?.() ?? null
    if (!expireAt || expireAt.getTime() <= Date.now()) {
      return { status: 'expired' }
    }

    return {
      status: 'ok',
      state: hydrateSandbox(data),
      expireAt,
    }
  } catch (err) {
    throw firestoreWriteError(err)
  }
}
