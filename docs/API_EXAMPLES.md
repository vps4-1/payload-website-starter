# SijiGPT API 调用示例与测试

## 📋 API 端点说明

### 生产环境
- **基础URL**: `https://sijigpt.com`
- **文章API**: `POST /api/posts`
- **前端API**: `GET /api/frontend-posts`

### 开发环境
- **基础URL**: `http://localhost:3000`
- **测试状态**: ✅ 已验证工作正常

## 🔐 认证方式

### 当前配置 (临时)
```bash
# 无需认证 (开发/测试阶段)
# 生产环境需要配置 API 密钥
Authorization: Bearer sijigpt-api-key-2026-make-firecrawl-integration
```

## 📝 文章创建 API

### 请求格式
```bash
POST /api/posts
Content-Type: application/json

{
  "title": "文章标题（中文）",
  "title_en": "Article Title (English)",
  "slug": "seo-friendly-url-slug",
  "source": {
    "url": "https://original-source.com/article",
    "name": "来源名称", 
    "author": "作者名称（可选）"
  },
  "summary_zh": {
    "content": "详细的中文摘要内容，建议300-400字...",
    "keywords": [
      {"keyword": "关键词1"},
      {"keyword": "关键词2"}, 
      {"keyword": "关键词3"}
    ]
  },
  "summary_en": {
    "content": "Detailed English summary content, recommended 300-400 words...",
    "keywords": [
      {"keyword": "keyword1"},
      {"keyword": "keyword2"},
      {"keyword": "keyword3"}
    ]
  },
  "original_language": "en", // 或 "zh"
  "publishedAt": "2026-01-23T15:35:00.000Z"
}
```

### 成功响应
```json
{
  "doc": {
    "id": 135,
    "title": "成功测试文章",
    "title_en": "Success Test Article", 
    "slug": "success-test-article-2026-v2",
    "source": {
      "url": "https://test.com",
      "name": "Test Source",
      "author": null
    },
    "original_language": "en",
    "summary_zh": {
      "content": "这是一个成功的测试摘要...",
      "keywords": [
        {
          "id": "697391aa9cdd466ee835a0c2",
          "keyword": "测试"
        }
      ]
    },
    "publishedAt": "2026-01-23T15:35:00.000Z",
    "createdAt": "2026-01-23T15:20:10.513Z",
    "updatedAt": "2026-01-23T15:20:10.518Z"
  },
  "message": "Post successfully created."
}
```

## 🧪 测试脚本

### 基础测试
```bash
#!/bin/bash

API_BASE="http://localhost:3000"
# API_BASE="https://sijigpt.com"  # 生产环境

echo "=== 测试文章创建 ==="
curl -X POST "${API_BASE}/api/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试文章 - Make.com集成",
    "title_en": "Test Article - Make.com Integration",
    "slug": "test-makecom-integration-2026",
    "source": {
      "url": "https://make.com/blog/api-integration",
      "name": "Make.com Blog"
    },
    "summary_zh": {
      "content": "这是一篇关于Make.com与SijiGPT集成的测试文章。通过API调用，我们可以自动化RSS内容的处理和发布流程。",
      "keywords": [
        {"keyword": "Make.com"},
        {"keyword": "API集成"}, 
        {"keyword": "自动化"}
      ]
    },
    "summary_en": {
      "content": "This is a test article about Make.com integration with SijiGPT. Through API calls, we can automate RSS content processing and publishing workflow.",
      "keywords": [
        {"keyword": "Make.com"},
        {"keyword": "API integration"},
        {"keyword": "automation"}
      ]
    },
    "original_language": "en",
    "publishedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"
  }' | jq

echo -e "\n=== 验证文章出现在列表 ==="
curl -s "${API_BASE}/api/frontend-posts?limit=3" | jq '.docs[] | {id, title, createdAt}'
```

