import PortfolioShell from '../components/PortfolioShell'
import { focusPageSeo } from './seo'

export function makeFocusPage(focusId) {
  const { metadata, jsonLd } = focusPageSeo(focusId)

  function FocusPage() {
    return <PortfolioShell jsonLd={jsonLd} seoKind="focus" focusId={focusId} />
  }

  return { metadata, FocusPage }
}
