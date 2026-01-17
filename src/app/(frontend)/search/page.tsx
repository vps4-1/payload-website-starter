import { Metadata } from 'next'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

const allPosts = [
  {
    id: '1',
    slug: 'zenken-chatgpt-enterprise',
    title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
    publishedAt: '2026-01-15',
    source: 'OpenAI Blog',
    tags: ['ChatGPT', '企业应用', '销售', 'AI工具', '数字化转型'],
    searchKeywords: ['ChatGPT Enterprise', '销售自动化', 'AI商业应用']
  },
  {
    id: '2',
    slug: 'alibaba-tongyi-qianwen-3',
    title: '阿里云发布通义千问3.0大模型',
    publishedAt: '2026-01-14',
    source: '阿里云官方博客',
    tags: ['通义千问', '阿里云', '大模型', '企业AI', '中文NLP'],
    searchKeywords: ['Tongyi Qianwen', 'large language model', '阿里云AI']
  }
]

export const metadata: Metadata = {
  title: '搜索 - SiJiGPT',
  description: '搜索文章、标签和关键词'
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q || ''

  const results = query
    ? allPosts.filter(post => {
        const searchText = query.toLowerCase()
        return (
          post.title.toLowerCase().includes(searchText) ||
          post.searchKeywords.some(k => k.toLowerCase().includes(searchText)) ||
          post.tags.some(t => t.toLowerCase().includes(searchText))
        )
      })
    : allPosts

  return (
    <TerminalLayout title="SiJiGPT">
      <div className="terminal-section">
        <h1>$ search --query=&quot;{query}&quot;</h1>
        
        {query && (
          <p className="terminal-output">
            找到了 {results.length} 篇相关文章
          </p>
        )}

        {results.length > 0 ? (
          <div className="search-results">
            {results.map(post => (
              <article key={post.id} className="search-result-item">
                <h2>
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <div className="post-meta">
                  <time>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
                  <span className="separator">•</span>
                  <span>{post.source}</span>
                </div>

                <div className="post-tags">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="tag"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <Link 
                  href={`/posts/${post.slug}`}
                  className="terminal-link"
                >
                  查看文章 →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="terminal-output">
            <p>没有找到匹配的文章</p>
            <Link href="/posts" className="terminal-button">
              返回文章列表
            </Link>
          </div>
        )}
      </div>
    </TerminalLayout>
  )
}
