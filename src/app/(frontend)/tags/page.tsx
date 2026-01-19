import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: '标签 - SijiGPT',
  description: '所有文章标签',
}

// ✅ 纯 ISR：不设置 revalidate，完全按需刷新

async function getTags() {
  try {
    const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
    
    const res = await fetch(
      `${NEXT_PUBLIC_SERVER_URL}/api/posts?limit=1000`,
      { 
        next: { tags: ['posts'] }
      }
    )
    
    if (!res.ok) throw new Error('Failed to fetch')
    
    const data = await res.json()
    const posts = data.docs || []
    
    // 统计标签出现次数
    const tagCount: Record<string, number> = {}
    
    posts.forEach((post: any) => {
      const keywords = post.summary_zh?.keywords || []
      keywords.forEach((kw: any) => {
        const keyword = kw.keyword
        if (keyword) {
          tagCount[keyword] = (tagCount[keyword] || 0) + 1
        }
      })
    })
    
    return {
      tags: Object.entries(tagCount)
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count),
      totalDocs: data.totalDocs || 0
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return { tags: [], totalDocs: 0 }
  }
}

export default async function TagsPage() {
  const { tags, totalDocs } = await getTags()
  
  return (
    <TerminalLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl text-pistachio-400 border-b border-terminal-border pb-2">
            标签
          </h1>
          
          <div className="text-terminal-muted text-sm">
            <span className="text-pistachio-400">$ ls -la tags/</span>
            <p className="pl-4 mt-1">共 {tags.length} 个标签，来自 {totalDocs} 篇文章</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {tags.map(({ keyword, count }) => (
            <Link
              key={keyword}
              href={`/tags/${encodeURIComponent(keyword)}`}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 rounded-lg hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200"
            >
              <span className="text-pistachio-400 hover:text-terminal-bg font-medium">
                #{keyword}
              </span>
              <span className="text-xs text-terminal-muted">({count})</span>
            </Link>
          ))}
          
          {tags.length === 0 && (
            <p className="text-terminal-muted">暂无标签</p>
          )}
        </div>
      </div>
    </TerminalLayout>
  )
}
