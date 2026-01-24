/**
 * SijiGPT Worker - 处理 Payload CMS 推送的文章通知
 * 功能: 接收新文章 → 推送到 Telegram → 缓存更新
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    
    // CORS 支持
    if (request.method === 'OPTIONS') {
      return handleCORS()
    }
    
    // 文章 Webhook 处理
    if (request.method === 'POST' && url.pathname === '/webhook/article') {
      return handleArticleWebhook(request, env)
    }
    
    // 健康检查
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response('SijiGPT Worker is running', { status: 200 })
    }
    
    return new Response('Not Found', { status: 404 })
  }
}

/**
 * 处理文章推送 Webhook
 */
async function handleArticleWebhook(request, env) {
  try {
    // 1. 验证 API 密钥
    const authResult = await validateApiKey(request, env)
    if (!authResult.valid) {
      return new Response(authResult.error, { status: authResult.status })
    }
    
    // 2. 解析请求数据
    const payload = await request.json()
    console.log(`[Webhook] 收到文章通知: ${payload.article?.title}`)
    
    // 3. 验证数据格式
    if (!payload.article || !payload.article.id) {
      return new Response('Invalid payload format', { status: 400 })
    }
    
    const { article } = payload
    
    // 4. 推送到 Telegram
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      await pushToTelegram(article, env)
      console.log(`[Webhook] Telegram 推送完成: ${article.title}`)
    }
    
    // 5. 更新 KV 缓存 (可选)
    if (env.CACHE_KV) {
      await updateArticleCache(article, env.CACHE_KV)
      console.log(`[Webhook] 缓存更新完成: ${article.id}`)
    }
    
    // 6. 通知其他订阅者 (邮件、Notion等)
    await notifySubscribers(article, env)
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Article notification processed',
      article_id: article.id,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('[Webhook] 处理失败:', error)
    return new Response(`Webhook processing failed: ${error.message}`, { 
      status: 500 
    })
  }
}

/**
 * 验证 API 密钥
 */
async function validateApiKey(request, env) {
  const authHeader = request.headers.get('Authorization')
  const source = request.headers.get('X-Payload-Source')
  
  if (!authHeader) {
    return { valid: false, error: 'Missing Authorization header', status: 401 }
  }
  
  const apiKey = authHeader.replace('Bearer ', '')
  
  if (apiKey !== env.WORKER_API_KEY) {
    return { valid: false, error: 'Invalid API key', status: 401 }
  }
  
  if (source !== 'sijigpt-cms') {
    return { valid: false, error: 'Invalid source', status: 403 }
  }
  
  return { valid: true }
}

/**
 * 推送到 Telegram 频道
 */
async function pushToTelegram(article, env) {
  try {
    // 构建消息内容
    const message = formatTelegramMessage(article)
    
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Telegram] 推送失败:', errorText)
    }
  } catch (error) {
    console.error('[Telegram] 推送异常:', error)
  }
}

/**
 * 格式化 Telegram 消息
 */
function formatTelegramMessage(article) {
  const keywords = article.summary_zh?.keywords?.slice(0, 3)
    ?.map(k => `#${k.keyword}`)?.join(' ') || ''
  
  const summary = article.summary_zh?.content 
    ? article.summary_zh.content.substring(0, 200) + '...'
    : '暂无摘要'
  
  return `🚀 *新文章发布*

📖 *${article.title}*

${summary}

🔗 [阅读全文](https://sijigpt.com/posts/${article.slug})

${keywords} #AI资讯`
}

/**
 * 更新 KV 缓存
 */
async function updateArticleCache(article, cacheKV) {
  try {
    // 缓存文章摘要信息
    const cacheKey = `article:${article.id}`
    const cacheData = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt,
      summary: article.summary_zh?.content?.substring(0, 100),
      cached_at: new Date().toISOString()
    }
    
    await cacheKV.put(cacheKey, JSON.stringify(cacheData), {
      expirationTtl: 86400 * 7  // 7天过期
    })
    
    // 更新最新文章列表
    await updateLatestArticlesList(article, cacheKV)
    
  } catch (error) {
    console.error('[Cache] 更新失败:', error)
  }
}

/**
 * 更新最新文章列表缓存
 */
async function updateLatestArticlesList(article, cacheKV) {
  try {
    const latestKey = 'latest_articles'
    const existingData = await cacheKV.get(latestKey)
    
    let articles = existingData ? JSON.parse(existingData) : []
    
    // 添加新文章到开头
    articles.unshift({
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt
    })
    
    // 只保留最新20篇
    articles = articles.slice(0, 20)
    
    await cacheKV.put(latestKey, JSON.stringify(articles), {
      expirationTtl: 86400  // 24小时过期
    })
    
  } catch (error) {
    console.error('[Cache] 最新列表更新失败:', error)
  }
}

/**
 * 通知其他订阅者
 */
async function notifySubscribers(article, env) {
  // TODO: 实现邮件订阅推送
  // TODO: 实现 Notion 数据库更新
  // TODO: 实现其他第三方服务通知
  
  console.log(`[Subscribers] 准备通知订阅者: ${article.title}`)
}

/**
 * 处理 CORS
 */
function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Payload-Source',
      'Access-Control-Max-Age': '86400'
    }
  })
}

/**
 * 环境变量说明:
 * 
 * WORKER_API_KEY: Worker API 密钥，用于验证 Payload 推送
 * TELEGRAM_BOT_TOKEN: Telegram Bot Token
 * TELEGRAM_CHAT_ID: Telegram 频道/群组 ID
 * CACHE_KV: KV 存储绑定名称 (可选)
 * 
 * Wrangler 配置示例:
 * 
 * [vars]
 * TELEGRAM_CHAT_ID = "@sijigpt_channel"
 * 
 * [secrets] 
 * WORKER_API_KEY = "sijigpt-worker-api-key-2026-secure-notifications"
 * TELEGRAM_BOT_TOKEN = "your-telegram-bot-token"
 * 
 * [[kv_namespaces]]
 * binding = "CACHE_KV"
 * id = "your-kv-namespace-id"
 */