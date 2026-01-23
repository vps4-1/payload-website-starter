# Cloudflare Workers → Payload CMS 集成指南

## 🎯 核心连接方式

### 方法 1: REST API 连接 (推荐)
```javascript
// Cloudflare Worker 代码
const PAYLOAD_CONFIG = {
  url: 'https://sijigpt.com',
  apiKey: 'your-api-key' // 从 Cloudflare Secrets 获取
};

// 写入文章到 Payload CMS
async function saveArticleToPayload(article) {
  const response = await fetch(`${PAYLOAD_CONFIG.url}/api/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYLOAD_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: article.title,
      slug: article.slug,
      source: article.sourceUrl,
      summary_zh: {
        title: article.title,
        content: article.summaryZh,
        keywords: article.keywordsZh
      },
      summary_en: {
        title: article.titleEn,
        content: article.summaryEn,
        keywords: article.keywordsEn
      },
      status: 'published'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Payload API error: ${response.status}`);
  }
  
  return await response.json();
}
```

### 方法 2: 直接数据库写入
```javascript
// 使用 PostgreSQL 客户端直接写入 Neon 数据库
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ 
  connectionString: 'postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb'
});

async function insertDirectly(article) {
  const client = await pool.connect();
  
  try {
    const query = `
      INSERT INTO posts (title, slug, source, summary_zh, summary_en, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const values = [
      article.title,
      article.slug,
      article.source,
      JSON.stringify(article.summary_zh),
      JSON.stringify(article.summary_en),
      'published',
      new Date()
    ];
    
    const result = await client.query(query, values);
    return result.rows[0];
    
  } finally {
    client.release();
  }
}
```

### 方法 3: Webhook 通知
```javascript
// Cloudflare Worker 处理完成后通知 Payload
async function notifyPayloadWebhook(articles) {
  await fetch(`${PAYLOAD_CONFIG.url}/api/webhooks/content-update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYLOAD_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: 'articles_processed',
      count: articles.length,
      timestamp: new Date().toISOString()
    })
  });
}
```

## ⚙️ 完整的 Worker 集成示例

```javascript
// worker.js - 完整示例
export default {
  // Cron 触发器
  async scheduled(event, env, ctx) {
    console.log('🚀 Starting RSS processing...');
    
    try {
      // 1. 获取 RSS 数据
      const articles = await fetchRSSFeeds(env);
      
      // 2. AI 处理与筛选
      const processed = await processArticlesWithAI(articles, env);
      
      // 3. 批量写入 Payload CMS
      const saved = await batchSaveToPayload(processed, env);
      
      // 4. 触发缓存刷新
      await revalidateNextJSCache(env);
      
      console.log(`✅ Successfully processed ${saved.length} articles`);
      
    } catch (error) {
      console.error('❌ RSS processing failed:', error);
      await sendErrorAlert(error, env);
    }
  },
  
  // HTTP 处理器（可选）
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/manual-trigger') {
      // 手动触发处理
      ctx.waitUntil(this.scheduled(null, env, ctx));
      return new Response('Processing started', { status: 200 });
    }
    
    return new Response('SijiGPT RSS Worker', { status: 200 });
  }
};

// RSS 获取与解析
async function fetchRSSFeeds(env) {
  const rssSources = JSON.parse(env.RSS_SOURCES); // 从环境变量获取
  const articles = [];
  
  for (const source of rssSources) {
    try {
      const response = await fetch(source.url, {
        headers: { 'User-Agent': 'SijiGPT-Bot/1.0' }
      });
      
      const xml = await response.text();
      const parsed = parseRSS(xml, source);
      articles.push(...parsed);
      
    } catch (error) {
      console.warn(`RSS source failed: ${source.url}`, error);
    }
  }
  
  return deduplicateArticles(articles);
}

// AI 处理函数
async function processArticlesWithAI(articles, env) {
  const processed = [];
  
  for (const article of articles) {
    try {
      const aiResult = await callAIModel({
        model: 'groq/llama-3.1-70b', // 首选模型
        apiKey: env.OPENROUTER_KEY,
        prompt: generateProcessingPrompt(article)
      });
      
      if (aiResult.isRelevant) {
        processed.push({
          ...article,
          ...aiResult,
          processedAt: new Date()
        });
      }
      
    } catch (error) {
      console.warn(`AI processing failed: ${article.title}`, error);
    }
  }
  
  return processed;
}

// 批量写入 Payload
async function batchSaveToPayload(articles, env) {
  const saved = [];
  
  for (const article of articles) {
    try {
      const response = await fetch(`${env.PAYLOAD_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.PAYLOAD_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formatForPayload(article))
      });
      
      if (response.ok) {
        const result = await response.json();
        saved.push(result);
        console.log(`✅ Saved: ${article.slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Save failed: ${article.slug}`, error);
    }
  }
  
  return saved;
}

// Next.js 缓存刷新
async function revalidateNextJSCache(env) {
  await fetch(`${env.PAYLOAD_URL}/api/revalidate?secret=${env.REVALIDATE_SECRET}`, {
    method: 'POST'
  });
}
```

## 🔧 环境配置

### wrangler.toml
```toml
name = "sijigpt-rss-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 */6 * * *"]  # 每 6 小时

[vars]
PAYLOAD_URL = "https://sijigpt.com"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
```

### 环境变量 (Secrets)
```bash
# Cloudflare Dashboard 或命令行设置
wrangler secret put PAYLOAD_API_KEY
wrangler secret put OPENROUTER_KEY
wrangler secret put REVALIDATE_SECRET
wrangler secret put RSS_SOURCES  # JSON 字符串
```

## 📊 监控与调试

### 日志记录
```javascript
// 结构化日志
function logEvent(level, message, data = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    worker: 'sijigpt-rss',
    ...data
  }));
}

// 使用示例
logEvent('INFO', 'Processing started', { articleCount: articles.length });
logEvent('ERROR', 'API call failed', { error: error.message, url: apiUrl });
```

### 错误告警
```javascript
async function sendErrorAlert(error, env) {
  // 发送到 Telegram 或其他通知渠道
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: `🚨 SijiGPT RSS Worker Error:\n${error.message}\nTime: ${new Date()}`
    })
  });
}
```

## 🎯 部署步骤

1. **准备 Worker 代码**: 复制上述示例代码
2. **配置环境变量**: 设置 Payload API 密钥等
3. **部署到 Cloudflare**: `wrangler deploy`
4. **测试连接**: 手动触发验证集成
5. **监控运行**: 检查日志与错误

## 💡 最佳实践

- ✅ 使用批量操作减少 API 调用
- ✅ 实现错误重试与降级机制  
- ✅ 设置合理的超时时间
- ✅ 记录详细的操作日志
- ✅ 定期检查与维护

---

这种架构确保了 Cloudflare Workers 与 Payload CMS 的无缝集成，实现了高效的 AI 资讯自动化处理流程。