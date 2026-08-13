import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ensureAnonymousAuth, getFirebase, isFirebaseConfigured, OWNER_EMAIL } from './firebase'

const AuthContext = createContext({
  user: null,
  ready: true,
  configured: false,
  isOwner: false,
  login: async () => {},
  logout: async () => {},
})

function isOwnerUser(user) {
  return (user?.email ?? '').toLowerCase() === OWNER_EMAIL
}

function isForeignEmailUser(user) {
  if (!user || user.isAnonymous) return false
  const email = (user.email ?? '').toLowerCase()
  return Boolean(email) && email !== OWNER_EMAIL
}

export function AuthProvider({ children }) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!configured)

  useEffect(() => {
    if (!configured) return undefined
    const { auth } = getFirebase()
    return onAuthStateChanged(auth, async (next) => {
      if (isForeignEmailUser(next)) {
        await signOut(auth)
        setUser(null)
        setReady(true)
        return
      }
      setUser(next)
      setReady(true)
    })
  }, [configured])

  const value = useMemo(
    () => ({
      user,
      ready,
      configured,
      isOwner: isOwnerUser(user),
      login: async (email, password) => {
        if (!configured) throw new Error('Firebase is not configured.')
        if (email.trim().toLowerCase() !== OWNER_EMAIL) {
          throw new Error('This desk is only for Lawrence.')
        }
        const { auth } = getFirebase()
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
        if (!isOwnerUser(cred.user)) {
          await signOut(auth)
          throw new Error('This desk is only for Lawrence.')
        }
        return cred.user
      },
      logout: async () => {
        const { auth } = getFirebase()
        if (auth) await signOut(auth)
        // Restore a silent guest session so comments still work.
        try {
          await ensureAnonymousAuth()
        } catch {
          // Anonymous may be disabled — comments will surface that on post.
        }
      },
    }),
    [user, ready, configured],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
