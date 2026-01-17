import type { Metadata } from 'next'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  title: '文章列表 - SiJiGPT',
  description: '浏览所有 AI 相关文章'
}

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  const payload = await getPayload({ config: configPromise })
  
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50,
    sort: '-publishedAt',
  })

  return (
    <TerminalLayout title="SiJiGPT">
      <div className="terminal-section">
        <h1>$ ls posts/ --sort-by date</h1>
        
        <div className="terminal-output">
          <p>共找到 {posts.totalDocs} 篇文章</p>
        </div>

        <nav className="terminal-nav">
          <Link href="/tags" className="terminal-button">标签</Link>
          <Link href="/archives" className="terminal-button">归档</Link>
          <Link href="/about" className="terminal-button">关于</Link>
          <Link href="/rss.xml" className="terminal-button">RSS</Link>
        </nav>

        <div className="posts-list">
          {posts.docs.map((post: any) => (
            <article key={post.id} className="post-item">
              <h2>
                <Link href={`/posts/${post.slug}`}>
                  {post.title || post.title_en}
                </Link>
              </h2>
              
              <div className="post-meta">
                <time>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('zh-CN')}
                </time>
                {post.source?.name && (
                  <>
                    <span className="separator">•</span>
                    <span>{post.source.name}</span>
                  </>
                )}
              </div>

              {post.description && (
                <p className="post-description">{post.description}</p>
              )}

              <Link href={`/posts/${post.slug}`} className="terminal-link">
                阅读全文 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </TerminalLayout>
  )
}
