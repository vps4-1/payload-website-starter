/**
 * SijiGPT Worker - Webhook 端点集成示例
 * 基于你现有的 worker-index.js，添加 webhook 处理功能
 */

// =================== 主要导出 ===================
export default {
  // 定时任务处理器（你现有的功能）
  async scheduled(event, env, ctx) {
    console.log('🕐 定时任务触发:', new Date().toISOString());
    
    try {
      // 执行你现有的 RSS 聚合逻辑
      await aggregateArticles(env);
      console.log('✅ RSS 聚合完成');
    } catch (error) {
      console.error('❌ 定时任务执行失败:', error);
    }
  },

  // HTTP 请求处理器（新增 webhook 支持）
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    try {
      // 根路径 - 健康检查
      if (path === '/' && method === 'GET') {
        return new Response('Siji Worker V2 Running', { 
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // 健康检查端点
      if (path === '/health' && method === 'GET') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '2.0',
          features: ['rss-aggregation', 'webhook', 'telegram']
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 测试端点
      if (path === '/test' && method === 'GET') {
        return await handleTest(env);
      }
      
      // ⭐ 核心功能: Webhook 端点
      if (path === '/webhook/article' && method === 'POST') {
        return await handleWebhook(request, env);
      }
      
      // 手动触发 RSS 聚合（调试用）
      if (path === '/trigger/rss' && method === 'POST') {
        return await handleManualRSS(request, env);
      }
      
      // 404
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('❌ 请求处理错误:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// =================== Webhook 处理器 ===================
async function handleWebhook(request, env) {
  const startTime = Date.now();
  
  try {
    // 1. 验证认证
    const auth = request.headers.get('Authorization');
    const payloadSource = request.headers.get('X-Payload-Source');
    const expectedAuth = `Bearer ${env.WORKER_API_KEY || 'sijigpt-worker-api-key-2026-secure-notifications'}`;
    
    if (!auth || auth !== expectedAuth) {
      console.warn('⚠️ Webhook 认证失败:', { auth: auth?.substring(0, 20), expected: expectedAuth.substring(0, 20) });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 2. 解析负载
    const payload = await request.json();
    const articleTitle = payload.title || payload.title_zh || 'Unknown Article';
    const articleId = payload.id || payload.doc?.id;
    
    console.log('📝 收到文章推送:', {
      id: articleId,
      title: articleTitle,
      source: payloadSource,
      timestamp: new Date().toISOString()
    });
    
    // 3. 发送 Telegram 通知
    let telegramResult = null;
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHANNEL) {
      try {
        telegramResult = await sendTelegramNotification(env, {
          title: articleTitle,
          id: articleId,
          source: payload.source || 'SijiGPT CMS',
          publishedAt: payload.publishedAt || payload.doc?.publishedAt
        });
      } catch (telegramError) {
        console.warn('⚠️ Telegram 通知失败:', telegramError.message);
      }
    }
    
    // 4. 触发缓存刷新和预热
    let revalidationResult = null;
    try {
      revalidationResult = await triggerSiteRefresh(env);
    } catch (revalidationError) {
      console.warn('⚠️ 缓存刷新失败:', revalidationError.message);
    }
    
    // 5. 返回处理结果
    const processingTime = Date.now() - startTime;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        article: {
          id: articleId,
          title: articleTitle
        },
        notifications: {
          telegram: telegramResult ? 'sent' : 'skipped',
          revalidation: revalidationResult ? 'triggered' : 'skipped'
        },
        processing: {
          time_ms: processingTime,
          timestamp: new Date().toISOString()
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Webhook 处理错误:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error.message,
        type: error.name || 'UnknownError'
      },
      processing: {
        time_ms: processingTime,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// =================== 辅助函数 ===================

// Telegram 通知
async function sendTelegramNotification(env, article) {
  const message = `📰 *新文章发布*
  
📝 *${article.title}*
🆔 ID: ${article.id}
📡 来源: ${article.source}
⏰ 时间: ${new Date(article.publishedAt || Date.now()).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

🔗 [查看文章](https://sijigpt.com)`;

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHANNEL || '@sijigpt',
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    })
  });
  
  if (!response.ok) {
    throw new Error(`Telegram API 错误: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// 站点刷新和预热
async function triggerSiteRefresh(env) {
  const payloadUrl = env.PAYLOAD_URL || 'https://payload-website-starter-git-main-billboings-projects.vercel.app';
  const results = {};
  
  // 1. 触发 Next.js revalidation
  try {
    const revalidateResponse = await fetch(`${payloadUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Revalidate-Secret': env.REVALIDATE_SECRET || 'skip-secret-check'
      },
      body: JSON.stringify({
        tags: ['posts', 'frontend-posts'],
        timestamp: new Date().toISOString()
      })
    });
    
    results.revalidate = revalidateResponse.ok ? 'success' : 'failed';
  } catch (error) {
    results.revalidate = 'error';
    console.warn('Revalidation 跳过:', error.message);
  }
  
  // 2. 预热关键页面
  const pagesToWarmup = [
    '/',
    '/posts', 
    '/archives',
    '/api/frontend-posts?limit=20'
  ];
  
  const warmupPromises = pagesToWarmup.map(async (path) => {
    try {
      const warmupResponse = await fetch(`${payloadUrl}${path}`, {
        method: 'HEAD',
        headers: { 'User-Agent': 'SijiWorker/2.0 Warmup' }
      });
      return { path, status: warmupResponse.status, success: warmupResponse.ok };
    } catch (error) {
      return { path, status: 0, success: false, error: error.message };
    }
  });
  
  const warmupResults = await Promise.all(warmupPromises);
  results.warmup = warmupResults;
  
  console.log('🔄 站点刷新结果:', results);
  return results;
}

// 测试端点处理器
async function handleTest(env) {
  const testResult = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      hasPayloadUrl: !!env.PAYLOAD_URL,
      hasWorkerApiKey: !!env.WORKER_API_KEY,
      hasTelegramBot: !!env.TELEGRAM_BOT_TOKEN,
      hasTelegramChannel: !!env.TELEGRAM_CHANNEL
    }
  };
  
  return new Response(JSON.stringify(testResult, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// 手动触发 RSS 聚合
async function handleManualRSS(request, env) {
  try {
    const auth = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${env.WORKER_API_KEY || 'sijigpt-worker-api-key-2026-secure-notifications'}`;
    
    if (!auth || auth !== expectedAuth) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    console.log('🔄 手动触发 RSS 聚合...');
    await aggregateArticles(env);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'RSS aggregation triggered manually',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// =================== 占位符函数 ===================
// 你需要将现有的 RSS 聚合逻辑放在这里
async function aggregateArticles(env) {
  // 这里应该是你现有的 RSS 聚合逻辑
  // 从 worker-index.js 复制相关代码
  console.log('🔄 执行 RSS 聚合逻辑...');
  
  // TODO: 实现你的 RSS 聚合逻辑
  // - 获取 RSS feeds
  // - AI 处理和翻译
  // - 发布到 Payload
  // - 等等...
}