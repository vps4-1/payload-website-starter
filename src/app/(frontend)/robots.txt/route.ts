import { NextResponse } from 'next/server'
import { getCanonicalSiteUrl } from '@/lib/site-url'

export async function GET() {
  const siteUrl = getCanonicalSiteUrl()
  
  const robots = `# SiJiGPT Robots.txt
# AI驾驶员的全球资讯聚合站 - 专注AI资讯聚合与智能分析

User-agent: *
Allow: /

# 重要页面
Allow: /posts
Allow: /posts/
Allow: /tags
Allow: /tags/
Allow: /archives
Allow: /about
Allow: /search
Allow: /rss.xml

# 专门针对AI搜索引擎的优化
User-agent: GPTBot
Allow: /
Allow: /posts/
Allow: /tags/

User-agent: ChatGPT-User
Allow: /
Allow: /posts/
Allow: /tags/

User-agent: Baiduspider
Allow: /
Allow: /posts/
Allow: /tags/
Crawl-delay: 2

# Sitemaps - 使用分级sitemap提升索引效率
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-main.xml
Sitemap: ${siteUrl}/sitemap-posts.xml
Sitemap: ${siteUrl}/sitemap-tags.xml

# 禁止索引的路径
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /.well-known/
Disallow: /404
Disallow: /500

# 爬虫速率限制
Crawl-delay: 1

# 额外的AI时代优化指令
# 支持结构化数据抓取
Allow: /*.json$
Allow: /rss.xml
Allow: /feed.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
