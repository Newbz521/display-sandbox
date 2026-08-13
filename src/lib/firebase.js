import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { OWNER } from '../data/portfolio'

export const OWNER_EMAIL = OWNER.email.toLowerCase()

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)
}

export function firestoreWriteError(err) {
  const code = err?.code ?? ''
  const msg = err?.message ?? ''
  if (code === 'permission-denied' || /insufficient permissions/i.test(msg)) {
    return new Error(
      'Firestore blocked this save. In Firebase Console → Firestore → Rules, paste the contents of firestore.rules and click Publish.',
    )
  }
  if (code === 'auth/operation-not-allowed') {
    return new Error(
      'Anonymous sign-in is off. In Firebase Console → Authentication → Sign-in method, enable Anonymous.',
    )
  }
  return err instanceof Error ? err : new Error(msg || 'Could not save.')
}

/** Invisible guest session for rate-limited comments — no login UI. */
export async function ensureAnonymousAuth() {
  const { auth } = getFirebase()
  if (!auth) throw new Error('Firebase is not configured.')
  if (auth.currentUser) return auth.currentUser
  const cred = await signInAnonymously(auth)
  return cred.user
}

let app
let auth
let db

export function getFirebase() {
  if (!isFirebaseConfigured()) return { app: null, auth: null, db: null }
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  return { app, auth, db }
}
