import { NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/utilities/getURL'

interface Post {
  id: string
  slug: string
  title: string
  title_en?: string
  summary_zh?: {
    title?: string
    content?: string
    keywords?: Array<{ keyword: string }>
  }
  summary_en?: {
    title?: string
    content?: string
    keywords?: Array<{ keyword: string }>
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
  original_language?: string
}

interface Tag {
  keyword: string
  count?: number
}

// 获取所有文章
async function getAllPosts(): Promise<Post[]> {
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/posts?limit=1000&sort=-createdAt`, {
      next: { revalidate: 3600 } // 1小时缓存
    })
    
    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status}`)
      return []
    }
    
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    return []
  }
}

// 获取所有标签
async function getAllTags(): Promise<Tag[]> {
  try {
    const posts = await getAllPosts()
    const tagCount = new Map<string, number>()
    
    posts.forEach(post => {
      // 统计中文标签
      post.summary_zh?.keywords?.forEach(kw => {
        const current = tagCount.get(kw.keyword) || 0
        tagCount.set(kw.keyword, current + 1)
      })
      
      // 统计英文标签
      post.summary_en?.keywords?.forEach(kw => {
        const current = tagCount.get(kw.keyword) || 0
        tagCount.set(kw.keyword, current + 1)
      })
    })
    
    return Array.from(tagCount.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 500) // 限制标签数量
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error)
    return []
  }
}

// 静态页面配置 - 针对AI内容优化
const staticPages = [
  { 
    path: '/', 
    priority: 1.0, 
    changefreq: 'hourly',
    description: 'AI资讯聚合主页 - 实时更新全球AI动态'
  },
  { 
    path: '/posts', 
    priority: 0.9, 
    changefreq: 'hourly',
    description: 'AI文章列表 - 深度解读人工智能趋势'
  },
  { 
    path: '/tags', 
    priority: 0.8, 
    changefreq: 'daily',
    description: 'AI标签分类 - 按主题浏览人工智能内容'
  },
  { 
    path: '/archives', 
    priority: 0.7, 
    changefreq: 'weekly',
    description: 'AI文章归档 - 按时间浏览历史内容'
  },
  { 
    path: '/about', 
    priority: 0.5, 
    changefreq: 'monthly',
    description: '关于SijiGPT - AI驾驶员的全球资讯聚合站'
  },
  { 
    path: '/search', 
    priority: 0.6, 
    changefreq: 'weekly',
    description: 'AI内容搜索 - 快速找到相关人工智能资讯'
  },
]

// AI关键词权重计算
function calculateAIPriority(post: Post): number {
  const aiKeywords = [
    'ai', 'artificial intelligence', '人工智能', 'machine learning', '机器学习',
    'deep learning', '深度学习', 'neural network', '神经网络', 'chatgpt', 'gpt',
    'llm', 'large language model', '大语言模型', 'transformer', 'attention',
    'nlp', 'natural language processing', '自然语言处理', 'computer vision',
    '计算机视觉', 'robotics', '机器人', 'automation', '自动化'
  ]
  
  let aiScore = 0
  const title = (post.summary_zh?.title || post.title || '').toLowerCase()
  const content = (post.summary_zh?.content || '').toLowerCase()
  const titleEn = (post.title_en || '').toLowerCase()
  const contentEn = (post.summary_en?.content || '').toLowerCase()
  
  const allText = `${title} ${content} ${titleEn} ${contentEn}`
  
  aiKeywords.forEach(keyword => {
    const matches = (allText.match(new RegExp(keyword, 'gi')) || []).length
    aiScore += matches
  })
  
  // 基础优先级 + AI相关度加成
  const basePriority = 0.8
  const aiBonus = Math.min(aiScore * 0.05, 0.15) // 最多+0.15
  
  return Math.min(basePriority + aiBonus, 0.95)
}

// 生成sitemap XML
function generateSitemap(posts: Post[], tags: Tag[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com'
  const currentDate = new Date().toISOString()
  
  // 静态页面 URLs
  const staticUrls = staticPages
    .map(page => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
    .join('\n')
  
  // 文章 URLs - 按AI相关度排序
  const sortedPosts = posts
    .sort((a, b) => {
      const priorityA = calculateAIPriority(a)
      const priorityB = calculateAIPriority(b)
      return priorityB - priorityA
    })
    .slice(0, 10000) // 限制文章数量
  
  const postUrls = sortedPosts
    .map(post => {
      const lastmod = post.updatedAt || post.publishedAt || post.createdAt
      const priority = calculateAIPriority(post)
      const changefreq = isRecentPost(lastmod) ? 'weekly' : 'monthly'
      
      return `  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`
    })
    .join('\n')
  
  // 标签 URLs - 只包含热门AI相关标签
  const aiTags = tags
    .filter(tag => {
      const keyword = tag.keyword.toLowerCase()
      return keyword.includes('ai') || keyword.includes('人工智能') ||
             keyword.includes('machine') || keyword.includes('deep') ||
             keyword.includes('neural') || keyword.includes('gpt') ||
             keyword.includes('模型') || keyword.includes('算法') ||
             (tag.count && tag.count >= 5) // 或者使用频率高的标签
    })
    .slice(0, 200) // 限制标签数量
  
  const tagUrls = aiTags
    .map(tag => {
      const encodedTag = encodeURIComponent(tag.keyword)
      const priority = Math.min(0.6 + (tag.count || 0) * 0.01, 0.8)
      
      return `  <url>
    <loc>${siteUrl}/tags/${encodedTag}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`
    })
    .join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrls}
${postUrls}
${tagUrls}
</urlset>`
}

// 检查是否为近期文章
function isRecentPost(dateString: string): boolean {
  const postDate = new Date(dateString)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return postDate > thirtyDaysAgo
}

export async function GET() {
  try {
    const [posts, tags] = await Promise.all([
      getAllPosts(),
      getAllTags()
    ])
    
    const sitemap = generateSitemap(posts, tags)
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200', // 1-2小时缓存
        'X-Robots-Tag': 'index, follow',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // 失败时返回基础sitemap
    const fallbackSitemap = generateSitemap([], [])
    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5分钟缓存
      },
    })
  }
}
