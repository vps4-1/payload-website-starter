# 🚀 Cloudflare Worker 部署指南

## 📋 部署前准备

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 2. 设置环境变量（Secrets）
```bash
# 设置 API 密钥
wrangler secret put OPENROUTER_API_KEY
# 输入你的 OpenRouter API Key

wrangler secret put PAYLOAD_API_KEY
# 输入: sijigpt-api-key-2026-make-firecrawl-integration

# 可选：Telegram 通知
wrangler secret put TELEGRAM_BOT_TOKEN
# 输入你的 Telegram Bot Token（如果需要）

# 可选：Claude API
wrangler secret put CLAUDE_API_KEY
# 输入你的 Claude API Key（如果需要）
```

### 3. 验证配置
```bash
# 检查当前配置
wrangler kv:namespace list
wrangler secret list
```

## 🔧 部署步骤

### 1. 部署 Worker
```bash
cd /home/user/webapp
wrangler deploy worker-index.js --name siji-worker-v2 --config worker-wrangler.toml
```

### 2. 验证部署
```bash
# 检查健康状态
curl https://siji-worker-v2.your-account.workers.dev/health

# 测试文章聚合（手动触发）
curl -X POST https://siji-worker-v2.your-account.workers.dev/test
```

## 🎯 配置详情

### 当前配置的 RSS 源
```
- OpenAI Blog
- Google AI Blog  
- DeepMind Blog
- Microsoft Research
- Hugging Face Blog
- AWS ML Blog
- LangChain Blog
- Lil'Log
- Andrej Karpathy Blog
- Distill
- Hacker News
- arXiv AI
- Replit Blog
- Simon Willison
- Sebastian Raschka
```

### 定时任务
```
- 00:00 UTC (每日)
- 04:00 UTC (每日)  
- 08:00 UTC (每日)
- 15:00 UTC (每日)
```

### Payload 集成
- **API 端点**: `https://payload-website-starter-git-main-billboings-projects.vercel.app/api/posts`
- **认证方式**: Bearer Token (API Key)
- **API Key**: `sijigpt-api-key-2026-make-firecrawl-integration`

## 📊 功能特性

### 🤖 AI 处理流程
1. **RSS 抓取**: 15个顶级 AI 资讯源
2. **AI 判定**: 使用 Claude 3.5 判断内容相关性
3. **双语生成**: 中英文标题和摘要
4. **去重机制**: URL + 标题哈希 + 内容指纹三层去重
5. **自动发布**: 发布到 Payload CMS
6. **页面预热**: 自动预热前端页面

### 📈 智能控制
- **日均目标**: 10篇文章/天 (可配置)
- **质量控制**: AI 相关性判断
- **防重复**: 30天去重记录
- **容错机制**: 多模型回退

### 🔔 通知系统
- **Telegram 频道**: @sijigpt
- **实时通知**: 每篇文章发布通知
- **汇总报告**: 每次运行结果汇总

## 🚨 故障排除

### 常见错误

1. **认证失败**
```bash
# 检查 API Key 是否正确设置
wrangler secret list
```

2. **Payload 发布失败**
```bash
# 测试 API 端点
curl -X POST https://payload-website-starter-git-main-billboings-projects.vercel.app/api/posts \
  -H "Authorization: Bearer sijigpt-api-key-2026-make-firecrawl-integration" \
  -H "Content-Type: application/json" \
  -d '{"title": "测试", "source": {"url": "https://test.com", "name": "Test"}}'
```

3. **RSS 抓取失败**
```bash
# 检查 RSS 源可访问性
curl -I https://openai.com/blog/rss.xml
```

### 监控和日志
```bash
# 查看实时日志
wrangler tail

# 查看 KV 存储
wrangler kv:key list --namespace-id=206167570b0b48a3a1ef05c516bd2d24
```

## 📝 更新部署

### 更新代码
```bash
# 修改代码后重新部署
wrangler deploy worker-index.js --name siji-worker-v2 --config worker-wrangler.toml
```

### 更新配置
```bash
# 更新环境变量
wrangler secret put PAYLOAD_API_KEY

# 更新 wrangler.toml 后重新部署
wrangler deploy
```

## 🎉 部署完成后

1. **验证 URL**: Worker 将部署到类似 `https://siji-worker-v2.your-account.workers.dev`
2. **更新 Payload Hook**: 将 `WORKER_WEBHOOK_URL` 更新为实际的 Worker URL
3. **测试完整流程**: 从 RSS 抓取到 Payload 发布再到前端展示

## 🔗 相关文档
- [Payload → Worker 推送配置](./PAYLOAD_WORKER_PUSH.md)
- [Make.com 集成方案](./MAKE_FIRECRAWL_INTEGRATION.md)
- [API 调用示例](./API_EXAMPLES.md)