# Make.com + Firecrawl + SijiGPT 集成方案

## 🎯 架构概览

将 RSS 处理从 Cloudflare Workers 转移到 Make.com，使用 Firecrawl 进行内容抓取，通过 Payload CMS API 写入数据库。

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────────┐
│ RSS Sources │───▶│   Make.com   │───▶│ Firecrawl   │───▶│   Payload CMS   │
│ (100+ feeds)│    │  Scenarios   │    │ Content     │    │  (Vercel+Neon)  │
└─────────────┘    │              │    │ Extraction  │    └─────────────────┘
                   │ • 定时触发    │    └─────────────┘              │
┌─────────────┐    │ • RSS解析    │    ┌─────────────┐              ▼
│ OpenRouter  │◀───│ • 去重筛选    │───▶│ OpenRouter  │    ┌─────────────────┐
│ AI Models   │    │ • 内容处理    │    │ AI Analysis │    │   Next.js App   │
└─────────────┘    │ • API写入     │    └─────────────┘    │ (sijigpt.com)   │
                   └──────────────┘                        └─────────────────┘
```

## 🔧 Make.com 场景配置

### Scenario 1: RSS 监控与抓取

**触发器**: Schedule (每6小时)
**模块序列**:

1. **RSS 模块** - 监控 RSS 源
   ```
   URL: https://openai.com/blog/rss.xml
   Max Items: 10
   ```

2. **过滤器** - 发布时间筛选
   ```javascript
   {{formatDate(2.publishedDate; "YYYY-MM-DD")}} = {{formatDate(now; "YYYY-MM-DD")}}
   ```

3. **Firecrawl** - 内容抓取
   ```json
   {
     "url": "{{2.link}}",
     "formats": ["markdown"],
     "includeTags": ["h1", "h2", "h3", "p", "article"],
     "onlyMainContent": true
   }
   ```

4. **OpenRouter API** - AI 分析
   ```json
   {
     "model": "groq/llama-3.1-70b-versatile",
     "messages": [{
       "role": "user", 
       "content": "分析这篇AI文章的价值并生成中英双语摘要..."
     }],
     "temperature": 0.3
   }
   ```

5. **Payload CMS API** - 写入数据
   ```json
   POST https://sijigpt.com/api/posts
   {
     "title": "{{4.zh_title}}",
     "title_en": "{{4.en_title}}",
     "slug": "{{4.slug}}",
     "source": {
       "url": "{{2.link}}",
       "name": "{{2.author}}"
     },
     "summary_zh": {
       "content": "{{4.zh_summary}}",
       "keywords": "{{4.zh_keywords}}"
     },
     "summary_en": {
       "content": "{{4.en_summary}}", 
       "keywords": "{{4.en_keywords}}"
     },
     "original_language": "en",
     "publishedAt": "{{2.publishedDate}}"
   }
   ```

### Scenario 2: 批量 RSS 处理

**触发器**: Manual/Webhook
**RSS 源列表**:
```javascript
[
  "https://openai.com/blog/rss.xml",
  "https://deepmind.google/blog/rss.xml", 
  "https://blog.google/products/ai/rss/",
  "https://www.anthropic.com/blog/rss.xml",
  "https://huggingface.co/blog/feed.xml",
  "https://aws.amazon.com/blogs/machine-learning/feed/",
  // ... 100+ RSS 源
]
```

## 📊 AI 分析提示词模板

### 内容价值评估
```
分析这篇文章是否值得收录到AI资讯平台：

文章标题: {{title}}
文章内容: {{content}}
来源: {{source}}

评估标准:
1. 是否与AI/ML/深度学习相关
2. 是否有新颖性或重要性
3. 是否适合技术从业者阅读

请返回JSON格式：
{
  "is_valuable": true/false,
  "confidence": 0.8,
  "zh_title": "中文标题",
  "en_title": "English Title", 
  "slug": "seo-friendly-slug",
  "zh_summary": "300字中文摘要",
  "en_summary": "300-word English summary",
  "zh_keywords": [{"keyword": "关键词1"}, {"keyword": "关键词2"}, {"keyword": "关键词3"}],
  "en_keywords": [{"keyword": "keyword1"}, {"keyword": "keyword2"}, {"keyword": "keyword3"}]
}
```

### 摘要生成模板
```
为这篇AI技术文章生成高质量的中英双语摘要：

