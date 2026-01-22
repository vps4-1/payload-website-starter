import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

export const metadata = {
  title: '全部文章 - SijiGPT',
  description: '浏览SijiGPT的所有AI资讯文章',
  keywords: 'AI文章, 人工智能资讯, 机器学习, SijiGPT',
}

// 按需刷新：只有调用 revalidate API 时才更新

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=20&sort=-createdAt`, { 
      next: { revalidate: 0, tags: ['posts'] } 
    })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return {
      posts: data.docs || [],
      totalDocs: data.totalDocs || 0,
      hasMore: data.hasNextPage || false
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    return { posts: [], totalDocs: 0, hasMore: false }
  }
}

export default async function PostsPage() {
  const { posts, totalDocs, hasMore } = await getPosts()

  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        {/* 页面介绍 */}
        <div className="mb-4" style={{ textAlign: 'center' }}>
          <p className="text-lg text-terminal-text mb-2">
            📚 全部文章 | 最新AI资讯
          </p>
        </div>
        
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <p className="text-terminal-muted text-sm">
            共 {totalDocs} 篇文章 · 每天 4 次更新 · AI 智能筛选 · 双语摘要
          </p>
        </div>

        <SubscribeSection />
        
        {/* 文章列表 */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-terminal-muted">📄 暂无文章</p>
            </div>
          ) : (
            <>
              {posts.map((post: any, index: number) => (
                <article 
                  key={post.id} 
                  className="py-4" 
                  style={{ 
                    borderBottom: index < posts.length - 1 ? '2px solid var(--terminal-border)' : 'none',
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem'
                  }}
                >
                  <div className="space-y-2">
                    {/* 第一行：日期 */}
                    <div className="text-xs text-terminal-muted">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </div>

                    {/* 第二行：标题 */}
                    <h2 className="text-lg font-semibold text-terminal-text hover:text-pistachio-400 transition-colors">
                      <Link href={`/posts/${post.slug}`}>
                        {post.summary_zh?.title || post.title}
                      </Link>
                    </h2>

                    {/* 第三行：摘要 */}
                    {post.summary_zh?.content && (
                      <Link 
                        href={`/posts/${post.slug}`} 
                        className="block text-terminal-muted hover:text-terminal-text transition-colors"
                      >
                        <p className="line-clamp-2">
                          {post.summary_zh.content.substring(0, 200)}...
                        </p>
                      </Link>
                    )}
                    
                    {/* 第四行：标签 */}
                    {post.summary_zh?.keywords && post.summary_zh.keywords.length > 0 && (
                      <div 
                        className="flex flex-wrap pt-1" 
                        style={{ 
                          gap: '0.3rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          paddingTop: '0.25rem'
                        }}
                      >
                        {post.summary_zh.keywords.slice(0, 5).map((kw: any) => (
                          <Link
                            key={kw.id}
                            href={`/tags/${encodeURIComponent(kw.keyword)}`}
                            className="text-sm text-pistachio-300 hover:text-pistachio-400 hover:underline whitespace-nowrap"
                            style={{ marginRight: '0.2rem', marginBottom: '0.2rem' }}
                          >
                            #{kw.keyword}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}

              {/* 分页导航 */}
              <div className="flex justify-center items-center gap-4 pt-8">
                <Link
                  href="/"
                  className="px-6 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors rounded"
                >
                  ← 返回首页
                </Link>
                
                {hasMore && (
                  <div className="text-terminal-muted text-sm">
                    更多文章请返回首页使用无限滚动浏览
                  </div>
                )}
              </div>
            </>
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