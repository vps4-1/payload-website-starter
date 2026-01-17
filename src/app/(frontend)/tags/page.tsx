import type { Metadata } from 'next'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata: Metadata = {
  title: '标签分类 - SiJiGPT AI资讯聚合',
  description: '浏览所有AI资讯标签分类：ChatGPT、大模型、企业应用、AI工具、数字化转型、通义千问、阿里云等热门话题。精选全球AI硬件软件资讯。',
  keywords: ['AI标签', 'ChatGPT', '大模型', '企业AI', 'AI工具', '阿里云', '通义千问', 'AI资讯分类'],
}

const allTags = [
  { name: 'AI工具', count: 2, slug: 'ai-tools', description: 'AI 工具与应用' },
  { name: '企业AI', count: 2, slug: 'enterprise-ai', description: '企业级 AI 解决方案' },
  { name: 'ChatGPT', count: 1, slug: 'chatgpt', description: 'ChatGPT 相关资讯' },
  { name: '企业应用', count: 1, slug: 'enterprise', description: 'AI 企业应用案例' },
  { name: '销售', count: 1, slug: 'sales', description: 'AI 销售自动化' },
  { name: '数字化转型', count: 1, slug: 'digital-transformation', description: '企业数字化转型' },
  { name: '通义千问', count: 1, slug: 'tongyi-qianwen', description: '阿里云通义千问大模型' },
  { name: '阿里云', count: 1, slug: 'alibaba-cloud', description: '阿里云 AI 服务' },
  { name: '大模型', count: 1, slug: 'llm', description: '大语言模型技术' },
  { name: '中文NLP', count: 1, slug: 'chinese-nlp', description: '中文自然语言处理' },
]

function groupTagsByHeat(tags: typeof allTags) {
  const hot = tags.filter(t => t.count >= 2)
  const normal = tags.filter(t => t.count === 1)
  return { hot, normal }
}

export default function TagsPage() {
  const { hot, normal } = groupTagsByHeat(allTags)
  const totalPosts = allTags.reduce((sum, tag) => sum + tag.count, 0)

  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '标签分类 - SiJiGPT',
    description: '浏览所有AI资讯标签分类',
    url: 'https://sijigpt.com/tags',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allTags.length,
      itemListElement: allTags.map((tag, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tag.name,
        description: tag.description,
        url: `https://sijigpt.com/search?q=${encodeURIComponent(tag.name)}`,
      })),
    },
  }

  return (
    <TerminalLayout title="SiJiGPT">
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="tags-page">
        <header className="tags-header">
          <h1>$ ls tags/ --sort-by count</h1>
          <p className="tags-subtitle">
            共 {allTags.length} 个标签 · {totalPosts} 篇文章
          </p>
        </header>

        {/* 热门标签 */}
        {hot.length > 0 && (
          <section className="tags-section">
            <h2>🔥 热门标签</h2>
            <div className="tags-grid hot-tags">
              {hot.map((tag) => (
                <article key={tag.slug} className="tag-card">
                  <a href={`/search?q=${encodeURIComponent(tag.name)}`}>
                    <div className="tag-card-header">
                      <h3 className="tag-card-name">{tag.name}</h3>
                      <span className="tag-card-count">{tag.count} 篇</span>
                    </div>
                    <p className="tag-card-desc">{tag.description}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 全部标签 */}
        <section className="tags-section">
          <h2>📂 全部标签</h2>
          <div className="tags-grid">
            {normal.map((tag) => (
              <article key={tag.slug} className="tag-card">
                <a href={`/search?q=${encodeURIComponent(tag.name)}`}>
                  <div className="tag-card-header">
                    <h3 className="tag-card-name">{tag.name}</h3>
                    <span className="tag-card-count">{tag.count} 篇</span>
                  </div>
                  <p className="tag-card-desc">{tag.description}</p>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* 标签索引（用于 SEO） */}
        <section className="tags-section">
          <h2>$ cat tags-index.txt</h2>
          <div className="terminal-output">
            <div className="tags-index">
              {allTags.map((tag, index) => (
                <span key={tag.slug}>
                  <a href={`/search?q=${encodeURIComponent(tag.name)}`}>
                    {tag.name}
                  </Link>
                  {index < allTags.length - 1 && ' · '}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="terminal-actions">
          <Link href="/posts" className="terminal-button">
            ← 返回文章列表
          </Link>
          <Link href="/archives" className="terminal-button">
            📅 查看归档
          </Link>
        </div>
      </div>
    </TerminalLayout>
  )
}
