import { PAGE_SEED, SITE_SEED } from '../data/contentSeed'
import { BLOG_SEED } from '../data/blogSeed'
import { MARGINS } from '../data/margins'
import { PIECES } from '../data/portfolio'
import { FOCUS_PATHS } from './focusRoutes'
import { SITE, absoluteUrl, getSiteUrl } from './site'
import {
  blogIndexMeta,
  blogIndexOutline,
  blogPostMeta,
  blogPostOutline,
  focusMeta,
  focusOutline,
  homeMeta,
  homeOutline,
} from './seoOutline'

function truncate(text, max = 160) {
  const clean = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}…`
}

function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: SITE.name,
    jobTitle: SITE.role,
    description: SITE.tagline,
    email: SITE.email,
    url: absoluteUrl('/'),
    sameAs: SITE.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
  }
}

function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: `${SITE.name} Portfolio`,
    url: absoluteUrl('/'),
    description: SITE.defaultDescription,
    inLanguage: 'en-US',
    publisher: { '@id': absoluteUrl('/#person') },
  }
}

function breadcrumbJsonLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function graph(...nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}

export function buildPageMetadata({
  title,
  description,
  path = '/',
  type = 'website',
  noIndex = false,
  image,
}) {
  const url = absoluteUrl(path)
  const fullTitle = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`
  const desc = truncate(description || SITE.defaultDescription)
  const ogImage = image || absoluteUrl('/favicon.svg')

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: desc,
      siteName: `${SITE.name} Portfolio`,
      locale: SITE.locale,
      images: [{ url: ogImage, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export function homeSeo() {
  const outline = homeOutline()
  const meta = homeMeta()
  return {
    metadata: buildPageMetadata({
      title: meta.title,
      description: meta.description,
      path: '/',
    }),
    jsonLd: graph(personJsonLd(), websiteJsonLd(), {
      '@type': 'ProfilePage',
      '@id': absoluteUrl('/#webpage'),
      url: absoluteUrl('/'),
      name: outline.h1,
      description: meta.description,
      isPartOf: { '@id': absoluteUrl('/#website') },
      about: { '@id': absoluteUrl('/#person') },
      mainEntity: { '@id': absoluteUrl('/#person') },
    }),
  }
}

export function focusPageSeo(id) {
  const path = FOCUS_PATHS[id] || `/${id}`
  const outline = focusOutline(id)
  const meta = focusMeta(id)
  const piece = PIECES.find((p) => p.id === id)
  const margin = MARGINS.find((m) => m.id === id)
  const label = piece?.label || margin?.label || id
  const description = meta?.description || outline?.lead || pageDescription(id) || SITE.defaultDescription
  const title = meta?.title || label

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path,
    }),
    jsonLd: graph(
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: label, path },
      ]),
      {
        '@type': 'WebPage',
        '@id': absoluteUrl(`${path}#webpage`),
        url: absoluteUrl(path),
        name: outline?.h1 || title,
        description,
        isPartOf: { '@id': absoluteUrl('/#website') },
        about: { '@id': absoluteUrl('/#person') },
      },
    ),
  }
}

function pageDescription(id) {
  const content = PAGE_SEED[id]?.content
  if (!content) {
    const margin = MARGINS.find((m) => m.id === id)
    if (!margin?.content) return margin?.kicker || ''
    if (margin.content.status) return margin.content.status
    if (margin.content.items?.length) {
      return margin.content.items
        .map((i) => i.value || i.body || i.title || i.label)
        .filter(Boolean)
        .join(' · ')
    }
    return margin.kicker || ''
  }
  if (content.lead) return content.lead
  if (content.kind === 'timeline' && content.items?.[0]) {
    const first = content.items[0]
    return `${first.title} at ${first.org} — ${first.points?.[0] || first.period}`
  }
  if (content.kind === 'cards' && content.items?.[0]) {
    return content.items.map((i) => i.name).join(', ')
  }
  if (content.kind === 'groups') {
    return content.items.map((g) => g.group).join(', ')
  }
  if (content.kind === 'contact') return content.lead || ''
  return PAGE_SEED[id]?.kicker || ''
}

export function blogIndexSeo(posts = BLOG_SEED) {
  const path = '/blog'
  const outline = blogIndexOutline(posts)
  const meta = blogIndexMeta()
  return {
    metadata: buildPageMetadata({
      title: meta.title,
      description: meta.description,
      path,
    }),
    jsonLd: graph(
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path },
      ]),
      {
        '@type': 'Blog',
        '@id': absoluteUrl(`${path}#blog`),
        url: absoluteUrl(path),
        name: outline.h1,
        description: meta.description,
        author: { '@id': absoluteUrl('/#person') },
        publisher: { '@id': absoluteUrl('/#person') },
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: absoluteUrl(`/blog/${post.slug}`),
          datePublished: toIsoDate(post.date),
          author: { '@id': absoluteUrl('/#person') },
        })),
      },
    ),
  }
}

export function blogPostSeo(post) {
  const path = `/blog/${post.slug}`
  const outline = blogPostOutline(post)
  const meta = blogPostMeta(post)
  const description = truncate(meta?.description || outline?.lead || post.blurb, 160)
  const title = meta?.title || outline?.h1 || post.title
  const published = toIsoDate(post.date)

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path,
      type: 'article',
    }),
    jsonLd: graph(
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
      ]),
      {
        '@type': 'BlogPosting',
        '@id': absoluteUrl(`${path}#article`),
        headline: outline?.h1 || title,
        description,
        articleBody: post.blurb,
        datePublished: published,
        dateModified: published,
        author: { '@id': absoluteUrl('/#person') },
        publisher: {
          '@type': 'Person',
          name: SITE.name,
          url: absoluteUrl('/'),
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': absoluteUrl(path),
        },
        url: absoluteUrl(path),
        inLanguage: 'en-US',
        isPartOf: { '@id': absoluteUrl('/blog#blog') },
      },
    ),
  }
}

export function writeDeskSeo() {
  return {
    metadata: buildPageMetadata({
      title: 'Write desk',
      description: 'Private writing desk for portfolio content.',
      path: '/write',
      noIndex: true,
    }),
    jsonLd: null,
  }
}

export function playSeo(id) {
  return {
    metadata: buildPageMetadata({
      title: 'Shared sandbox',
      description: 'A shared drafting sandbox board. Links expire after one hour.',
      path: `/play/${id}`,
      noIndex: true,
    }),
    jsonLd: null,
  }
}

/** MM/DD/YYYY → ISO date string (best effort). */
export function toIsoDate(value) {
  if (!value) return undefined
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  const m = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) {
    const [, month, day, year] = m
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  return undefined
}

export function sitemapEntries(posts = BLOG_SEED) {
  const base = getSiteUrl()
  const focus = Object.values(FOCUS_PATHS).map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  const blogPosts = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
    lastModified: toIsoDate(post.date),
  }))
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    ...focus,
    ...blogPosts,
  ]
}

export { SITE_SEED, PAGE_SEED }
