import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: '归档 - SijiGPT',
  description: '按时间归档的所有文章',
}

// ✅ 纯 ISR：不设置 revalidate，完全按需刷新
// 只有调用 revalidatePath('/archives') 时才更新

async function getArchives() {
  try {
    const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
    
    const res = await fetch(
      `${NEXT_PUBLIC_SERVER_URL}/api/posts?limit=1000&sort=-createdAt`,
      { 
        next: { tags: ['posts'] }  // 支持 revalidateTag('posts')
      }
    )
    
    if (!res.ok) throw new Error('Failed to fetch')
    
    const data = await res.json()
    const posts = data.docs || []
    
    // 按年月分组
    const archives: Record<string, any[]> = {}
    
    posts.forEach((post: any) => {
      const date = new Date(post.createdAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const key = `${year}-${month}`
      
      if (!archives[key]) {
        archives[key] = []
      }
      archives[key].push(post)
    })
    
    return {
      archives,
      totalDocs: data.totalDocs || 0
    }
  } catch (error) {
    console.error('Failed to fetch archives:', error)
    return { archives: {}, totalDocs: 0 }
  }
}

export default async function ArchivesPage() {
  const { archives, totalDocs } = await getArchives()
  
  return (
    <TerminalLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl text-pistachio-400 border-b border-terminal-border pb-2">
            归档
          </h1>
          
          <div className="text-terminal-muted text-sm">
            <span className="text-pistachio-400">$ ls -la archives/</span>
            <p className="pl-4 mt-1">共 {totalDocs} 篇文章</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {Object.entries(archives)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, posts]) => (
              <div key={month} className="space-y-3">
                <h2 className="text-lg text-pistachio-400 font-semibold">
                  {month}
                </h2>
                <ul className="pl-4 space-y-2">
                  {posts.map((post: any) => (
                    <li key={post.id} className="text-sm">
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="text-terminal-text hover:text-pistachio-400 transition-colors"
                      >
                        <span className="text-terminal-muted mr-3">
                          {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          
          {Object.keys(archives).length === 0 && (
            <p className="text-terminal-muted">暂无文章</p>
          )}
        </div>
      </div>
    </TerminalLayout>
  )
}
