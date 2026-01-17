import { NextResponse } from 'next/server'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com'
  
  const robots = `# SiJiGPT Robots.txt
# AI驾驶员的全球资讯聚合站

User-agent: *
Allow: /

# 重要页面
Allow: /posts
Allow: /tags
Allow: /archives
Allow: /about

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml

# 禁止索引的路径（如果有的话）
Disallow: /api/
Disallow: /admin/

# 爬虫速率限制
Crawl-delay: 1`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
