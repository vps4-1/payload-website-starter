import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = result.docs[0]
  if (!post) notFound()

  return (
    <TerminalLayout>
      <article className="space-y-6">
        <h1 className="text-2xl text-pistachio-400">
          {post.title || post.title_en}
        </h1>

        {post.title_en && post.title && (
          <h2 className="text-xl text-terminal-muted">{post.title_en}</h2>
        )}

        <div className="text-terminal-muted text-sm space-y-1">
          {post.source_url && (
            <p>
              来源: <a href={post.source_url} target="_blank" rel="noopener" className="text-pistachio-400 hover:underline">
                {post.source_name || 'Unknown'}
              </a>
            </p>
          )}
          <p>发布: {new Date(post.published_at || post.createdAt).toLocaleDateString('zh-CN')}</p>
        </div>

        {post.summary_zh_content && (
          <div className="space-y-2">
            <h3 className="text-pistachio-400">中文摘要</h3>
            <p className="text-terminal-text">{post.summary_zh_content}</p>
          </div>
        )}

        {post.summary_en_content && (
          <div className="space-y-2">
            <h3 className="text-pistachio-400">English Summary</h3>
            <p className="text-terminal-text">{post.summary_en_content}</p>
          </div>
        )}

        <Link href="/posts" className="text-pistachio-400 hover:underline">
          ← 返回文章列表
        </Link>
      </article>
    </TerminalLayout>
  )
}

export async function generateStaticParams() {
  return []
}
