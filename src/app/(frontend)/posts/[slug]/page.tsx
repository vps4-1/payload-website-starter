export const dynamic = 'force-dynamic'

export default function PostPage() {
  return (
    <div className="container py-8">
      <p>文章加载中...</p>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
