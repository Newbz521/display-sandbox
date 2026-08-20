import PortfolioShell from '../../../components/PortfolioShell'
import { isPlayId } from '../../../lib/playRoutes'
import { playSeo } from '../../../lib/seo'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  const { id } = await params
  if (!isPlayId(id)) {
    return { title: 'Sandbox', robots: { index: false, follow: false } }
  }
  return playSeo(id).metadata
}

export default async function PlayPage({ params }) {
  const { id } = await params
  if (!isPlayId(id)) notFound()

  return <PortfolioShell jsonLd={null} seoKind="home" />
}
