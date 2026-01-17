import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''

  // 模拟文章数据（包含完整标签列表）
  const allPosts = [
    {
      id: '1',
      slug: 'zenken-chatgpt-enterprise',
      title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
      publishedAt: '2026-01-14',
      source: {
        name: 'OpenAI Blog'
      },
      // 文章的所有标签
      tags: [
        'ChatGPT Enterprise',
        '销售自动化',
        'AI商业应用',
        '客户关系管理',
        '数字化转型'
      ],
      // 用于搜索匹配（包含中英文）
      searchKeywords: [
        'ChatGPT Enterprise',
        '销售自动化',
        'AI商业应用',
        '客户关系管理',
        '数字化转型',
        'sales automation',
        'AI business applications',
        'customer relationship management',
        'digital transformation'
      ]
    },
    {
      id: '2',
      slug: 'alibaba-tongyi-qianwen-3',
      title: '阿里云发布通义千问3.0大模型',
      publishedAt: '2026-01-14',
      source: {
        name: '阿里云官方博客'
      },
      tags: [
        '通义千问',
        '大语言模型',
        '阿里云AI',
        '企业级应用',
        '中文NLP'
      ],
      searchKeywords: [
        '通义千问',
        '大语言模型',
        '阿里云AI',
        '企业级应用',
        '中文NLP',
        'Tongyi Qianwen',
        'large language model',
        'Alibaba Cloud AI',
        'enterprise applications',
        'Chinese NLP'
      ]
    }
  ]

  // 搜索匹配
  const searchResults = query 
    ? allPosts.filter(post => 
        post.searchKeywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase())
        ) || post.title.toLowerCase().includes(query.toLowerCase())
      )
    : allPosts

  return (
    <TerminalLayout title="我的终端博客">
      <div className="search-page">
        <h1>🔍 搜索结果</h1>
        
        {query && (
          <div className="search-query">
            搜索关键词：<strong>{query}</strong>
          </div>
        )}

        {searchResults.length > 0 ? (
          <div className="posts" style={{ marginTop: '2rem' }}>
            {searchResults.map((post) => (
              <article className="post" key={post.id}>
                <h2 className="post-title">
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                {/* 显示文章的所有标签 */}
                <div className="post-tags">
                  <strong>文章标签：</strong>
                  {post.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <Link 
                        href={`/search?q=${encodeURIComponent(tag)}`} 
                        className="keyword-link"
                      >
                        {tag}
                      </Link>
                      {idx < post.tags.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Link className="button" href={`/posts/${post.slug}`}>
                    查看文章 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>没有找到与 "<strong>{query}</strong>" 相关的文章。</p>
            <p>
              <Link href="/posts">返回文章列表</Link>
            </p>
          </div>
        )}
      </div>
    </TerminalLayout>
  )
}
