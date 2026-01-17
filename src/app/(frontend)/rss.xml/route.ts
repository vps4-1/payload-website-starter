import { NextResponse } from 'next/server'

// 文章数据（与 posts/page.tsx 保持一致）
const posts = [
  {
    id: '1',
    slug: 'zenken-chatgpt-enterprise',
    title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
    publishedAt: '2026-01-15T00:00:00.000Z',
    description: 'Zenken 采用 ChatGPT Enterprise 革新销售流程，实现精简团队的规模化增长。日本数字营销公司 Zenken 面临着一个独特的挑战：如何在维持精简团队的同时扩大销售运营。',
    author: 'OpenAI Team',
  },
  {
    id: '2',
    slug: 'alibaba-tongyi-qianwen-3',
    title: '阿里云发布通义千问3.0大模型',
    publishedAt: '2026-01-14T00:00:00.000Z',
    description: '通义千问 3.0 在中文理解、逻辑推理和代码生成能力上实现显著提升。阿里云正式发布通义千问 3.0 大语言模型，这是中国企业在大模型领域的又一重要突破。',
    author: '阿里云团队',
  },
]

function generateRSS() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com'
  const buildDate = new Date().toUTCString()

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`
      const pubDate = new Date(post.publishedAt).toUTCString()

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
    </item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SiJiGPT - AI驾驶员的全球资讯聚合站</title>
    <link>${siteUrl}</link>
    <description>本站为AI驾驶员们提供全球AI硬件软件资讯聚合，助力驾驶技术越来越好</description>
    <language>zh-CN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`
}

export async function GET() {
  const rss = generateRSS()

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
