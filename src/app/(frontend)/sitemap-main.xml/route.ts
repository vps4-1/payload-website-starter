import { NextResponse } from 'next/server';
import { getCanonicalSiteUrl } from '@/lib/site-url';

export async function GET() {
  const siteUrl = getCanonicalSiteUrl();
  const currentDate = new Date().toISOString();
  
  // AI资讯站点的静态页面配置
  const staticPages = [
    {
      url: '',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
      description: 'AI资讯主页'
    },
    {
      url: '/posts',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
      description: 'AI文章列表'
    },
    {
      url: '/search',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
      description: 'AI内容搜索'
    },
    {
      url: '/tags',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
      description: 'AI标签分类'
    },
    {
      url: '/archives',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
      description: 'AI文章归档'
    },
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
      description: '关于斯基GPT'
    },
    {
      url: '/rss.xml',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.6,
      description: 'RSS订阅'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'noindex'
    },
  });
}