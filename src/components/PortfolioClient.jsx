'use client'

import App from '../App'
import { AuthProvider } from '../lib/AuthContext'

/** Client island: interactive board + Firebase auth. Route comes from the URL. */
export default function PortfolioClient() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
