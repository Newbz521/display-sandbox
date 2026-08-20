import { absoluteUrl } from '../lib/site'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/write', '/play/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
