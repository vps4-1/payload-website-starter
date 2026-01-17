import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TerminalLayout } from '@/components/TerminalLayout'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = result.docs[0]
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title || post.title_en} - SiJiGPT`,
    description: post.description || post.summary_zh?.content?.substring(0, 160),
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = result.docs[0]
  if (!post) notFound()

  return (
    <TerminalLayout title="SiJiGPT">
      <article className="terminal-section post-detail">
        <header>
          <h1>{post.title || post.title_en}</h1>
          
          <div className="post-meta">
            {post.source?.url && post.source?.name && (
              <div className="post-source">
                来源: <Link href={post.source.url} target="_blank">[{post.source.name}]</Link>
                {post.source.author && ` by ${post.source.author}`}
              </div>
            )}
            
            <div className="post-date">
              发布时间: {new Date(post.publishedAt || post.createdAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </header>

        {post.summary_zh?.content && (
          <section className="post-summary">
            <h2>摘要 (中文)</h2>
            <p>{post.summary_zh.content}</p>
            
            {post.summary_zh.keywords && post.summary_zh.keywords.length > 0 && (
              <div className="keywords">
                <strong>关键词:</strong>{' '}
                {post.summary_zh.keywords.map((keyword: string, index: number) => (
                  <span key={index}>
                    <Link href={`/search?q=${encodeURIComponent(keyword)}`}>
                      {keyword}
                    </Link>
                    {index < post.summary_zh.keywords.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {post.summary_en?.content && (
          <section className="post-summary">
            <h2>Summary (English)</h2>
            <p>{post.summary_en.content}</p>
            
            {post.summary_en.keywords && post.summary_en.keywords.length > 0 && (
              <div className="keywords">
                <strong>Keywords:</strong>{' '}
                {post.summary_en.keywords.map((keyword: string, index: number) => (
                  <span key={index}>
                    <Link href={`/search?q=${encodeURIComponent(keyword)}`}>
                      {keyword}
                    </Link>
                    {index < post.summary_en.keywords.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {post.tags && post.tags.length > 0 && (
          <section className="post-tags">
            <h3>标签</h3>
            <div className="tags-list">
              {post.tags.map((tag: string) => (
                <Link 
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="tag"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link href="/posts" className="terminal-button">
          ← 返回文章列表
        </Link>
      </article>
    </TerminalLayout>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const posts = await payload.find({
    collection: 'posts',
    limit: 100,
  })

  return posts.docs.map((post) => ({
    slug: post.slug,
  }))
}
