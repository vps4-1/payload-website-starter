import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

// 按需刷新
export const revalidate = false

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?where[slug][equals]=${slug}&limit=1`
    )
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('获取文章失败:', error)
    return null
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <TerminalLayout>
      <article className="space-y-6">
        <h1 className="text-2xl text-pistachio-400">
          {post.title}
        </h1>

        {post.title_en && (
          <h2 className="text-xl text-terminal-muted">{post.title_en}</h2>
        )}

        <div className="text-terminal-muted text-sm space-y-1">
          {post.source?.url && (
            <p>
              来源:{' '}
              <a
                href={post.source.url}
                target="_blank"
                rel="noopener"
                className="text-pistachio-400 hover:underline"
              >
                {post.source.name || 'Unknown'}
              </a>
            </p>
          )}
          <p>
            发布: {new Date(post.publishedAt || post.createdAt).toLocaleDateString('zh-CN')}
          </p>
        </div>

        {post.summary_zh?.content && (
          <div className="space-y-2 border-l-2 border-pistachio-400 pl-4">
            <h3 className="text-pistachio-400 font-bold">📄 中文摘要</h3>
            <p className="text-terminal-text leading-relaxed whitespace-pre-wrap">
              {post.summary_zh.content}
            </p>
            {post.summary_zh.keywords && post.summary_zh.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.summary_zh.keywords.map((kw: any) => (
                  <span key={kw.id} className="text-xs text-pistachio-300">
                    #{kw.keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {post.summary_en?.content && (
          <div className="space-y-2 border-l-2 border-pistachio-400 pl-4">
            <h3 className="text-pistachio-400 font-bold">📝 English Summary</h3>
            <p className="text-terminal-text leading-relaxed whitespace-pre-wrap">
              {post.summary_en.content}
            </p>
            {post.summary_en.keywords && post.summary_en.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.summary_en.keywords.map((kw: any) => (
                  <span key={kw.id} className="text-xs text-pistachio-300">
                    #{kw.keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="pt-6 border-t border-terminal-border">
          <Link href="/posts" className="text-pistachio-400 hover:underline">
            ← 返回文章列表
          </Link>
        </div>
      </article>
    </TerminalLayout>
  )
}

export async function generateStaticParams() {
  return []
}
