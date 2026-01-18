import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: '文章列表 - SiJiGPT',
}

// ISR: 每小时重新生成一次
export const revalidate = 3600

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=20`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('获取文章失败:', error)
    return []
  }
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <TerminalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl text-pistachio-400">$ ls posts/</h1>
        
        {posts.length === 0 ? (
          <p className="text-terminal-muted">
            文章正在聚合中，Worker 每天会自动发布新内容...
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any, index: number) => (
              <div key={post.id} className="border-l-2 border-pistachio-400 pl-4">
                <div className="text-terminal-muted text-sm">
                  {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                </div>
                <Link 
                  href={`/posts/${post.slug}`}
                  className="text-pistachio-400 hover:text-pistachio-300 text-lg block mt-1"
                >
                  {index + 1}. {post.title}
                </Link>
                {post.title_en && (
                  <div className="text-terminal-muted text-sm mt-1">
                    {post.title_en}
                  </div>
                )}
                {post.summary_zh?.content && (
                  <p className="text-terminal-text mt-2 line-clamp-2">
                    {post.summary_zh.content.substring(0, 150)}...
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {post.summary_zh?.keywords?.slice(0, 3).map((kw: any) => (
                    <span key={kw.id} className="text-xs text-pistachio-300">
                      #{kw.keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Link href="/" className="text-pistachio-400 hover:underline block mt-8">
          ← 返回首页
        </Link>
      </div>
    </TerminalLayout>
  )
}
