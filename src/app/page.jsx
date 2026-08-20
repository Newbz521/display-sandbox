import PortfolioShell from '../components/PortfolioShell'
import { homeSeo } from '../lib/seo'

export const metadata = homeSeo().metadata

export default function HomePage() {
  const { jsonLd } = homeSeo()
  return <PortfolioShell jsonLd={jsonLd} seoKind="home" />
}
