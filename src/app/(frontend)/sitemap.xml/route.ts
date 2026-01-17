import { NextResponse } from 'next/server'

// 文章数据
const posts = [
  {
    slug: 'zenken-chatgpt-enterprise',
    lastModified: '2026-01-15',
    priority: 0.8,
  },
  {
    slug: 'alibaba-tongyi-qianwen-3',
    lastModified: '2026-01-14',
    priority: 0.8,
  },
]

// 静态页面
const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/posts', priority: 1.0, changefreq: 'daily' },
  { path: '/tags', priority: 0.7, changefreq: 'weekly' },
  { path: '/archives', priority: 0.7, changefreq: 'weekly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/search', priority: 0.6, changefreq: 'weekly' },
]

function generateSitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com'
  const currentDate = new Date().toISOString()

  // 静态页面 URLs
  const staticUrls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')

  // 文章 URLs
  const postUrls = posts
    .map(
      (post) => `
  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${post.lastModified}T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.priority}</priority>
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrls}${postUrls}
</urlset>`
}

export async function GET() {
  const sitemap = generateSitemap()

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
