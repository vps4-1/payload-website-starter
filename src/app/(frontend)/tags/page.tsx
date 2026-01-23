import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'
import { getApiBaseUrl } from '@/utilities/getURL'

export const metadata = {
  title: '文章标签 - SijiGPT',
  description: '浏览所有AI资讯文章的标签分类，快速找到感兴趣的内容',
  keywords: 'AI标签, 文章分类, 人工智能, 机器学习, SijiGPT',
}

// ✅ 纯 ISR：不设置 revalidate，完全按需刷新

async function getTags() {
  try {
    const baseUrl = getApiBaseUrl()
    
    const res = await fetch(
      `${baseUrl}/api/frontend-posts?limit=1000`,
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
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        {/* 页面介绍 */}
        <div className="mb-4" style={{ textAlign: 'center' }}>
          <p className="text-lg text-terminal-text mb-2">
            🏷️ 文章标签 | 按主题分类浏览
          </p>
        </div>
        
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <p className="text-terminal-muted text-sm">
            共 {tags.length} 个标签，来自 {totalDocs} 篇文章
          </p>
        </div>

        <SubscribeSection />
        
        {/* 标签云 */}
        <div className="space-y-6">
          {/* 热门标签 */}
          {tags.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
                🔥 热门标签 (前20个)
              </h2>
              
              <div 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                {tags.slice(0, 20).map(({ keyword, count }) => (
                  <Link
                    key={keyword}
                    href={`/tags/${encodeURIComponent(keyword)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded text-sm"
                  >
                    <span>#{keyword}</span>
                    <span className="text-xs opacity-70">({count})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          {/* 所有标签 */}
          {tags.length > 20 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
                📚 所有标签 (按使用频率排序)
              </h2>
              
              <div 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.75rem'
                }}
              >
                {tags.map(({ keyword, count }) => (
                  <Link
                    key={keyword}
                    href={`/tags/${encodeURIComponent(keyword)}`}
                    className="inline-flex items-center justify-between px-3 py-2 border border-terminal-border text-terminal-text hover:border-pistachio-400 hover:text-pistachio-400 transition-all duration-200 rounded text-sm gap-2"
                  >
                    <span>#{keyword}</span>
                    <span className="text-xs text-terminal-muted">({count})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          {tags.length === 0 && (
            <div className="text-center py-12">
              <p className="text-terminal-muted">🏷️ 暂无标签数据</p>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="pt-8 text-terminal-muted text-sm text-center border-t border-terminal-border">
          <p>Powered by Cloudflare Workers + Payload CMS + Claude 3.5</p>
          <p className="mt-1">
            数据源: OpenAI, Google AI, DeepMind, AWS ML Blog, HuggingFace 等
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}