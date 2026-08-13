import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { firestoreWriteError, getFirebase } from './firebase'
import { PAGE_SEED, SITE_SEED } from '../data/contentSeed'

function stripUndefined(value) {
  if (Array.isArray(value)) return value.map(stripUndefined)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)]),
    )
  }
  return value
}

export function applyLivePage(piece, livePages) {
  if (!piece) return piece
  const live = livePages?.[piece.id]
  if (!live) return piece
  return {
    ...piece,
    kicker: live.kicker ?? piece.kicker,
    content: live.content ?? piece.content,
  }
}

export function applyLiveSite(owner, liveSite) {
  if (!liveSite) return owner
  return {
    ...owner,
    name: liveSite.name ?? owner.name,
    role: liveSite.role ?? owner.role,
    tagline: liveSite.tagline ?? owner.tagline,
  }
}

export function subscribePages(onChange, onError) {
  const { db } = getFirebase()
  if (!db) {
    onChange({})
    return () => {}
  }

  return onSnapshot(
    collection(db, 'pages'),
    (snap) => {
      const next = {}
      for (const d of snap.docs) {
        const data = d.data()
        next[d.id] = {
          kicker: data.kicker,
          content: data.content,
        }
      }
      onChange(next)
    },
    (err) => onError?.(err),
  )
}

export function subscribeSite(onChange, onError) {
  const { db } = getFirebase()
  if (!db) {
    onChange(null)
    return () => {}
  }

  return onSnapshot(
    doc(db, 'site', 'meta'),
    (snap) => {
      onChange(snap.exists() ? snap.data() : null)
    },
    (err) => onError?.(err),
  )
}

export async function savePage(id, { kicker, content }) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')

  try {
    await setDoc(
      doc(db, 'pages', id),
      stripUndefined({
        kicker: kicker?.trim?.() ?? kicker ?? '',
        content,
        updatedAt: serverTimestamp(),
      }),
      { merge: true },
    )
  } catch (err) {
    throw firestoreWriteError(err)
  }
}

export async function saveSite({ name, role, tagline }) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')

  try {
    await setDoc(
      doc(db, 'site', 'meta'),
      {
        name: name.trim(),
        role: role.trim(),
        tagline: tagline.trim(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (err) {
    throw firestoreWriteError(err)
  }
}

export async function seedPages() {
  const { db } = getFirebase()
  if (!db) return

  for (const [id, page] of Object.entries(PAGE_SEED)) {
    const ref = doc(db, 'pages', id)
    const existing = await getDoc(ref)
    if (existing.exists()) continue
    await setDoc(ref, stripUndefined({
      kicker: page.kicker,
      content: page.content,
      updatedAt: serverTimestamp(),
    }))
  }

  const siteRef = doc(db, 'site', 'meta')
  const siteSnap = await getDoc(siteRef)
  if (!siteSnap.exists()) {
    await setDoc(siteRef, {
      ...SITE_SEED,
      updatedAt: serverTimestamp(),
    })
  }
}
