import JsonLd from './JsonLd'
import SeoContent from './SeoContent'

/**
 * Per-route SSR shell: JSON-LD + crawlable copy.
 * The interactive board lives in the root layout so it stays mounted across navigations.
 */
export default function PortfolioShell({ jsonLd, seoKind, focusId, post, posts }) {
  return (
    <>
      <JsonLd data={jsonLd} />
      <SeoContent kind={seoKind} focusId={focusId} post={post} posts={posts} />
    </>
  )
}
