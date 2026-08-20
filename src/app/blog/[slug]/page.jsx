import { notFound } from 'next/navigation'
import PortfolioShell from '../../../components/PortfolioShell'
import { BLOG_SEED } from '../../../data/blogSeed'
import { fetchPostBySlug, fetchPosts, mergeBlogPosts } from '../../../lib/blogStore'
import { findPostBySlug } from '../../../lib/blogRoutes'
import { blogPostSeo } from '../../../lib/seo'

export async function generateStaticParams() {
  return BLOG_SEED.map((post) => ({ slug: post.slug }))
}

async function resolvePost(slug) {
  const live = await fetchPostBySlug(slug)
  if (live) return live
  const allLive = await fetchPosts()
  const merged = mergeBlogPosts(BLOG_SEED, allLive)
  return findPostBySlug(merged, slug)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await resolvePost(slug)
  if (!post) {
    return { title: 'Post not found', robots: { index: false, follow: false } }
  }
  return blogPostSeo(post).metadata
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await resolvePost(slug)
  if (!post) notFound()

  const { jsonLd } = blogPostSeo(post)

  return <PortfolioShell jsonLd={jsonLd} seoKind="blog" post={post} />
}
