import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  
  // 排除特殊路径，避免拦截 tags 和 archives
  const excludedPaths = ['tags', 'archives', 'posts', 'search', 'about']
  
  if (excludedPaths.includes(slug)) {
    // 这些路径有自己的页面，不要重定向
    return null
  }
  
  // 其他路径重定向到 /posts/{slug}
  redirect(`/posts/${slug}`)
}

export async function generateStaticParams() {
  // 返回空数组，因为我们不需要预生成任何 slug 页面
  return []
}
