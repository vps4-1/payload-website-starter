import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'
import { getApiBaseUrl } from '@/utilities/getURL'

export const metadata = {
  title: '文章归档 - SijiGPT',
  description: '按时间归档的所有AI资讯文章，便于浏览历史内容',
  keywords: 'AI资讯归档, 人工智能文章, 历史内容, SijiGPT',
}

// ✅ 纯 ISR：不设置 revalidate，完全按需刷新
// 只有调用 revalidatePath('/archives') 时才更新

async function getArchives() {
  try {
    const baseUrl = getApiBaseUrl()
    
    const res = await fetch(
      `${baseUrl}/api/posts?limit=1000&sort=-createdAt`,
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
              <section key={month} className="space-y-2">
                <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4 mb-2">
                  📅 {month.replace('-', '年')}月 ({posts.length}篇)
                </h2>
                
                <div style={{ marginLeft: '1.5rem' }}>
                  {posts
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post: any) => (
                    <div 
                      key={post.id} 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.125rem 0',
                        fontSize: '0.875rem',
                        lineHeight: '1.2'
                      }}
                    >
                      <time 
                        style={{ 
                          color: 'var(--terminal-muted)',
                          fontFamily: 'monospace',
                          width: '3rem',
                          flexShrink: 0
                        }}
                      >
                        {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </time>
                      
                      <Link 
                        href={`/posts/${post.slug}`}
                        style={{ 
                          color: 'var(--terminal-text)',
                          textDecoration: 'none',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.2s ease'
                        }}
                        className="hover:text-pistachio-400"
                      >
                        {post.summary_zh?.title || post.title}
                      </Link>
                    </div>
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