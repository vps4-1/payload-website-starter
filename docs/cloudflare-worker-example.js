/**
 * Cloudflare Workers + Payload CMS 连接示例
 * 展示如何从 RSS 处理后写入 Payload CMS
 */

// 环境变量配置
const CONFIG = {
  PAYLOAD_URL: 'https://sijigpt.com',  // Payload CMS 域名
  PAYLOAD_API_KEY: 'your-api-key',     // Payload API 密钥
  OPENROUTER_KEY: 'your-openrouter-key' // OpenRouter API 密钥
};

// Cron 触发器：每天 4 次执行
export default {
  async scheduled(controller, env, ctx) {
    try {
      console.log('🚀 Starting RSS processing...');
      
      // 1. RSS 聚合处理
      const rssFeeds = await fetchRSSFeeds();
      
      // 2. AI 智能筛选与处理
      const processedArticles = await processWithAI(rssFeeds);
      
      // 3. 批量写入 Payload CMS
      const results = await batchWriteToPayload(processedArticles);
      
      // 4. 触发缓存刷新
      await revalidateCache();
      
      console.log(`✅ Processed ${results.length} articles successfully`);
      
    } catch (error) {
      console.error('❌ RSS processing failed:', error);
    }
  }
};

/**
 * 获取并解析 RSS 源
 */
async function fetchRSSFeeds() {
  const rssSources = [
    'https://openai.com/blog/rss.xml',
    'https://blog.google/products-and-platforms/ai/rss/',
    'https://www.deepmind.com/blog/rss.xml',
    // ... 100+ RSS 源
  ];
  
  const articles = [];
  
  for (const rssUrl of rssSources) {
    try {
      const response = await fetch(rssUrl, {
        headers: { 'User-Agent': 'SijiGPT RSS Bot 1.0' }
      });
      
      if (response.ok) {
        const xmlText = await response.text();
        const parsed = parseRSSXML(xmlText);
        articles.push(...parsed);
      }
    } catch (error) {
      console.warn(`RSS fetch failed: ${rssUrl}`, error);
    }
  }
  
  return deduplicateArticles(articles);
}

/**
 * AI 智能处理：筛选 + 摘要生成
 */
async function processWithAI(articles) {
  const processedArticles = [];
  
  for (const article of articles) {
    try {
      // 使用智能调度策略
      const aiResult = await callAIWithFallback({
        models: ['groq/llama-3.1-70b', 'deepseek-chat', 'moonshot-v1-8k'],
        prompt: `分析这篇文章的AI/ML技术价值并生成中英双语摘要：
        
标题: ${article.title}
内容: ${article.content}

请返回JSON格式：
{
  "isValuable": boolean,
  "summary_zh": "中文摘要",
  "summary_en": "English summary",
  "keywords": ["关键词1", "keyword2"],
  "slug": "seo-friendly-slug"
}`
      });
      
      if (aiResult.isValuable) {
        processedArticles.push({
          title: article.title,
          title_en: aiResult.summary_en.split('.')[0], // 提取英文标题
          slug: aiResult.slug,
          source: article.url,
          summary_zh: aiResult.summary_zh,
          summary_en: aiResult.summary_en,
          keywords: aiResult.keywords,
          publishedAt: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.warn(`AI processing failed for: ${article.title}`, error);
    }
  }
  
  return processedArticles;
}

/**
 * 批量写入 Payload CMS
 */
async function batchWriteToPayload(articles) {
  const results = [];
  
  for (const article of articles) {
    try {
      const response = await fetch(`${CONFIG.PAYLOAD_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.PAYLOAD_API_KEY}`
        },
        body: JSON.stringify({
          title: article.title,
          title_en: article.title_en,
          slug: article.slug,
          source: article.source,
          summary_zh: {
            title: article.title,
            content: article.summary_zh,
            keywords: article.keywords.filter(k => /[\u4e00-\u9fff]/.test(k))
          },
          summary_en: {
            title: article.title_en,
            content: article.summary_en,
            keywords: article.keywords.filter(k => /^[a-zA-Z]/.test(k))
          },
          status: 'published',
          publishedAt: article.publishedAt
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push(result);
        console.log(`✅ Article saved: ${article.slug}`);
      } else {
        console.error(`❌ Failed to save: ${article.slug}`, await response.text());
      }
      
    } catch (error) {
      console.error(`❌ API call failed: ${article.slug}`, error);
    }
  }
  
  return results;
}

/**
 * AI 模型调用与降级机制
 */
async function callAIWithFallback({ models, prompt }) {
  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.OPENROUTER_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const content = result.choices[0].message.content;
        return JSON.parse(content);
      }
      
    } catch (error) {
      console.warn(`Model ${model} failed, trying next...`, error);
    }
  }
  
  throw new Error('All AI models failed');
}

/**
 * 触发 Next.js 缓存刷新
 */
async function revalidateCache() {
  try {
    await fetch(`${CONFIG.PAYLOAD_URL}/api/revalidate?secret=${env.REVALIDATE_SECRET}`, {
      method: 'POST'
    });
    console.log('✅ Cache revalidated successfully');
  } catch (error) {
    console.warn('Cache revalidation failed:', error);
  }
}

/**
 * 辅助函数：去重文章
 */
function deduplicateArticles(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = article.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * 辅助函数：解析 RSS XML
 */
function parseRSSXML(xmlText) {
  // 简化的 RSS 解析逻辑
  const articles = [];
  
  // 实际实现中需要使用 XML 解析器
  // 这里只是示例结构
  const items = extractItemsFromXML(xmlText);
  
  for (const item of items) {
    articles.push({
      title: item.title,
      url: item.link,
      content: item.description,
      pubDate: item.pubDate
    });
  }
  
  return articles;
}

function extractItemsFromXML(xml) {
  // 实际的 XML 解析实现
  // 返回解析后的文章数组
  return [];
}

// 环境变量绑定示例（wrangler.toml）
/*
[vars]
PAYLOAD_URL = "https://sijigpt.com"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

[triggers]
crons = ["0 */6 * * *"]  # 每 6 小时执行一次

[secrets]
PAYLOAD_API_KEY = "your-payload-api-key"
OPENROUTER_KEY = "your-openrouter-key"
REVALIDATE_SECRET = "your-revalidate-secret"
*/