### Make.com 场景测试
```javascript
// Make.com HTTP 模块配置
{
  "url": "https://sijigpt.com/api/posts",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{env.PAYLOAD_API_KEY}}"
  },
  "body": {
    "title": "{{ai_response.zh_title}}",
    "title_en": "{{ai_response.en_title}}", 
    "slug": "{{ai_response.slug}}",
    "source": {
      "url": "{{rss_item.link}}",
      "name": "{{rss_item.source_name}}"
    },
    "summary_zh": {
      "content": "{{ai_response.zh_summary}}",
      "keywords": "{{ai_response.zh_keywords}}"
    },
    "summary_en": {
      "content": "{{ai_response.en_summary}}",
      "keywords": "{{ai_response.en_keywords}}"
    },
    "original_language": "{{ai_response.original_language}}",
    "publishedAt": "{{rss_item.published_date}}"
  }
}
```

## 🔍 调试与监控

### API 状态检查
```bash
# 检查 API 可用性
curl -I https://sijigpt.com/api/posts

# 检查前端API
curl -I https://sijigpt.com/api/frontend-posts

# 检查最新文章
curl -s "https://sijigpt.com/api/frontend-posts?limit=1" | jq '.docs[0] | {id, title, createdAt}'
```

### 错误处理
```bash
# 常见错误及解决方案

# 1. HTTP 405 Method Not Allowed
# 原因: API路由冲突或配置错误
# 解决: 检查路由配置，确保没有冲突

# 2. HTTP 403 Forbidden  
# 原因: 权限配置问题
# 解决: 检查 Posts 集合的 access 配置

# 3. ValidationError
# 原因: 必填字段缺失或格式错误
# 解决: 确保 keywords 至少3个，所有必填字段都有值

# 4. Duplicate slug error
# 原因: slug 重复
# 解决: 为 slug 添加时间戳或随机后缀
```

### 性能监控
```bash
# 监控文章总数
curl -s "https://sijigpt.com/api/frontend-posts?limit=1" | jq '.totalDocs'

# 监控最近发布时间
curl -s "https://sijigpt.com/api/frontend-posts?limit=1" | jq '.docs[0].createdAt'

# 检查特定slug是否存在
curl -s "https://sijigpt.com/api/frontend-posts?where[slug][equals]=test-article" | jq '.totalDocs'
```

## 📊 Make.com 集成清单

### ✅ 已完成
- [x] Payload CMS API 可用性验证
- [x] 文章创建API测试通过
- [x] 前端API路由正常工作
- [x] 文章排序修复（最新优先）
- [x] 权限配置（临时开放创建）

### 🔄 进行中 
- [ ] 部署到 Vercel 生产环境
- [ ] 配置生产环境 API 密钥
- [ ] Make.com 场景创建和测试

### 📋 待办事项
- [ ] 实现 API 密钥认证（生产环境）
- [ ] 配置 RSS 源列表（100+）
- [ ] 设置 Firecrawl 内容抓取
- [ ] OpenRouter AI 分析配置
- [ ] 错误监控和告警

## 🎯 下一步行动

### 立即部署
```bash
# 1. 推送代码到 GitHub
git push origin main

# 2. 部署到 Vercel
# 访问 Vercel Dashboard 触发部署

# 3. 配置环境变量
# PAYLOAD_API_KEY=sijigpt-api-key-2026-make-firecrawl-integration
# 其他必要的环境变量...

# 4. 验证生产API
curl -X POST "https://sijigpt.com/api/posts" -H "Content-Type: application/json" -d @test-data.json
```

### Make.com 配置
1. 创建新 Scenario
2. 添加 RSS Watch 模块
3. 配置 Firecrawl HTTP 请求
4. 设置 OpenRouter AI 分析
5. 连接 SijiGPT API 写入

---

**状态**: 🟢 API 基础设施就绪，可开始 Make.com 集成  
**测试**: ✅ 本地验证通过，创建文章ID 135成功  
**部署**: 🔄 准备推送到生产环境