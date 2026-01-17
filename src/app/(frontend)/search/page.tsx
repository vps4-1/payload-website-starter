import type { Metadata } from 'next'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata: Metadata = {
  title: '搜索 - SiJiGPT',
  description: '搜索 AI 资讯和文章',
}

const allPosts = [
  {
    id: '1',
    slug: 'zenken-chatgpt-enterprise',
    title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
    publishedAt: '2026-01-15',
    source: { name: 'OpenAI Blog' },
    tags: ['ChatGPT', '企业应用', '销售', 'AI工具', '数字化转型'],
    searchKeywords: ['ChatGPT Enterprise', '销售自动化', 'AI商业应用', '客户关系管理', '数字化转型', 'sales automation', 'AI business applications', 'customer relationship management', 'digital transformation', 'enterprise AI']
  },
  {
    id: '2',
    slug: 'alibaba-tongyi-qianwen-3',
    title: '阿里云发布通义千问3.0大模型',
    publishedAt: '2026-01-14',
    source: { name: '阿里云官方博客' },
    tags: ['通义千问', '阿里云', '大模型', '企业AI', '中文NLP'],
    searchKeywords: ['通义千问', '大语言模型', '阿里云AI', '企业级应用', '中文NLP', 'Tongyi Qianwen', 'large language model', 'Alibaba Cloud AI', 'enterprise applications', 'Chinese NLP']
  }
]

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  
  const results = query
    ? allPosts.filter(post => {
        const lowerQuery = query.toLowerCase()
        return (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.searchKeywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
          post.tags.some(t => t.toLowerCase().includes(lowerQuery))
        )
      })
    : allPosts

  return (
    <TerminalLayout title="SiJiGPT">
      <div className="search-page">
        <header className="search-header">
          <h1>$ search --query &quot;{query || '全部文章'}&quot;</h1>
          <p className="search-meta">
            找到 {results.length} 篇相关文章
          </p>
        </header>

        {results.length > 0 ? (
          <div className="search-results">
            {results.map((post) => (
              <article key={post.id} className="search-result-card">
                <h2>
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <div className="result-meta">
                  <span className="result-date">
                    {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="result-source">
                    来源：{post.source.name}
                  </span>
                </div>

                <div className="post-tags">
                  <strong>标签：</strong>
                  {post.tags.map((tag, index) => (
                    <Link 
                      key={index}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="keyword-link"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                <Link href={`/posts/${post.slug}`} className="result-link">
                  查看文章 →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>没有找到匹配的文章</p>
            <Link href="/posts" className="terminal-button">
              浏览全部文章
            </Link>
          </div>
        )}
      </div>
    </TerminalLayout>
  )
}
