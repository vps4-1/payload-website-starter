import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: 'SiJiGPT - 你的 AI 资讯驾驶员',
  description: '聚合全球优质 AI 资讯，提供中英双语深度解读',
}

// 按需刷新
export const revalidate = false

async function getPosts(limit = 50) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=${limit}&sort=-createdAt`)
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
        {/* Header */}
        <div className="space-y-4">
          <pre className="text-pistachio-400 text-sm overflow-x-auto">
{`
   _____ _ _ _  _____  _____ _______ 
  / ____(_|_|_)/ ____|/ ____|__   __|
 | (___  _ _  | |  __| |  __   | |   
  \\___ \\| | | | | |_ | | |_ |  | |   
  ____) | | | | |__| | |__| |  | |   
 |_____/|_| |_|\\_____|\\_____|  |_|   
`}
          </pre>
          
          <div className="text-terminal-muted">
            <span className="text-pistachio-400">$ whoami</span>
            <p className="pl-4 mt-1">
              SiJiGPT - 你的 AI 资讯驾驶员 | 聚合全球优质 AI 资讯
            </p>
          </div>

          <div className="text-terminal-muted text-sm">
            <span className="text-pistachio-400">$ ls -la posts/</span>
            <p className="pl-4 mt-1">
              共 {totalDocs} 篇文章 · 每天 4 次更新 · AI 智能筛选 · 双语摘要
            </p>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-6">
          <h2 className="text-xl text-pistachio-400 border-b border-terminal-border pb-2">
            最新文章
          </h2>
          
          {posts.length === 0 ? (
            <p className="text-terminal-muted">
              文章正在聚合中，Worker 每天会自动发布新内容...
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any, index: number) => (
                <div key={post.id} className="border-l-2 border-pistachio-400 pl-4 hover:border-pistachio-300 transition-colors">
                  <div className="flex items-center gap-2 text-terminal-muted text-sm">
                    <span className="text-pistachio-300">#{index + 1}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="text-pistachio-400 hover:text-pistachio-300 text-lg block mt-1 font-medium"
                  >
                    {post.title}
                  </Link>
                  
                  {post.title_en && (
                    <div className="text-terminal-muted text-sm mt-1">
                      {post.title_en}
                    </div>
                  )}
                  
                  {post.summary_zh?.content && (
                    <p className="text-terminal-text mt-2 line-clamp-2">
                      {post.summary_zh.content.substring(0, 150)}...
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-2">
                    {post.summary_zh?.keywords?.slice(0, 5).map((kw: any) => (
                      <Link
                        key={kw.id}
                        href={`/tags/${encodeURIComponent(kw.keyword)}`}
                        className="text-xs text-pistachio-300 hover:text-pistachio-400 hover:underline whitespace-nowrap"
                      >
                        #{kw.keyword}
                      </Link>
                    ))}
                  </div>
                </div>
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

        {/* 底部导航 */}
        <div className="pt-8 border-t border-terminal-border space-y-2">
          <div className="text-pistachio-400">$ ls -la</div>
          <div className="pl-4 space-y-1 text-sm">
            <Link href="/posts" className="block hover:text-pistachio-300">
              drwxr-xr-x <span className="text-pistachio-400">posts/</span> - 所有文章
            </Link>
            <Link href="/tags" className="block hover:text-pistachio-300">
              drwxr-xr-x <span className="text-pistachio-400">tags/</span> - 标签分类
            </Link>
            <Link href="/archives" className="block hover:text-pistachio-300">
              drwxr-xr-x <span className="text-pistachio-400">archives/</span> - 时间归档
            </Link>
            <a href="/rss.xml" className="block hover:text-pistachio-300" target="_blank">
              -rw-r--r-- <span className="text-terminal-text">rss.xml</span> - RSS 订阅
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
