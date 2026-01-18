import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'


async function getPostsByTag(tag: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=100&sort=-createdAt`,
      { next: { revalidate: 0, tags: [] } }
    )

    if (!res.ok) return []

    const data = await res.json()
    const posts = data.docs || []

    return posts.filter((post: any) => {
      const zhKeywords = post.summary_zh?.keywords?.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ) || []
      const enKeywords = post.summary_en?.keywords?.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ) || []

      return [...zhKeywords, ...enKeywords].some((keyword: string) => 
        keyword.toLowerCase() === tag.toLowerCase()
      )
    })
  } catch (error) {
    console.error('获取标签文章失败:', error)
    return []
  }
}

export default async function TagPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const tag = decodeURIComponent(params.slug)
  const posts = await getPostsByTag(tag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <TerminalLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          标签: #{tag}
        </h1>
        <p className="text-terminal-gray">
          找到 {posts.length} 篇相关文章
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post: any) => (
          <article key={post.id} className="border-b border-terminal-border pb-4">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-bold hover:text-terminal-green transition-colors">
                {post.title}
              </h2>
            </Link>
            
            {post.title_en && (
              <p className="text-terminal-gray text-sm mt-1">
                {post.title_en}
              </p>
            )}

            <time className="text-terminal-gray text-sm block mt-2">
              {new Date(post.createdAt).toLocaleDateString('zh-CN')}
            </time>

            {post.summary_zh?.content && (
              <p className="text-terminal-gray mt-2">
                {post.summary_zh.content.substring(0, 150)}...
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/tags" className="text-terminal-green hover:underline">
          ← 返回所有标签
        </Link>
      </div>
    </TerminalLayout>
  )
}