原文标题: {{title}}
原文内容: {{content}}

要求:
- 中文摘要: 300-400字，技术准确，语言流畅
- 英文摘要: 300-400词，保持专业性
- 关键词: 各3-5个，包含技术术语
- 重点突出文章的核心贡献和应用价值

返回JSON格式，字段同上。
```

## 🛡️ 安全与配置

### API 密钥管理
```javascript
// Make.com 中的环境变量
const API_KEYS = {
  PAYLOAD_API_KEY: "sijigpt-api-key-2026-make-firecrawl-integration",
  OPENROUTER_KEY: "sk-or-v1-your-openrouter-key",
  FIRECRAWL_API_KEY: "fc-your-firecrawl-api-key"
}
```

### 错误处理
```javascript
// Make.com 错误处理器
if ({{4.status}} !== 200) {
  // 记录错误并跳过当前项目
  console.error(`API调用失败: ${4.statusText}`);
  continue;
}
```

### 去重逻辑
```javascript
// 基于URL去重
const processedUrls = new Set();
if (processedUrls.has({{2.link}})) {
  // 跳过已处理的文章
  continue;
}
processedUrls.add({{2.link}});
```

## 📈 性能优化

### 并发控制
- **RSS 源分组**: 每组20个源，避免API限制
- **批处理**: 每次处理10篇文章
- **错误重试**: 3次重试机制，指数退避

### 成本控制
- **Firecrawl**: 免费额度1000次/月，约33次/天
- **OpenRouter**: 使用廉价模型 Groq/Llama-3.1-70b
- **Make.com**: 免费额度1000操作/月

### 缓存策略
```javascript
// 24小时内不重复处理同一URL
const cacheKey = btoa({{2.link}});
if (localStorage.getItem(cacheKey)) {
  continue;
}
localStorage.setItem(cacheKey, Date.now());
```

## 🚀 部署步骤

### 1. Make.com 设置
1. 创建新的 Scenario
2. 配置 RSS 模块
3. 添加 Firecrawl 连接
4. 设置 OpenRouter API
5. 配置 Payload CMS Webhook

### 2. API 密钥配置
```bash
# Vercel 环境变量
vercel env add PAYLOAD_API_KEY
vercel env add OPENROUTER_KEY  
vercel env add FIRECRAWL_API_KEY
```

### 3. 测试验证
```bash
# 测试 Payload API
curl -X POST "https://sijigpt.com/api/posts" \
  -H "Content-Type: application/json" \
  -d @test-article.json

# 验证文章出现在前端
curl "https://sijigpt.com/api/frontend-posts?limit=1"
```

## 📊 监控与告警

### Make.com 日志
- 执行状态监控
- 错误率统计  
- 处理文章数量统计

### 性能指标
- RSS 源响应时间
- Firecrawl 成功率
- AI 分析准确率
- 文章发布延迟

### 告警设置
```javascript
// 当错误率超过10%时发送通知
if (errorRate > 0.1) {
  // 发送 Telegram 通知
  sendTelegramAlert(`SijiGPT RSS处理错误率过高: ${errorRate}%`);
}
```

## 🎯 优势总结

### vs Cloudflare Workers
- ✅ **部署简单**: Make.com 可视化配置，无需代码部署
- ✅ **成本更低**: 免费额度足够处理日常需求
- ✅ **维护容易**: 图形界面修改，无需重新部署
- ✅ **集成丰富**: 内置100+服务集成

### vs 手动处理  
- ✅ **自动化**: 24/7无人值守运行
- ✅ **可扩展**: 轻松添加新的RSS源
- ✅ **智能筛选**: AI自动评估内容价值
- ✅ **质量控制**: 标准化的摘要和关键词生成

---

**技术栈**: Make.com + Firecrawl + OpenRouter + Payload CMS + Vercel + Neon  
**维护成本**: 几乎为零（免费额度内）  
**处理能力**: 100+RSS源，日处理50-100篇文章  
**响应时间**: RSS发布后1小时内出现在网站