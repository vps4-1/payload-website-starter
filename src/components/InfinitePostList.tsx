'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  slug: string
  title: string
  summary_zh?: {
    title?: string
    content?: string
    keywords?: Array<{ id: string; keyword: string }>
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
      const res = await fetch(`/api/posts?limit=20&sort=-createdAt&page=${page + 1}`)
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      const newPosts = data.docs || []
      
      setPosts(prev => [...prev, ...newPosts])
      setHasMore(data.hasNextPage || false)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('加载更多文章失败:', error)
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
          {posts.map((post: Post) => (
            <article key={post.id} className="py-4 border-b border-terminal-border/30">
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
                      gap: '1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      paddingTop: '0.25rem'
                    }}
                  >
                    {post.summary_zh.keywords.slice(0, 5).map((kw: any) => (
                      <Link
                        key={kw.id}
                        href={`/tags/${encodeURIComponent(kw.keyword)}`}
                        className="text-sm text-pistachio-300 hover:text-pistachio-400 hover:underline whitespace-nowrap"
                        style={{ marginRight: '0.5rem', marginBottom: '0.25rem' }}
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