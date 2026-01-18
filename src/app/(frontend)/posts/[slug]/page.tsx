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

        <div className="text-terminal-muted text-sm space-y-1">
          {post.source?.url && (
            <p className="break-words">
              出处:{' '}
              <a
                href={post.source.url}
                target="_blank"
                rel="noopener"
                className="text-pistachio-400 hover:underline"
              >
                {post.source.name || 'Unknown'} - {post.title_en || post.title}
              </a>
            </p>
          )}
          <p>
            发布: {new Date(post.publishedAt || post.createdAt).toLocaleDateString('zh-CN')}
          </p>
        </div>

        {post.summary_zh?.content && (
          <div className="space-y-3 border-l-2 border-pistachio-400 pl-4">
            <h3 className="text-pistachio-400 font-bold">中文摘要</h3>
            <p className="text-terminal-text leading-relaxed whitespace-pre-wrap">
              {post.summary_zh.content}
            </p>
            {post.summary_zh.keywords && post.summary_zh.keywords.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {post.summary_zh.keywords.map((kw: any) => (
                  <Link
                    key={kw.id}
                    href={`/tags/${encodeURIComponent(kw.keyword)}`}
                    className="text-sm text-pistachio-300 hover:text-pistachio-400 hover:underline whitespace-nowrap"
                  >
                    #{kw.keyword}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {post.summary_en?.content && (
          <div className="space-y-3 border-l-2 border-pistachio-400 pl-4">
            <h3 className="text-pistachio-400 font-bold">English Summary</h3>
            {post.title_en && (
              <h4 className="text-lg text-terminal-text">
                <a
                  href={post.source?.url}
                  target="_blank"
                  rel="noopener"
                  className="hover:text-pistachio-400 hover:underline"
                >
                  {post.title_en}
                </a>
              </h4>
            )}
            <p className="text-terminal-text leading-relaxed whitespace-pre-wrap">
              {post.summary_en.content}
            </p>
            {post.summary_en.keywords && post.summary_en.keywords.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {post.summary_en.keywords.map((kw: any) => (
                  <Link
                    key={kw.id}
                    href={`/tags/${encodeURIComponent(kw.keyword)}`}
                    className="text-sm text-pistachio-300 hover:text-pistachio-400 hover:underline whitespace-nowrap"
                  >
                    #{kw.keyword}
                  </Link>
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
