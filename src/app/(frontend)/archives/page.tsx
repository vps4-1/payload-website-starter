import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

export const metadata = {
  title: '文章归档 - SijiGPT',
  description: '按时间归档的所有AI资讯文章，便于浏览历史内容',
  keywords: 'AI资讯归档, 人工智能文章, 历史内容, SijiGPT',
}

// ✅ 纯 ISR：不设置 revalidate，完全按需刷新
// 只有调用 revalidatePath('/archives') 时才更新

async function getArchives() {
  try {
    const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
    
    const res = await fetch(
      `${NEXT_PUBLIC_SERVER_URL}/api/posts?limit=1000&sort=-createdAt`,
      { 
        next: { tags: ['posts'] }  // 支持 revalidateTag('posts')
      }
    )
    
    if (!res.ok) throw new Error('Failed to fetch')
    
    const data = await res.json()
    const posts = data.docs || []
    
    // 按年月分组
    const archives: Record<string, any[]> = {}
    
    posts.forEach((post: any) => {
      const date = new Date(post.createdAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const key = `${year}-${month}`
      
      if (!archives[key]) {
        archives[key] = []
      }
      archives[key].push(post)
    })
    
    return {
      archives,
      totalDocs: data.totalDocs || 0
    }
  } catch (error) {
    console.error('Failed to fetch archives:', error)
    return { archives: {}, totalDocs: 0 }
  }
}

export default async function ArchivesPage() {
  const { archives, totalDocs } = await getArchives()
  
  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        {/* 页面介绍 */}
        <div className="mb-4" style={{ textAlign: 'center' }}>
          <p className="text-lg text-terminal-text mb-2">
            📚 文章归档 | 按时间浏览历史内容
          </p>
        </div>
        
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <p className="text-terminal-muted text-sm">
            共收录 {totalDocs} 篇文章 · 按月份归档整理
          </p>
        </div>

        <SubscribeSection />
        
        {/* 归档内容 */}
        <div className="space-y-8">
          {Object.entries(archives)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, posts]) => (
              <section key={month} className="space-y-4">
                <h2 className="text-xl font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
                  📅 {month.replace('-', '年')}月 ({posts.length}篇)
                </h2>
                
                <div className="grid gap-3 ml-6">
                  {posts.map((post: any) => (
                    <article key={post.id} className="flex items-start gap-4 py-2 border-b border-terminal-border/30">
                      <time className="text-sm text-terminal-muted whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </time>
                      
                      <div className="flex-1">
                        <h3>
                          <Link 
                            href={`/posts/${post.slug}`}
                            className="text-terminal-text hover:text-pistachio-400 transition-colors font-medium"
                          >
                            {post.summary_zh?.title || post.title}
                          </Link>
                        </h3>
                        
                        {/* 标签 */}
                        {post.summary_zh?.keywords && post.summary_zh.keywords.length > 0 && (
                          <div className="flex flex-wrap mt-1" style={{ gap: '0.3rem' }}>
                            {post.summary_zh.keywords.slice(0, 3).map((kw: any) => (
                              <Link
                                key={kw.id}
                                href={`/tags/${encodeURIComponent(kw.keyword)}`}
                                className="text-xs text-pistachio-300 hover:text-pistachio-400 hover:underline"
                              >
                                #{kw.keyword}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          
          {Object.keys(archives).length === 0 && (
            <div className="text-center py-12">
              <p className="text-terminal-muted">📂 暂无文章归档</p>
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