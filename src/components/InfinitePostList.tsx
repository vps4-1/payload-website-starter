'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// 从URL中提取友好的来源名称
function getSourceName(url: string): string {
  try {
    const domain = new URL(url).hostname
    
    // 特殊域名映射
    const sourceMap: Record<string, string> = {
      'blog.replit.com': 'Replit',
      'www.media.mit.edu': 'MIT',
      'blog.langchain.com': 'LangChain',
      'www.blog.langchain.com': 'LangChain',
      'openai.com': 'OpenAI',
      'blog.openai.com': 'OpenAI',
      'ai.googleblog.com': 'Google AI',
      'deepmind.google': 'DeepMind',
      'deepmind.com': 'DeepMind',
      'aws.amazon.com': 'AWS',
      'huggingface.co': 'HuggingFace',
      'blog.huggingface.co': 'HuggingFace',
      'techcrunch.com': 'TechCrunch',
      'venturebeat.com': 'VentureBeat',
      'technologyreview.com': 'MIT Tech Review',
      'www.technologyreview.com': 'MIT Tech Review',
      'theverge.com': 'The Verge',
      'www.theverge.com': 'The Verge',
      'arxiv.org': 'arXiv',
      'github.com': 'GitHub',
      'microsoft.com': 'Microsoft',
      'blog.microsoft.com': 'Microsoft',
      'anthropic.com': 'Anthropic',
      'cohere.ai': 'Cohere',
      'stability.ai': 'Stability AI'
    }
    
    if (sourceMap[domain]) {
      return sourceMap[domain]
    }
    
    // 如果没有特殊映射，返回清理后的域名
    return domain.replace('www.', '').replace('blog.', '').split('.')[0]
      .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      
  } catch {
    return '未知来源'
  }
}

interface Post {
  id: string
  slug: string
  title: string
  summary_zh?: {
    title?: string
    content?: string
    keywords?: Array<{ id: string; keyword: string }>
  }
  source?: {
    url?: string
    name?: string
    author?: string
  }
  createdAt: string
}

interface InfinitePostListProps {
  initialPosts: Post[]
  initialHasMore: boolean
  totalDocs: number
}

export default function InfinitePostList({ initialPosts, initialHasMore, totalDocs }: InfinitePostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const offset = posts.length
      // 在客户端使用相对路径访问API
      const apiUrl = `/api/frontend-posts?limit=20&sort=-createdAt&page=${page + 1}`
      console.log('InfinitePostList: 尝试加载更多文章，URL:', apiUrl)
      
      const res = await fetch(apiUrl)
      if (!res.ok) {
        console.error('API请求失败:', res.status, res.statusText)
        throw new Error(`Failed to load /api/frontend-posts: ${res.status}`)
      }
      
      const data = await res.json()
      const newPosts = data.docs || []
      console.log('InfinitePostList: 成功加载', newPosts.length, '篇文章')
      
      setPosts(prev => [...prev, ...newPosts])
      setHasMore(data.hasNextPage || false)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, posts.length, page])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
      loadMorePosts()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMorePosts])

  return (
    <div className="space-y-5">
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
        <>
          {posts.map((post: Post, index: number) => (
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
                {/* 第一行：标题 */}
                <h2 className="text-lg font-semibold text-terminal-text hover:text-pistachio-400 transition-colors">
                  <Link href={`/posts/${post.slug}`}>
                    {post.summary_zh?.title || post.title}
                  </Link>
                </h2>

                {/* 第二行：日期和出处 */}
                <div className="flex items-center text-xs text-terminal-muted" style={{ gap: '1.5rem' }}>
                  <time>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</time>
                  <span className="text-terminal-muted" style={{ marginLeft: '0.5rem' }}>
                    出处：
                    {post.source?.url ? (
                      <a 
                        href={post.source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-pistachio-400 transition-colors ml-1"
                      >
                        {getSourceName(post.source.url)}
                      </a>
                    ) : (
                      <span className="ml-1">未知来源</span>
                    )}
                  </span>
                </div>

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
                    className="flex flex-wrap pt-2" 
                    style={{ 
                      gap: '0.5rem',
                      display: 'flex',
                      flexWrap: 'wrap'
                    }}
                  >
                    {post.summary_zh.keywords.slice(0, 5).map((kw: any) => (
                      <Link
                        key={kw.id}
                        href={`/tags/${encodeURIComponent(kw.keyword)}`}
                        className="text-xs px-2 py-1 bg-terminal-bg border border-pistachio-400 text-pistachio-300 hover:text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
                      >
                        #{kw.keyword}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}

          {/* 加载更多指示器 */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-pistachio-400">
                <pre className="text-sm">
{`  📡 加载更多内容中...
  
  [ ████████████████████████████████ ] 加载中`}
                </pre>
              </div>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-terminal-muted">
              <p>— 已显示全部 {posts.length} 篇文章 —</p>
              <Link
                href="/posts"
                className="inline-block mt-4 px-6 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors"
              >
                查看文章归档 →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}