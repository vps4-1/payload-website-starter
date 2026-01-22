import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'
import { getApiBaseUrl } from '@/utilities/getURL'

// 按需刷新

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(
      `${baseUrl}/api/posts?where[slug][equals]=${slug}&limit=1`,
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
    const baseUrl = getApiBaseUrl()
    const res = await fetch(
      `${baseUrl}/api/posts?limit=5&sort=-createdAt&where[id][not_equals]=${currentPostId}`,
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
  const relatedPosts = await getRelatedPosts(post.id, keywords)

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
                    {post.title_en || post.title}
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
                  <div 
                    style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem', 
                      rowGap: '0.75rem', 
                      columnGap: '0.75rem',
                      margin: '0',
                      padding: '0'
                    }}
                  >
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
              
              {/* 英文标题 */}
              <h3 className="text-lg font-medium text-terminal-text leading-tight">
                {post.title_en || post.title}
              </h3>
              
              <div className="text-terminal-muted leading-relaxed whitespace-pre-wrap text-base">
                {post.summary_en.content}
              </div>
              
              {/* 英文标签 */}
              {post.summary_en.keywords && post.summary_en.keywords.length > 0 && (
                <div className="pt-3">
                  <h3 className="text-sm font-semibold text-terminal-text mb-2">🏷️ Related Tags</h3>
                  <div 
                    style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem', 
                      rowGap: '0.75rem', 
                      columnGap: '0.75rem',
                      margin: '0',
                      padding: '0'
                    }}
                  >
                    {post.summary_en.keywords.map((kw: any) => (
                      <Link
                        key={kw.id}
                        href={`/tags/${encodeURIComponent(kw.keyword)}`}
                        className="text-sm px-2 py-1 bg-pistachio-50 border border-pistachio-400 text-pistachio-300 hover:text-pistachio-50 hover:bg-pistachio-400 transition-all duration-200 rounded whitespace-nowrap"
                      >
                        #{kw.keyword}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </article>

        {/* 相关文章 */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4 border-t-2 border-terminal-border pt-8 mt-8">
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