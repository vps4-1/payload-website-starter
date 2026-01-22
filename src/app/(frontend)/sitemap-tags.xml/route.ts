import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/utilities/getURL';

// 从所有文章中提取唯一标签
async function getAllTags() {
  const baseUrl = getApiBaseUrl();
  
  try {
    // 获取所有文章来提取标签
    const response = await fetch(
      `${baseUrl}/api/posts?limit=1000&sort=-createdAt`,
      {
        next: { revalidate: 7200 }, // 2小时缓存
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch posts for tags:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (!data.docs || !Array.isArray(data.docs)) {
      return [];
    }

    // 提取所有标签
    const tagSet = new Set<string>();
    
    data.docs.forEach((post: any) => {
      // 从中文摘要的关键词中提取
      if (post.summary_zh?.keywords && Array.isArray(post.summary_zh.keywords)) {
        post.summary_zh.keywords.forEach((keywordObj: any) => {
          if (keywordObj.keyword && keywordObj.keyword.trim()) {
            tagSet.add(keywordObj.keyword.trim());
          }
        });
      }
      // 从英文摘要的关键词中提取
      if (post.summary_en?.keywords && Array.isArray(post.summary_en.keywords)) {
        post.summary_en.keywords.forEach((keywordObj: any) => {
          if (keywordObj.keyword && keywordObj.keyword.trim()) {
            tagSet.add(keywordObj.keyword.trim());
          }
        });
      }
    });

    // 转换为数组并排序
    const tags = Array.from(tagSet).sort();
    
    // 为每个标签添加一些元数据
    return tags.map(tag => ({
      name: tag,
      slug: encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-')),
      lastModified: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error);
    return [];
  }
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com';
  
  try {
    const tags = await getAllTags();
    
    if (!tags || tags.length === 0) {
      // 如果没有标签，返回基础标签页面
      const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  <url>
    <loc>${siteUrl}/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>
</urlset>`;
      
      return new NextResponse(basicSitemap, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=7200, s-maxage=7200',
          'X-Robots-Tag': 'noindex'
        },
      });
    }

    // 常见AI/ML标签的权重映射
    const aiKeywords = [
      'ai', '人工智能', 'machine learning', '机器学习', 'deep learning', '深度学习',
      'chatgpt', 'gpt', 'openai', 'claude', 'gemini', 'llm', '大语言模型',
      'transformer', 'neural network', '神经网络', 'nlp', '自然语言处理',
      'computer vision', '计算机视觉', 'robotics', '机器人', 'automation', '自动化'
    ];
    
    // 生成标签URL
    const tagUrls = tags.map(tag => {
      const isAIRelated = aiKeywords.some(keyword => 
        tag.name.toLowerCase().includes(keyword) || 
        keyword.includes(tag.name.toLowerCase())
      );
      
      return `  <url>
    <loc>${siteUrl}/tags/${tag.slug}</loc>
    <lastmod>${tag.lastModified}</lastmod>
    <changefreq>${isAIRelated ? 'weekly' : 'monthly'}</changefreq>
    <priority>${isAIRelated ? '0.7' : '0.5'}</priority>
    <mobile:mobile/>
  </url>`;
    }).join('\n');

    // 添加主标签页面
    const mainTagPageUrl = `  <url>
    <loc>${siteUrl}/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>`;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${mainTagPageUrl}
${tagUrls}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200', // 2小时缓存
        'X-Robots-Tag': 'noindex'
      },
    });
  } catch (error) {
    console.error('Tags sitemap generation error:', error);
    
    // 错误情况下返回基本sitemap
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    
    return new NextResponse(errorSitemap, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }
}