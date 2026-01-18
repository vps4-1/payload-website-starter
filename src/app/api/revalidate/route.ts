import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  // 验证密钥
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    // 刷新所有相关页面
    const paths = [
      '/',              // 首页
      '/posts',         // 文章列表
      '/archives',      // 归档页
      '/tags',          // 标签页
      '/search',        // 搜索页
      '/about',         // 关于页
    ]
    
    paths.forEach(path => {
      revalidatePath(path)
    })
    
    // 刷新所有动态路由
    revalidatePath('/posts/[slug]', 'page')
    revalidatePath('/tags/[slug]', 'page')
    
    return NextResponse.json({ 
      revalidated: true,
      paths: paths,
      now: Date.now() 
    })
  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: String(err)
    }, { status: 500 })
  }
}
