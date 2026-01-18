import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

// 按需刷新
export const revalidate = false

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPostsByTag(tag: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=100&sort=-createdAt`
    )
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    
    // 前端过滤包含该标签的文章
    const filtered = data.docs.filter((post: any) => {
      const zhKeywords = post.summary_zh?.keywords || []
      const enKeywords = post.summary_en?.keywords || []
      return [...zhKeywords, ...enKeywords].some((kw: any) => 
        kw.keyword === decodeURIComponent(tag)
      )
    })
    
    return filtered
  } catch (error) {
    console.error('获取文章失败:', error)
    return []
  }
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params
  const tag = decodeURIComponent(slug)
  const posts = await getPostsByTag(tag)

  if (posts.length === 0) notFound()

  return (
    <TerminalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-pistachio-400">$ ls posts/ | grep "#{tag}"</h1>
          <p className="text-terminal-muted mt-2">
            找到 {posts.length} 篇相关文章
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post: any, index: number) => (
            <React.Fragment key={post.id}>
              <article className="border-l-2 border-pistachio-400 pl-4 space-y-2">
                <h3>
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="text-pistachio-400 hover:text-pistachio-300 text-lg font-medium"
                  >
                    {post.title}
                  </Link>
                </h3>
                
                <div className="text-terminal-muted text-sm">
                  {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                </div>
                
                {post.summary_zh?.content && (
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="block text-terminal-text hover:text-pistachio-400"
                  >
                    <p className="line-clamp-2">
                      {post.summary_zh.content.substring(0, 150)}...
                    </p>
                  </Link>
                )}
              </article>
              
              {index < posts.length - 1 && (
                <hr className="border-terminal-border" />
              )}
            </React.Fragment>
          ))}
        </div>

        <Link href="/" className="text-pistachio-400 hover:underline block mt-8">
          ← 返回首页
        </Link>
      </div>
    </TerminalLayout>
  )
}

export async function generateStaticParams() {
  return []
}
