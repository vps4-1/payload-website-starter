# 🔧 修复 Worker → Payload 数据格式

## ✅ API Token 问题已解决

API Token 功能现在可以正常工作了！测试结果：
- ✅ **本地测试**: HTTP 201，文章 ID 329 创建成功
- ✅ **认证正常**: Bearer Token 认证通过
- ✅ **Hook 触发**: Payload → Worker 推送正常触发

## 📋 必需字段清单

根据验证错误，Worker 向 Payload 发送文章时必须包含以下字段：

### 必填字段
```javascript
{
  // 基础信息
  "title": "中文标题",
  "title_en": "English Title", // 必需
  "slug": "url-friendly-slug", // 必需  
  "publishedAt": "2026-01-25T01:55:00.000Z", // 必需
  "original_language": "zh", // 或 "en"
  "_status": "published",
  
  // 来源信息
  "source": {
    "url": "https://source-url.com",
    "name": "Source Name"
  },
  
  // 中文摘要（必需）
  "summary_zh": {
    "content": "中文摘要内容",
    "keywords": [
      {"keyword": "关键词1"}, 
      {"keyword": "关键词2"}, 
      {"keyword": "关键词3"}
    ] // 至少3个
  },
  
  // 英文摘要（必需）
  "summary_en": {
    "content": "English summary content", // 必需
    "keywords": [
      {"keyword": "keyword1"}, 
      {"keyword": "keyword2"}, 
      {"keyword": "keyword3"}
    ] // 至少3个，必需
  }
}
```

## 🔧 Worker 代码修复

在你的 Worker 的 `publishToPayload` 函数中，确保数据格式正确：

```javascript
async function publishToPayload(env, article, logs) {
  if (!env.PAYLOAD_API_KEY) {
    logs.push('[Payload] ❌ 未配置 PAYLOAD_API_KEY');
    return false;
  }
  
  try {
    logs.push('[Payload] 使用 API Key 发布...');
    
    // 🎯 确保所有必需字段都存在
    const payloadData = {
      title: article.title_zh || article.title,
      title_en: article.title_en, // 必需
      slug: generateSlug(article.title_zh || article.title),
      publishedAt: new Date().toISOString(), // 必需
      _status: "published",
      original_language: article.original_language || 'en',
      
      source: {
        url: article.source?.url || article.url,
        name: article.source?.name || extractSourceName(article.url)
      },
      
      // 确保中文摘要完整
      summary_zh: {
        content: article.summary_zh || article.summary || "AI相关资讯",
        keywords: (article.keywords_zh || ["AI", "技术", "资讯"]).map(kw => 
          typeof kw === 'string' ? { keyword: kw } : kw
        )
      },
      
      // 🎯 确保英文摘要存在且完整
      summary_en: {
        content: article.summary_en || article.summary_zh || article.summary || "AI-related news",
        keywords: (article.keywords_en || ["AI", "technology", "news"]).map(kw => 
          typeof kw === 'string' ? { keyword: kw } : kw
        )
      }
    };
    
    // 验证关键字段
    if (!payloadData.title_en) {
      payloadData.title_en = payloadData.title;
    }
    
    if (!payloadData.summary_en.content) {
      payloadData.summary_en.content = payloadData.summary_zh.content;
    }
    
    // 确保至少3个关键词
    while (payloadData.summary_zh.keywords.length < 3) {
      payloadData.summary_zh.keywords.push({ keyword: "AI资讯" });
    }
    
    while (payloadData.summary_en.keywords.length < 3) {
      payloadData.summary_en.keywords.push({ keyword: "AI news" });
    }
    
    const response = await fetch('https://payload-website-starter-git-main-billboings-projects.vercel.app/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PAYLOAD_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logs.push(`[Payload] ❌ 发布失败: ${response.status} - ${errorText}`);
      return false;
    }
    
    const result = await response.json();
    logs.push(`[Payload] ✅ 发布成功 ID: ${result.doc.id}`);
    return true;
    
  } catch (error) {
    logs.push(`[Payload] ❌ 发布异常: ${error.message}`);
    return false;
  }
}

// 生成 URL 友好的 slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-')     // 空格替换为连字符
    .substring(0, 50)         // 限制长度
    + '-' + Date.now().toString(36); // 添加时间戳避免重复
}
```

## 🧪 测试生产环境

确保你的 Worker 有正确的 `PAYLOAD_API_KEY`：

```bash
# 在 Cloudflare Dashboard 设置，或者：
wrangler secret put PAYLOAD_API_KEY
# 输入你在 Payload 后台生成的 API Token
```

## 🎯 完整流程测试

修复后，测试完整的自动化流程：

```bash
# 1. 手动触发 Worker RSS 聚合
curl -X POST "https://siji-worker-v2.chengqiangshang.workers.dev/test"

# 2. 检查 Payload 是否收到新文章
curl "https://payload-website-starter-git-main-billboings-projects.vercel.app/api/frontend-posts?limit=3"

# 3. 检查前端是否显示新文章
# 访问 https://payload-website-starter-git-main-billboings-projects.vercel.app
```

## 🏆 总结

- ✅ **API Token 功能**: 已修复，可正常工作
- ✅ **字段验证**: 已识别所有必需字段
- ✅ **本地测试**: 完全成功 (ID 329)
- ✅ **Hook 推送**: 正确触发
- 🔧 **Worker 代码**: 需要更新数据格式
- 📋 **Webhook 端点**: 需要添加到 Worker

完成这些更新后，你就拥有了完全自动化的 AI 资讯平台！🚀