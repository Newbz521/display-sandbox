import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { firestoreWriteError, getFirebase } from './firebase'
import { postSlug, slugify } from './blogRoutes'

export function formatPostDate(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export function toPublicPost(data, fallbackSlug) {
  const slug = data.slug || fallbackSlug || slugify(data.title)
  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? formatPostDate(),
    blurb: data.blurb ?? data.body ?? '',
    link: '#',
    source: data.source ?? 'live',
  }
}

export function mergeBlogPosts(staticItems, liveItems) {
  const bySlug = new Map()
  for (const item of staticItems) {
    const slug = postSlug(item)
    if (!slug) continue
    bySlug.set(slug, { ...item, slug, link: item.link ?? '#', source: 'static' })
  }
  for (const item of liveItems) {
    const slug = postSlug(item)
    if (!slug) continue
    bySlug.set(slug, toPublicPost(item, slug))
  }
  return [...bySlug.values()]
}

export function subscribePosts(onChange, onError) {
  const { db } = getFirebase()
  if (!db) {
    onChange([])
    return () => {}
  }

  return onSnapshot(
    collection(db, 'posts'),
    (snap) => {
      const items = snap.docs.map((d) => toPublicPost({ ...d.data(), source: 'live' }, d.id))
      onChange(items)
    },
    (err) => onError?.(err),
  )
}

/** One-shot fetch for SSR / metadata. Falls back to [] if Firebase is offline. */
export async function fetchPosts() {
  const { db } = getFirebase()
  if (!db) return []
  try {
    const snap = await getDocs(collection(db, 'posts'))
    return snap.docs.map((d) => toPublicPost({ ...d.data(), source: 'live' }, d.id))
  } catch {
    return []
  }
}

export async function fetchPostBySlug(slug) {
  const nextSlug = slugify(slug)
  if (!nextSlug) return null
  const { db } = getFirebase()
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, 'posts', nextSlug))
    if (!snap.exists()) return null
    return toPublicPost({ ...snap.data(), source: 'live' }, snap.id)
  } catch {
    return null
  }
}

export async function publishPost({ title, blurb, slug, date }) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')

  const nextSlug = slugify(slug || title)
  if (!nextSlug) throw new Error('Give the post a title so it can have a URL.')

  try {
    await setDoc(
      doc(db, 'posts', nextSlug),
      {
        title: title.trim(),
        blurb: blurb.trim(),
        slug: nextSlug,
        date: date || formatPostDate(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (err) {
    throw firestoreWriteError(err)
  }

  return nextSlug
}

export async function seedLocalPosts(posts) {
  const { db } = getFirebase()
  if (!db || !posts?.length) return []

  const seeded = []
  for (const post of posts) {
    const slug = slugify(post.slug || post.title)
    if (!slug) continue
    const ref = doc(db, 'posts', slug)
    const existing = await getDoc(ref)
    if (existing.exists()) continue

    await setDoc(ref, {
      title: (post.title ?? '').trim(),
      blurb: (post.blurb ?? '').trim(),
      slug,
      date: post.date || formatPostDate(),
      updatedAt: serverTimestamp(),
    })
    seeded.push(slug)
  }
  return seeded
}

export async function deletePost(slug) {
  const { db } = getFirebase()
  if (!db) throw new Error('Firebase is not configured.')

  const nextSlug = slugify(slug)
  if (!nextSlug) throw new Error('Missing post to delete.')

  try {
    await deleteDoc(doc(db, 'posts', nextSlug))
  } catch (err) {
    throw firestoreWriteError(err)
  }
  return nextSlug
}
