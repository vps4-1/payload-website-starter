import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: 'SijiGPT - 斯基GPT - 你的 AI 资讯驾驶员',
  description: '聚合全球优质 AI 资讯，提供中英双语深度解读',
}

// 按需刷新

async function getPosts(limit = 50) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=${limit}&sort=-createdAt`, { next: { revalidate: 0, tags: [] } })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return {
      posts: data.docs || [],
      hasMore: data.hasNextPage || false,
      totalDocs: data.totalDocs || 0
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    return { posts: [], hasMore: false, totalDocs: 0 }
  }
}

export default async function HomePage() {
  const { posts, hasMore, totalDocs } = await getPosts(50)

  return (
    <TerminalLayout>
      <div className="space-y-8">
        {/* 导航栏 */}
        <nav className="flex items-center justify-center gap-8 text-lg font-bold border-4 border-pistachio-400 px-8 py-4 mb-8 bg-terminal-bg-secondary shadow-lg rounded-lg" style={{ borderRadius: 'var(--radius)' }}>
          <Link href="/" className="text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg px-4 py-2 transition-all duration-200 rounded">主页</Link>
          <span className="text-terminal-gray">|</span>
          <Link href="/posts" className="text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg px-4 py-2 transition-all duration-200 rounded">文章</Link>
          <span className="text-terminal-gray">|</span>
          <Link href="/tags" className="text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg px-4 py-2 transition-all duration-200 rounded">标签</Link>
          <span className="text-terminal-gray">|</span>
          <Link href="/archives" className="text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg px-4 py-2 transition-all duration-200 rounded">归档</Link>
          <span className="text-terminal-gray">|</span>
          <Link href="/rss.xml" className="text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg px-4 py-2 transition-all duration-200 rounded">RSS</Link>
        </nav>

        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-pistachio-400">斯基GPT</h1>
          
          <div className="text-terminal-muted">
            <p className="text-lg">
              你的 AI 资讯驾驶员 | 聚合全球优质 AI 资讯
            </p>
          </div>

          <div className="text-terminal-muted text-sm">
            <p>
              共 {totalDocs} 篇文章 · 每天 4 次更新 · AI 智能筛选 · 双语摘要
            </p>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-6">
          
          {posts.length === 0 ? (
            <div className="space-y-4 text-center py-12">
              <div className="text-pistachio-400 text-lg">
                <pre className="text-sm">
{`
  📡 正在聚合中...
  
  [ ████████████████████████████████ ] 100%
`}
                </pre>
              </div>
              <p className="text-terminal-muted">
                Worker 每天自动发布新内容，AI 智能筛选全球优质资讯
              </p>
              <div className="text-terminal-muted text-sm">
                数据源: OpenAI • Google AI • DeepMind • AWS ML Blog • HuggingFace
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post: any, index: number) => (
                <React.Fragment key={post.id}>
                  <article className="border-l-2 border-pistachio-400 pl-4 space-y-2">
                    {/* 第一行：标题 */}
                    <h3>
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="text-pistachio-400 hover:text-pistachio-300 text-lg font-medium"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    
                    {/* 第二行：发布时间 + 出处 */}
                    <div className="text-terminal-muted text-sm flex flex-wrap items-center gap-2">
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                      {post.source?.url && (
                        <>
                          <span>·</span>
                          <a
                            href={post.source.url}
                            target="_blank"
                            rel="noopener"
                            className="text-pistachio-300 hover:text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg px-3 py-1 rounded transition-all duration-200"
                          >
                            {post.source.name || 'Unknown'}
                          </a>
                        </>
                      )}
                    </div>
                    
                    {/* 第三行：摘要（带链接） */}
                    {post.summary_zh?.content && (
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="block text-terminal-text hover:text-pistachio-400 transition-colors"
                      >
                        <p className="line-clamp-2">
                          {post.summary_zh.content.substring(0, 200)}...
                        </p>
                      </Link>
                    )}
                    
                    {/* 第四行：标签 */}
                    {post.summary_zh?.keywords && post.summary_zh.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {post.summary_zh.keywords.slice(0, 5).map((kw: any) => (
                          <Link
                            key={kw.id}
                            href={`/tags/${encodeURIComponent(kw.keyword)}`}
                            className="text-sm text-pistachio-300 hover:text-pistachio-400 hover:underline whitespace-nowrap"
                          >
                            #{kw.keyword}
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                  
                  {/* 分割线（最后一篇不显示） */}
                  {index < posts.length - 1 && (
                    <hr className="border-terminal-border" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* 加载更多提示 */}
          {hasMore && (
            <div className="text-center pt-4">
              <Link
                href="/posts"
                className="inline-block px-6 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors"
              >
                查看更多文章 →
              </Link>
            </div>
          )}
        </div>

        {/* 订阅服务 */}
        <div className="pt-8 border-t border-terminal-border space-y-4">
          <div className="text-pistachio-400 text-center">$ 订阅我们</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://t.me/sijigpt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded"
            >
              <span>📱</span>
              <span>Telegram 频道</span>
            </a>
            
            <a 
              href="mailto:subscribe@sijigpt.com" 
              className="flex items-center justify-center gap-2 p-4 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded"
            >
              <span>📧</span>
              <span>邮件订阅</span>
            </a>
            
            <a 
              href="https://notion.so/sijigpt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded"
            >
              <span>📄</span>
              <span>Notion 订阅</span>
            </a>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="pt-4 text-terminal-muted text-sm">
          <p>Powered by Cloudflare Workers + Payload CMS + Claude 3.5</p>
          <p className="mt-1">
            数据源: OpenAI, Google AI, DeepMind, AWS ML Blog, HuggingFace 等
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}
