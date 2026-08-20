import { BLOG_SEED } from '../data/blogSeed'
import { fetchPosts, mergeBlogPosts } from '../lib/blogStore'
import { sitemapEntries } from '../lib/seo'

export default async function sitemap() {
  const live = await fetchPosts()
  const posts = mergeBlogPosts(BLOG_SEED, live)
  return sitemapEntries(posts)
}
