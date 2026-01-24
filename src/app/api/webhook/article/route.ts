import { NextRequest, NextResponse } from 'next/server'

/**
 * 本地 Webhook 处理器 - 替代外部 Cloudflare Worker
 * 处理新文章发布的通知
 */
export async function POST(request: NextRequest) {
  try {
    // 验证来源
    const source = request.headers.get('X-Payload-Source')
    if (source !== 'sijigpt-cms') {
      return NextResponse.json({ error: 'Invalid source' }, { status: 403 })
    }
    
    const payload = await request.json()
    const { article } = payload
    
    console.log(`[LocalWebhook] 收到新文章通知: ${article.title}`)
    
    // 这里可以添加你需要的逻辑，例如:
    // 1. 发送到 Telegram 
    // 2. 更新缓存
    // 3. 发送邮件通知
    // 4. 推送到其他平台
    
    // 示例：简单的日志记录
    console.log(`[LocalWebhook] 文章详情:`, {
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt
    })
    
    // TODO: 在这里添加实际的通知逻辑
    // await sendToTelegram(article)
    // await updateCache(article)
    
    return NextResponse.json({
      success: true,
      message: 'Article notification received',
      article_id: article.id
    })
    
  } catch (error) {
    console.error('[LocalWebhook] 处理失败:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// 健康检查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'sijigpt-local-webhook',
    timestamp: new Date().toISOString()
  })
}