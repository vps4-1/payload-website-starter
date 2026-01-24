# 🔧 添加 Webhook 端点到你的 Cloudflare Worker

## 📋 需要添加的代码

请在你的 Worker 代码中添加以下 webhook 处理逻辑：

### 1. 在 fetch 函数中添加 webhook 路由

```javascript
// 在你的 Worker 的 fetch 函数中添加这个路由
if (path === '/webhook/article' && request.method === 'POST') {
  try {
    // 验证 API 密钥
    const authHeader = request.headers.get('Authorization');
    const expectedKey = env.WORKER_API_KEY || 'sijigpt-worker-api-key-2026-secure-notifications';
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const receivedKey = authHeader.replace('Bearer ', '');
    if (receivedKey !== expectedKey) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 验证来源
    const payloadSource = request.headers.get('X-Payload-Source');
    if (payloadSource !== 'sijigpt-cms') {
      console.log('[Webhook] 来源验证失败:', payloadSource);
    }
    
    const article = await request.json();
    console.log('[Webhook] 收到新文章通知:', article.title);
    
    // 发送到 Telegram（如果配置了）
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHANNEL) {
      try {
        const telegramMessage = `🆕 新文章发布

**${article.title}**

📝 ${article.summary_zh?.content?.substring(0, 100) || '无摘要'}...

🔗 查看详情: https://sijigpt.com/posts/${article.slug}`;

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHANNEL,
            text: telegramMessage,
            parse_mode: 'Markdown',
            disable_web_page_preview: false
          })
        });
        
        console.log('[Webhook] ✅ Telegram 通知已发送');
      } catch (tgError) {
        console.log('[Webhook] ⚠️ Telegram 通知失败:', tgError.message);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Article notification processed',
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('[Webhook] 处理错误:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
```

### 2. 更新 OPTIONS 处理（如果有）

```javascript
if (request.method === 'OPTIONS') {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Payload-Source'
    }
  });
}
```

### 3. 配置环境变量（Secrets）

在 Cloudflare Dashboard 中或通过 wrangler CLI 设置：

```bash
# 设置 Worker API Key（用于验证 Payload 推送）
wrangler secret put WORKER_API_KEY
# 输入: sijigpt-worker-api-key-2026-secure-notifications

# 可选：设置 Telegram 通知
wrangler secret put TELEGRAM_BOT_TOKEN
# 输入你的 Telegram Bot Token

wrangler secret put TELEGRAM_CHANNEL  
# 输入: @sijigpt 或你的频道ID
```

## 🚀 部署更新

添加代码后，重新部署你的 Worker：

```bash
wrangler deploy
```

## 🧪 测试新的 Webhook

部署完成后，测试 webhook：

```bash
curl -X POST https://siji-worker-v2.chengqiangshang.workers.dev/webhook/article \
  -H "Authorization: Bearer sijigpt-worker-api-key-2026-secure-notifications" \
  -H "X-Payload-Source: sijigpt-cms" \
  -H "Content-Type: application/json" \
  -d '{"id": 999, "title": "测试", "slug": "test"}'
```

期望返回：
```json
{
  "success": true,
  "message": "Article notification processed",
  "article": {
    "id": 999,
    "title": "测试",
    "slug": "test"
  }
}
```

## 🔄 验证完整流程

1. **创建新文章**（通过 Payload API）
2. **Hook 自动触发**（推送到 Worker）
3. **Worker 处理通知**（可选发送 Telegram）
4. **检查日志**（确认所有步骤成功）

## 🎯 预期效果

一旦添加了 webhook 端点，完整的自动化流程就是：

```
RSS Sources → Worker RSS 聚合 → Payload API 发布 → Hook 触发 → Worker Webhook → Telegram 通知
```

你的 Worker 将同时具备：
- ✅ **RSS 聚合功能**（已有）
- ✅ **文章发布功能**（已有）
- ✅ **推送通知功能**（新增）

添加这个 webhook 端点后，整个 SijiGPT 自动化流程就完整了！