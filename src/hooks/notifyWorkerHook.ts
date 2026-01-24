import { CollectionAfterChangeHook } from 'payload'

export const notifyWorkerHook: CollectionAfterChangeHook = async ({
  doc, // 文章文档
  req, // 请求对象
  operation, // 'create' | 'update'
}) => {
  // 只在创建新文章时通知 Worker
  if (operation === 'create') {
    console.log(`[Hook] 新文章创建，准备通知 Worker: ${doc.title}`)
    
    try {
      const workerUrl = process.env.WORKER_WEBHOOK_URL
      const workerApiKey = process.env.WORKER_API_KEY
      
      if (!workerUrl || !workerApiKey) {
        console.log('[Hook] Worker webhook 未配置，跳过通知')
        return
      }
      
      const payload = {
        event: 'article.created',
        article: {
          id: doc.id,
          title: doc.title,
          title_en: doc.title_en,
          slug: doc.slug,
          source: doc.source,
          summary_zh: doc.summary_zh,
          summary_en: doc.summary_en,
          original_language: doc.original_language,
          publishedAt: doc.publishedAt,
          createdAt: doc.createdAt
        },
        timestamp: new Date().toISOString(),
        source: 'sijigpt-payload-cms'
      }
      
      console.log(`[Hook] 发送 Worker 通知到: ${workerUrl}`)
      
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${workerApiKey}`,
          'X-Payload-Source': 'sijigpt-cms',
          'User-Agent': 'SijiGPT-Payload/1.0'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        console.log(`[Hook] Worker 通知成功: ${response.status}`)
      } else {
        const errorText = await response.text()
        console.error(`[Hook] Worker 通知失败: ${response.status} ${response.statusText}`)
        console.error(`[Hook] 错误详情:`, errorText)
      }
      
    } catch (error) {
      console.error('[Hook] Worker 通知异常:', error)
      // 不抛出错误，避免影响文章创建
    }
  }
}