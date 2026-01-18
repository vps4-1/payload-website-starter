export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function PostPage() {
  return (
    <div className="container py-8">
      <p>文章加载中...</p>
      <p>请访问 <a href="/posts" className="text-blue-500">/posts</a> 查看文章列表</p>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
