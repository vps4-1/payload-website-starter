import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

// 按需刷新

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?where[slug][equals]=${slug}&limit=1`,
      { next: { revalidate: 0 } }
    )
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('获取文章失败:', error)
    return null
  }
}

async function getRelatedPosts(currentPostId: string, keywords: string[] = []) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=5&sort=-createdAt&where[id][not_equals]=${currentPostId}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('获取相关文章失败:', error)
    return []
  }
}

async function getAdjacentPosts(currentSlug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=100&sort=-createdAt`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    const posts = data.docs || []
    
    const currentIndex = posts.findIndex((p: any) => p.slug === currentSlug)
    if (currentIndex === -1) return { prevPost: null, nextPost: null }
    
    return {
      prevPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
      nextPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
    }
  } catch (error) {
    console.error('获取相邻文章失败:', error)
    return { prevPost: null, nextPost: null }
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: '文章不存在 - SijiGPT',
      description: '您访问的文章不存在或已被删除'
    }
  }

  return {
    title: `${post.summary_zh?.title || post.title} - SijiGPT`,
    description: post.summary_zh?.content?.substring(0, 160) || post.title,
    keywords: post.summary_zh?.keywords?.map((kw: any) => kw.keyword).join(', ') || '',
    openGraph: {
      title: post.summary_zh?.title || post.title,
      description: post.summary_zh?.content?.substring(0, 160) || post.title,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors: ['SijiGPT'],
      tags: post.summary_zh?.keywords?.map((kw: any) => kw.keyword) || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.summary_zh?.title || post.title,
      description: post.summary_zh?.content?.substring(0, 160) || post.title,
    }
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const keywords = post.summary_zh?.keywords?.map((kw: any) => kw.keyword) || []
  const [relatedPosts, { prevPost, nextPost }] = await Promise.all([
    getRelatedPosts(post.id, keywords),
    getAdjacentPosts(slug)
  ])

  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        <SubscribeSection />

        <article className="space-y-6">
          {/* 文章标题 */}
          <header className="space-y-4">
            <h1 className="text-2xl font-bold text-pistachio-400 leading-tight">
              {post.summary_zh?.title || post.title}
            </h1>

            <div className="text-terminal-muted text-sm space-y-2">
              {post.source?.url && (
                <p>
                  <span className="text-pistachio-300">出处:</span>{' '}
                  <a
                    href={post.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pistachio-400 hover:text-pistachio-300 hover:underline transition-colors"
                  >
                    {post.source.name || 'Unknown'}
                  </a>
                </p>
              )}
              <p>
                <span className="text-pistachio-300">发布:</span>{' '}
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </header>

          {/* 中文摘要 */}
          {post.summary_zh?.content && (
            <section className="border-l-4 border-pistachio-400 pl-6 space-y-4">
              <h2 className="text-lg font-semibold text-pistachio-400">📄 中文摘要</h2>
              <div className="text-terminal-text leading-relaxed whitespace-pre-wrap text-base">
                {post.summary_zh.content}
              </div>
              
              {/* 标签 */}
              {post.summary_zh.keywords && post.summary_zh.keywords.length > 0 && (
                <div className="pt-3">
                  <h3 className="text-sm font-semibold text-pistachio-300 mb-2">🏷️ 相关标签</h3>
                  <div className="flex flex-wrap" style={{ gap: '0.3rem' }}>
                    {post.summary_zh.keywords.map((kw: any) => (
                      <Link
                        key={kw.id}
                        href={`/tags/${encodeURIComponent(kw.keyword)}`}
                        className="text-sm px-2 py-1 bg-terminal-bg border border-pistachio-400 text-pistachio-300 hover:text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
                      >
                        #{kw.keyword}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 英文摘要 */}
          {post.summary_en?.content && (
            <section className="border-l-4 border-terminal-border pl-6 space-y-4">
              <h2 className="text-lg font-semibold text-terminal-text">📄 English Summary</h2>
              <div className="text-terminal-muted leading-relaxed whitespace-pre-wrap text-base">
                {post.summary_en.content}
              </div>
            </section>
          )}
        </article>

        {/* 上一篇下一篇导航 */}
        <nav className="flex justify-between items-center py-8 border-t-2 border-terminal-border mt-8">
          <div className="flex-1">
            {prevPost && (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="group flex items-center gap-2 text-terminal-muted hover:text-pistachio-400 transition-colors"
              >
                <span className="text-lg">←</span>
                <div>
                  <div className="text-xs text-terminal-muted">上一篇</div>
                  <div className="group-hover:text-pistachio-400 transition-colors line-clamp-1">
                    {prevPost.summary_zh?.title || prevPost.title}
                  </div>
                </div>
              </Link>
            )}
          </div>
          
          <div className="flex-1 text-right">
            {nextPost && (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group flex items-center justify-end gap-2 text-terminal-muted hover:text-pistachio-400 transition-colors"
              >
                <div className="text-right">
                  <div className="text-xs text-terminal-muted">下一篇</div>
                  <div className="group-hover:text-pistachio-400 transition-colors line-clamp-1">
                    {nextPost.summary_zh?.title || nextPost.title}
                  </div>
                </div>
                <span className="text-lg">→</span>
              </Link>
            )}
          </div>
        </nav>

        {/* 相关文章 */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4 border-t-2 border-terminal-border pt-8">
            <h2 className="text-xl font-bold text-pistachio-400 mb-4">📚 相关文章</h2>
            <div className="space-y-4">
              {relatedPosts.slice(0, 3).map((relatedPost: any) => (
                <article key={relatedPost.id} className="border-l-2 border-pistachio-400 pl-4 space-y-2">
                  <h3>
                    <Link 
                      href={`/posts/${relatedPost.slug}`}
                      className="text-pistachio-400 hover:text-pistachio-300 text-base font-medium transition-colors"
                    >
                      {relatedPost.summary_zh?.title || relatedPost.title}
                    </Link>
                  </h3>
                  
                  <div className="text-terminal-muted text-sm">
                    {new Date(relatedPost.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                  
                  {relatedPost.summary_zh?.content && (
                    <p className="text-terminal-muted text-sm line-clamp-2">
                      {relatedPost.summary_zh.content.substring(0, 120)}...
                    </p>
                  )}
                </article>
              ))}
            </div>
            
            <div className="text-center pt-4">
              <Link
                href="/posts"
                className="inline-block px-6 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors rounded"
              >
                查看更多文章 →
              </Link>
            </div>
          </section>
        )}

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