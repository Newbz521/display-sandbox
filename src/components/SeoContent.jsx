import {
  blogIndexOutline,
  blogPostOutline,
  focusOutline,
  homeOutline,
} from '../lib/seoOutline'

/**
 * Crawlable document twin: H1 → lead → H2 → description (+ optional detail).
 * Clipped visually; present in SSR HTML for search engines.
 */
export default function SeoContent({ kind, focusId, post, posts }) {
  if (kind === 'home') {
    return <SeoArticle outline={homeOutline()} nav={homeNav()} />
  }

  if (kind === 'blog' && !post) {
    const outline = blogIndexOutline(posts)
    return (
      <SeoArticle
        outline={outline}
        sectionLinks={outline.sections.map((section, i) => {
          const match = (posts || []).find((p) => p.title === section.title)
          return match ? { href: `/blog/${match.slug}`, title: section.title, index: i } : null
        })}
      />
    )
  }

  if (kind === 'blog' && post) {
    return (
      <SeoArticle
        outline={blogPostOutline(post)}
        meta={
          post.date ? (
            <time dateTime={toDateTime(post.date)}>{post.date}</time>
          ) : null
        }
        footer={
          <p>
            <a href="/blog">All posts</a>
            {' · '}
            <a href="/">Home</a>
          </p>
        }
      />
    )
  }

  if (kind === 'focus' && focusId) {
    const outline = focusOutline(focusId)
    if (!outline) return null
    return (
      <SeoArticle
        outline={outline}
        footer={
          <p>
            <a href="/">Back to portfolio</a>
          </p>
        }
      />
    )
  }

  return null
}

function SeoArticle({ outline, meta = null, footer = null, nav = null, sectionLinks = null }) {
  if (!outline) return null

  return (
    <article className="seo-content">
      <header>
        <h1>{outline.h1}</h1>
        <p>{outline.lead}</p>
        {meta}
      </header>

      {outline.sections.map((section, i) => {
        const link = sectionLinks?.[i]
        return (
          <section key={`${section.title}-${i}`}>
            <h2>{link ? <a href={link.href}>{section.title}</a> : section.title}</h2>
            <p>{section.description}</p>
            {section.body?.length ? (
              <ul>
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </section>
        )
      })}

      {nav}
      {footer}
    </article>
  )
}

function homeNav() {
  return (
    <nav aria-label="Portfolio sections">
      <ul>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/work">Work</a>
        </li>
        <li>
          <a href="/projects">Projects</a>
        </li>
        <li>
          <a href="/toolkit">Toolkit</a>
        </li>
        <li>
          <a href="/playground">Playground</a>
        </li>
        <li>
          <a href="/blog">Blog</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  )
}

function toDateTime(value) {
  const m = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return value
  const [, month, day, year] = m
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}
