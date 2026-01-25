# REVALIDATE_SECRET 配置文档

## 🔐 当前配置

**REVALIDATE_SECRET**: `dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA=`

## 📖 用途说明

`REVALIDATE_SECRET` 是用于保护 Next.js 缓存刷新端点的安全密钥。它确保只有授权的系统能够触发网站内容的缓存刷新。

## 🔧 工作原理

当外部系统（如 Cloudflare Worker）需要通知网站有新内容更新时，它们会调用 `/api/revalidate` 端点，并提供正确的密钥来验证身份。

## 🌐 API 端点详情

**端点**: `POST /api/revalidate`
**参数**: `?secret=YOUR_SECRET_HERE`
**功能**: 刷新以下页面缓存：
- `/` (首页)
- `/posts` (文章列表)
- `/archives` (归档页)
- `/tags` (标签页)
- `/search` (搜索页)
- `/about` (关于页)
- `/posts/[slug]` (动态文章页)
- `/tags/[slug]` (动态标签页)

## 📋 使用示例

### 1. Cloudflare Worker 中使用
```javascript
const revalidateUrl = `${env.PAYLOAD_URL}/api/revalidate?secret=${env.REVALIDATE_SECRET}`;
await fetch(revalidateUrl, { method: 'POST' });
```

### 2. 手动触发缓存刷新
```bash
curl -X POST "https://sijigpt.com/api/revalidate?secret=dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA="
```

### 3. 从其他服务调用
```javascript
await fetch('https://sijigpt.com/api/revalidate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    secret: 'dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA='
  })
});
```

## ⚙️ 部署配置

### 本地开发
- ✅ 已配置在 `.env.local` 文件中

### 生产环境 (Vercel)
需要在 Vercel 项目设置中添加环境变量：
1. 进入 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 添加：`REVALIDATE_SECRET` = `dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA=`

### Cloudflare Worker
需要在 wrangler.toml 或 Worker 设置中配置：
```bash
wrangler secret put REVALIDATE_SECRET
# 输入值: dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA=
```

## 🔒 安全性

- 使用 32 字节随机生成的 base64 编码密钥
- 仅用于服务器到服务器的通信
- 不应暴露在客户端代码中
- 建议定期更新密钥

## 🧪 测试验证

### 有效请求
```bash
curl -X POST "http://localhost:3001/api/revalidate?secret=dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA="
# 返回: {"revalidated":true,"paths":[...],"now":timestamp}
```

### 无效请求
```bash
curl -X POST "http://localhost:3001/api/revalidate?secret=invalid"
# 返回: {"message":"Invalid secret"} (401 状态)
```

## 📝 使用场景

1. **自动内容更新**: Cloudflare Worker 处理完 RSS 文章后触发缓存刷新
2. **手动内容刷新**: 管理员需要立即更新网站内容
3. **Webhook 集成**: 外部系统通过 webhook 通知内容变更
4. **CI/CD 部署**: 部署完成后自动刷新缓存

## 🚀 集成完成

REVALIDATE_SECRET 现已配置完成并可正常使用。所有相关系统都可以使用此密钥来安全地触发网站缓存刷新。