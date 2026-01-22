import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'
import { getApiBaseUrl } from '@/utilities/getURL'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPostsByTag(tag: string) {
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(
      `${baseUrl}/api/posts?limit=100&sort=-createdAt`,
      { next: { revalidate: 0, tags: [] } }
    )

    if (!res.ok) return []

    const data = await res.json()
    const posts = data.docs || []

    return posts.filter((post: any) => {
      const zhKeywords = post.summary_zh?.keywords?.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ) || []
      const enKeywords = post.summary_en?.keywords?.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ) || []

      return [...zhKeywords, ...enKeywords].some((keyword: string) => 
        keyword.toLowerCase() === tag.toLowerCase()
      )
    })
  } catch (error) {
    console.error('Failed to fetch posts by tag:', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  
  return {
    title: `#${tag} - SijiGPT`,
    description: `浏览所有关于"${tag}"的AI资讯文章`,
    keywords: `${tag}, AI资讯, 人工智能, SijiGPT`,
    openGraph: {
      title: `#${tag} - SijiGPT`,
      description: `浏览所有关于"${tag}"的AI资讯文章`,
      type: 'website',
    },
  }
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  const posts = await getPostsByTag(tag)

  if (posts.length === 0) {
    return (
      <TerminalLayout customHeader={<SiteHeader />}>
        <div style={{ marginTop: '-1rem' }} className="mb-4">
          {/* header下方细线 */}
          <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
          
          {/* 页面介绍 */}
          <div className="mb-4" style={{ textAlign: 'center' }}>
            <p className="text-lg text-terminal-text mb-2">
              🏷️ 标签: #{tag}
            </p>
          </div>
          
          <div className="mb-6" style={{ textAlign: 'center' }}>
            <p className="text-terminal-muted text-sm">
              该标签下暂无文章
            </p>
          </div>

          <SubscribeSection />
          
          <div className="text-center py-12">
            <p className="text-terminal-muted mb-4">😅 暂时没有关于 "#{tag}" 的文章</p>
            <Link
              href="/tags"
              className="inline-block px-6 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors rounded"
            >
              浏览所有标签 →
            </Link>
          </div>
        </div>
      </TerminalLayout>
    )
  }

  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        {/* 页面介绍 */}
        <div className="mb-4" style={{ textAlign: 'center' }}>
          <p className="text-lg text-terminal-text mb-2">
            🏷️ 标签: #{tag}
          </p>
        </div>
        
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <p className="text-terminal-muted text-sm">
            共找到 {posts.length} 篇相关文章
          </p>
        </div>

        <SubscribeSection />
        
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-2 text-sm text-terminal-muted mb-6">
          <Link href="/" className="text-pistachio-400 hover:text-pistachio-300">首页</Link>
          <span>→</span>
          <Link href="/tags" className="text-pistachio-400 hover:text-pistachio-300">标签</Link>
          <span>→</span>
          <span className="text-pistachio-400">#{tag}</span>
        </nav>
        
        {/* 文章列表 */}
        <div className="space-y-6">
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
                        className={`text-sm hover:underline whitespace-nowrap ${
                          kw.keyword.toLowerCase() === tag.toLowerCase() 
                            ? 'text-pistachio-400 font-bold' 
                            : 'text-pistachio-300 hover:text-pistachio-400'
                        }`}
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
        </div>

        {/* 相关标签 */}
        <div className="mt-8 pt-6 border-t border-terminal-border">
          <h3 className="text-lg font-bold text-pistachio-400 mb-4">🔗 相关标签</h3>
          <div className="text-center">
            <Link
              href="/tags"
              className="inline-block px-6 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors rounded"
            >
              浏览所有标签 →
            </Link>
          </div>
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