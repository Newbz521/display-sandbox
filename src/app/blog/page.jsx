import PortfolioShell from '../../components/PortfolioShell'
import { BLOG_SEED } from '../../data/blogSeed'
import { fetchPosts, mergeBlogPosts } from '../../lib/blogStore'
import { blogIndexSeo } from '../../lib/seo'

export async function generateMetadata() {
  const live = await fetchPosts()
  const posts = mergeBlogPosts(BLOG_SEED, live)
  return blogIndexSeo(posts).metadata
}

export default async function BlogIndexPage() {
  const live = await fetchPosts()
  const posts = mergeBlogPosts(BLOG_SEED, live)
  const { jsonLd } = blogIndexSeo(posts)

  return <PortfolioShell jsonLd={jsonLd} seoKind="blog" posts={posts} />
}
