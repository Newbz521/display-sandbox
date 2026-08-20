'use client'

import dynamic from 'next/dynamic'

const PortfolioClient = dynamic(() => import('./PortfolioClient'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-paper" aria-hidden />,
})

/**
 * Persistent interactive board — mounted once in the root layout so route
 * changes update the URL / SEO shell without remounting the camera scene.
 */
export default function PortfolioBoard() {
  return (
    <div className="portfolio-app absolute inset-0">
      <PortfolioClient />
    </div>
  )
}
