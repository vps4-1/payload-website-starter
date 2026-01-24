# Payload CMS 到 Worker 安全推送方案

## 🚫 不推荐的方式
- ❌ **账号密码认证**: 不安全，容易泄露
- ❌ **Session Cookie**: Worker 无法维护 session
- ❌ **用户登录令牌**: 过期时间短，维护复杂

## ✅ 推荐的安全推送方式

### 方案1: API 密钥认证 (推荐)

**原理**: 使用长期有效的 API 密钥进行认证

```typescript
// src/collections/Posts.ts - 添加 Hooks
export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          await notifyWorker(doc)
        }
      }
    ]
  },
  // ... 其他配置
}

// 推送到 Worker 的函数
async function notifyWorker(article: any) {
  try {
    const response = await fetch(process.env.WORKER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORKER_API_KEY}`,
        'X-Payload-Source': 'sijigpt-cms'
      },
      body: JSON.stringify({
        event: 'article.created',
        article: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          publishedAt: article.publishedAt,
          summary_zh: article.summary_zh,
          summary_en: article.summary_en
        },
        timestamp: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      console.error('Worker notification failed:', response.statusText)
    }
  } catch (error) {
    console.error('Worker notification error:', error)
  }
}
```

**Worker 端接收**:
```javascript
// Cloudflare Worker
export default {
  async fetch(request, env) {
    if (request.method === 'POST' && request.url.includes('/webhook/article')) {
      return handleArticleWebhook(request, env)
    }
  }
}

async function handleArticleWebhook(request, env) {
  // 验证 API 密钥
  const authHeader = request.headers.get('Authorization')
  const apiKey = authHeader?.replace('Bearer ', '')
  
  if (apiKey !== env.PAYLOAD_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // 验证来源
  const source = request.headers.get('X-Payload-Source')
  if (source !== 'sijigpt-cms') {
    return new Response('Invalid source', { status: 403 })
  }
  
  const payload = await request.json()
  
  // 处理文章推送 - 比如推送到 Telegram
  await pushToTelegram(payload.article)
  
  return new Response('OK', { status: 200 })
}
```

### 方案2: JWT 令牌认证

**原理**: 使用 JWT 进行短期认证，定期刷新

```typescript
// src/utilities/generateWorkerToken.ts
import jwt from 'jsonwebtoken'

export function generateWorkerToken(): string {
  const payload = {
    service: 'sijigpt-cms',
    purpose: 'worker-notification',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时有效
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET!)
}

// 在 Hook 中使用
async function notifyWorker(article: any) {
  const token = generateWorkerToken()
  
  await fetch(process.env.WORKER_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ article })
  })
}
```

**Worker 端验证**:
```javascript
async function verifyJWT(token, secret) {
  // 简单的 JWT 验证逻辑
  const [header, payload, signature] = token.split('.')
  
  // 验证签名和过期时间
  const decodedPayload = JSON.parse(atob(payload))
  
  if (decodedPayload.exp < Date.now() / 1000) {
    throw new Error('Token expired')
  }
  
  // 验证签名 (简化版本)
  // 实际应该使用加密库验证
  
  return decodedPayload
}
```

### 方案3: 签名验证 (GitHub 风格)

**原理**: 使用 HMAC 签名验证请求完整性

```typescript
// src/utilities/signPayload.ts
import crypto from 'crypto'

export function signPayload(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

// 在 Hook 中使用
async function notifyWorker(article: any) {
  const payloadStr = JSON.stringify({ article })
  const signature = signPayload(payloadStr, process.env.WEBHOOK_SECRET!)
  
  await fetch(process.env.WORKER_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'X-Hub-Signature-256': `sha256=${signature}`,
      'Content-Type': 'application/json'
    },
    body: payloadStr
  })
}
```

**Worker 端验证**:
```javascript
async function verifySignature(request, secret) {
  const signature = request.headers.get('X-Hub-Signature-256')
  const body = await request.text()
  
  const expectedSignature = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  ).then(key => 
    crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  ).then(signature => 
    'sha256=' + Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  )
  
  return signature === expectedSignature
}
```

## 🔧 实施步骤

### Step 1: 选择方案并配置环境变量

```bash
# 方案1: API 密钥 (最简单)
WORKER_WEBHOOK_URL="https://your-worker.domain.workers.dev/webhook/article"
WORKER_API_KEY="sijigpt-worker-key-2026-secure"

# 方案2: JWT
JWT_SECRET="your-super-secret-jwt-key-2026"

# 方案3: 签名验证  
WEBHOOK_SECRET="your-webhook-signing-secret-2026"
```

### Step 2: 添加 Payload Hooks

```typescript
// src/collections/Posts.ts
import { notifyWorker } from '../utilities/workerNotification'

export const Posts: CollectionConfig = {
  // ... 现有配置
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // 只在创建或发布时通知 Worker
        if (operation === 'create' && doc.status === 'published') {
          console.log(`[Hook] 通知 Worker 新文章发布: ${doc.title}`)
          await notifyWorker({
            event: 'article.published',
            article: doc,
            source: 'payload-cms'
          })
        }
      }
    ]
  }
}
```

### Step 3: Worker 配置推送目标

```javascript
// Worker: 接收到文章后的处理
async function handleArticleWebhook(request, env) {
  const { article } = await request.json()
  
  // 1. 推送到 Telegram
  await pushToTelegram(article, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID)
  
  // 2. 更新缓存
  await updateCache(article, env.CACHE_KV)
  
  // 3. 通知其他服务
  await notifySubscribers(article, env.SUBSCRIBER_LIST)
  
  return new Response('Article processed', { status: 200 })
}

async function pushToTelegram(article, botToken, chatId) {
  const message = `🚀 新文章发布：${article.title}
  
📖 ${article.summary_zh.content.substring(0, 200)}...

🔗 https://sijigpt.com/posts/${article.slug}

#AI资讯 #${article.summary_zh.keywords.slice(0,2).map(k => k.keyword).join(' #')}`

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    })
  })
}
```

## 🏆 推荐实施方案

**对于 SijiGPT 项目，我推荐方案1（API 密钥认证）**:

### 优势
- ✅ **实施简单**: 最少的代码和配置
- ✅ **维护方便**: 不需要处理令牌刷新
- ✅ **足够安全**: 对于内部服务通信已足够
- ✅ **调试友好**: 容易排查和测试

### 立即行动
1. 在 `.env.local` 添加 Worker 配置
2. 在 Posts 集合添加 `afterChange` Hook  
3. 创建 Worker webhook 端点
4. 测试文章发布 → Worker 通知流程

这样就能实现：**文章发布 → 自动推送到 Worker → Telegram 通知** 的完整流程！

---

**安全级别**: 🔐 生产环境就绪  
**实施难度**: ⭐⭐☆☆☆ (简单)  
**维护成本**: 💰 极低