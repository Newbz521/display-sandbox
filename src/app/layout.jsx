import { Suspense } from 'react'
import PortfolioBoard from '../components/PortfolioBoard'
import { SITE, absoluteUrl } from '../lib/site'
import '../styles.css'

export const metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: SITE.defaultTitle,
  description: SITE.defaultDescription,
  applicationName: `${SITE.name} Portfolio`,
  authors: [{ name: SITE.name, url: absoluteUrl('/') }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: `${SITE.name} Portfolio`,
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    url: absoluteUrl('/'),
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="relative h-full overflow-hidden bg-paper text-ink">
        <Suspense fallback={<div className="h-full w-full bg-paper" />}>
          {children}
          <PortfolioBoard />
        </Suspense>
      </body>
    </html>
  )
}
