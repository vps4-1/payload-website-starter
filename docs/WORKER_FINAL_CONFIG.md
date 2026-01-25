# 🚀 Cloudflare Worker 最终配置指南

## 📊 当前状态
- ✅ Payload API 测试成功，文章数量: 55
- ✅ 无认证方案已验证可用 (ID: 333 生产环境创建成功)
- ✅ API Key 已生成备用: `51499fb8ce009bb625caa0861bd1ba87800f68351a3f88f4cb4707580d82d5f3`
- ✅ Worker 域名确认: `siji-worker-v2.chengqiangshang.workers.dev`
- ⚠️ 待完成: Worker webhook 端点开发

## 🔧 Cloudflare Worker Secrets 配置

### 方案 1: 无认证方案 (推荐)
```bash
# 基础配置 - 无需 PAYLOAD_API_KEY
wrangler secret put PAYLOAD_URL
# 输入: https://payload-website-starter-git-main-billboings-projects.vercel.app

wrangler secret put WORKER_API_KEY  
# 输入: sijigpt-worker-api-key-2026-secure-notifications

# AI 配置
wrangler secret put OPENROUTER_API_KEY
# 输入: [你的 OpenRouter API Key]

wrangler secret put TELEGRAM_BOT_TOKEN
# 输入: [你的 Telegram Bot Token]
```

### 方案 2: API Key 方案 (备用)
```bash
# 如果需要使用 API Key 认证
wrangler secret put PAYLOAD_API_KEY
# 输入: 51499fb8ce009bb625caa0861bd1ba87800f68351a3f88f4cb4707580d82d5f3
```

## 📝 Worker 代码更新需求

你的 Worker 目前缺少 `/webhook/article` 端点，需要添加以下代码:

### 1. 在 worker `fetch` 处理器中添加 webhook 路由

```javascript
// 在主 fetch handler 中添加
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 现有的路由
    if (path === '/') {
      return new Response('Siji Worker V2 Running', { status: 200 });
    }
    
    if (path === '/test') {
      return new Response('Worker Test OK', { status: 200 });
    }
    
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // ⭐ 新增: Webhook 端点
    if (path === '/webhook/article' && request.method === 'POST') {
      return await handleWebhook(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
}

// ⭐ 新增: Webhook 处理函数
async function handleWebhook(request, env) {
  try {
    // 验证认证
    const auth = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${env.WORKER_API_KEY}`;
    
    if (!auth || auth !== expectedAuth) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // 解析负载
    const payload = await request.json();
    console.log('📝 收到文章推送:', payload.title || payload.title_zh);
    
    // 可选: 发送 Telegram 通知
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHANNEL) {
      await sendTelegramNotification(env, payload);
    }
    
    // 可选: 触发缓存刷新
    await triggerCacheRefresh(env);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processed successfully',
      article: payload.title || payload.title_zh,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Webhook 处理错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Telegram 通知函数
async function sendTelegramNotification(env, article) {
  try {
    const message = `📰 新文章发布: ${article.title || article.title_zh}\\n🔗 来源: ${article.source || 'SijiGPT'}\\n⏰ ${new Date().toLocaleString('zh-CN')}`;
    
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHANNEL,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Telegram 通知失败:', error);
  }
}

// 缓存刷新函数
async function triggerCacheRefresh(env) {
  try {
    // 可选: 调用 Payload 的 revalidation API
    await fetch(`${env.PAYLOAD_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Revalidate-Secret': env.REVALIDATE_SECRET || 'skip'
      }
    });
  } catch (error) {
    console.log('缓存刷新跳过:', error.message);
  }
}
```

## 🧪 测试步骤

### 1. 部署 Worker
```bash
# 在你的 Worker 项目目录
wrangler deploy
```

### 2. 测试 Webhook 端点
```bash
# 测试 webhook 端点
curl -X POST https://siji-worker-v2.chengqiangshang.workers.dev/webhook/article \\
  -H "Authorization: Bearer sijigpt-worker-api-key-2026-secure-notifications" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": 999,
    "title": "Webhook测试文章", 
    "title_zh": "Webhook测试文章",
    "source": "测试来源",
    "publishedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'
```

### 3. 从 Payload 触发测试
```bash
# 在 Payload 中创建新文章，应该自动触发 webhook
curl -X POST http://localhost:3003/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "完整流程测试",
    "title_en": "Full Pipeline Test",
    "slug": "full-pipeline-test-2026",
    "summary_zh": {"content": "测试完整的 RSS → AI → Payload → Webhook 流程"},
    "summary_en": {"content": "Testing complete RSS → AI → Payload → Webhook pipeline", "keywords": ["test", "pipeline", "automation"]},
    "source": "Manual Test",
    "original_language": "zh",
    "publishedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "_status": "published"
  }'
```

## 📈 性能监控

添加这些到你的 Worker 以便监控:

```javascript
// 在每个函数中添加性能日志
console.log(`⏱️ Webhook 处理耗时: ${Date.now() - startTime}ms`);
```

## 🔄 下一步

1. **立即**: 按上述代码更新你的 Worker
2. **测试**: 验证 webhook 端点正常工作 
3. **自动化**: 启动 RSS 定时聚合 (cron jobs)
4. **监控**: 观察 Telegram 通知和文章创建

## 🎯 期望结果

完成后你将拥有:
- 🤖 自动 RSS 聚合 (每日 10+ 篇)
- 🧠 AI 内容生成和翻译
- 📱 实时 Telegram 通知
- 🔄 自动缓存刷新
- 📊 完整的监控日志

当前你已经 **95% 完成**，只需添加 webhook 端点即可实现完全自动化！