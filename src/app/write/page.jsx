import PortfolioShell from '../../components/PortfolioShell'
import { writeDeskSeo } from '../../lib/seo'

export const metadata = writeDeskSeo().metadata

export default function WritePage() {
  return <PortfolioShell jsonLd={null} seoKind="home" />
}
