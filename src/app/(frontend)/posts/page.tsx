import type { Metadata } from 'next'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata: Metadata = {
  title: 'AI 资讯 - SiJiGPT',
  description: 'AI驾驶员的全球资讯聚合站 - 最新 AI 硬件软件资讯',
}

// 示例文章列表
const mockPosts = [
  {
    id: '1',
    slug: 'zenken-chatgpt-enterprise',
    title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
    publishedAt: '2026-01-15',
    source: { name: 'OpenAI Blog' },
    description: 'Zenken 采用 ChatGPT Enterprise 革新销售流程，实现精简团队的规模化增长...',
  },
  {
    id: '2',
    slug: 'alibaba-tongyi-qianwen-3',
    title: '阿里云发布通义千问3.0大模型',
    publishedAt: '2026-01-14',
    source: { name: '阿里云官方博客' },
    description: '通义千问 3.0 在中文理解、逻辑推理和代码生成能力上实现显著提升...',
  },
]

export default function PostsPage() {
  return (
    <TerminalLayout title="SiJiGPT">
      <div className="posts-page">
        <header className="posts-header">
          <h1>$ ls posts/ --sort-by date</h1>
          <p className="posts-subtitle">
            AI驾驶员的全球资讯聚合站 🚗💨
          </p>
        </header>

        <div className="posts-list">
          {mockPosts.map((post) => (
            <article key={post.id} className="post-card framed">
              <h2>
                <a href={`/posts/${post.slug}`}>
                  {post.title}
                </a>
              </h2>
              
              <div className="post-meta">
                <time>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
                <span className="separator">•</span>
                <span className="source">来源：{post.source.name}</span>
              </div>

              <p className="post-description">
                {post.description}
              </p>

              <a href={`/posts/${post.slug}`} className="read-more">
                阅读全文 →
              </a>
            </article>
          ))}
        </div>
      </div>
    </TerminalLayout>
  )
}
