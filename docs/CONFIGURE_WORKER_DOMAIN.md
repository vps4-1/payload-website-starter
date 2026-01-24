# 🔧 配置 Cloudflare Worker 域名

## 📋 找到你的 Worker 域名

### 方法 1: Cloudflare Dashboard
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** 
3. 点击你的 **siji-worker-v2** Worker
4. 在 **Settings** → **Domains & Routes** 中查看域名
5. 默认格式应该是: `https://siji-worker-v2.YOUR-SUBDOMAIN.workers.dev`

### 方法 2: Wrangler CLI  
```bash
# 查看已部署的 Worker
wrangler list

# 获取 Worker 信息
wrangler whoami
```

### 方法 3: 检查 wrangler.toml
在你的 Worker 项目中检查 `wrangler.toml` 文件：
```toml
name = "siji-worker-v2"
# 域名通常是: https://siji-worker-v2.YOUR-ACCOUNT.workers.dev
```

## 🔍 常见的 Worker 域名格式

```bash
# Cloudflare 账户子域名格式
https://siji-worker-v2.vps4-1.workers.dev/health
https://siji-worker-v2.billboing.workers.dev/health
https://siji-worker-v2.your-username.workers.dev/health

# 自定义域名格式（如果你配置了）  
https://worker.sijigpt.com/health
https://api.sijigpt.com/health
```

## 🧪 测试 Worker 连接

找到正确域名后，请测试以下端点：

### 1. 健康检查
```bash
curl https://YOUR-WORKER-DOMAIN/health
# 期望返回:
# {"status":"ok","service":"Siji Worker V2","timestamp":"..."}
```

### 2. Webhook 端点测试
```bash
curl -X POST https://YOUR-WORKER-DOMAIN/webhook/article \
  -H "Authorization: Bearer sijigpt-worker-api-key-2026-secure-notifications" \
  -H "X-Payload-Source: sijigpt-cms" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "id": 1, "slug": "test"}'
# 期望返回:
# {"success": true, "message": "Article notification processed"}
```

## ⚙️ 更新 Payload 配置

找到正确的 Worker 域名后，更新 `/home/user/webapp/.env.local`：

```bash
# 替换为你的实际域名
WORKER_WEBHOOK_URL="https://siji-worker-v2.YOUR-ACTUAL-SUBDOMAIN.workers.dev/webhook/article"
WORKER_API_KEY="sijigpt-worker-api-key-2026-secure-notifications"
```

## 🔄 重启服务

更新配置后，重启开发服务器：
```bash
# 停止当前服务器
pkill -f "next dev"

# 重新启动
npm run dev
```

## 🧪 验证完整流程

配置正确后，测试端到端流程：

### 1. 创建测试文章
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer sijigpt-api-key-2026-make-firecrawl-integration" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Worker集成测试",
    "source": {"url": "https://test.com", "name": "Test"},
    "summary_zh": {"content": "测试", "keywords": [{"keyword": "测试"}]},
    "original_language": "zh"
  }'
```

### 2. 检查服务器日志
应该看到：
```
[Hook] 新文章创建，准备通知 Worker: Worker集成测试
[Hook] 发送 Worker 通知到: https://YOUR-WORKER-DOMAIN/webhook/article
[Hook] ✅ Worker 通知成功
```

### 3. 检查 Worker 日志
在 Cloudflare Dashboard 的 Worker 日志中应该看到：
```
[Webhook] 收到新文章通知: Worker集成测试  
[Webhook] Telegram 通知已发送
```

## 🚨 故障排除

### DNS 解析失败
```
ENOTFOUND your-worker-domain.workers.dev
```
**解决**: 检查域名拼写，确认 Worker 已成功部署

### 认证失败  
```
401 Unauthorized 或 403 Forbidden
```
**解决**: 检查 `WORKER_API_KEY` 是否在两端都正确配置

### Hook 不触发
**解决**: 确保 `.env.local` 配置正确，重启服务器

## 📞 需要帮助？

如果遇到问题，请提供：
1. 你的实际 Worker 域名
2. `curl` 测试结果
3. Payload 服务器日志
4. Cloudflare Worker 日志

这样我们可以精确诊断和修复问题。